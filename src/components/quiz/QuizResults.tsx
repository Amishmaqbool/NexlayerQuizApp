import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Star, Target, Award, CheckCircle, XCircle } from "lucide-react";

interface QuizResultsProps {
  sessionData: {
    quiz: any;
    score: number;
    totalQuestions: number;
    sessionId: string;
    responses: any[];
  };
  onBackToList: () => void;
  onBackToDashboard: () => void;
}

export const QuizResults = ({ sessionData, onBackToList, onBackToDashboard }: QuizResultsProps) => {
  const { quiz, score, totalQuestions } = sessionData;
  const percentage = Math.round((score / totalQuestions) * 100);

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
      color: "from-blue-500 to-indigo-600",
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Main Results Card */}
      <Card className="text-center border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 shadow-2xl">
        <CardHeader className="pb-6">
          <div className="mx-auto mb-6 relative">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-4xl mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Quiz Complete!
          </CardTitle>
          <h3 className="text-xl text-muted-foreground font-medium">{quiz.title}</h3>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-scale-in">
              {percentage}%
            </div>
            <p className="text-2xl text-muted-foreground mb-6">
              {score} out of {totalQuestions} questions correct
            </p>
            
            {/* Performance Badge */}
            <Badge className={`bg-gradient-to-r ${performance.color} text-white px-8 py-3 text-lg font-semibold shadow-lg flex items-center gap-2 w-fit mx-auto`}>
              {performance.icon}
              {performance.message}
            </Badge>
            <p className="text-muted-foreground mt-2">{performance.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">{score}</div>
              <div className="text-sm text-green-700 dark:text-green-400 font-medium">Correct Answers</div>
            </div>
            
            <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-center mb-3">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600 mb-1">{totalQuestions - score}</div>
              <div className="text-sm text-red-700 dark:text-red-400 font-medium">Incorrect Answers</div>
            </div>
            
            <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{totalQuestions}</div>
              <div className="text-sm text-blue-700 dark:text-blue-400 font-medium">Total Questions</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-purple-200 dark:border-purple-800">
            <Button 
              onClick={onBackToDashboard} 
              variant="outline" 
              size="lg"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              onClick={onBackToList} 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Take Another Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info Card */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-purple-500" />
            Nexlayer Knowledge Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              You've completed the <span className="font-semibold text-purple-600 dark:text-purple-400">{quiz.title}</span> quiz, 
              testing your knowledge of Nexlayer's AI-Native Cloud Platform.
            </p>
            
            <div className="flex justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-semibold text-purple-600 dark:text-purple-400">Next Steps</div>
                <div className="text-muted-foreground">Try other quizzes to master Nexlayer</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600 dark:text-blue-400">Learn More</div>
                <div className="text-muted-foreground">Visit nexlayer.com for documentation</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};