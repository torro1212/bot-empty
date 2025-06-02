import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, MessageCircle, FileText, Monitor, Printer, Wifi, Users, Settings, CheckCircle, Clock, AlertTriangle, Menu, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TechSupportBot from '@/components/TechSupportBot';
import SupportCategories from '@/components/SupportCategories';
import StatusPage from '@/components/StatusPage';
import ReportIssue from '@/components/ReportIssue';
import AutomatedSolutionWizard from '@/components/AutomatedSolutionWizard';
import { CSSProperties } from 'react';

// Direct style objects with explicit colors
const styles: Record<string, CSSProperties> = {
  pageBackground: {
    background: 'linear-gradient(to bottom right, #eef2ff, #ffffff, #faf5ff)',
    minHeight: '100vh'
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky' as 'sticky',
    top: 0,
    zIndex: 50,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  logoContainer: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  heroSection: {
    padding: '2rem 1rem'
  },
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    borderRadius: '1rem',
    padding: '1rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #e0e7ff'
  },
  heroCardGlow: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    opacity: 0.1,
    borderRadius: '1rem'
  },
  logoCircle: {
    background: 'linear-gradient(to right, #6366f1, #9333ea)',
    borderRadius: '9999px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  gradientText: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  tabsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(8px)',
    padding: '0.25rem',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  activeTab: {
    background: 'linear-gradient(to right, #6366f1, #a855f7)',
    color: 'white',
    borderRadius: '0.5rem'
  },
  footer: {
    background: 'linear-gradient(to right, #312e81, #581c87)',
    color: 'white',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    marginTop: '2rem',
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  footerHeading: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '0.75rem'
  },
  footerText: {
    color: '#c7d2fe'
  },
  footerLink: {
    color: '#c7d2fe'
  },
  footerBorder: {
    borderColor: '#4338ca',
    marginTop: '1.5rem',
    paddingTop: '1.5rem'
  }
};

// Media query styles can be applied using CSS classes or conditional rendering

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();

  const stats = [
    { label: 'תקלות נפתרו היום', value: '47', icon: CheckCircle, color: '#10b981' },
    { label: 'זמן תגובה ממוצע', value: '2 דק׳', icon: Clock, color: '#3b82f6' },
    { label: 'תקלות פעילות', value: '3', icon: AlertTriangle, color: '#f59e0b' },
  ];

  return (
    <div style={styles.pageBackground}>
      {/* Header */}
      <header style={styles.header}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div style={styles.logoContainer} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">מרכז תמיכה טכנית</h1>
                <p className="text-xs sm:text-sm text-gray-600">טיפ - העוזר החכם שלך</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              {stats.map((stat, index) => (
                <div key={index} style={styles.statBox} className="text-center">
                  <div className="flex items-center gap-1" style={{ color: stat.color }}>
                    <stat.icon className="w-4 h-4" />
                    <span className="font-bold">{stat.value}</span>
                  </div>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="sm:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {menuOpen && (
            <div className="sm:hidden pt-2 pb-3 border-t mt-2 space-y-2">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <div className="flex items-center gap-1" style={{ color: stat.color }}>
                    <stat.icon className="w-4 h-4" />
                    <span className="font-bold">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection} className="py-8 sm:py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0" style={styles.heroCardGlow}></div>
            <div style={{...styles.heroCard}} className="relative sm:p-8 sm:rounded-3xl">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div style={styles.logoCircle} className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-float">
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                שלום! אני <span style={styles.gradientText}>טיפ</span> 🤖
              </h2>
              <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                העוזר החכם שלך לפתרון תקלות טכניות. אני כאן לעזור לך לפתור כל בעיה במהירות ויעילות!
              </p>
              
              {/* Automated Solution Wizard */}
              <AutomatedSolutionWizard 
                onComplete={() => {
                  toast({
                    title: "פתרון הושלם!",
                    description: "תודה שהשתמשת באשף הפתרון המהיר",
                  });
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList style={styles.tabsList} className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6 sm:mb-8">
              <TabsTrigger 
                value="chat" 
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base py-2"
                style={activeTab === 'chat' ? styles.activeTab : {}}
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                צ׳אט עם טיפ
              </TabsTrigger>
              <TabsTrigger 
                value="wizard" 
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base py-2"
                style={activeTab === 'wizard' ? styles.activeTab : {}}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                פתרון מהיר
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base py-2"
                style={activeTab === 'categories' ? styles.activeTab : {}}
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                מדריכים
              </TabsTrigger>
              <TabsTrigger 
                value="report" 
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base py-2"
                style={activeTab === 'report' ? styles.activeTab : {}}
              >
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                דיווח תקלה
              </TabsTrigger>
              <TabsTrigger 
                value="status" 
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base py-2"
                style={activeTab === 'status' ? styles.activeTab : {}}
              >
                <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />
                מצב מערכות
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <TechSupportBot />
            </TabsContent>

            <TabsContent value="wizard" className="space-y-6">
              <AutomatedSolutionWizard 
                onComplete={() => {
                  toast({
                    title: "פתרון הושלם!",
                    description: "תודה שהשתמשת באשף הפתרון המהיר",
                  });
                }} 
              />
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
      <footer style={styles.footer} className="py-8 sm:py-12 mt-8 sm:mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 style={styles.footerHeading} className="sm:text-lg sm:mb-4">מרכז תמיכה טכנית</h3>
              <p style={styles.footerText} className="text-sm">
                פתרונות מהירים ומקצועיים לכל התקלות הטכניות שלך
              </p>
            </div>
            <div>
              <h3 style={styles.footerHeading} className="sm:text-lg sm:mb-4">קישורים מהירים</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm">
                <li style={styles.footerLink}>מדריכי פתרון בעיות</li>
                <li style={styles.footerLink}>שאלות נפוצות</li>
                <li style={styles.footerLink}>צור קשר</li>
                <li style={styles.footerLink}>מצב מערכות</li>
              </ul>
            </div>
            <div>
              <h3 style={styles.footerHeading} className="sm:text-lg sm:mb-4">זמינות</h3>
              <p style={styles.footerText} className="text-sm">
                ראשון-חמישי: 08:00-18:00<br />
                שישי: 08:00-14:00<br />
                שבת: סגור
              </p>
            </div>
          </div>
          <div style={styles.footerBorder} className="border-t text-center text-xs sm:text-sm sm:mt-8 sm:pt-8">
            <p style={styles.footerText}>&copy; 2024 מרכז תמיכה טכנית. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
