import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CSSProperties } from 'react';
import { ThumbsUp, ThumbsDown, PartyPopper, Check } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';

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
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0',
    padding: '0 1rem',
    width: '100%'
  },
  positiveButton: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.4)',
    borderRadius: '9999px',
    padding: '0.75rem 1.5rem',
    border: 'none',
    fontWeight: 'bold',
    transition: 'all 0.2s',
    width: '100%',
    maxWidth: '280px'
  },
  negativeButton: {
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.4)',
    borderRadius: '9999px',
    padding: '0.75rem 1.5rem',
    border: 'none',
    fontWeight: 'bold',
    transition: 'all 0.2s',
    width: '100%',
    maxWidth: '280px'
  }
};

const FeedbackPrompt: React.FC<FeedbackPromptProps> = ({ onResponse }) => {
  return (
    <Card style={styles.card} className="animate-in zoom-in-95 duration-300">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <CardHeader style={styles.cardHeader}>
        <CardTitle style={styles.cardTitle}>
          <Check className="inline-block mr-2 h-8 w-8" /> כל הכבוד!
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-0">
          <div className="bg-blue-50 rounded-lg p-2 mb-2 text-center">
            <p className="text-gray-700" style={styles.textCenter}>
              האם תרצה לשלוח לנו משוב?
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => onResponse(true)}
              className="w-full transition-all"
              style={{
                background: '#10b981',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '999px',
                padding: '8px 12px',
                fontSize: '14px'
              }}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              כן
            </Button>
            <Button
              onClick={() => {
                // מעקב אחר לחיצת "לא" למשוב
                try {
                  trackButtonClick('feedback-no', 'לא - לא רוצה לתת משוב', 'feedback_response');
                  console.log('✅ מעקב אחר משוב שלילי נשלח ל-Google Sheets');
                  
                  // סיום מעקב זמן - משתמש לא רוצה לתת משוב
                  console.log('🏁 מסיים מעקב זמן - לא רוצה לתת משוב');
                  import('@/utils/analytics').then(({ endUserTimer, formatDuration }) => {
                    const timing = endUserTimer(undefined, 'solution_complete');
                    if (timing?.duration) {
                      console.log(`⏱️ זמן עד סיום (ללא משוב): ${formatDuration(timing.duration)}`);
                    }
                  });
                } catch (error) {
                  console.error('❌ שגיאה במעקב משוב שלילי:', error);
                }
                onResponse(false);
              }}
              className="w-full transition-all"
              style={{
                background: '#ef4444',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '999px',
                padding: '8px 12px',
                fontSize: '14px'
              }}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              לא
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* No decorative elements to keep it simple */}
    </Card>
  );
};

export default FeedbackPrompt; 