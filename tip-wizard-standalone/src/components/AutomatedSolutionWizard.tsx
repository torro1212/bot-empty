import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle, HelpCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CSSProperties } from 'react';

// Import flow data
import kupaFlow from '../kupa.js';
import ashraiFlow from '../ashrai.js';
import holetzFlow from '../holetz.js';

// Direct style objects with explicit colors
const styles: Record<string, CSSProperties> = {
  card: {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: 'none',
    background: 'linear-gradient(to bottom right, white, #eef2ff)'
  },
  cardHeader: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    color: 'white',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem'
  },
  cardTitle: {
    color: 'white'
  },
  cardDescription: {
    color: '#e0e7ff'
  },
  badge: {
    color: '#e0e7ff',
    borderColor: '#a5b4fc'
  },
  separator: {
    backgroundColor: '#e0e7ff'
  },
  optionButton: {
    borderColor: '#e0e7ff'
  },
  sendButton: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  backButton: {
    color: '#4f46e5'
  },
  restartButton: {
    borderColor: '#e0e7ff'
  },
  flowTypeButton: {
    borderColor: '#e0e7ff',
    height: '6rem'
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
}

const AutomatedSolutionWizard = ({ onComplete }: WizardProps) => {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<FlowNode | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const flowTypes = [
    { id: 'kupa', name: 'בעיות קופה', description: 'פתרון בעיות במערכת הקופה' },
    { id: 'ashrai', name: 'בעיות אשראי', description: 'פתרון בעיות במכשיר האשראי' },
    { id: 'holetz', name: 'בעיות חולץ', description: 'פתרון בעיות בחולץ הכרטיסים' },
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
      if (typeof nextNode === 'object' && nextNode.type === 'end') {
        setIsCompleted(true);
        toast({
          title: "תהליך הושלם!",
          description: nextNode.text || "תהליך פתרון הבעיה הושלם בהצלחה.",
        });
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
    toast({
      title: "דיווח נשלח",
      description: "תודה על הדיווח! צוות התמיכה יצור איתך קשר בהקדם.",
    });
    setIsCompleted(true);
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
            {flowTypes.find(f => f.id === selectedFlow)?.name || 'פתרון תקלות'}
          </CardTitle>
          <Badge style={styles.badge} className="border">שלב {history.length + 1}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Back button */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 text-sm"
            style={styles.backButton}
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
            {history.length > 0 ? 'חזרה לשלב הקודם' : 'חזרה לבחירת תקלה'}
          </Button>
        </div>
        
        {/* Question text */}
        {currentNode && (
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium mb-2">{currentNode.text}</h3>
            
            {/* Images */}
            {(currentNode.image || currentNode.image2) && (
              <div className="flex flex-wrap justify-center gap-4 my-4">
                {currentNode.image && (
                  <div className="border rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src={currentNode.image} 
                      alt="תמונת הדרכה" 
                      className="max-w-full max-h-64 object-contain"
                    />
                  </div>
                )}
                
                {currentNode.image2 && (
                  <div className="border rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src={currentNode.image2} 
                      alt="תמונת הדרכה נוספת" 
                      className="max-w-full max-h-64 object-contain"
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Video */}
            {currentNode.video && (
              <div className="my-4 mx-auto max-w-md">
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <video 
                    src={currentNode.video} 
                    controls
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            {/* Options */}
            {currentNode.type === 'question' && (
              <div className="space-y-3 mt-6">
                {renderOptions()}
              </div>
            )}
            
            {/* End node */}
            {currentNode.type === 'end' && (
              <div className="mt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-center mb-4">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p>{currentNode.text}</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <Button 
                    variant="outline"
                    style={styles.restartButton}
                    onClick={handleRestart}
                    className="flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    התחל שוב
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedSolutionWizard; 