import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw } from "lucide-react";

interface QuizResultsProps {
  sessionData: {
    quiz: any;
    score: number;
    totalQuestions: number;
    sessionId: string;
    responses: any[];
  };
  onBackToList: () => void;
}

export const QuizResults = ({ sessionData, onBackToList }: QuizResultsProps) => {
  const { quiz, score, totalQuestions } = sessionData;
  const percentage = Math.round((score / totalQuestions) * 100);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Excellent work!", color: "bg-green-500" };
    if (percentage >= 80) return { message: "Great job!", color: "bg-blue-500" };
    if (percentage >= 70) return { message: "Good effort!", color: "bg-yellow-500" };
    if (percentage >= 60) return { message: "Keep practicing!", color: "bg-orange-500" };
    return { message: "Try again!", color: "bg-red-500" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card className="text-center border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Trophy className="w-16 h-16 text-nexlayer-cyan animate-glow" />
          </div>
          <CardTitle className="text-4xl mb-2 text-nexlayer-cyan">Quiz Complete!</CardTitle>
          <h3 className="text-xl text-muted-foreground">{quiz.title}</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-nexlayer-cyan mb-2 animate-scale-in">
              {percentage}%
            </div>
            <p className="text-xl text-muted-foreground">
              {score} out of {totalQuestions} correct
            </p>
          </div>

          <div className="flex justify-center">
            <Badge className="bg-nexlayer-cyan text-nexlayer-dark px-6 py-3 text-lg font-semibold animate-glow">
              {performance.message}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg border border-nexlayer-cyan/20">
              <div className="text-2xl font-bold text-nexlayer-cyan">{score}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-destructive/20">
              <div className="text-2xl font-bold text-destructive">{totalQuestions - score}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border/20">
              <div className="text-2xl font-bold text-foreground">{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button onClick={onBackToList} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Another Quiz
            </Button>
            <Button onClick={onBackToList} size="lg" className="bg-nexlayer-cyan hover:bg-nexlayer-cyan/90 text-nexlayer-dark font-semibold">
              Back to Quiz List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};