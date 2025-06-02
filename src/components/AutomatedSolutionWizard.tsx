import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle, HelpCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CSSProperties } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Import flow data
import kupaFlow from '../../kupa.js';
import ashraiFlow from '../../ashrai.js';
import holetzFlow from '../../holetz.js';

// Direct style objects with explicit colors
const styles: Record<string, CSSProperties> = {
  card: {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: 'none',
    background: 'linear-gradient(to bottom right, white, #eef2ff)',
    textAlign: 'center'
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
    textAlign: 'center'
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
    textAlign: 'center'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem'
  },
  textCenter: {
    textAlign: 'center'
  }
};

interface FlowOption {
  text?: string;
  next?: string;
}

interface FlowNode {
  type: string;
  text: string;
  image?: string;
  image2?: string;
  video?: string;
  options: FlowOption[] | Record<string, string>;
}

interface FlowData {
  start: string;
  [key: string]: FlowNode | string;
}

interface WizardProps {
  onComplete?: () => void;
  onReportIssue?: () => void;
}

const AutomatedSolutionWizard = ({ onComplete, onReportIssue }: WizardProps) => {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<FlowNode | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
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
        return kupaFlow;
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
      if (typeof nextNode === 'object' && nextNode.type === 'end') {
        setIsCompleted(true);
        if (onComplete) onComplete();
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
    if (onComplete) onComplete();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderOptions = () => {
    if (!currentNode) return null;
    
    if (Array.isArray(currentNode.options)) {
      // Kupa format
      return currentNode.options.map((option, index) => (
        <Button 
          key={index} 
          variant="outline" 
          className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-700 justify-center mx-auto w-full sm:w-3/4"
          style={styles.optionButton}
          onClick={() => handleOptionClick(option)}
        >
          {option.text}
        </Button>
      ));
    } else {
      // Ashrai and Holetz format
      return Object.entries(currentNode.options).map(([label, value], index) => (
        <Button 
          key={index} 
          variant="outline" 
          className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-700 justify-center mx-auto w-full sm:w-3/4"
          style={styles.optionButton}
          onClick={() => handleOptionClick(label)}
        >
          {label}
        </Button>
      ));
    }
  };

  // Render report form
  if (showReportForm) {
    return (
      <Card style={styles.card}>
        <CardHeader style={styles.cardHeader}>
          <CardTitle style={styles.cardTitle} className="text-xl">טופס דיווח תקלה</CardTitle>
          <CardDescription style={styles.cardDescription}>אנא מלא את הפרטים הבאים</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleReportFormSubmit} className="space-y-4" style={styles.formContainer}>
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-center block">מותג:</Label>
              <Input 
                id="brand" 
                name="brand" 
                value={reportForm.brand} 
                onChange={handleInputChange} 
                placeholder="שם המותג"
                required
                className="text-center mx-auto"
                style={{maxWidth: '400px'}}
              />
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
                onClick={() => setShowReportForm(false)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                חזור
              </Button>
              
              <Button 
                type="submit"
                style={styles.sendButton}
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
    return (
      <Card style={styles.card}>
        <CardHeader style={styles.cardHeader}>
          <CardTitle style={styles.cardTitle} className="text-xl">אשף פתרון תקלות</CardTitle>
          <CardDescription style={styles.cardDescription}>בחר את סוג התקלה שברצונך לפתור</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {flowTypes.map((flow) => (
              <Button
                key={flow.id}
                variant="outline"
                className="flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                style={styles.flowTypeButton}
                onClick={() => setSelectedFlow(flow.id)}
              >
                <div className="text-lg font-medium">{flow.name}</div>
                <div className="text-xs text-gray-500">{flow.description}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render current node
  return (
    <Card style={styles.card}>
      <CardHeader style={styles.cardHeader}>
        <div className="flex justify-between items-center">
          <CardTitle style={styles.cardTitle} className="text-xl">
            {flowTypes.find(f => f.id === selectedFlow)?.name}
          </CardTitle>
          <Badge variant="outline" style={styles.badge}>
            שלב {history.length + 1}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {currentNode && (
          <div className="space-y-6" style={styles.textCenter}>
            <div className="text-lg font-medium text-center">{currentNode.text}</div>
            
            {/* Display images */}
            {(currentNode.image || currentNode.image2) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 mx-auto" style={{maxWidth: '800px'}}>
                {currentNode.image && (
                  <div className="rounded-lg overflow-hidden border border-indigo-100 shadow-md mx-auto">
                    <img src={currentNode.image} alt="הדרכה" className="w-full h-auto" />
                  </div>
                )}
                {currentNode.image2 && (
                  <div className="rounded-lg overflow-hidden border border-indigo-100 shadow-md mx-auto">
                    <img src={currentNode.image2} alt="הדרכה נוספת" className="w-full h-auto" />
                  </div>
                )}
              </div>
            )}
            
            {/* Display video */}
            {currentNode.video && (
              <div className="rounded-lg overflow-hidden border border-indigo-100 shadow-md my-4 mx-auto" style={{maxWidth: '600px'}}>
                <video 
                  src={currentNode.video} 
                  controls 
                  className="w-full h-auto" 
                  autoPlay 
                  loop 
                  muted
                />
              </div>
            )}
            
            <Separator style={styles.separator} className="my-4" />
            
            <div className="space-y-3 flex flex-col items-center">
              {renderOptions()}
              
              {/* Special case for "SEND" option */}
              {currentNode.type === "question" && 
               Object.values(currentNode.options).includes("SEND") && (
                <Button 
                  variant="default" 
                  className="w-full sm:w-3/4 hover:shadow-lg transition-shadow"
                  style={styles.sendButton}
                  onClick={handleSendReport}
                >
                  שלח דיווח תקלה
                </Button>
              )}
            </div>
            
            <div style={styles.buttonContainer}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 hover:bg-indigo-50"
                style={styles.backButton}
                onClick={handleBack}
                disabled={history.length === 0 && !selectedFlow}
              >
                <ArrowLeft className="h-4 w-4" />
                חזור
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 hover:bg-indigo-50 hover:text-indigo-700"
                style={styles.restartButton}
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