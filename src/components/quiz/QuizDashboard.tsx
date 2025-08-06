import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Star,
  ArrowRight,
  Zap,
  Users,
  Award,
  ChevronRight,
  Globe,
  Shield,
  Rocket,
  Code,
  Database,
  Layers
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizStats {
  totalQuizzes: number;
  totalQuestions: number;
  totalSessions: number;
  averageScore: number;
  recentSessions: any[];
}

interface QuizDashboardProps {
  onStartQuizzing: () => void;
}

export const QuizDashboard = ({ onStartQuizzing }: QuizDashboardProps) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalSessions: 0,
    averageScore: 0,
    recentSessions: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        console.log('No user in QuizDashboard');
        return;
      }
      
      console.log('Fetching stats for user:', user.id);
      
      try {
        // Try to fetch quiz count (total available quizzes)
        const { count: quizCount } = await supabase
          .from('quizzes')
          .select('*', { count: 'exact', head: true });

        // Try to fetch total questions (total available questions)
        const { count: questionCount } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });

        // Try to fetch session stats for the current user only
        const { data: sessions, count: sessionCount } = await supabase
          .from('quiz_sessions')
          .select('*, quizzes(title)', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Calculate average score for the current user only
        const { data: allSessions } = await supabase
          .from('quiz_sessions')
          .select('score, total_questions')
          .eq('user_id', user.id)
          .not('score', 'is', null)
          .not('total_questions', 'is', null);

        let avgScore = 0;
        if (allSessions && allSessions.length > 0) {
          const validSessions = allSessions.filter(session => 
            session.score !== null && session.total_questions !== null && session.total_questions > 0
          );
          
          if (validSessions.length > 0) {
            const totalPercentage = validSessions.reduce((sum, session) => {
              return sum + (session.score / session.total_questions) * 100;
            }, 0);
            avgScore = Math.round(totalPercentage / validSessions.length);
          }
        }

        setStats({
          totalQuizzes: quizCount || 0,
          totalQuestions: questionCount || 0,
          totalSessions: sessionCount || 0,
          averageScore: avgScore,
          recentSessions: sessions || []
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard stats. Please ensure database is connected.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, toast]);

  const features = [
    {
      icon: Brain,
      title: "AI-Native Platform",
      description: "Learn about Nexlayer's revolutionary approach to cloud deployment",
      color: "text-nexlayer-cyan"
    },
    {
      icon: Zap,
      title: "One Command Deploy",
      description: "Master the art of deploying entire stacks with a single command",
      color: "text-yellow-500"
    },
    {
      icon: Target,
      title: "Production Ready",
      description: "Understand enterprise-grade infrastructure and scaling",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Agent Friendly",
      description: "Explore the future of autonomous deployments and AI agents",
      color: "text-nexlayer-cyan"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-nexlayer-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 max-w-7xl mx-auto animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-nexlayer-cyan/10 border border-nexlayer-cyan/20 mb-6">
          <Star className="w-4 h-4 text-nexlayer-cyan mr-2" />
          <span className="text-sm font-medium text-nexlayer-cyan">Master the AI-Native Cloud</span>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Test Your Knowledge of Modern Cloud Infrastructure
        </h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Take comprehensive quizzes covering Nexlayer's platform, CLI commands, and cloud infrastructure concepts.
        </p>
        <Button 
          onClick={onStartQuizzing}
          size="lg"
          className="bg-nexlayer-cyan hover:bg-nexlayer-cyan/90 text-nexlayer-dark font-semibold px-8 py-3 text-lg"
        >
          Start Learning
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-nexlayer-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexlayer-cyan">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">Available knowledge tests</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Questions</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">Comprehensive coverage</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attempts</CardTitle>
            <TrendingUp className="h-4 w-4 text-nexlayer-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexlayer-cyan">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Total quiz attempts</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Community average</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h4 className="text-xl font-bold text-foreground mb-6">What You'll Learn</h4>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-background/50`}>
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground mb-1">{feature.title}</h5>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-bold text-foreground mb-6">Recent Activity</h4>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              {stats.recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentSessions.map((session, index) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-nexlayer-cyan/20 flex items-center justify-center">
                          <Award className="w-4 h-4 text-nexlayer-cyan" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{session.quizzes?.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={session.score / session.total_questions >= 0.8 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {Math.round((session.score / session.total_questions) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No quiz attempts yet</p>
                  <p className="text-sm text-muted-foreground">Start your first quiz to see activity here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="border-nexlayer-cyan/20 bg-gradient-to-r from-nexlayer-cyan/5 to-nexlayer-cyan/10 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <Brain className="w-12 h-12 text-nexlayer-cyan mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-white mb-2">Ready to Master Nexlayer?</h4>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of developers who are mastering the future of cloud deployment. 
              Test your knowledge and become an expert in AI-native infrastructure.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onStartQuizzing}
              size="lg"
              className="bg-nexlayer-cyan hover:bg-nexlayer-cyan/90 text-nexlayer-dark font-semibold"
            >
              Take Your First Quiz
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open('https://nexlayer.com', '_blank')}
            >
              Visit Nexlayer.com
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
