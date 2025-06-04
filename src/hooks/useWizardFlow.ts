import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Import flow data
import kupaFlow from '../../kupa.js';
import ashraiFlow from '../../ashrai.js';
import holetzFlow from '../../holetz.js';

interface FlowOption {
  text?: string;
  next?: string;
}

interface ButtonStyle {
  background?: string;
  color?: string;
  icon?: string;
}

export interface FlowNode {
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

interface ReportForm {
  brand: string;
  branchName: string;
  registerNumber: string;
  issueDetails: string;
  name: string;
  phone: string;
}

interface UseWizardFlowProps {
  onComplete?: (showFeedbackForm?: boolean, showReportForm?: boolean) => void;
  onReportIssue?: () => void;
}

export const useWizardFlow = ({ onComplete, onReportIssue }: UseWizardFlowProps = {}) => {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<FlowNode | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [pendingFeedbackAction, setPendingFeedbackAction] = useState(false);
  const [reportForm, setReportForm] = useState<ReportForm>({
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
  const getFlowData = (flowType: string): FlowData => {
    try {
      switch (flowType) {
        case 'kupa':
          return kupaFlow.flowData || kupaFlow;
        case 'ashrai':
          return ashraiFlow.flowData || ashraiFlow;
        case 'holetz':
          return holetzFlow.flowData || holetzFlow;
        default:
          throw new Error(`Unknown flow type: ${flowType}`);
      }
    } catch (err) {
      setError(`Error loading flow data: ${err instanceof Error ? err.message : String(err)}`);
      return { start: '', '': { type: '', text: '', options: [] } };
    }
  };

  // Initialize flow when selected
  useEffect(() => {
    if (selectedFlow) {
      try {
        setIsLoading(true);
        setError(null);
        
        const flowData = getFlowData(selectedFlow);
        const startNodeId = flowData.start;
        setCurrentNodeId(startNodeId);
        setHistory([]);
        setIsCompleted(false);
      } catch (err) {
        setError(`Error initializing flow: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedFlow]);

  // Update current node when node ID changes
  useEffect(() => {
    if (!currentNodeId || !selectedFlow) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const flowData = getFlowData(selectedFlow);
      const node = flowData[currentNodeId];
      
      if (typeof node === 'object') {
        setCurrentNode(node);
      } else {
        throw new Error(`Invalid node: ${currentNodeId}`);
      }
    } catch (err) {
      setError(`Error loading node: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentNodeId, selectedFlow]);

  const handleOptionClick = (option: FlowOption | string) => {
    if (!selectedFlow || !currentNode) return;
    
    try {
      const flowData = getFlowData(selectedFlow);
      let nextNodeId: string;
      
      if (typeof option === 'string') {
        // For holetz and ashrai format
        const optionsMap = currentNode.options as Record<string, string>;
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
      } else {
        throw new Error(`Invalid next node ID: ${nextNodeId}`);
      }
    } catch (err) {
      setError(`Error navigating to next step: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה במעבר לשלב הבא. אנא נסה שוב.",
        variant: "destructive"
      });
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
      try {
        const flowData = getFlowData(selectedFlow);
        setCurrentNodeId(flowData.start);
        setHistory([]);
        setIsCompleted(false);
      } catch (err) {
        setError(`Error restarting flow: ${err instanceof Error ? err.message : String(err)}`);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה באתחול מחדש. אנא נסה שוב.",
          variant: "destructive"
        });
      }
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
      
      toast({
        title: "תודה",
        description: "חזרת למסך הראשי",
      });
    }
  };

  const handleReportFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // כאן יהיה הקוד לשליחת הטופס לשרת
      // לדוגמה: await sendReportToServer(reportForm);
      
      // סימולציה של שליחה לשרת
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "תודה על הדיווח!",
        description: "פנייתך התקבלה בהצלחה, נחזור אליך בהקדם",
      });
      
      setShowReportForm(false);
      setSelectedFlow(null);
      setCurrentNodeId(null);
      setCurrentNode(null);
    } catch (err) {
      setError(`Error submitting report: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "שגיאה בשליחת הטופס",
        description: "אירעה שגיאה בשליחת הטופס. אנא נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setReportForm({
      brand: '',
      branchName: '',
      registerNumber: '',
      issueDetails: '',
      name: '',
      phone: ''
    });
  };

  return {
    // מצב
    selectedFlow,
    currentNodeId,
    currentNode,
    history,
    isCompleted,
    isLoading,
    error,
    showReportForm,
    reportForm,
    flowTypes,
    showFeedbackPrompt,
    pendingFeedbackAction,
    
    // פעולות
    setSelectedFlow,
    handleOptionClick,
    handleBack,
    handleRestart,
    handleSendReport,
    handleReportFormSubmit,
    handleInputChange,
    setShowReportForm,
    resetForm,
    handleFeedbackPromptResponse
  };
};

export default useWizardFlow; 