import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Zap } from 'lucide-react';
import TroubleshootingSelector from './TroubleshootingSelector';
import { Button } from './ui/button';

const InteractiveSolutionCenter = () => {
  const [activeTab, setActiveTab] = useState<string>('current');
  
  const faqItems = [
    {
      question: "מה זה פתרון אוטומטי אינטראקטיבי?",
      answer: "פתרון אוטומטי אינטראקטיבי הוא מערכת חכמה שמובילה אותך צעד אחר צעד לפתרון תקלות טכניות. המערכת שואלת שאלות ומציגה אפשרויות, ובהתאם לתשובות שלך, מנחה אותך לפתרון המתאים."
    },
    {
      question: "איך עובד תהליך הפתרון האוטומטי?",
      answer: "בחר את סוג הבעיה (קופה, מכשיר אשראי או חולץ), ענה על השאלות המוצגות בכל שלב, וצפה בהנחיות, תמונות וסרטונים שיעזרו לך לפתור את התקלה. בכל שלב תוכל לחזור לשלב הקודם אם תרצה."
    },
    {
      question: "מה לעשות אם הפתרון האוטומטי לא עזר?",
      answer: "אם לא הצלחת לפתור את הבעיה באמצעות המערכת האוטומטית, תוכל לשלוח דיווח תקלה ישירות מהמערכת. צוות התמיכה שלנו יצור איתך קשר בהקדם."
    },
    {
      question: "האם אפשר לחזור לשלבים קודמים?",
      answer: "כן, בכל שלב יש כפתור 'חזור לשלב הקודם' שמאפשר לך לחזור לשאלה הקודמת ולבחור תשובה אחרת."
    },
    {
      question: "מה לעשות אם אני לא מבין את ההנחיות?",
      answer: "אם ההנחיות לא ברורות, תוכל לחזור לשלב הקודם או לשלוח דיווח תקלה. אנו ממליצים גם לצפות בסרטוני ההדרכה המצורפים בחלק מהשלבים."
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
          <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
          פתרון אוטומטי אינטראקטיבי
        </CardTitle>
        <CardDescription className="text-white/90 text-xs sm:text-sm">
          מערכת חכמה שתוביל אותך צעד אחר צעד לפתרון התקלה
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="current" className="text-sm sm:text-base">
              פתרון תקלות
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-sm sm:text-base">
              שאלות ותשובות
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-2">
            <TroubleshootingSelector />
          </TabsContent>
          
          <TabsContent value="faq" className="mt-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center mb-4">שאלות נפוצות על מערכת הפתרון האוטומטי</h3>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-blue-50 p-3">
                      <CardTitle className="text-base font-medium">{item.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 text-sm">
                      {item.answer}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InteractiveSolutionCenter; 