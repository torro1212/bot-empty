import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CSSProperties } from 'react';
import { ThumbsUp, ThumbsDown, PartyPopper, Check } from 'lucide-react';

interface FeedbackPromptProps {
  onResponse: (wantsToGiveFeedback: boolean) => void;
}

const styles: Record<string, CSSProperties> = {
  card: {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.1)',
    background: 'linear-gradient(145deg, white, #f8fafc)',
    textAlign: 'center',
    borderRadius: '16px',
    overflow: 'hidden',
    maxWidth: '500px',
    margin: '0 auto',
    position: 'relative'
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
    color: 'white',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    textAlign: 'center',
    padding: '1.5rem 1rem'
  },
  cardTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: '1.75rem',
    fontWeight: 'bold'
  },
  textCenter: {
    textAlign: 'center',
    direction: 'rtl',
    unicodeBidi: 'embed'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem'
  },
  positiveButton: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.4)',
    borderRadius: '9999px',
    padding: '0.75rem 2rem',
    border: 'none',
    fontWeight: 'bold',
    transition: 'all 0.2s'
  },
  negativeButton: {
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.4)',
    borderRadius: '9999px',
    padding: '0.75rem 2rem',
    border: 'none',
    fontWeight: 'bold',
    transition: 'all 0.2s'
  }
};

const FeedbackPrompt: React.FC<FeedbackPromptProps> = ({ onResponse }) => {
  return (
    <Card style={styles.card} className="animate-in zoom-in-95 duration-300">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-3 right-3 opacity-80">
        <PartyPopper size={32} className="text-white animate-bounce" />
      </div>
      
      <CardHeader style={styles.cardHeader}>
        <CardTitle style={styles.cardTitle}>
          <Check className="inline-block mr-2 h-8 w-8" /> כל הכבוד!
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-8 pb-8 px-6">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600" style={styles.textCenter}>
            הצלחת לפתור את התקלה
          </h3>
          
          <div className="py-2 px-4 bg-blue-50 rounded-lg inline-block">
            <p className="text-gray-700 font-medium" style={styles.textCenter}>
              האם תרצה לשלוח לנו משוב?
            </p>
          </div>
          
          <div style={styles.buttonContainer}>
            <Button
              onClick={() => onResponse(true)}
              className="px-6 py-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={styles.positiveButton}
            >
              <ThumbsUp className="mr-2 h-5 w-5" />
              כן, בשמחה
            </Button>
            <Button
              onClick={() => onResponse(false)}
              className="px-6 py-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={styles.negativeButton}
            >
              <ThumbsDown className="mr-2 h-5 w-5" />
              לא, תודה
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Decorative elements */}
      <div className="absolute -z-10 top-20 right-0 w-20 h-20 rounded-full bg-blue-100 opacity-30 blur-xl"></div>
      <div className="absolute -z-10 bottom-10 left-5 w-24 h-24 rounded-full bg-indigo-100 opacity-30 blur-xl"></div>
    </Card>
  );
};

export default FeedbackPrompt; 