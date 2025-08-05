import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Star, Target, Award, CheckCircle, XCircle, Clock } from "lucide-react";

interface QuizResultsProps {
  sessionData: {
    quizId: string;
    quizTitle: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    results: Array<{
      question: string;
      selectedAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }>;
    percentage: number;
  };
  onBackToList: () => void;
  onBackToDashboard: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const QuizResults = ({ sessionData, onBackToList, onBackToDashboard }: QuizResultsProps) => {
  const { quizTitle, score, totalQuestions, timeSpent, results, percentage } = sessionData;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { 
      message: "Nexlayer Expert!", 
      description: "You've mastered the AI-Native Cloud Platform!",
      color: "from-green-500 to-emerald-600",
      icon: <Award className="w-6 h-6" />
    };
    if (percentage >= 80) return { 
      message: "Cloud Architect!", 
      description: "Great understanding of Nexlayer concepts!",
      color: "from-nexlayer-cyan to-nexlayer-cyan/80",
      icon: <Star className="w-6 h-6" />
    };
    if (percentage >= 70) return { 
      message: "Getting There!", 
      description: "Good grasp of Nexlayer fundamentals!",
      color: "from-yellow-500 to-orange-500",
      icon: <Target className="w-6 h-6" />
    };
    if (percentage >= 60) return { 
      message: "Keep Learning!", 
      description: "Review the concepts and try again!",
      color: "from-orange-500 to-red-500",
      icon: <RotateCcw className="w-6 h-6" />
    };
    return { 
      message: "Study More!", 
      description: "More practice needed with Nexlayer!",
      color: "from-red-500 to-pink-600",
      icon: <RotateCcw className="w-6 h-6" />
    };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="my-20 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Main Results Card */}
      <Card className="text-center border-nexlayer-cyan/20 bg-gradient-to-br from-nexlayer-cyan/5 to-nexlayer-cyan/10 shadow-2xl">
        <CardHeader className="pb-6">
          <div className="mx-auto mb-6 relative">
            <div className="w-24 h-24 bg-gradient-to-r from-nexlayer-cyan to-nexlayer-cyan/80 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-4xl mb-3 bg-gradient-to-r from-nexlayer-cyan to-nexlayer-cyan/80 bg-clip-text text-transparent">
            Quiz Complete!
          </CardTitle>
          <h3 className="text-xl text-white font-medium">{quizTitle}</h3>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-8xl font-bold bg-gradient-to-r from-nexlayer-cyan to-nexlayer-cyan/80 bg-clip-text text-transparent mb-4 animate-scale-in">
              {percentage}%
            </div>
            <p className="text-2xl text-white mb-6">
              {score} out of {totalQuestions} questions correct
            </p>
            
            {/* Performance Badge */}
            <Badge className={`bg-gradient-to-r ${performance.color} text-white px-8 py-3 text-lg font-semibold shadow-lg flex items-center gap-2 w-fit mx-auto`}>
              {performance.icon}
              {performance.message}
            </Badge>
            <p className="text-muted-foreground mt-2">{performance.description}</p>
          </div>

          {/* Time Display */}
          <div className="text-center py-4 bg-card/50 rounded-lg border border-nexlayer-cyan/20">
            <p className="text-lg text-white">
              <Clock className="inline-block w-5 h-5 mr-2" />
              Time spent: <span className="font-semibold text-nexlayer-cyan">{formatTime(timeSpent)}</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-400 mb-1">{score}</div>
              <div className="text-sm text-green-300 font-medium">Correct Answers</div>
            </div>
            
            <div className="p-6 bg-red-500/10 rounded-xl border border-red-500/20">
              <div className="flex items-center justify-center mb-3">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400 mb-1">{totalQuestions - score}</div>
              <div className="text-sm text-red-300 font-medium">Incorrect Answers</div>
            </div>
            
            <div className="p-6 bg-nexlayer-cyan/10 rounded-xl border border-nexlayer-cyan/20">
              <div className="flex items-center justify-center mb-3">
                <Target className="w-8 h-8 text-nexlayer-cyan" />
              </div>
              <div className="text-3xl font-bold text-nexlayer-cyan mb-1">{totalQuestions}</div>
              <div className="text-sm text-nexlayer-cyan/80 font-medium">Total Questions</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-nexlayer-cyan/20">
            <Button 
              onClick={onBackToDashboard} 
              variant="outline" 
              size="lg"
              className="border-nexlayer-cyan/30 text-white hover:bg-nexlayer-cyan/10 hover:border-nexlayer-cyan/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              onClick={onBackToList} 
              size="lg" 
              className="bg-gradient-to-r from-nexlayer-cyan to-nexlayer-cyan/80 hover:from-nexlayer-cyan/90 hover:to-nexlayer-cyan/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Take Another Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info Card */}
      <Card className="border-nexlayer-cyan/20">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2 text-white">
            <Trophy className="w-5 h-5 text-nexlayer-cyan" />
            Nexlayer Knowledge Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              You've completed the <span className="font-semibold text-nexlayer-cyan">{quizTitle}</span> quiz, 
              testing your knowledge of Nexlayer's AI-Native Cloud Platform.
            </p>
            
            <div className="flex justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-nexlayer-cyan">Next Steps</div>
                <div className="text-muted-foreground">Try other quizzes to master Nexlayer</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-nexlayer-cyan">Learn More</div>
                <div className="text-muted-foreground">Visit nexlayer.com for documentation</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};