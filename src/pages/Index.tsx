import { useState } from "react";
import { QuizList } from "@/components/quiz/QuizList";
import { QuizTaker } from "@/components/quiz/QuizTaker";
import { QuizResults } from "@/components/quiz/QuizResults";

const Index = () => {
  const [currentView, setCurrentView] = useState<'list' | 'quiz' | 'results'>('list');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  const handleQuizSelect = (quizId: string) => {
    setSelectedQuizId(quizId);
    setCurrentView('quiz');
  };

  const handleQuizComplete = (results: any) => {
    setSessionData(results);
    setCurrentView('results');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedQuizId(null);
    setSessionData(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-nexlayer-dark via-background to-nexlayer-dark opacity-50"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-nexlayer-cyan rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-nexlayer-cyan rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-nexlayer-cyan rounded mr-3"></div>
            <h1 className="text-5xl font-bold text-foreground">Nexlayer</h1>
          </div>
          <h2 className="text-3xl font-bold text-nexlayer-cyan mb-4">Quiz Platform</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge with our interactive quizzes. From prototype to product, 
            <span className="text-nexlayer-cyan"> no infrastructure PhD required.</span>
          </p>
        </header>

        {currentView === 'list' && (
          <QuizList onQuizSelect={handleQuizSelect} />
        )}

        {currentView === 'quiz' && selectedQuizId && (
          <QuizTaker 
            quizId={selectedQuizId} 
            onComplete={handleQuizComplete}
            onBack={handleBackToList}
          />
        )}

        {currentView === 'results' && sessionData && (
          <QuizResults 
            sessionData={sessionData}
            onBackToList={handleBackToList}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
