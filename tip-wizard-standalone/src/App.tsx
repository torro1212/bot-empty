import React from 'react';
import AutomatedSolutionWizard from './components/AutomatedSolutionWizard';
import { useToast } from './hooks/use-toast';

const App: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 md:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          טיפ - אשף פתרון תקלות
        </h1>
        <p className="text-gray-600">
          העוזר החכם שלך לפתרון תקלות טכניות
        </p>
      </header>

      <main className="max-w-3xl mx-auto">
        <AutomatedSolutionWizard
          onComplete={() => {
            toast({
              title: "הפתרון הושלם!",
              description: "תודה שהשתמשת באשף הפתרון המהיר",
            });
          }}
        />
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} טיפ - מערכת פתרון תקלות אוטומטית</p>
      </footer>
    </div>
  );
};

export default App; 