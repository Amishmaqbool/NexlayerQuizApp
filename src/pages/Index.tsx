import { useState, useEffect } from "react";
import { QuizDashboard } from "@/components/quiz/QuizDashboard";
import { QuizList } from "@/components/quiz/QuizList";
import { QuizTaker } from "@/components/quiz/QuizTaker";
import { QuizResults } from "@/components/quiz/QuizResults";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Globe, Shield, Clock, TrendingUp } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'quiz' | 'results'>('dashboard');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0);

  const handleViewChange = (view: 'dashboard' | 'list' | 'quiz' | 'results', quizId?: string) => {
    setCurrentView(view);
    if (quizId) {
      setSelectedQuizId(quizId);
    }
  };

  const handleQuizComplete = (data: any) => {
    setSessionData(data);
    setCurrentView('results');
    // Trigger dashboard refresh when quiz is completed
    setDashboardRefreshTrigger(prev => prev + 1);
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
        return <QuizDashboard 
          onStartQuizzing={() => handleViewChange('list')} 
          refreshTrigger={dashboardRefreshTrigger}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col" style={{backgroundColor: '#191919'}}>
      {/* Header */}
      <Header onNavigate={(section) => {
        if (section === 'quizzes') {
          handleViewChange('list');
        } else if (section === 'dashboard') {
          handleViewChange('dashboard');
        }
      }} />

      {/* Main Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
