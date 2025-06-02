import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlowData, FlowNode, FlowType } from '@/lib/troubleshootingFlows';
import { useToast } from '@/hooks/use-toast';

interface TroubleshootingFlowProps {
  flowType: FlowType;
  flowData: FlowData;
  onComplete?: () => void;
}

const TroubleshootingFlow = ({ flowType, flowData, onComplete }: TroubleshootingFlowProps) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(flowData.start);
  const [history, setHistory] = useState<string[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { toast } = useToast();
  
  const currentNode = flowData.nodes[currentNodeId];
  
  const handleOptionClick = (nextNodeId: string) => {
    setHistory(prev => [...prev, currentNodeId]);
    setCurrentNodeId(nextNodeId);
    
    if (flowData.nodes[nextNodeId].type === 'end') {
      toast({
        title: "תהליך הפתרון הושלם",
        description: "תודה שהשתמשת במערכת הפתרון האוטומטי שלנו",
      });
      
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  const handleBack = () => {
    if (history.length > 0) {
      const prevNodeId = history[history.length - 1];
      setCurrentNodeId(prevNodeId);
      setHistory(prev => prev.slice(0, -1));
    }
  };
  
  const getFlowTitle = () => {
    switch (flowType) {
      case 'ashrai':
        return "פתרון בעיות במכשיר אשראי";
      case 'holetz':
        return "פתרון בעיות בחולץ";
      case 'kupa':
        return "פתרון בעיות בקופה";
      default:
        return "פתרון בעיות";
    }
  };

  return (
    <Card className="shadow-lg border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>{getFlowTitle()}</span>
          {history.length > 0 && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleBack} 
              className="bg-white text-blue-700 font-medium border-2 border-blue-200 shadow-sm hover:bg-blue-50"
            >
              חזור לשלב הקודם
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {currentNode && (
          <div className="space-y-6">
            <div className="text-lg font-medium text-center">{currentNode.text}</div>
            
            {/* Images */}
            <div className="flex flex-wrap gap-4 justify-center">
              {currentNode.image && (
                <div className="border rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={currentNode.image} 
                    alt="תמונת הדרכה" 
                    className="max-w-full h-auto max-h-80 object-contain"
                  />
                </div>
              )}
              
              {currentNode.image2 && (
                <div className="border rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={currentNode.image2} 
                    alt="תמונת הדרכה נוספת" 
                    className="max-w-full h-auto max-h-80 object-contain"
                  />
                </div>
              )}
            </div>
            
            {/* Video */}
            {currentNode.video && (
              <div className="flex justify-center">
                <div className="border rounded-lg overflow-hidden shadow-md w-full max-w-2xl">
                  <video 
                    src={currentNode.video} 
                    controls
                    className="w-full"
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                  />
                </div>
              </div>
            )}
            
            {/* Options */}
            {currentNode.type === 'question' && currentNode.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {Array.isArray(currentNode.options) ? (
                  // Handle array format
                  currentNode.options.map((option, index) => (
                    <Button 
                      key={index} 
                      onClick={() => handleOptionClick(option.next)}
                      className="text-lg py-6"
                      variant="outline"
                    >
                      {option.text}
                    </Button>
                  ))
                ) : (
                  // Handle object format
                  Object.entries(currentNode.options).map(([text, nextNodeId]) => (
                    <Button 
                      key={text} 
                      onClick={() => handleOptionClick(nextNodeId as string)}
                      className="text-lg py-6"
                      variant="outline"
                    >
                      {text}
                    </Button>
                  ))
                )}
              </div>
            )}
            
            {/* End node */}
            {currentNode.type === 'end' && currentNode.text && (
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{currentNode.text}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TroubleshootingFlow; 