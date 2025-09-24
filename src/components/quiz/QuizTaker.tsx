import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Clock, CheckCircle, AlertCircle, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question_text: string;
  options: {
    id: string;
    option_text: string;
    is_correct: boolean;
  }[];
}

interface QuizTakerProps {
  quizId: string;
  onComplete: (results: any) => void;
  onBack: () => void;
}

export const QuizTaker = ({ quizId, onComplete, onBack }: QuizTakerProps) => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        console.log('🚀 QuizTaker: Fetching quiz data for ID:', quizId);
        
        // Fetch quiz details
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single();

        if (quizError) {
          console.error('❌ QuizTaker: Error fetching quiz:', quizError);
          throw quizError;
        }

        console.log('✅ QuizTaker: Quiz data:', quizData);

        // Fetch questions with their options
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', quizId)
          .order('order_index');

        if (questionsError) {
          console.error('❌ QuizTaker: Error fetching questions:', questionsError);
          throw questionsError;
        }

        console.log('✅ QuizTaker: Questions data:', questionsData);

        // Fetch options for all questions
        const { data: optionsData, error: optionsError } = await supabase
          .from('options')
          .select('*')
          .in('question_id', questionsData.map(q => q.id))
          .order('order_index');

        if (optionsError) {
          console.error('❌ QuizTaker: Error fetching options:', optionsError);
          throw optionsError;
        }

        console.log('✅ QuizTaker: Options data:', optionsData);

        // Group options by question_id
        const optionsByQuestion = optionsData.reduce((acc, option) => {
          if (!acc[option.question_id]) {
            acc[option.question_id] = [];
          }
          acc[option.question_id].push(option);
          return acc;
        }, {} as Record<string, any[]>);

        // Shuffle options for each question to randomize answer positions
        const shuffleArray = (array: any[]) => {
          const shuffled = [...array];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        };
        
        const formattedQuestions = questionsData.map(q => ({
          ...q,
          options: shuffleArray(optionsByQuestion[q.id] || [])
        }));

        console.log('✅ QuizTaker: Formatted questions:', formattedQuestions);
        
        setQuiz(quizData);
        setQuestions(formattedQuestions);
        
      } catch (error) {
        console.error('💥 QuizTaker: Error fetching quiz data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        toast({
          title: "Quiz Loading Error",
          description: `Failed to load quiz: ${errorMessage}`,
          variant: "destructive",
        });
        onBack();
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId, toast, onBack]);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    setAnsweredQuestions(prev => new Set([...prev, questionId]));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Calculate score
      let score = 0;
      const results = questions.map(question => {
        const selectedOptionId = selectedAnswers[question.id];
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        const correctOption = question.options.find(opt => opt.is_correct);
        const isCorrect = selectedOption?.is_correct || false;
        
        if (isCorrect) score++;

        return {
          question: question.question_text,
          selectedAnswer: selectedOption?.option_text || 'Not answered',
          correctAnswer: correctOption?.option_text || '',
          isCorrect
        };
      });

      const sessionData = {
        quizId,
        quizTitle: quiz?.title,
        score,
        totalQuestions: questions.length,
        timeSpent,
        results,
        percentage: Math.round((score / questions.length) * 100)
      };

      // Try to save to database
      try {
        console.log('=== QUIZ SUBMISSION DEBUG ===');
        console.log('User object:', user);
        console.log('User ID:', user?.id);
        console.log('User ID type:', typeof user?.id);
        console.log('User ID length:', user?.id?.length);
        console.log('Quiz ID:', quizId);
        console.log('Score:', score);
        console.log('Total questions:', questions.length);
        
        // Make sure we have a user before trying to save
        if (!user || !user.id) {
          console.error('❌ No authenticated user found');
          toast({
            title: "Authentication Required",
            description: "Please sign in to save your quiz results.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('Calling simplified insert (without time_spent field)...');
        
        // Use simplified insert without problematic fields
        const { data, error } = await supabase
          .from('quiz_sessions')
          .insert([{
            quiz_id: quizId,
            user_id: user.id,
            score: score,
            total_questions: questions.length
          }])
          .select();
        
        if (error) {
          console.error('❌ Database error:', error);
          toast({
            title: "Database Error",
            description: `Failed to save quiz session: ${error.message}`,
            variant: "destructive",
          });
        } else {
          console.log('✅ Quiz session saved successfully to database');
          console.log('Inserted data:', data);
          toast({
            title: "Quiz Completed!",
            description: "Your results have been saved successfully.",
          });
        }
      } catch (dbError) {
        console.error('❌ Could not save to database:', dbError);
        toast({
          title: "Save Error",
          description: "Failed to save quiz results. Please try again.",
          variant: "destructive",
        });
      }

      onComplete(sessionData);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const allAnswered = questions.length > 0 && answeredQuestions.size === questions.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-pulse mx-auto mb-4 text-nexlayer-cyan" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Quiz not found</h3>
        <p className="text-muted-foreground mb-4">The requested quiz could not be loaded.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quiz List
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-nexlayer-cyan border-nexlayer-cyan">
            <Clock className="w-3 h-3 mr-1" />
            {formatTime(timeSpent)}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-nexlayer-cyan font-medium">
            {answeredQuestions.size} / {questions.length} answered
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Quiz Info */}
      <Card className="border-nexlayer-cyan/20 bg-gradient-to-r from-nexlayer-cyan/5 to-nexlayer-cyan/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-white">{quiz?.title}</CardTitle>
        </CardHeader>
      </Card>

      {/* Question */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-foreground leading-relaxed">
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedAnswers[currentQuestion.id] || ""}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer text-sm">
                  {option.option_text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-nexlayer-cyan text-nexlayer-dark'
                  : answeredQuestions.has(questions[index].id)
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            className="bg-nexlayer-cyan hover:bg-nexlayer-cyan/90 text-nexlayer-dark font-semibold"
            disabled={!allAnswered}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit Quiz {!allAnswered && `(${questions.length - answeredQuestions.size} remaining)`}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
