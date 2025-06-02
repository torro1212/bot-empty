import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Printer, Wifi, Users, ChevronDown, Play, FileText, MessageCircle, Zap } from 'lucide-react';
import TroubleshootingSelector from './TroubleshootingSelector';
import InteractiveSolutionCenter from './InteractiveSolutionCenter';

const SupportCategories = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('guides');

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
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">פתרון בעיות טכניות</h2>
        <p className="text-base sm:text-lg text-gray-600">מדריכים ומערכות אוטומטיות לפתרון תקלות בקלות ובמהירות</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-8">
          <TabsTrigger value="guides" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base py-2">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            מדריכים כתובים
          </TabsTrigger>
          <TabsTrigger value="interactive" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base py-2">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
            פתרון אוטומטי אינטראקטיבי
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className={`${category.color} text-white p-3 sm:p-6`}>
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <category.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-white/90 text-xs sm:text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                  {category.articles.map((article, index) => (
                    <Collapsible key={index}>
                      <CollapsibleTrigger asChild>
                        <div className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{article.title}</h4>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                <Badge className={`${getDifficultyColor(article.difficulty)} text-xs`}>
                                  {article.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {article.duration}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full">
                              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-3 sm:p-4 bg-gray-50 space-y-2 sm:space-y-3">
                          <h5 className="font-medium text-sm sm:text-base">שלבי פתרון:</h5>
                          <ol className="space-y-1 sm:space-y-2 list-decimal list-inside text-xs sm:text-sm">
                            {article.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-gray-700">{step}</li>
                            ))}
                          </ol>
                          <div className="pt-2 sm:pt-3 flex justify-end">
                            <Button size="sm" className="text-xs sm:text-sm h-7 sm:h-9">
                              <Play className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                              הצג מדריך מפורט
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
        </TabsContent>

        <TabsContent value="interactive" className="space-y-4 sm:space-y-6">
          <InteractiveSolutionCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportCategories;
