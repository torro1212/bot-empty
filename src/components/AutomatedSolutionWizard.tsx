import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle, HelpCircle, AlertTriangle, ArrowLeft, Star, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CSSProperties } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import FeedbackPrompt from '@/components/ui/feedback-prompt';
import { trackButtonClick } from '@/utils/analytics';

// Import flow data
import kupaFlow from '../../kupa.js';
import ashraiFlow from '../../ashrai.js';
import holetzFlow from '../../holetz.js';

// Add global RTL style safely
const addGlobalRtlStyle = () => {
  if (typeof document !== 'undefined' && !document.getElementById('global-rtl-style')) {
const globalRtlStyle = document.createElement('style');
    globalRtlStyle.id = 'global-rtl-style';
globalRtlStyle.innerHTML = `
  body {
    direction: rtl;
  }
  
  .rtl-text {
    direction: rtl;
    text-align: center;
  }
  
  .rtl-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .rtl-button-icon-left {
    margin-right: 8px;
    order: -1;
  }
  
  .rtl-button-icon-right {
    margin-left: 8px;
    order: 1;
  }
`;
document.head.appendChild(globalRtlStyle);
  }
};

// Call the function safely
if (typeof window !== 'undefined') {
  addGlobalRtlStyle();
}

// Direct style objects with explicit colors
const styles: Record<string, CSSProperties> = {
  card: {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: 'none',
    background: 'linear-gradient(to bottom right, white, #e2e8f0)',
    textAlign: 'center',
    width: '100%',
    height: 'auto',
    minHeight: '300px',
    margin: '0',
    maxWidth: '100%',
    overflow: 'auto',
    borderRadius: '12px'
  },
  cardFullScreen: {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: 'none',
    background: 'linear-gradient(to bottom right, white, #e2e8f0)',
    textAlign: 'center',
    width: '100%',
    minHeight: '100vh',
    height: 'auto',
    margin: '0',
    maxWidth: '100%',
    overflow: 'auto',
    borderRadius: '12px'
  },
  cardHeader: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    color: 'white',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    textAlign: 'center'
  },
  cardTitle: {
    color: 'white',
    textAlign: 'center'
  },
  cardDescription: {
    color: '#e0e7ff',
    textAlign: 'center'
  },
  badge: {
    color: '#e0e7ff',
    borderColor: '#a5b4fc'
  },
  separator: {
    backgroundColor: '#e0e7ff'
  },
  optionButton: {
    borderColor: '#e0e7ff',
    textAlign: 'center',
    direction: 'rtl'
  },
  sendButton: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  backButton: {
    color: '#4f46e5'
  },
  restartButton: {
    borderColor: '#e0e7ff'
  },
  flowTypeButton: {
    borderColor: '#e0e7ff',
    height: '6rem',
    textAlign: 'center'
  },
  formContainer: {
    textAlign: 'center',
    direction: 'rtl'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  },
  textCenter: {
    textAlign: 'center',
    direction: 'rtl',
    color: '#1e293b',
    textShadow: '0 1px 0 rgba(255, 255, 255, 0.4)',
    padding: '0.25rem 0',
    maxWidth: '90%',
    margin: '0 auto',
    borderBottom: '1px solid rgba(255, 255, 255, 0.5)'
  },
  subtext: {
    color: '#1e293b',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    textAlign: 'center',
    direction: 'rtl',
    fontWeight: 'bold',
    padding: '0.25rem 0',
    maxWidth: '85%',
    margin: '0 auto',
    textShadow: '0 1px 0 rgba(255, 255, 255, 0.4)'
  },
  cardContent: {
    backgroundColor: '#f8fafc',
    borderRadius: '0 0 0.5rem 0.5rem',
    paddingBottom: '30px',
    maxHeight: 'calc(100vh - 100px)',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  rtlContainer: {
    direction: 'rtl',
    textAlign: 'center'
  },
  rtlInput: {
    direction: 'rtl',
    textAlign: 'center'
  },
  rtlLabel: {
    display: 'block',
    textAlign: 'center'
  }
};

interface FlowOption {
  text?: string;
  next?: string;
}

interface ButtonStyle {
  background?: string;
  color?: string;
  icon?: string;
}

