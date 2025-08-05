import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Fetch quiz details
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single();

        if (quizError) throw quizError;
        setQuiz(quizData);

        // Fetch questions with options
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            id,
            question_text,
            question_options (
              id,
              option_text,
              is_correct
            )
          `)
          .eq('quiz_id', quizId)
          .order('created_at');

        if (questionsError) throw questionsError;

        const formattedQuestions = questionsData?.map(q => ({
          id: q.id,
          question_text: q.question_text,
          options: q.question_options || []
        })) || [];

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId, toast]);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
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
      const responses = [];

      for (const question of questions) {
        const selectedOptionId = selectedAnswers[question.id];
        if (selectedOptionId) {
          const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
          const isCorrect = selectedOption?.is_correct || false;
          if (isCorrect) score++;

          responses.push({
            question_id: question.id,
            selected_option_id: selectedOptionId,
            is_correct: isCorrect
          });
        }
      }

      // Create quiz session
      const { data: sessionData, error: sessionError } = await supabase
        .from('quiz_sessions')
        .insert({
          quiz_id: quizId,
          score,
          total_questions: questions.length
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Insert user responses
      const responsesWithSession = responses.map(response => ({
        ...response,
        session_id: sessionData.id
      }));

      const { error: responsesError } = await supabase
        .from('user_responses')
        .insert(responsesWithSession);

      if (responsesError) throw responsesError;

      // Pass results to parent
      onComplete({
        quiz,
        score,
        totalQuestions: questions.length,
        sessionId: sessionData.id,
        responses: responsesWithSession
      });

    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || !quiz || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const selectedAnswer = selectedAnswers[currentQuestion.id];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </Button>
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question_text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswer || ""}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer flex-1">
                  {option.option_text}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={!selectedAnswer}>
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!selectedAnswer}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};