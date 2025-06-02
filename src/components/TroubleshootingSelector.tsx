import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Printer, CreditCard } from 'lucide-react';
import { troubleshootingFlows, FlowType } from '@/lib/troubleshootingFlows';
import TroubleshootingFlow from './TroubleshootingFlow';

const TroubleshootingSelector = () => {
  const [selectedFlow, setSelectedFlow] = useState<FlowType | null>(null);

  const flowOptions = [
    { 
      id: 'kupa' as FlowType, 
      title: 'בעיות בקופה', 
      description: 'פתרון בעיות בקופה ובמערכת ה-POS', 
      icon: Monitor,
      color: 'bg-blue-500' 
    },
    { 
      id: 'ashrai' as FlowType, 
      title: 'בעיות במכשיר אשראי', 
      description: 'פתרון בעיות במכשיר האשראי וחיבורו', 
      icon: CreditCard,
      color: 'bg-green-500' 
    },
    { 
      id: 'holetz' as FlowType, 
      title: 'בעיות בחולץ', 
      description: 'פתרון בעיות בחולץ ובמערכת הקריאה', 
      icon: Printer,
      color: 'bg-purple-500' 
    },
  ];

  const handleSelectFlow = (flowType: FlowType) => {
    setSelectedFlow(flowType);
  };

  const handleComplete = () => {
    setSelectedFlow(null);
  };

  return (
    <div className="space-y-6">
      {!selectedFlow ? (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">בחר את סוג הבעיה לפתרון</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {flowOptions.map((option) => (
              <Card 
                key={option.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200"
                onClick={() => handleSelectFlow(option.id)}
              >
                <div className={`h-2 ${option.color}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium">{option.title}</h3>
                  </div>
                  <p className="text-gray-600">{option.description}</p>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => handleSelectFlow(option.id)}
                  >
                    התחל פתרון
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedFlow(null)}
              className="mb-4"
            >
              חזרה לבחירת בעיה
            </Button>
          </div>
          
          <TroubleshootingFlow 
            flowType={selectedFlow} 
            flowData={troubleshootingFlows[selectedFlow]} 
            onComplete={handleComplete}
          />
        </div>
      )}
    </div>
  );
};

export default TroubleshootingSelector; 