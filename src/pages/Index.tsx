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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Nexlayer Quiz App</h1>
          <p className="text-xl text-muted-foreground">Test your knowledge with our interactive quizzes</p>
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
