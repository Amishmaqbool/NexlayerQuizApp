import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, BookOpen, Clock, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Quiz {
  id: string;
  title: string;
  description: string;
  questionCount?: number;
  difficulty?: string;
  estimatedTime?: number;
  completions?: number;
  averageScore?: number;
}

interface QuizListProps {
  onQuizSelect: (quizId: string) => void;
}

export const QuizList = ({ onQuizSelect }: QuizListProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        console.log('Fetching quizzes...');
        const { data: quizzesData, error: quizzesError } = await supabase
          .from('quizzes')
          .select('*')
          .order('created_at', { ascending: false });

        if (quizzesError) {
          console.error('Quiz fetch error:', quizzesError);
          throw quizzesError;
        }

        console.log('Fetched quizzes:', quizzesData);

        // Get question counts for each quiz with error handling
        const quizzesWithCounts = await Promise.all(
          (quizzesData || []).map(async (quiz) => {
            try {
              const { count, error: countError } = await supabase
                .from('questions')
                .select('*', { count: 'exact', head: true })
                .eq('quiz_id', quiz.id);

              if (countError) {
                console.error('Question count error for quiz', quiz.id, ':', countError);
                // Continue with default values instead of failing
              }

              const questionCount = count || 0;
              
              // Set default values without trying to access quiz_sessions for now
              const difficulty = questionCount <= 3 ? 'Beginner' : questionCount <= 6 ? 'Intermediate' : 'Advanced';
              const estimatedTime = Math.max(questionCount * 1.5, 5); // At least 5 minutes

              return {
                ...quiz,
                questionCount,
                difficulty,
                estimatedTime,
                completions: 0, // Default value for now
                averageScore: 0  // Default value for now
              };
            } catch (error) {
              console.error('Error processing quiz', quiz.id, ':', error);
              // Return quiz with default values if there's an error
              return {
                ...quiz,
                questionCount: 0,
                difficulty: 'Beginner',
                estimatedTime: 5,
                completions: 0,
                averageScore: 0
              };
            }
          })
        );

        console.log('Processed quizzes:', quizzesWithCounts);
        setQuizzes(quizzesWithCounts);
        setFilteredQuizzes(quizzesWithCounts);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        toast({
          title: "Database Error",
          description: `Failed to load quizzes: ${error.message || 'Unknown error'}`,
          variant: "destructive",
        });
        setQuizzes([]);
        setFilteredQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [toast]);

  // Filter quizzes based on search term
  useEffect(() => {
    const filtered = quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="py-28 max-w-7xl mx-auto space-y-8 px-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-nexlayer-cyan to-nexlayer-cyan/80 bg-clip-text text-transparent">
          Nexlayer Quiz Collection
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master the AI-Native Cloud Platform with our comprehensive quiz series
        </p>
        
        {/* Search */}
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <Card 
            key={quiz.id} 
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer"
            onClick={() => onQuizSelect(quiz.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-lg group-hover:text-nexlayer-cyan transition-colors">
                    {quiz.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getDifficultyColor(quiz.difficulty || 'Beginner')}`}>
                      {quiz.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {quiz.questionCount} questions
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm text-muted-foreground">
                {quiz.description}
              </CardDescription>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{quiz.estimatedTime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{quiz.completions} completed</span>
                </div>
              </div>
              
              {quiz.averageScore !== undefined && quiz.averageScore > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-nexlayer-cyan" />
                  <span className="text-sm text-nexlayer-cyan font-medium">
                    {quiz.averageScore}% avg score
                  </span>
                </div>
              )}
              
              <Button 
                className="w-full bg-nexlayer-cyan hover:bg-nexlayer-cyan/90 text-nexlayer-dark font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuizSelect(quiz.id);
                }}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No quizzes found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'No quizzes available at the moment'}
          </p>
        </div>
      )}
    </div>
  );
};