interface FlowNode {
  type: string;
  text: string;
  subtext?: string;
  image?: string;
  image2?: string;
  video?: string;
  options: FlowOption[] | Record<string, string>;
  buttonStyles?: Record<string, ButtonStyle>;
  showFeedbackForm?: boolean;
  showReportForm?: boolean;
}

interface FlowData {
  start: string;
  [key: string]: FlowNode | string;
}

interface WizardProps {
  onComplete?: (showFeedbackForm?: boolean, showReportForm?: boolean) => void;
  onReportIssue?: () => void;
  onWizardStart?: () => void;
  onWizardReset?: () => void;
  isWizardStarted?: boolean;
}

const AutomatedSolutionWizard = ({ onComplete, onReportIssue, onWizardStart, onWizardReset, isWizardStarted = false }: WizardProps) => {
  console.log('🔧 AutomatedSolutionWizard נטען');
  
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<FlowNode | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [pendingFeedbackAction, setPendingFeedbackAction] = useState(false);
  const [reportForm, setReportForm] = useState({
    brand: '',
    branchName: '',
    registerNumber: '',
    issueDetails: '',
    name: '',
    phone: ''
  });
  const { toast } = useToast();

  const flowTypes = [
    { id: 'kupa', name: 'בעיות קופה', description: 'פתרון בעיות במערכת הקופה' },
    { id: 'ashrai', name: 'בעיות אשראי', description: 'פתרון בעיות במכשיר האשראי' },
    { id: 'holetz', name: 'בעיות חולץ', description: 'פתרון בעיות בחולץ' },
  ];



  // Get the appropriate flow data based on selection
  const getFlowData = (): FlowData => {
    switch (selectedFlow) {
      case 'kupa':
        return kupaFlow.flowData || kupaFlow;
      case 'ashrai':
        return ashraiFlow.flowData || ashraiFlow;
      case 'holetz':
        return holetzFlow.flowData || holetzFlow;
      default:
        return { start: '', '': { type: '', text: '', options: [] } };
    }
  };

  // Initialize flow when selected
  useEffect(() => {
    if (selectedFlow) {
      const flowData = getFlowData();
      const startNodeId = flowData.start;
      setCurrentNodeId(startNodeId);
      setHistory([]);
      setIsCompleted(false);
    }
  }, [selectedFlow]);

  // Update current node when node ID changes
  useEffect(() => {
    if (!currentNodeId || !selectedFlow) return;
    
    const flowData = getFlowData();
    const node = flowData[currentNodeId];
    
    if (typeof node === 'object') {
      setCurrentNode(node);
    } else {
      console.error('Invalid node:', node);
    }
  }, [currentNodeId, selectedFlow]);

  const handleOptionClick = (option: FlowOption | string) => {
    const flowData = getFlowData();
    let nextNodeId: string;
    
    if (typeof option === 'string') {
      // For holetz and ashrai format
      const optionsMap = currentNode?.options as Record<string, string>;
      nextNodeId = optionsMap[option];
    } else {
      // For kupa format
      nextNodeId = option.next || '';
    }
    
    if (nextNodeId) {
      setHistory([...history, currentNodeId || '']);
      setCurrentNodeId(nextNodeId);
      
      const nextNode = flowData[nextNodeId];
      if (typeof nextNode === 'object') {
        if (nextNode.type === 'end' && nextNode.showFeedbackForm) {
          // Show feedback prompt before showing the feedback form
          setShowFeedbackPrompt(true);
          setPendingFeedbackAction(true);
        }
        else if (nextNode.type === 'end' && nextNode.showReportForm) {
          // Show report form directly
          if (onComplete) onComplete(false, true);
        }
        else if (nextNode.type === 'end') {
          setIsCompleted(true);
          if (onComplete) onComplete(false, false);
        }
      }
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevNodeId = history[history.length - 1];
      setCurrentNodeId(prevNodeId);
      setHistory(history.slice(0, -1));
    } else {
      setSelectedFlow(null);
      setCurrentNodeId(null);
      setCurrentNode(null);
      // איפוס מצב האשף כשחוזרים למסך הבחירה הראשי
      if (onWizardReset) onWizardReset();
    }
  };

  const handleRestart = () => {
    if (selectedFlow) {
      const flowData = getFlowData();
      setCurrentNodeId(flowData.start);
      setHistory([]);
      setIsCompleted(false);
    }
  };

  const handleSendReport = () => {
    if (onReportIssue) {
      onReportIssue();
    } else {
      setShowReportForm(true);
    }
  };

  const handleFeedbackPromptResponse = (wantsToGiveFeedback: boolean) => {
    setShowFeedbackPrompt(false);
    setPendingFeedbackAction(false);
    
    if (wantsToGiveFeedback) {
      // User wants to give feedback
      if (onComplete) onComplete(true, false);
    } else {
      // User doesn't want to give feedback - חזרה למסך הראשי
      setIsCompleted(false);
      setSelectedFlow(null);
      setCurrentNodeId(null);
      setCurrentNode(null);
      setHistory([]);
      // איפוס מצב האשף במסך הראשי
      if (onWizardReset) onWizardReset();
    }
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
    setIsCompleted(true);
    if (onComplete) onComplete(false, false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportForm(prev => ({ ...prev, [name]: value }));
  };

  // Get the appropriate icon component based on the icon name
  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return null;
    
    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle className="h-4 w-4" />;
      case 'AlertCircle':
        return <AlertCircle className="h-4 w-4" />;
      case 'AlertTriangle':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Star':
        return <Star className="h-4 w-4" />;
      case 'ArrowRight':
        return <ArrowRight className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderOptions = () => {
    if (!currentNode) return null;
    
    // Check if options is an array (old kupa format) or an object (holetz/ashrai format)
    if (Array.isArray(currentNode.options)) {
      return (
        <div className="flex flex-col gap-2 md:gap-3 mt-2 md:mt-4 rtl-text px-2" style={styles.rtlContainer}>
          {currentNode.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="py-4 md:py-6 text-sm md:text-lg font-medium rtl-button h-12 md:h-auto"
              style={{...styles.optionButton, fontSize: 'clamp(0.875rem, 3vw, 1.125rem)', minHeight: '48px'}}
              onClick={() => handleOptionClick(option)}
            >
              <span className="rtl-text">{option.text}</span>
            </Button>
          ))}
        </div>
      );
    } else {
      // Handle object format for options
      return (
        <div className="flex flex-col gap-2 md:gap-3 mt-2 md:mt-4 rtl-text px-2" style={styles.rtlContainer}>
          {Object.entries(currentNode.options).map(([text, nextNodeId]) => {
            // Get custom button style if available
            const buttonStyle = currentNode.buttonStyles?.[text];
            const customStyle: CSSProperties = buttonStyle ? {
              background: buttonStyle.background || undefined,
              color: buttonStyle.color || undefined,
              ...styles.optionButton
            } : styles.optionButton;
            
            const icon = buttonStyle ? getIconComponent(buttonStyle.icon) : null;
            
            return (
              <Button
                key={text}
                variant={buttonStyle ? "default" : "outline"}
                className="py-4 md:py-6 text-sm md:text-lg font-medium rtl-button h-12 md:h-auto"
                style={{...customStyle, fontSize: 'clamp(0.875rem, 3vw, 1.125rem)', minHeight: '48px'}}
                onClick={() => handleOptionClick(text)}
              >
                <span className="rtl-text">{text}</span>
                {icon && <span className="rtl-button-icon-left">{icon}</span>}
              </Button>
            );
          })}
        </div>
      );
    }
  };

  // Render feedback prompt
  if (showFeedbackPrompt && pendingFeedbackAction) {
    return <FeedbackPrompt onResponse={handleFeedbackPromptResponse} />;
  }

  // Render report form
  if (showReportForm) {
    return (
      <Card style={styles.card}>
        <CardHeader style={styles.cardHeader}>
          <CardTitle style={styles.cardTitle} className="text-xl rtl-text">טופס דיווח תקלה</CardTitle>
          <CardDescription style={styles.cardDescription} className="rtl-text">אנא מלא את הפרטים הבאים</CardDescription>
        </CardHeader>
        <CardContent className="p-6" style={styles.cardContent}>
          <form onSubmit={handleReportFormSubmit} className="space-y-4" style={styles.formContainer}>
            <div className="space-y-2">
              <Label htmlFor="brand" style={styles.rtlLabel} className="rtl-text">מותג:</Label>
              <Input 
                id="brand" 
                name="brand" 
                value={reportForm.brand} 
                onChange={handleInputChange} 
                placeholder="שם המותג"
                required
                className="mx-auto rtl-text"
                style={{...styles.rtlInput, maxWidth: '400px'}}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branchName" style={styles.rtlLabel} className="rtl-text">שם סניף:</Label>
              <Input 
                id="branchName" 
                name="branchName" 
                value={reportForm.branchName} 
                onChange={handleInputChange} 
                placeholder="שם הסניף"
                required
                className="mx-auto rtl-text"
                style={{...styles.rtlInput, maxWidth: '400px'}}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registerNumber" style={styles.rtlLabel} className="rtl-text">מספר קופה:</Label>
              <Input 
                id="registerNumber" 
                name="registerNumber" 
                value={reportForm.registerNumber} 
                onChange={handleInputChange} 
                placeholder="מספר הקופה"
                required
                className="mx-auto rtl-text"
                style={{...styles.rtlInput, maxWidth: '400px'}}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issueDetails" style={styles.rtlLabel} className="rtl-text">פירוט התקלה:</Label>
              <Textarea 
                id="issueDetails" 
                name="issueDetails" 
                value={reportForm.issueDetails} 
                onChange={handleInputChange} 
                placeholder="תיאור מפורט של התקלה"
                required
                className="min-h-[100px] mx-auto rtl-text"
                style={{...styles.rtlInput, maxWidth: '400px'}}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" style={styles.rtlLabel} className="rtl-text">שם:</Label>
              <Input 
                id="name" 
                name="name" 
                value={reportForm.name} 
                onChange={handleInputChange} 
                placeholder="השם שלך"
                required
                className="mx-auto rtl-text"
                style={{...styles.rtlInput, maxWidth: '400px'}}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" style={styles.rtlLabel} className="rtl-text">מספר טלפון:</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={reportForm.phone} 
                onChange={handleInputChange} 
                placeholder="מספר הטלפון שלך"
                required
                className="mx-auto rtl-text"
                style={{...styles.rtlInput, maxWidth: '400px'}}
              />
            </div>
            
            <div style={styles.buttonContainer}>
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => setShowReportForm(false)}
                className="rtl-button"
              >
                <span className="rtl-text">חזור</span>
                <ArrowLeft className="rtl-button-icon-left h-4 w-4" />
              </Button>
              
              <Button 
                type="submit"
                style={styles.sendButton}
                className="rtl-text"
              >
                שלח דיווח
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Render flow selection
  if (!selectedFlow) {
    console.log('🎯 מציג מסך בחירת זרימה - כפתורים זמינים:', flowTypes);
    
    return (
      <Card style={isWizardStarted ? styles.cardFullScreen : styles.card}>
        <CardHeader style={styles.cardHeader}>
          <CardTitle style={{...styles.cardTitle, fontSize: 'clamp(1rem, 4vw, 1.25rem)'}} className="text-lg md:text-xl rtl-text">אשף פתרון תקלות</CardTitle>
          <CardDescription style={{...styles.cardDescription, fontSize: 'clamp(0.75rem, 3vw, 0.875rem)'}} className="rtl-text text-sm">בחר את סוג התקלה שברצונך לפתור</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pb-2" style={styles.cardContent}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {flowTypes.map((flow) => {
              console.log('🔘 יוצר כפתור עבור:', flow);
              return (
              <Button
                key={flow.id}
                variant="outline"
                className="flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all rtl-text h-20 md:h-24"
                style={{...styles.flowTypeButton, minHeight: '80px', fontSize: 'clamp(1.25rem, 4vw, 1.5rem)'}}
                onClick={() => {
                    try {
                      // מעקב אחר הלחיצה
                      console.log('🔄 מתחיל מעקב לחיצה עבור:', flow.name);
                      trackButtonClick(flow.id, flow.name, 'main_buttons');
                      console.log('✅ מעקב לחיצה הושלם בהצלחה');
                    } catch (error) {
                      console.error('❌ שגיאה במעקב לחיצה:', error);
                    }
                    
                    // הצגת הודעה למשתמש
                    toast({
                      title: `נבחר: ${flow.name}`,
                      description: "מתחיל תהליך פתרון התקלה...",
                      duration: 2000
                    });
                    
                  setSelectedFlow(flow.id);
                  if (onWizardStart) onWizardStart();
                }}
              >
                <div className="text-xl md:text-2xl font-bold rtl-text" style={{fontSize: 'clamp(1.25rem, 5vw, 1.75rem)'}}>{flow.name}</div>
                <div className="text-base md:text-lg text-gray-600 rtl-text font-semibold" style={{fontSize: 'clamp(1rem, 3.5vw, 1.25rem)'}}>{flow.description}</div>
              </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render current node
  return (
    <Card style={styles.cardFullScreen}>
      <CardHeader style={styles.cardHeader}>
        <div className="flex justify-between items-center">
          <CardTitle style={{...styles.cardTitle, fontSize: 'clamp(1rem, 4vw, 1.25rem)'}} className="text-lg md:text-xl rtl-text">
            {flowTypes.find(f => f.id === selectedFlow)?.name}
          </CardTitle>
          
          {/* Botex Center */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
                         <span className="text-xl font-bold" style={{
               color: '#ffffff',
               textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)',
               filter: 'brightness(1.2)'
             }}>בוטקס</span>
          </div>
          
          <Badge variant="outline" style={styles.badge} className="rtl-text">
            שלב {history.length + 1}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6" style={styles.cardContent}>
        {currentNode && (
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold rtl-text" style={{...styles.textCenter, fontSize: 'clamp(1rem, 4vw, 1.25rem)'}}>{currentNode.text}</h3>
            
            {currentNode.subtext && (
              <p style={{...styles.subtext, fontSize: 'clamp(0.75rem, 3vw, 0.875rem)'}} className="rtl-text text-sm">{currentNode.subtext}</p>
            )}
            
            {/* Display images */}
            {(currentNode.image || currentNode.image2) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 my-2 md:my-4 mx-auto px-2" style={{maxWidth: '100%'}}>
                {currentNode.image && (
                  <div className="rounded-lg overflow-hidden border border-indigo-100 shadow-md mx-auto w-full">
                    <img src={currentNode.image} alt="הדרכה" className="w-full h-auto max-w-full" style={{maxHeight: '300px', objectFit: 'contain'}} />
                  </div>
                )}
                {currentNode.image2 && (
                  <div className="rounded-lg overflow-hidden border border-indigo-100 shadow-md mx-auto w-full">
                    <img src={currentNode.image2} alt="הדרכה נוספת" className="w-full h-auto max-w-full" style={{maxHeight: '300px', objectFit: 'contain'}} />
                  </div>
                )}
              </div>
            )}
            
            {currentNode.video && (
              <div className="mt-2 md:mt-4 rounded-lg overflow-hidden border border-indigo-100 shadow-md mx-2">
                <video src={currentNode.video} controls className="w-full h-auto" style={{maxHeight: '300px'}} />
              </div>
            )}
            
            <Separator style={styles.separator} className="my-4" />
            
            {currentNode.type === 'question' && renderOptions()}
            
            <div style={styles.buttonContainer}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rtl-button hover:bg-indigo-50 h-10 md:h-8 px-4 py-2"
                style={{...styles.backButton, fontSize: 'clamp(0.875rem, 3vw, 1rem)', minHeight: '40px'}}
                onClick={handleBack}
                disabled={history.length === 0 && !selectedFlow}
              >
                <span className="rtl-text">חזור</span>
                <ArrowLeft className="rtl-button-icon-left h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="rtl-text hover:bg-indigo-50 hover:text-indigo-700 h-10 md:h-8 px-4 py-2"
                style={{...styles.restartButton, fontSize: 'clamp(0.875rem, 3vw, 1rem)', minHeight: '40px'}}
                onClick={handleRestart}
              >
                התחל מחדש
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedSolutionWizard; 