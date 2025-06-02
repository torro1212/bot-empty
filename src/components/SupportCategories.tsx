
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Monitor, Printer, Wifi, Users, ChevronDown, Play, FileText, MessageCircle } from 'lucide-react';

const SupportCategories = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const categories = [
    {
      id: 'pos',
      title: 'מערכות קופה (POS)',
      description: 'פתרונות לבעיות קופה, מערכות תשלום ורישום',
      icon: Monitor,
      color: 'bg-blue-500',
      articles: [
        {
          title: 'הקופה לא נדלקת',
          difficulty: 'קל',
          duration: '5 דקות',
          steps: [
            'בדוק שכבל החשמל מחובר היטב לקופה ולחשמל',
            'ודא שמתג הפעלה/כיבוי במצב ON',
            'בדוק שיש חשמל בחנות - נסה לחבר מכשיר אחר',
            'אם הנורות דולקות אבל המסך כבוי - לחץ על מתג המסך'
          ]
        },
        {
          title: 'שגיאה בעיבוד תשלומים',
          difficulty: 'בינוני',
          duration: '10 דקות',
          steps: [
            'בדוק חיבור האינטרנט - ודא שהרשת פעילה',
            'נסה לסגור ולפתח מחדש את תוכנת הקופה',
            'בדוק שטרמינל האשראי מחובר ופעיל',
            'נסה עסקה בסכום קטן (1 ש״ח) לבדיקה'
          ]
        }
      ]
    },
    {
      id: 'printer',
      title: 'מדפסות וסורקים',
      description: 'פתרונות לבעיות הדפסה, קבלות וסריקת ברקודים',
      icon: Printer,
      color: 'bg-green-500',
      articles: [
        {
          title: 'המדפסת לא מדפיסה',
          difficulty: 'קל',
          duration: '5 דקות',
          steps: [
            'בדוק שיש נייר במדפסת ושהוא מושחל נכון',
            'ודא שהמדפסת מחוברת לחשמל ודולקת',
            'בדוק שכבל ה-USB מחובר היטב למחשב ולמדפסת',
            'נסה להדפיס דף בדיקה מתוך הגדרות המדפסת'
          ]
        },
        {
          title: 'איכות הדפסה גרועה',
          difficulty: 'בינוני',
          duration: '15 דקות',
          steps: [
            'נקה את ראש ההדפסה באמצעות הכלי במדפסת',
            'בדוק שכמות הדיו/טונר מספקת',
            'ודא שאתה משתמש בנייר מתאים (גודל ועובי)',
            'עדכן את דרייבר המדפסת למחשב'
          ]
        }
      ]
    },
    {
      id: 'network',
      title: 'רשת ואינטרנט',
      description: 'פתרונות לבעיות חיבור, WiFi ורשתות',
      icon: Wifi,
      color: 'bg-purple-500',
      articles: [
        {
          title: 'אין חיבור לאינטרנט',
          difficulty: 'קל',
          duration: '10 דקות',
          steps: [
            'בדוק שהנתב דולק - נורות ירוקות או כחולות',
            'נתק את כבל החשמל מהנתב למשך 30 שניות ותחבר בחזרה',
            'בדוק שכבלי הרשת מחוברים היטב',
            'צור קשר עם ספק האינטרנט לבדיקת קו'
          ]
        },
        {
          title: 'WiFi לא עובד',
          difficulty: 'בינוני',
          duration: '15 דקות',
          steps: [
            'בדוק שה-WiFi מופעל במכשיר שלך',
            'נסה לשכוח ולהתחבר מחדש לרשת',
            'בדוק שאתה קרוב מספיק לנתב',
            'נסה להפעיל מחדש את הנתב ואת המכשיר'
          ]
        }
      ]
    },
    {
      id: 'users',
      title: 'ניהול משתמשים',
      description: 'פתרונות לבעיות התחברות, סיסמאות והרשאות',
      icon: Users,
      color: 'bg-orange-500',
      articles: [
        {
          title: 'שכחתי סיסמה',
          difficulty: 'קל',
          duration: '5 דקות',
          steps: [
            'לחץ על "שכחתי סיסמה" במסך ההתחברות',
            'הזן את כתובת המייל הרשומה במערכת',
            'בדוק את תיבת המייל שלך (כולל תיקיית ספאם)',
            'לחץ על הקישור ברסאל ועקוב אחר ההוראות'
          ]
        },
        {
          title: 'לא מצליח להתחבר למערכת',
          difficulty: 'בינוני',
          duration: '10 דקות',
          steps: [
            'ודא שאתה מזין את שם המשתמש והסיסמה נכון',
            'בדוק ש-Caps Lock כבוי',
            'נסה לאפס את הסיסמה',
            'צור קשר עם מנהל המערכת לבדיקת הרשאות'
          ]
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'קל': return 'bg-green-100 text-green-800';
      case 'בינוני': return 'bg-yellow-100 text-yellow-800';
      case 'קשה': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">מדריכי פתרון בעיות</h2>
        <p className="text-lg text-gray-600">מדריכים מפורטים לפתרון התקלות הנפוצות ביותר</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className={`${category.color} text-white`}>
              <CardTitle className="flex items-center gap-3">
                <category.icon className="w-6 h-6" />
                {category.title}
              </CardTitle>
              <CardDescription className="text-white/90">
                {category.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              {category.articles.map((article, index) => (
                <Collapsible key={index}>
                  <CollapsibleTrigger asChild>
                    <div className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                          <div className="flex gap-2">
                            <Badge className={getDifficultyColor(article.difficulty)}>
                              {article.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {article.duration}
                            </Badge>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 bg-gray-50">
                      <h5 className="font-medium text-gray-900 mb-3">שלבי הפתרון:</h5>
                      <ol className="space-y-3">
                        {article.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                      
                      <div className="mt-4 pt-4 border-t flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          צפה בסרטון
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          הורד מדריך
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          דבר עם טיפ
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SupportCategories;
