
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, MessageCircle, FileText, Monitor, Printer, Wifi, Users, Settings, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TechSupportBot from '@/components/TechSupportBot';
import SupportCategories from '@/components/SupportCategories';
import StatusPage from '@/components/StatusPage';
import ReportIssue from '@/components/ReportIssue';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const { toast } = useToast();

  const stats = [
    { label: 'תקלות נפתרו היום', value: '47', icon: CheckCircle, color: 'text-green-600' },
    { label: 'זמן תגובה ממוצע', value: '2 דק׳', icon: Clock, color: 'text-blue-600' },
    { label: 'תקלות פעילות', value: '3', icon: AlertTriangle, color: 'text-yellow-600' },
  ];

  const quickActions = [
    { title: 'בעיה בקופה', description: 'תקלות POS ומערכות תשלום', icon: Monitor, color: 'bg-blue-500' },
    { title: 'בעיית מדפסת', description: 'מדפסות וסורקי ברקוד', icon: Printer, color: 'bg-green-500' },
    { title: 'בעיית רשת', description: 'אינטרנט וחיבורים', icon: Wifi, color: 'bg-purple-500' },
    { title: 'ניהול משתמשים', description: 'סיסמאות וגישות', icon: Users, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white animate-spin" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">מרכז תמיכה טכנית</h1>
                <p className="text-sm text-gray-600">טיפ - העוזר החכם שלך</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`flex items-center gap-1 ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                    <span className="font-bold">{stat.value}</span>
                  </div>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-10 animate-pulse-slow"></div>
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-float">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                שלום! אני <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">טיפ</span> 🤖
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                העוזר החכם שלך לפתרון תקלות טכניות. אני כאן לעזור לך לפתור כל בעיה במהירות ויעילות!
              </p>
              
              {/* Quick Action Buttons */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
                    onClick={() => {
                      setActiveTab('chat');
                      toast({
                        title: "טיפ מוכן לעזור!",
                        description: `אני אעזור לך עם ${action.title}`,
                      });
                    }}
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                צ׳אט עם טיפ
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                מדריכים
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                דיווח תקלה
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                מצב מערכות
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <TechSupportBot />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <SupportCategories />
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              <ReportIssue />
            </TabsContent>

            <TabsContent value="status" className="space-y-6">
              <StatusPage />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">מרכז תמיכה טכנית</h3>
              <p className="text-gray-400">
                פתרונות מהירים ומקצועיים לכל התקלות הטכניות שלך
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">קישורים מהירים</h3>
              <ul className="space-y-2 text-gray-400">
                <li>מדריכי פתרון בעיות</li>
                <li>שאלות נפוצות</li>
                <li>צור קשר</li>
                <li>מצב מערכות</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">זמינות</h3>
              <p className="text-gray-400">
                ראשון-חמישי: 08:00-18:00<br />
                שישי: 08:00-14:00<br />
                שבת: סגור
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 מרכז תמיכה טכנית. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
