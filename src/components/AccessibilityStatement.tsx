import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ExternalLink, Mail, Phone } from 'lucide-react';

const AccessibilityStatement: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const lastUpdated = new Date().toLocaleDateString('he-IL');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="fixed bottom-2 right-2 z-40 text-xs underline text-white hover:text-gray-200 bg-black bg-opacity-60 hover:bg-opacity-80 px-3 py-1 rounded"
          aria-label="הצהרת נגישות"
          data-accessibility-statement="true"
        >
          <FileText className="h-3 w-3 ml-1" />
          הצהרת נגישות
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            הצהרת נגישות
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-right" dir="rtl">
            
            <section>
              <h2 className="text-lg font-semibold mb-3">מחויבות לנגישות</h2>
              <p className="text-sm leading-relaxed">
                אנו בחברה מחויבים להנגשת שירותי האינטרנט שלנו לכלל הציבור, 
                לרבות אנשים עם מוגבלויות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998
                ותקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירותי אינטרנט), התש"ף-2019.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">תקן נגישות</h2>
              <p className="text-sm leading-relaxed">
                האתר בנוי בהתאם לתקן הישראלי ת"י 5568 המבוסס על הנחיות 
                <strong> WCAG 2.1</strong> ברמת התאמה <strong>AA</strong>.
                התקן מתייחס לנגישות תכנים באינטרנט עבור מגוון רחב של מוגבלויות 
                כולל עיוורון וליקויי ראייה, חירשות ולקויי שמעה, מוגבלויות למידה, 
                מוגבלויות קוגניטיביות, מוגבלויות נוירולוגיות, מוגבלויות פיזיות ומוגבלויות דיבור.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">מצב הנגישות באתר</h2>
              <p className="text-sm leading-relaxed mb-3">
                הערכנו את נגישות האתר בהתאם לתקן WCAG 2.1 ברמת התאמה AA.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ תכונות נגישות זמינות:</h3>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>• ניווט מקלדת מלא</li>
                  <li>• תמיכה בקוראי מסך</li>
                  <li>• הגדלת/הקטנת טקסט (80%-150%)</li>
                  <li>• מצב ניגודיות גבוהה</li>
                  <li>• פונט מותאם לדיסלקציה</li>
                  <li>• הפחתת אנימציות</li>
                  <li>• הדגשת פוקוס משופרת</li>
                  <li>• קישורי דילוג לתוכן</li>
                  <li>• תמיכה בזום דפדפן עד 200%</li>
                  <li>• הגדלת סמן עכבר</li>
                  <li>• קו תחתי לקישורים</li>
                  <li>• עצירת אנימציות מלאה</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ מגבלות נגישות ידועות:</h3>
                <ul className="text-sm space-y-1 text-yellow-700">
                  <li>• תכנים של צד שלישי עשויים להיות בעלי רמת נגישות שונה</li>
                  <li>• קבצי PDF ישנים עדיין לא הונגשו במלואם</li>
                  <li>• חלק מהתכנים הישנים עדיין בתהליך הנגשה</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">פניות נגישות</h2>
              <p className="text-sm leading-relaxed mb-4">
                אם נתקלת בבעיית נגישות באתר או שאתה זקוק לקבלת מידע בפורמט נגיש אחר, 
                אנא פנה אלינו:
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <strong>דואר אלקטרוני:</strong> Support@mutagim.com
                  </span>
                </div>
                
                <p className="text-xs text-gray-600">
                  אנו מתחייבים להגיב לפניות נגישות תוך 15 ימי עסקים
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">עדכון אחרון</h2>
              <p className="text-sm text-gray-600">
                הצהרה זו עודכנה בתאריך: <strong>{lastUpdated}</strong>
              </p>
            </section>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityStatement; 