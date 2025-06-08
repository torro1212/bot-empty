import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, MessageSquare, Settings, Star, Send, X, AlertCircle, CheckCircle, AlertTriangle, User, Store, Hash, Phone } from 'lucide-react';
import AutomatedSolutionWizard from '@/components/AutomatedSolutionWizard';
import { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FeedbackPrompt from '@/components/ui/feedback-prompt';
import emailjs from '@emailjs/browser';
import { DEMO_MODE, EMAIL_CONFIG } from '@/lib/config';

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
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.9)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.05\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    padding: '1rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    overflow: 'hidden',
    position: 'relative',
    color: 'white'
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
    borderRadius: '16px',
    padding: '1rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    position: 'fixed',
    top: '5vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '95vw',
    maxWidth: '800px',
    height: '85vh',
    maxHeight: '85vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin',
    zIndex: 1000,
    background: 'linear-gradient(145deg, #ffffff, #f9fafb)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    direction: 'rtl',
    textAlign: 'right',
    fontFamily: "'Heebo', sans-serif"
  },
  feedbackButton: {
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
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

// EmailJS configuration - המידע האמיתי שלך
const EMAILJS_SERVICE_ID = 'SendMail'; // Service ID שלך
const EMAILJS_TEMPLATE_ID = 'IssueReport'; // Template ID לטופס דיווח תקלה
const EMAILJS_FEEDBACK_TEMPLATE_ID = 'Feedback'; // Template ID לטופס המשוב
const EMAILJS_PUBLIC_KEY = '6RjrhWpav2fs1C9Dq'; // Public Key שלך
const RECIPIENT_EMAIL = 'Support@mutagim.com'; // המייל שאליו ישלח הטופס

// אתחול EmailJS מוקדם עם בדיקות
if (typeof window !== 'undefined') {
  try {
  emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized successfully with public key:', EMAILJS_PUBLIC_KEY);
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Feedback Template ID:', EMAILJS_FEEDBACK_TEMPLATE_ID);
    console.log('Issue Report Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('Recipient Email:', RECIPIENT_EMAIL);
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
  }
}

const FeedbackForm = ({ onClose }: { onClose: () => void }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [clarity, setClarity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // אם לא דורגו כוכבים, מציג הודעת שגיאה
    if (rating === 0) {
      toast({
        title: "נא לדרג את החוויה",
        description: "אנא דרג את החוויה שלך באמצעות הכוכבים",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // בדיקה אם להשתמש במצב הדגמה
    if (DEMO_MODE) {
      console.log('DEMO MODE: Simulating feedback submission...');
      console.log('Feedback data:', {
        rating,
        clarity: clarity || 'לא צוין',
        comments: comment || 'אין הערות נוספות',
        from_name: name || 'משתמש אנונימי'
      });
      
      // סימולציה של טעינה
      setTimeout(() => {
        toast({
          title: "תודה על המשוב!",
          description: "המשוב שלך התקבל בהצלחה (מצב הדגמה)",
          style: { 
            background: 'linear-gradient(to right, #3b82f6, #6366f1)',
            color: 'white',
            border: 'none',
          }
        });
        
        setIsSubmitting(false);
        onClose();
      }, 1500);
      
      return;
    }
    
    try {
      console.log('Starting email submission with form:', formRef.current);
      console.log('Using service ID:', EMAILJS_SERVICE_ID);
      console.log('Using template ID:', EMAILJS_FEEDBACK_TEMPLATE_ID);
      
      // שליחה ישירה ללא שימוש ב-sendForm
      console.log('Sending feedback email directly...');
      
      // יצירת תוכן מסודר עבור המייל
      const clarityText = clarity === 'clear' ? 'כן, מאוד ברורים' : 
                         clarity === 'partial' ? 'חלקית' : 
                         clarity === 'unclear' ? 'לא מספיק ברורים' : 'לא צוין';
      
      const templateParams = {
        to_name: "צוות התמיכה",
        reply_to: RECIPIENT_EMAIL,
        from_name: name || "משתמש אנונימי",
        user_rating: `${rating}/5`,
        clarity_rating: clarityText,
        user_comments: comment || "אין הערות נוספות",
        from_phone: "לא צוין",
        brand: "משוב כללי",
        branch_name: "מערכת המשוב",
        register_number: "N/A",
        date: new Date().toLocaleString('he-IL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jerusalem'
        }),
        browser_info: `${navigator.userAgent}`,
        description: `משוב חדש מהאתר

דירוג החוויה:
${rating}/5 כוכבים

בהירות ההסברים:
${clarityText}

שם המשתמש:
${name || "משתמש אנונימי"}

הערות נוספות:
${comment || "אין הערות נוספות"}

תאריך ושעה:
${new Date().toLocaleString('he-IL', {
  year: 'numeric',
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Jerusalem'
})}

---
תודה על המשוב!`,
        subject: `⭐ התקבל משוב חדש מבוטקס`
      };
      
      console.log('Sending with params:', templateParams);
      console.log('Using EmailJS configuration:', {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_FEEDBACK_TEMPLATE_ID,
        publicKey: EMAILJS_PUBLIC_KEY
      });
      
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_FEEDBACK_TEMPLATE_ID,
        templateParams
      );
      
      console.log('Email sent successfully with send method:', result);
      
      toast({
        title: "תודה על המשוב!",
        description: "המשוב שלך התקבל בהצלחה",
        style: { 
          background: 'linear-gradient(to right, #3b82f6, #6366f1)',
          color: 'white',
          border: 'none',
        }
      });
      
      onClose();
    } catch (error) {
      console.error('Error sending feedback email:', error);
      
      // לוג מפורט יותר
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      
      toast({
        title: "שגיאה בשליחה",
        description: "אירעה שגיאה בשליחת המשוב. אנא נסה שנית.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{...styles.feedbackCard}} className="animate-in zoom-in-95 duration-300">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-2 top-2 hover:bg-gray-100 transition-all duration-200" 
        onClick={onClose}
      >
        <X size={18} />
      </Button>
      
      <h3 className="text-2xl font-bold text-center mb-5 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">המשוב שלך חשוב לנו!</h3>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <p className="mb-3 font-medium text-gray-700">איך היית מדרג את החוויה שלך?</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-all duration-200 hover:scale-125"
              >
                <Star 
                  size={28} 
                  strokeWidth={1.5}
                  style={rating >= star ? styles.starActive : styles.starInactive} 
                  fill={rating >= star ? "#f59e0b" : "none"}
                  className={rating >= star ? "animate-pulse" : ""}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-5">
          <p className="text-base font-semibold mb-4 text-gray-800 text-center bg-blue-50 py-2 px-4 rounded-lg mx-auto shadow-sm border border-blue-100 w-fit">האם ההסברים היו ברורים ומובנים?</p>
          <div className="flex flex-col gap-4 items-center">
            <div className="flex justify-center gap-4 w-full">
              <div 
                className={`relative cursor-pointer w-auto max-w-[140px] h-[60px] rounded-lg border-2 flex items-center justify-center px-3 transition-all duration-200 ${
                  clarity === 'clear' 
                    ? 'bg-white border-green-500 shadow-md' 
                    : 'bg-white border-green-200 hover:border-green-400'
                }`}
                onClick={() => setClarity('clear')}
              >
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-5 w-5 mb-1 text-green-500" />
                  <span className="font-medium text-xs text-center text-gray-800">כן, מאוד ברורים</span>
                </div>
                {clarity === 'clear' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                )}
              </div>
              
              <div 
                className={`relative cursor-pointer w-auto max-w-[120px] h-[60px] rounded-lg border-2 flex items-center justify-center px-3 transition-all duration-200 ${
                  clarity === 'partial' 
                    ? 'bg-white border-amber-500 shadow-md' 
                    : 'bg-white border-amber-200 hover:border-amber-400'
                }`}
                onClick={() => setClarity('partial')}
              >
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-5 w-5 mb-1 text-amber-500" />
                  <span className="font-medium text-xs text-center text-gray-800">חלקית</span>
                </div>
                {clarity === 'partial' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border border-white" />
                )}
              </div>
              
              <div 
                className={`relative cursor-pointer w-auto max-w-[140px] h-[60px] rounded-lg border-2 flex items-center justify-center px-3 transition-all duration-200 ${
                  clarity === 'unclear' 
                    ? 'bg-white border-red-500 shadow-md' 
                    : 'bg-white border-red-200 hover:border-red-400'
                }`}
                onClick={() => setClarity('unclear')}
              >
                <div className="flex flex-col items-center">
                  <AlertCircle className="h-5 w-5 mb-1 text-red-500" />
                  <span className="font-medium text-xs text-center text-gray-800">לא מספיק ברורים</span>
                </div>
                {clarity === 'unclear' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700">הערות נוספות</label>
          <div className="relative">
            <Textarea
              name="comments"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="ספר לנו על החוויה שלך..."
              className="w-full pr-8 pl-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg transition-all duration-200 text-right text-gray-800 input-with-icon-rtl"
            />
            <MessageSquare className="absolute right-2 top-3 h-4 w-4 text-gray-400 icon-rtl" />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700">שם (לא חובה)</label>
          <div className="relative">
            <Input
              name="from_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="השם שלך"
              className="w-full pr-8 pl-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg transition-all duration-200 text-right text-gray-800 input-with-icon-rtl"
            />
            <User className="absolute right-2 top-3 h-4 w-4 text-gray-400 icon-rtl" />
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            type="submit"
            className="px-8 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)',
              border: 'none',
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                שולח...
              </>
            ) : (
              <>
                <Send size={16} className="ml-2" />
                שלח משוב
              </>
            )}
          </Button>
        </div>
      </form>
      
      {/* Decorative elements */}
      <div className="absolute -z-10 top-20 right-0 w-20 h-20 rounded-full bg-blue-100 opacity-30 blur-xl"></div>
      <div className="absolute -z-10 bottom-10 left-5 w-24 h-24 rounded-full bg-indigo-100 opacity-30 blur-xl"></div>
    </div>
  );
};

const Index = () => {
  const { toast } = useToast();
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [solutionCompleted, setSolutionCompleted] = useState(false);
  const [wizardStarted, setWizardStarted] = useState(false);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSolutionComplete = (showFeedbackForm?: boolean, showReportForm?: boolean) => {
    setSolutionCompleted(true);
    setWizardStarted(false);
    
    // אם התבקש להציג טופס משוב, נציג אותו ישירות
    if (showFeedbackForm) {
      setShowFeedbackForm(true);
      return;
    }
    
    // אם התבקש להציג טופס דיווח תקלה, נציג אותו ישירות
    if (showReportForm) {
      setShowReportForm(true);
      return;
    }
    
    // אחרת, נציג את שאלת המשוב הרגילה
    setShowFeedbackPrompt(true);
  };

  const handleReportFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // בדיקה אם להשתמש במצב הדגמה
    if (DEMO_MODE) {
      console.log('DEMO MODE: Simulating issue report submission...');
      console.log('Report data:', {
        brand: reportForm.brand,
        branchName: reportForm.branchName,
        registerNumber: reportForm.registerNumber,
        issueDetails: reportForm.issueDetails,
        name: reportForm.name,
        phone: reportForm.phone
      });
      
      // סימולציה של טעינה
      setTimeout(() => {
        toast({
          title: "דיווח נשלח בהצלחה",
          description: "תודה על הדיווח! צוות התמיכה יצור איתך קשר בהקדם. (מצב הדגמה)",
        });
        
        setShowReportForm(false);
        setShowReportPrompt(false);
        setSolutionCompleted(false);
        
        // Reset form
        setReportForm({
          brand: '',
          branchName: '',
          registerNumber: '',
          issueDetails: '',
          name: '',
          phone: ''
        });
        
        setIsSubmitting(false);
      }, 1500);
      
      return;
    }

    try {
      console.log('Sending issue report email directly...');
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        to_name: "צוות התמיכה",
        reply_to: RECIPIENT_EMAIL,
        from_name: reportForm.name || "משתמש אנונימי",
        from_phone: reportForm.phone || "לא צוין",
        brand: reportForm.brand || "לא צוין",
        branch_name: reportForm.branchName || "לא צוין",
        register_number: reportForm.registerNumber || "לא צוין",
        user_rating: "N/A",
        clarity_rating: "N/A", 
        user_comments: reportForm.issueDetails || "לא צוין",
        date: new Date().toLocaleString('he-IL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jerusalem'
        }),
        browser_info: `${navigator.userAgent}`,
        priority: "גבוהה", // ניתן להוסיף שדה בחירה בעתיד
        description: `דיווח תקלה חדשה

פרטי התקלה:

מותג:
${reportForm.brand || "לא צוין"}

סניף:
${reportForm.branchName || "לא צוין"}

מספר קופה:
${reportForm.registerNumber || "לא צוין"}

פרטי המדווח:

שם:
${reportForm.name || "לא צוין"}

טלפון:
${reportForm.phone || "לא צוין"}

תיאור התקלה:
${reportForm.issueDetails || "לא צוין"}

תאריך ושעה:
${new Date().toLocaleString('he-IL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Jerusalem'
})}

מידע טכני:
${navigator.userAgent}

---
⚠️ נא לטפל בהקדם האפשרי! ⚠️`,
        subject: `🚨 תקלה חדשה\u200F : ${reportForm.brand || "לא צוין"} - ${reportForm.branchName || "לא צוין"}`
      };
      
      console.log('Sending with params:', templateParams);
      console.log('Using EmailJS configuration:', {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        publicKey: EMAILJS_PUBLIC_KEY
      });

      // Initialize EmailJS in case it wasn't already
      if (typeof emailjs.init === 'function') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      }
      
      // Send the email
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      console.log('Email sent successfully:', result);
      
      toast({
        title: "דיווח נשלח בהצלחה",
        description: "תודה על הדיווח! צוות התמיכה יצור איתך קשר בהקדם.",
      });
      
      setShowReportForm(false);
      setShowReportPrompt(false);
      setSolutionCompleted(false);
      
      // Reset form
      setReportForm({
        brand: '',
        branchName: '',
        registerNumber: '',
        issueDetails: '',
        name: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // שיפור הלוגים לדיבוג
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      toast({
        title: "שגיאה בשליחה",
        description: "אירעה שגיאה בשליחת הדיווח. אנא נסה שנית.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <section style={styles.heroSection} className="w-full min-h-screen" aria-label="אזור הגיבור" data-section-name="אזור הגיבור (Hero Section)">
        <div className="w-full text-center">
          <div className="relative">
            <div className="absolute inset-0" style={styles.heroCardGlow}></div>
            <div style={{
              ...styles.heroCard,
              width: '100vw',
              minHeight: 'calc(100vh + 100px)', // Ensure always scrollable
              height: 'auto',
              position: 'fixed',
              top: '0',
              left: '0',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '10px',
              paddingBottom: '80px', // Increased bottom padding for better scrolling
              overflowY: 'auto',
              overflowX: 'hidden', // Prevent horizontal scroll
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin', // For Firefox
              msOverflowStyle: 'auto' // For IE/Edge
                          }}>
              {/* כותרת תוצג רק כשהאשף לא התחיל וטופס המשוב לא פתוח */}
              {!wizardStarted && !showFeedbackForm && (
                <div className="text-center mb-2 px-2" style={{marginTop: '5px'}}>
                  <h2 className="text-lg sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-4 relative" dir="rtl" style={{fontSize: 'clamp(1.25rem, 4vw, 2.5rem)'}}>
                    שלום!<br />
                    אני <span style={styles.gradientText} className="relative inline-block">
                      בוטקס
                      <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
                    </span> <span className="inline-block mr-1 animate-bounce">🤖</span>
                  </h2>
                  <p className="text-xs sm:text-sm md:text-lg text-gray-200 mb-2 sm:mb-6 max-w-2xl mx-auto leading-relaxed relative px-2" dir="rtl" style={{fontSize: 'clamp(0.75rem, 3vw, 1.125rem)'}}>
                    <span className="bg-gradient-to-r from-gray-900 to-gray-800 px-2 py-1 rounded-lg" dir="rtl">
                      העוזר החכם שלך לפתרון תקלות טכניות<br />
                      אני כאן לעזור לך לפתור כל בעיה במהירות ויעילות!
                    </span>
                  </p>
                </div>
              )}
                
                {/* Automated Solution Wizard */}
              <div style={{
                flexGrow: 1, 
                width: '100%', 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'center', 
                paddingTop: '5px', 
                minHeight: '0',
                paddingBottom: '10px'
              }}>
                {!solutionCompleted && !showReportForm && !showReportPrompt && (
                  <AutomatedSolutionWizard 
                    onComplete={handleSolutionComplete} 
                    onReportIssue={() => setShowReportForm(true)}
                    onWizardStart={() => setWizardStarted(true)}
                    onWizardReset={() => setWizardStarted(false)}
                    isWizardStarted={wizardStarted}
                  />
                )}
              </div>
              
              {/* Report Form */}
              {showReportForm && (
                <>
                  {/* Dark overlay behind report form */}
                  <div 
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      zIndex: 999,
                      backdropFilter: 'blur(5px)'
                    }}
                    onClick={() => {
                      setShowReportForm(false);
                      setSolutionCompleted(false);
                    }}
                  />
                  <Card style={{
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    position: 'fixed',
                    top: '5vh',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '95vw',
                    maxWidth: '800px',
                    height: '85vh',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    zIndex: 1000
                  }} className="animate-in zoom-in-95 duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -z-10 top-20 right-0 w-20 h-20 rounded-full bg-blue-100 opacity-30 blur-xl"></div>
                  <div className="absolute -z-10 bottom-10 left-5 w-24 h-24 rounded-full bg-indigo-100 opacity-30 blur-xl"></div>
                  
                  <CardHeader style={{
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
                    color: 'white',
                    padding: '1rem 1rem'
                  }}>
                    <CardTitle className="text-lg md:text-xl font-bold" style={{fontSize: 'clamp(1rem, 4vw, 1.25rem)'}}>דיווח על תקלה</CardTitle>
                    <CardDescription className="text-gray-100 text-sm" style={{fontSize: 'clamp(0.75rem, 3vw, 0.875rem)'}}>אנא מלא את הפרטים הבאים כדי שנוכל לעזור לך</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-6">
                    <form onSubmit={handleReportFormSubmit} className="space-y-4" style={styles.formContainer}>
                      <div className="space-y-2">
                        <Label htmlFor="brand" className="text-center block font-medium text-gray-700 text-sm md:text-base" style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}>מותג:</Label>
                        <div className="mx-auto" style={{maxWidth: '100%', width: '100%'}}>
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
                            <SelectTrigger 
                              className="h-12 md:h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm md:text-base transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                              id="brand-select-trigger"
                              style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', minHeight: '48px'}}
                            >
                              <div className="w-full text-center">
                                {reportForm.brand || "בחר מותג"}
                              </div>
                            </SelectTrigger>
                            <SelectContent className="border-blue-200 shadow-lg animation-pulse" style={{textAlign: 'center'}}>
                              <SelectItem value="ZARA" className="text-center justify-center">ZARA</SelectItem>
                              <SelectItem value="PULL&BEAR" className="text-center justify-center">PULL&BEAR</SelectItem>
                              <SelectItem value="Massimo Dutti" className="text-center justify-center">Massimo Dutti</SelectItem>
                              <SelectItem value="BERSHKA" className="text-center justify-center">BERSHKA</SelectItem>
                              <SelectItem value="STRADIVARIUS" className="text-center justify-center">STRADIVARIUS</SelectItem>
                              <SelectItem value="ZARA HOME" className="text-center justify-center">ZARA HOME</SelectItem>
                              <SelectItem value="Lefties" className="text-center justify-center">Lefties</SelectItem>
                              <SelectItem value="OYSHO" className="text-center justify-center">OYSHO</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <style dangerouslySetInnerHTML={{__html: `
                          #brand-select-trigger {
                            display: flex;
                            align-items: center;
                            padding-right: 30px;
                            text-align: right;
                          }
                          
                          #brand-select-trigger svg {
                            display: none;
                          }
                        `}} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="branchName" className="text-center block font-medium text-gray-700 text-sm md:text-base" style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}>שם סניף:</Label>
                        <div className="relative mx-auto" style={{maxWidth: '100%', width: '100%'}}>
                          <Input 
                            id="branchName" 
                            name="branchName" 
                            value={reportForm.branchName} 
                            onChange={handleInputChange} 
                            placeholder="שם הסניף"
                            required
                            className="pr-8 pl-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg transition-all duration-200 text-right input-with-icon-rtl h-12 md:h-10 text-sm md:text-base"
                            style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', minHeight: '48px'}}
                          />
                          <Store className="absolute right-2 top-3 h-4 w-4 text-gray-400 icon-rtl" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="registerNumber" className="text-center block font-medium text-gray-700 text-sm md:text-base" style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}>מספר קופה:</Label>
                        <div className="relative mx-auto" style={{maxWidth: '100%', width: '100%'}}>
                          <Input 
                            id="registerNumber" 
                            name="registerNumber" 
                            value={reportForm.registerNumber} 
                            onChange={handleInputChange} 
                            placeholder="מספר הקופה"
                            required
                            className="pr-8 pl-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg transition-all duration-200 text-right input-with-icon-rtl h-12 md:h-10 text-sm md:text-base"
                            style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', minHeight: '48px'}}
                          />
                          <Hash className="absolute right-2 top-3 h-4 w-4 text-gray-400 icon-rtl" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="issueDetails" className="text-center block font-medium text-gray-700 text-sm md:text-base" style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}>פירוט התקלה:</Label>
                        <div className="relative mx-auto" style={{maxWidth: '100%', width: '100%'}}>
                          <Textarea 
                            id="issueDetails" 
                            name="issueDetails" 
                            value={reportForm.issueDetails} 
                            onChange={handleInputChange} 
                            placeholder="תיאור מפורט של התקלה"
                            required
                            className="min-h-[100px] pr-8 pl-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg transition-all duration-200 text-right input-with-icon-rtl text-sm md:text-base"
                            style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}
                          />
                          <AlertTriangle className="absolute right-2 top-3 h-4 w-4 text-gray-400 icon-rtl" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-center block font-medium text-gray-700 text-sm md:text-base" style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}>שם:</Label>
                        <div className="relative mx-auto" style={{maxWidth: '100%', width: '100%'}}>
                          <Input 
                            id="name" 
                            name="name" 
                            value={reportForm.name} 
                            onChange={handleInputChange} 
                            placeholder="השם שלך"
                            required
                            className="pr-8 pl-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg transition-all duration-200 text-right input-with-icon-rtl h-12 md:h-10 text-sm md:text-base"
                            style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', minHeight: '48px'}}
                          />
                          <User className="absolute right-2 top-3 h-4 w-4 text-gray-400 icon-rtl" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-center block font-medium text-gray-700 text-sm md:text-base" style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)'}}>מספר טלפון:</Label>
                        <div className="relative mx-auto" style={{maxWidth: '100%', width: '100%'}}>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={reportForm.phone} 
                            onChange={handleInputChange} 
                            placeholder="מספר הטלפון שלך"
                            required
                            className="pr-8 pl-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg transition-all duration-200 text-right input-with-icon-rtl h-12 md:h-10 text-sm md:text-base"
                            style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', minHeight: '48px'}}
                          />
                          <Phone className="absolute right-2 top-3 h-4 w-4 text-gray-400 icon-rtl" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                        <Button 
                          type="button"
                          variant="outline" 
                          onClick={() => {
                            setShowReportForm(false);
                            setSolutionCompleted(false);
                          }}
                          className="px-4 py-3 transition-all duration-200 hover:bg-gray-100 border-gray-300 text-sm md:text-base h-12 md:h-10"
                          style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', minHeight: '48px'}}
                        >
                          <X className="mr-2 h-4 w-4" />
                          ביטול
                        </Button>
                        
                        <Button 
                          type="submit"
                          className="px-6 py-3 rounded-full font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg text-sm md:text-base h-12 md:h-10"
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
                            color: 'white',
                            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)',
                            border: 'none',
                            fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                            minHeight: '48px'
                          }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                              שולח...
                            </>
                          ) : (
                            <>
                              <Send className="ml-2 h-4 w-4" />
                              שלח דיווח
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                </>
              )}
              
              {/* Feedback Prompt */}
              {showFeedbackPrompt && !showFeedbackForm && !showReportForm && !showReportPrompt && (
                <FeedbackPrompt onResponse={(wantsToGiveFeedback) => {
                  if (wantsToGiveFeedback) {
                    handleSolutionComplete(true);
                  } else {
                    setShowFeedbackPrompt(false);
                    setSolutionCompleted(false);
                  }
                }} />
              )}
              
              {/* Feedback Form */}
              {showFeedbackForm && !showReportForm && (
                <>
                  {/* Dark overlay behind feedback form */}
                  <div 
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      zIndex: 999,
                      backdropFilter: 'blur(5px)'
                    }}
                    onClick={() => {
                      setShowFeedbackForm(false);
                      setShowFeedbackPrompt(false);
                      setSolutionCompleted(false);
                    }}
                  />
                  <FeedbackForm onClose={() => {
                    setShowFeedbackForm(false);
                    setShowFeedbackPrompt(false);
                    setSolutionCompleted(false);
                  }} />
                </>
              )}
              
              {/* Return to Solution Button */}
              {solutionCompleted && !showFeedbackPrompt && !showFeedbackForm && !showReportPrompt && !showReportForm && (
                <Button
                  onClick={() => setSolutionCompleted(false)}
                  className="mt-4 px-6 py-3 text-sm md:text-base h-12 md:h-10"
                  style={{fontSize: 'clamp(0.875rem, 3vw, 1rem)', minHeight: '48px'}}
                >
                  חזרה לפתרון
                </Button>
              )}
              
              {/* Developer Credit */}
              <div 
                className="text-xs md:text-xs text-gray-400 font-bold mt-auto"
                style={{
                  textAlign: 'center',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                  marginTop: '20px',
                  paddingBottom: '10px'
                }}
              >
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
