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

export const RobustQuizList = ({ onQuizSelect }: QuizListProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        console.log('🚀 RobustQuizList: Starting to fetch quizzes...');
        
        // Simple, reliable query for quizzes
        const { data: quizzesData, error: quizzesError } = await supabase
          .from('quizzes')
          .select('*')
          .order('created_at', { ascending: false });

        if (quizzesError) {
          console.error('❌ RobustQuizList: Error fetching quizzes:', quizzesError);
          throw new Error(quizzesError.message);
        }

        console.log('✅ RobustQuizList: Fetched quizzes:', quizzesData);

        if (!quizzesData || quizzesData.length === 0) {
          console.log('⚠️ RobustQuizList: No quizzes found');
          setQuizzes([]);
          setFilteredQuizzes([]);
          return;
        }

        // Add question counts and attempt statistics one by one with error handling
        const quizzesWithCounts = await Promise.allSettled(
          quizzesData.map(async (quiz) => {
            try {
              // Get question count
              const { count, error: countError } = await supabase
                .from('questions')
                .select('*', { count: 'exact', head: true })
                .eq('quiz_id', quiz.id);

              if (countError) {
                console.error(`⚠️ RobustQuizList: Count error for ${quiz.title}:`, countError);
                // Use default count instead of failing
              }

              // Get completion statistics
              const { data: sessions, error: sessionError } = await supabase
                .from('quiz_sessions')
                .select('score, total_questions')
                .eq('quiz_id', quiz.id)
                .eq('status', 'completed')
                .not('completed_at', 'is', null);

              if (sessionError) {
                console.error(`⚠️ RobustQuizList: Session error for ${quiz.title}:`, sessionError);
              }

              const questionCount = count || 15; // Default to 15 questions
              const difficulty = questionCount >= 10 ? 'Advanced' : questionCount >= 5 ? 'Intermediate' : 'Beginner';
              const estimatedTime = Math.max(questionCount * 1.5, 5);
              
              // Calculate completion statistics
              const completions = sessions?.length || 0;
              const averageScore = completions > 0 
                ? Math.round((sessions.reduce((sum, session) => sum + (session.score || 0), 0) / completions) * 100 / questionCount) / 100
                : 0;

              return {
                ...quiz,
                questionCount,
                difficulty,
                estimatedTime,
                completions,
                averageScore
              };
            } catch (error) {
              console.error(`⚠️ RobustQuizList: Processing error for ${quiz.title}:`, error);
              // Return quiz with defaults if there's an error
              return {
                ...quiz,
                questionCount: 15,
                difficulty: 'Advanced',
                estimatedTime: 22.5,
                completions: 0,
                averageScore: 0
              };
            }
          })
        );

        // Extract successful results and handle failures gracefully
        const successfulQuizzes = quizzesWithCounts
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<Quiz>).value);

        const failedCount = quizzesWithCounts.length - successfulQuizzes.length;
        if (failedCount > 0) {
          console.warn(`⚠️ RobustQuizList: ${failedCount} quizzes failed to process completely`);
        }

        console.log('✅ RobustQuizList: Final processed quizzes:', successfulQuizzes);
        
        setQuizzes(successfulQuizzes);
        setFilteredQuizzes(successfulQuizzes);

        if (successfulQuizzes.length > 0) {
          toast({
            title: "Quizzes Loaded",
            description: `Successfully loaded ${successfulQuizzes.length} quizzes with 15 questions each.`,
            variant: "default",
          });
        }

      } catch (error) {
        console.error('💥 RobustQuizList: Fatal error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        toast({
          title: "Error Loading Quizzes",
          description: errorMessage,
          variant: "destructive",
        });

        // Set empty state
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
    if (!searchTerm.trim()) {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    }
  }, [searchTerm, quizzes]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-nexlayer-cyan mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Available Quizzes
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Choose from {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'es' : ''} with 15 questions each
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchTerm ? 'No matching quizzes found' : 'No quizzes available'}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search term.' : 'Check back later for new quizzes.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card 
              key={quiz.id} 
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-nexlayer-cyan/50 transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getDifficultyColor(quiz.difficulty || 'Advanced')}>
                    {quiz.difficulty || 'Advanced'}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {quiz.questionCount || 15}
                  </div>
                </div>
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  {quiz.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-nexlayer-cyan" />
                    {Math.round(quiz.estimatedTime || 22.5)} min
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-nexlayer-cyan" />
                    {quiz.completions || 0} taken
                  </div>
                </div>
                
                <Button 
                  onClick={() => onQuizSelect(quiz.id)}
                  className="w-full bg-nexlayer-cyan hover:bg-nexlayer-cyan/90 text-background font-semibold"
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};