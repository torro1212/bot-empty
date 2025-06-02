import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Settings, Star, Send, X, AlertCircle } from 'lucide-react';
import AutomatedSolutionWizard from '@/components/AutomatedSolutionWizard';
import { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Add global keyframe animations
const keyframes = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.5), 0 0 15px -5px rgba(79, 70, 229, 0.3) inset; }
  50% { transform: scale(1.05); box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.6), 0 0 20px -5px rgba(79, 70, 229, 0.4) inset; }
  100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.5), 0 0 15px -5px rgba(79, 70, 229, 0.3) inset; }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(5deg); }
  66% { transform: translateY(5px) rotate(-5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes floatReverse {
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(10px) rotate(-5deg); }
  66% { transform: translateY(-5px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
`;

// Add style tag to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = keyframes;
  document.head.appendChild(styleElement);
}

// מערך של הלוגואים של המותגים
const brandLogos = [
  { name: 'ZARA', color: '#000000' },
  { name: 'PULL&BEAR', color: '#1a1a1a' },
  { name: 'Massimo Dutti', color: '#333333' },
  { name: 'BERSHKA', color: '#000000' },
  { name: 'STRADIVARIUS', color: '#222222' },
  { name: 'ZARA HOME', color: '#000000' },
  { name: 'Lefties', color: '#0a0a0a' },
  { name: 'OYSHO', color: '#111111' }
];

// Direct style objects with explicit colors
const styles: Record<string, CSSProperties> = {
  pageBackground: {
    background: 'linear-gradient(135deg, #e0f2fe, #f0f9ff, #ede9fe, #faf5ff)',
    minHeight: '100vh',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    position: 'relative',
    overflow: 'hidden'
  },
  brandsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0
  },
  heroSection: {
    padding: '2rem 1rem',
    position: 'relative'
  },
  heroCard: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    overflow: 'hidden',
    position: 'relative'
  },
  heroCardGlow: {
    background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.8), rgba(79, 70, 229, 0.4), transparent)',
    opacity: 0.25,
    borderRadius: '1.5rem',
    filter: 'blur(40px)',
    zIndex: 0
  },
  logoCircle: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb)',
    borderRadius: '9999px',
    boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5), 0 0 15px -5px rgba(79, 70, 229, 0.3) inset',
    animation: 'pulse 2s infinite'
  },
  gradientText: {
    background: 'linear-gradient(to right, #4f46e5, #7c3aed, #2563eb)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 10px rgba(79, 70, 229, 0.2)'
  },
  brandBubble: {
    position: 'absolute',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 0,
    opacity: 0.8,
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'hidden',
    padding: '5px'
  },
  feedbackCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e7ff',
    maxWidth: '500px',
    margin: '2rem auto 0',
    position: 'relative' as 'relative',
    textAlign: 'center',
    background: 'linear-gradient(to bottom, #ffffff, #f9faff)'
  },
  feedbackButton: {
    background: 'linear-gradient(to right, #3b82f6, #6366f1)',
    color: 'white',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  starActive: {
    color: '#f59e0b',
    fill: '#f59e0b'
  },
  starInactive: {
    color: '#d1d5db'
  },
  formContainer: {
    textAlign: 'center'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  }
};

const FeedbackForm = ({ onClose }: { onClose: () => void }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // כאן יהיה הקוד לשליחת המשוב לשרת
    console.log({ rating, comment, name });
    
    toast({
      title: "תודה על המשוב!",
      description: "המשוב שלך התקבל בהצלחה",
    });
    
    onClose();
  };

  return (
    <div style={styles.feedbackCard}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-2 top-2" 
        onClick={onClose}
      >
        <X size={18} />
      </Button>
      
      <h3 className="text-xl font-bold text-center mb-4" style={{color: '#3b82f6'}}>משוב על השירות</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <p className="mb-2" style={{color: '#4b5563'}}>איך היית מדרג את החוויה שלך?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  size={24} 
                  style={rating >= star ? styles.starActive : styles.starInactive} 
                  fill={rating >= star ? "#3b82f6" : "none"}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <p className="block text-sm font-medium mb-2" style={{color: '#4b5563'}}>האם ההסברים היו ברורים ומובנים?</p>
          <div className="flex flex-col gap-2 items-center" style={{maxWidth: '300px', margin: '0 auto'}}>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="text-xs px-2 py-0.5 h-6 rounded-full border hover:bg-blue-50 w-full"
              style={{fontWeight: 'normal', borderColor: '#bfdbfe', color: '#3b82f6'}}
              onClick={() => console.log("כן, מאוד ברורים")}
            >
              כן, מאוד ברורים
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="text-xs px-2 py-0.5 h-6 rounded-full border hover:bg-blue-50 w-full"
              style={{fontWeight: 'normal', borderColor: '#bfdbfe', color: '#3b82f6'}}
              onClick={() => console.log("חלקית")}
            >
              חלקית
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="text-xs px-2 py-0.5 h-6 rounded-full border hover:bg-blue-50 w-full"
              style={{fontWeight: 'normal', borderColor: '#bfdbfe', color: '#3b82f6'}}
              onClick={() => console.log("לא מספיק ברורים")}
            >
              לא מספיק ברורים
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">הערות נוספות</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ספר לנו על החוויה שלך..."
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">שם (לא חובה)</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="השם שלך"
            className="w-full"
          />
        </div>
        
        <div className="text-center">
          <Button 
            type="submit"
            style={styles.feedbackButton}
            className="px-6 py-2"
          >
            <Send size={16} className="ml-2" />
            שלח משוב
          </Button>
        </div>
      </form>
    </div>
  );
};

const Index = () => {
  const { toast } = useToast();
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [solutionCompleted, setSolutionCompleted] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showReportPrompt, setShowReportPrompt] = useState(false);
  const [brandBubbles, setBrandBubbles] = useState<Array<{
    name: string;
    color: string;
    size: number;
    top: string;
    left: string;
    animation: string;
    delay: string;
  }>>([]);
  const [reportForm, setReportForm] = useState({
    brand: '',
    branchName: '',
    registerNumber: '',
    issueDetails: '',
    name: '',
    phone: ''
  });

  // יצירת בועות המותגים בטעינת העמוד
  useEffect(() => {
    // מיקומים קבועים לעיגולים
    const positions = [
      { top: '10%', left: '5%' },
      { top: '15%', left: '85%' },
      { top: '30%', left: '15%' },
      { top: '35%', left: '75%' },
      { top: '55%', left: '8%' },
      { top: '60%', left: '90%' },
      { top: '80%', left: '20%' },
      { top: '85%', left: '80%' }
    ];

    const bubbles = brandLogos.map((brand, index) => {
      // גדלים אחידים יותר
      const size = 70 + (index % 3) * 10; // גדלים בין 70-90px
      const { top, left } = positions[index]; // מיקום קבוע לפי המערך
      const animation = index % 2 === 0 ? 'float 8s infinite ease-in-out' : 'floatReverse 10s infinite ease-in-out';
      const delay = `-${index}s`; // השהייה לפי האינדקס

      return {
        name: brand.name,
        color: brand.color,
        size,
        top,
        left,
        animation,
        delay
      };
    });

    setBrandBubbles(bubbles);
  }, []);

  const handleSolutionComplete = () => {
    setSolutionCompleted(true);
    
    // מסיר את הודעת ה-toast
    // toast({
    //   title: "פתרון הושלם!",
    //   description: "תודה שהשתמשת באשף הפתרון המהיר",
    // });
    
    // הצג שאלה האם הפתרון עזר
    setShowFeedbackPrompt(true);
  };

  const handleReportFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן יהיה הקוד לשליחת הטופס לשרת
    console.log(reportForm);
    
    toast({
      title: "דיווח נשלח",
      description: "תודה על הדיווח! צוות התמיכה יצור איתך קשר בהקדם.",
    });
    
    setShowReportForm(false);
    setShowReportPrompt(false);
    setSolutionCompleted(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={styles.pageBackground}>
      {/* Brand Bubbles Container */}
      <div style={styles.brandsContainer as CSSProperties}>
        {brandBubbles.map((bubble, index) => (
          <div
            key={index}
            style={{
              ...styles.brandBubble as CSSProperties,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              top: bubble.top,
              left: bubble.left,
              color: bubble.color,
              animation: bubble.animation,
              animationDelay: bubble.delay,
              fontSize: `${Math.min(bubble.size / 6, 12)}px` // הגבלת גודל הטקסט
            }}
          >
            <div className="w-full text-center" dir="ltr">
              {bubble.name}
            </div>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section style={styles.heroSection} className="py-8 sm:py-16 px-4" aria-label="אזור הגיבור" data-section-name="אזור הגיבור (Hero Section)">
        <div className="container mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0" style={styles.heroCardGlow}></div>
            <div style={{...styles.heroCard}} className="relative sm:p-8 sm:rounded-3xl">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-purple-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-30 translate-x-1/4 translate-y-1/4"></div>
              
              <div className="flex justify-center mb-6 sm:mb-8">
                <div style={styles.logoCircle} className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 relative" dir="rtl">
                שלום! אני <span style={styles.gradientText} className="relative inline-block">
                  בוטקס
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
                </span> <span className="inline-block mr-1 animate-bounce">🤖</span>
              </h2>
              <p className="text-lg sm:text-2xl text-gray-700 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed relative" dir="rtl">
                <span className="bg-gradient-to-r from-indigo-100 to-purple-100 px-2 py-1 rounded-lg" dir="rtl">
                  העוזר החכם שלך לפתרון תקלות טכניות<br />
                  אני כאן לעזור לך לפתור כל בעיה במהירות ויעילות!
                </span>
              </p>
              
              {/* Automated Solution Wizard */}
              {!solutionCompleted && !showReportForm && !showReportPrompt && (
                <AutomatedSolutionWizard 
                  onComplete={handleSolutionComplete} 
                  onReportIssue={() => setShowReportForm(true)}
                />
              )}
              
              {/* Report Form */}
              {showReportForm && (
                <Card style={{
                  backgroundColor: '#f0f7ff',
                  borderRadius: '1rem',
                  padding: '1rem',
                  boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.3)',
                  border: '1px solid #e0e7ff',
                  textAlign: 'center'
                }}>
                  <CardHeader style={{
                    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
                    color: 'white',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem'
                  }}>
                    <CardTitle className="text-xl text-white">טופס דיווח תקלה</CardTitle>
                    <CardDescription className="text-indigo-100">אנא מלא את הפרטים הבאים</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleReportFormSubmit} className="space-y-4" style={styles.formContainer}>
                      <div className="space-y-2">
                        <Label htmlFor="brand" className="text-center block">מותג:</Label>
                        <Select 
                          name="brand"
                          value={reportForm.brand}
                          onValueChange={(value) => {
                            setReportForm(prev => ({
                              ...prev,
                              brand: value
                            }));
                          }}
                          required
                        >
                          <SelectTrigger className="text-center mx-auto" style={{maxWidth: '400px'}}>
                            <SelectValue placeholder="בחר מותג" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ZARA">ZARA</SelectItem>
                            <SelectItem value="PULL&BEAR">PULL&BEAR</SelectItem>
                            <SelectItem value="Massimo Dutti">Massimo Dutti</SelectItem>
                            <SelectItem value="BERSHKA">BERSHKA</SelectItem>
                            <SelectItem value="STRADIVARIUS">STRADIVARIUS</SelectItem>
                            <SelectItem value="ZARA HOME">ZARA HOME</SelectItem>
                            <SelectItem value="Lefties">Lefties</SelectItem>
                            <SelectItem value="OYSHO">OYSHO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="branchName" className="text-center block">שם סניף:</Label>
                        <Input 
                          id="branchName" 
                          name="branchName" 
                          value={reportForm.branchName} 
                          onChange={handleInputChange} 
                          placeholder="שם הסניף"
                          required
                          className="text-center mx-auto"
                          style={{maxWidth: '400px'}}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="registerNumber" className="text-center block">מספר קופה:</Label>
                        <Input 
                          id="registerNumber" 
                          name="registerNumber" 
                          value={reportForm.registerNumber} 
                          onChange={handleInputChange} 
                          placeholder="מספר הקופה"
                          required
                          className="text-center mx-auto"
                          style={{maxWidth: '400px'}}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="issueDetails" className="text-center block">פירוט התקלה:</Label>
                        <Textarea 
                          id="issueDetails" 
                          name="issueDetails" 
                          value={reportForm.issueDetails} 
                          onChange={handleInputChange} 
                          placeholder="תיאור מפורט של התקלה"
                          required
                          className="min-h-[100px] text-center mx-auto"
                          style={{maxWidth: '400px'}}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-center block">שם:</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={reportForm.name} 
                          onChange={handleInputChange} 
                          placeholder="השם שלך"
                          required
                          className="text-center mx-auto"
                          style={{maxWidth: '400px'}}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-center block">מספר טלפון:</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={reportForm.phone} 
                          onChange={handleInputChange} 
                          placeholder="מספר הטלפון שלך"
                          required
                          className="text-center mx-auto"
                          style={{maxWidth: '400px'}}
                        />
                      </div>
                      
                      <div style={styles.buttonContainer}>
                        <Button 
                          type="button"
                          variant="ghost" 
                          onClick={() => {
                            setShowReportForm(false);
                            setSolutionCompleted(false);
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          ביטול
                        </Button>
                        
                        <Button 
                          type="submit"
                          style={{
                            background: 'linear-gradient(to right, #4f46e5, #9333ea)',
                            color: 'white'
                          }}
                        >
                          <Send className="ml-2 h-4 w-4" />
                          שלח דיווח
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {/* Feedback Prompt - מחזיר את המסך */}
              {showFeedbackPrompt && !showFeedbackForm && !showReportForm && !showReportPrompt && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-indigo-100 text-center">
                  <h3 className="text-lg font-medium mb-2">האם הצלחת לפתור את התקלה?</h3>
                  <p className="text-gray-600 mb-4">בחר באפשרות המתאימה:</p>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', width: '100%', maxWidth: '300px', margin: '0 auto'}}>
                    <Button 
                      onClick={() => {
                        // שמירת מידע שהתקלה נפתרה
                        console.log("התקלה נפתרה בהצלחה");
                        setShowFeedbackForm(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-xs px-3 py-1 h-8 rounded-lg w-full transition-all duration-300 hover:scale-105"
                      style={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                        color: 'white',
                        boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.3)',
                        border: 'none'
                      }}
                    >
                      <Star className="mr-1 h-3 w-3" fill="white" />
                      כן, הבעיה נפתרה
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        // שמירת מידע שהתקלה לא נפתרה
                        console.log("התקלה לא נפתרה");
                        setShowFeedbackPrompt(false);
                        setShowReportForm(true);
                      }}
                      size="sm"
                      className="text-xs px-3 py-1 h-8 rounded-lg w-full transition-all duration-300 hover:scale-105"
                      style={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #f97316, #ea580c)',
                        color: 'white',
                        boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.3)',
                        border: 'none'
                      }}
                    >
                      <AlertCircle className="mr-1 h-3 w-3" />
                      לא, אני רוצה לפתוח קריאת שירות
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Feedback Form */}
              {showFeedbackForm && !showReportForm && (
                <FeedbackForm onClose={() => {
                  setShowFeedbackForm(false);
                  setShowFeedbackPrompt(false);
                  setSolutionCompleted(false);
                }} />
              )}
              
              {/* Return to Solution Button */}
              {solutionCompleted && !showFeedbackPrompt && !showFeedbackForm && !showReportPrompt && !showReportForm && (
                <Button
                  onClick={() => setSolutionCompleted(false)}
                  className="mt-4"
                >
                  חזרה לפתרון
                </Button>
              )}
              
              {/* Developer Credit */}
              <div className="mt-8 pt-4 text-xs text-gray-400 border-t border-gray-100">
                Developed by Shahar Barsheshet
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
