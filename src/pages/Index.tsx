import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuizDashboard } from "@/components/quiz/QuizDashboard";
import { QuizList } from "@/components/quiz/QuizList";
import { QuizTaker } from "@/components/quiz/QuizTaker";
import { QuizResults } from "@/components/quiz/QuizResults";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthComponent } from "@/components/auth/AuthComponent";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Globe, Shield, Clock, TrendingUp, Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'quiz' | 'results'>('dashboard');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const navigate = useNavigate();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{backgroundColor: '#191919'}}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-nexlayer-cyan mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth component if user is not logged in
  if (!user) {
    return <AuthComponent />;
  }

  const handleViewChange = (view: 'dashboard' | 'list' | 'quiz' | 'results', quizId?: string) => {
    setCurrentView(view);
    if (quizId) {
      setSelectedQuizId(quizId);
    }
  };

  const handleQuizComplete = (data: any) => {
    setSessionData(data);
    setCurrentView('results');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return <QuizList onQuizSelect={(quizId) => handleViewChange('quiz', quizId)} />;
      case 'quiz':
        return selectedQuizId ? 
          <QuizTaker 
            quizId={selectedQuizId} 
            onComplete={handleQuizComplete} 
            onBack={() => handleViewChange('list')}
          /> : 
          <QuizList onQuizSelect={(quizId) => handleViewChange('quiz', quizId)} />;
      case 'results':
        return <QuizResults 
          sessionData={sessionData} 
          onBackToDashboard={() => handleViewChange('dashboard')} 
          onBackToList={() => handleViewChange('list')}
        />;
      default:
        return <QuizDashboard onStartQuizzing={() => handleViewChange('list')} />;
    }
  };

  return (
    <div className="background-svg min-h-screen bg-background relative overflow-hidden flex flex-col" style={{backgroundColor: '#191919'}}>
      <Header onNavigate={(section) => {
        if (section === 'list') {
          handleViewChange('list');
        } else if (section === 'dashboard') {
          handleViewChange('dashboard');
        }
        // External links are handled directly in the Header component
      }} />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
