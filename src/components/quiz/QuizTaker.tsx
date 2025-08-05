import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
        // Try to fetch from Supabase first
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single();

        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            *,
            question_options (
              id,
              option_text,
              is_correct
            )
          `)
          .eq('quiz_id', quizId)
          .order('created_at');

        if (quizError || questionsError) throw new Error('Database error');

        setQuiz(quizData);
        const formattedQuestions = questionsData.map(q => ({
          ...q,
          options: q.question_options || []
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        toast({
          title: "Database Error",
          description: "Failed to load quiz. Please ensure the database is connected and migrations are applied.",
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
        await supabase.from('quiz_sessions').insert({
          quiz_id: quizId,
          score,
          total_questions: questions.length,
          time_spent: timeSpent,
          answers: selectedAnswers
        });
      } catch (dbError) {
        console.log('Could not save to database, but quiz completed successfully');
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
  const allAnswered = questions.every(q => selectedAnswers[q.id]);

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
