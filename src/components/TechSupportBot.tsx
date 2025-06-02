
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Settings, Printer, Wifi, Monitor, Users, HelpCircle, CheckCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  category?: string;
  steps?: string[];
  hasImage?: boolean;
  imageUrl?: string;
  image2Url?: string;
  hasVideo?: boolean;
  videoUrl?: string;
  flowOptions?: { [key: string]: string };
  currentFlowNode?: string;
}

const creditCardFlow = {
  start: "ASHRAI",
  nodes: {
    ASHRAI: {
      type: "question",
      text: "האם מכשיר האשראי דולק?",
      image: "https://i.imgur.com/3HbntNU.jpeg",
      options: {
        "דלוק": "A-DALOK",
        "לא דלוק": "A-LODALOK"
      }
    },
    "A-DALOK": {
      type: "question",
      text: "יש ללחוץ על הכפתור הירוק. האם מופיעים שלושה ריבועים בצד שמאל – כמו בתמונה 1 או כמו בתמונה 2?",
      image: "https://i.imgur.com/iUXJPVo.jpeg",
      image2: "https://i.imgur.com/umUOoUc.png",
      options: {
        "תמונה 1": "A-PIC-1-V",
        "תמונה 2": "A-PIC-2-X"
      }
    },
    "A-PIC-1-V": {
      type: "question",
      text: "יש ללחוץ על כוכבית או על כפתור F, ולאחר מכן להקליד 7277 ולסיים שוב בלחיצה על כוכבית או F – כפי שמוצג בסרטון",
      image: "https://i.imgur.com/UZLWIlt.jpeg",
      video: "https://i.imgur.com/hCqwr4B.mp4",
      options: {
        "הבא": "A-NEXT",
        "כבר ביצעתי לא עזר": "DONELOVED"
      }
    },
    "A-NEXT": {
      type: "question",
      text: "נא ללחוץ על כפתור ה-ROUTE. מה מופיע במסך – כמו בתמונה 1, תמונה 2 או משהו אחר?",
      image: "https://i.imgur.com/1Ut0dKU.jpeg",
      image2: "https://i.imgur.com/OyqOLJg.png",
      options: {
        "תמונה 1": "Route-PIC1-3-V",
        "תמונה 2 \\ אחר": "Route-PIC4-X"
      }
    },
    "Route-PIC1-3-V": {
      type: "question",
      text: "נא לבצע כיבוי והדלקה (כפי שמוצג בסרטון). האם התקלה נפתרה?",
      video: "https://i.imgur.com/Ps5UHMg.mp4",
      options: {
        "כן": "YES",
        "לא": "NO"
      }
    },
    "YES": {
      type: "end",
      text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
    },
    "NO": {
      type: "question",
      text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
      options: {
        "שליחת תקלה": "SEND"
      }
    },
    "Route-PIC4-X": {
      type: "question",
      text: "נא לבצע 'הצמדה' של האשראי לקופה כפי שמתואר בסרטון",
      video: "https://i.imgur.com/srw8fHO.mp4",
      options: {
        "הצליח ועובד": "WORKOVED",
        "הצליח ולא עובד": "WORKLOVED"
      }
    },
    "WORKOVED": {
      type: "end",
      text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
    },
    "WORKLOVED": {
      type: "question",
      text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
      options: {
        "שליחת תקלה": "SEND"
      }
    },
    "DONELOVED": {
      type: "question",
      text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
      options: {
        "שליחת תקלה": "SEND"
      }
    },
    "A-PIC-2-X": {
      type: "question",
      text: "נא לעקוב אחר הכבל כפי שמוצג בסרטון, ולוודא שהוא מחובר כפי שמתואר בתמונה",
      video: "https://i.imgur.com/tyZBRer.mp4",
      options: {
        "מחובר ועובד": "A-CA-OVED",
        "מחובר ולא עובד": "A-CA-LOVED"
      }
    },
    "A-CA-OVED": {
      type: "end",
      text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
    },
    "A-CA-LOVED": {
      type: "question",
      text: "נא ללחוץ על הכפתור שמסומן בתמונה 1 לבדוק שמופיע כמו בתמונה 2",
      image: "https://i.imgur.com/VreUuab.png",
      options: {
        "תקין-ירוק": "TAKINYAROK",
        "לא תקין": "LOTAKIN"
      }
    },
    "TAKINYAROK": {
      type: "question",
      text: "נא לבצע 'הצמדה' של האשראי לקופה כפי שמתואר בסרטון",
      video: "https://i.imgur.com/srw8fHO.mp4",
      options: {
        "הצליח ועובד": "WORKOVED",
        "הצליח ולא עובד": "WORKLOVED"
      }
    },
    "LOTAKIN": {
      type: "question",
      text: "נא לבדוק שהכבל רשת מחובר כמו בסרטון ומופיע חיבורים ירוקים כמו בתמונה",
      video: "https://i.imgur.com/J6tKRYe.mp4",
      options: {
        "מחובר-ירוק": "MHO-YAROK",
        "מחובר-לא ירוק": "LO-YAROK"
      }
    },
    "MHO-YAROK": {
      type: "question",
      text: "נא לבצע 'הצמדה' של האשראי לקופה כפי שמתואר בסרטון",
      video: "https://i.imgur.com/srw8fHO.mp4",
      options: {
        "הצליח ועובד": "WORKOVED",
        "הצליח ולא עובד": "WORKLOVED"
      }
    },
    "LO-YAROK": {
      type: "question",
      text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
      options: {
        "שליחת תקלה": "SEND"
      }
    },
    "A-LODALOK": {
      type: "question",
      text: "נא לעקוב אחר הכבל בהתאם לסרטון, ולוודא שהוא מחובר כפי שמוצג בתמונה",
      video: "https://i.imgur.com/eKLaeYO.mp4",
      options: {
        "נדלק ועובד": "A-CAH-OVED",
        "נדלק ולא עובד": "A-CAH-LOVED",
        "מחובר וכבוי": "A-CAH-LONDLAK"
      }
    },
    "A-CAH-OVED": {
      type: "end",
      text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
    },
    "A-CAH-LOVED": {
      type: "question",
      text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
      options: {
        "שליחת תקלה": "SEND"
      }
    },
    "A-CAH-LONDLAK": {
      type: "question",
      text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
      options: {
        "שליחת תקלה": "SEND"
      }
    },
    "SEND": {
      type: "end",
      text: "התקלה נשלחה לצוות התמיכה. נחזור אליכם בהקדם האפשרי!"
    }
  }
};

const TechSupportBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'שלום! אני טיפ, העוזר הטכני החכם שלך 🤖\nאני כאן לעזור לך לפתור כל בעיה טכנית במהירות. איך אוכל לעזור לך היום?',
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const quickReplies = [
    { text: 'הקופה לא עובדת', category: 'pos', icon: Monitor },
    { text: 'המדפסת לא מדפיסה', category: 'printer', icon: Printer },
    { text: 'אין אינטרנט', category: 'network', icon: Wifi },
    { text: 'בעיה באשראי', category: 'credit-card', icon: CreditCard },
    { text: 'שכחתי סיסמה', category: 'users', icon: Users },
  ];

  const troubleshootingSteps = {
    pos: {
      title: 'פתרון בעיות קופה (POS)',
      steps: [
        'בדוק שהקופה מחוברת לחשמל ■',
        'ודא שכבל הרשת מחובר היטב ■',
        'נסה להפעיל מחדש את המערכת ■',
        'בדוק עדכונים במערכת ■'
      ],
      image: '/api/placeholder/400/300'
    },
    printer: {
      title: 'פתרון בעיות מדפסת',
      steps: [
        'בדוק שיש נייר במדפסת ■',
        'ודא שהמדפסת מחוברת לחשמל ■',
        'בדוק שכבל USB/רשת מחובר ■',
        'נסה להדפיס דף בדיקה ■'
      ],
      image: '/api/placeholder/400/300'
    },
    network: {
      title: 'פתרון בעיות רשת',
      steps: [
        'בדוק שהנתב דולק (נורות ירוקות) ■',
        'נתק ומחבר מחדש את כבל הרשת ■',
        'נסה להפעיל מחדש את הנתב ■',
        'בדוק עם ספק האינטרנט ■'
      ],
      image: '/api/placeholder/400/300'
    },
    users: {
      title: 'איפוס סיסמה',
      steps: [
        'לחץ על "שכחתי סיסמה" במסך ההתחברות ■',
        'הזן את כתובת המייל שלך ■',
        'בדוק את תיבת המייל לקישור איפוס ■',
        'צור סיסמה חדשה ■'
      ],
      image: '/api/placeholder/400/300'
    }
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFlowOption = (nodeId: string, option: string) => {
    const nextNodeId = creditCardFlow.nodes[nodeId]?.options?.[option];
    if (!nextNodeId) return;

    const nextNode = creditCardFlow.nodes[nextNodeId];
    if (!nextNode) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: option,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: nextNode.text,
        isBot: true,
        timestamp: new Date(),
        category: 'credit-card',
        hasImage: !!nextNode.image,
        imageUrl: nextNode.image,
        image2Url: nextNode.image2,
        hasVideo: !!nextNode.video,
        videoUrl: nextNode.video,
        flowOptions: nextNode.type === 'question' ? nextNode.options : undefined,
        currentFlowNode: nextNodeId
      };

      if (nextNode.type === 'end' && nextNodeId === 'SEND') {
        // Handle report issue
        toast({
          title: "תקלה נשלחה",
          description: "התקלה נשלחה לצוות התמיכה. נחזור אליכם בהקדם!",
        });
      }

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('אשראי') || lowerMessage.includes('כרטיס אשראי') || lowerMessage.includes('בעיה באשראי')) {
      const startNode = creditCardFlow.nodes[creditCardFlow.start];
      return {
        id: Date.now().toString(),
        text: "בואו נפתור את בעיית האשראי יחד! אני אדריך אותך שלב אחר שלב:\n\n" + startNode.text,
        isBot: true,
        timestamp: new Date(),
        category: 'credit-card',
        hasImage: !!startNode.image,
        imageUrl: startNode.image,
        flowOptions: startNode.options,
        currentFlowNode: creditCardFlow.start
      };
    }
    
    if (lowerMessage.includes('קופה') || lowerMessage.includes('pos')) {
      return {
        id: Date.now().toString(),
        text: 'אני רואה שיש לך בעיה עם הקופה. הנה המדריך המפורט לפתרון:',
        isBot: true,
        timestamp: new Date(),
        category: 'pos',
        steps: troubleshootingSteps.pos.steps,
        hasImage: true,
        imageUrl: troubleshootingSteps.pos.image
      };
    }
    
    if (lowerMessage.includes('מדפסת') || lowerMessage.includes('הדפסה')) {
      return {
        id: Date.now().toString(),
        text: 'בואו נפתור את בעיית המדפסת יחד. עקוב אחר השלבים הבאים:',
        isBot: true,
        timestamp: new Date(),
        category: 'printer',
        steps: troubleshootingSteps.printer.steps,
        hasImage: true,
        imageUrl: troubleshootingSteps.printer.image
      };
    }
    
    if (lowerMessage.includes('אינטרנט') || lowerMessage.includes('רשת') || lowerMessage.includes('wifi')) {
      return {
        id: Date.now().toString(),
        text: 'בעיות רשת יכולות להיות מעצבנות. בואו נבדוק יחד:',
        isBot: true,
        timestamp: new Date(),
        category: 'network',
        steps: troubleshootingSteps.network.steps,
        hasImage: true,
        imageUrl: troubleshootingSteps.network.image
      };
    }
    
    if (lowerMessage.includes('סיסמה') || lowerMessage.includes('התחברות') || lowerMessage.includes('משתמש')) {
      return {
        id: Date.now().toString(),
        text: 'אין בעיה! אני אעזור לך לאפס את הסיסמה:',
        isBot: true,
        timestamp: new Date(),
        category: 'users',
        steps: troubleshootingSteps.users.steps,
        hasImage: true,
        imageUrl: troubleshootingSteps.users.image
      };
    }

    return {
      id: Date.now().toString(),
      text: 'תודה על השאלה! אני יכול לעזור לך עם:\n• בעיות קופה ומערכות POS\n• בעיות מדפסות וסורקים\n• בעיות רשת ואינטרנט\n• בעיות אשראי וכרטיסי אשראי\n• ניהול משתמשים וסיסמאות\n\nפשוט תאמר לי איך אוכל לעזור! 😊',
      isBot: true,
      timestamp: new Date(),
    };
  };

  const handleStepComplete = (messageId: string, stepIndex: number) => {
    toast({
      title: "שלב הושלם!",
      description: `השלב ${stepIndex + 1} סומן כהושלם`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl">טיפ - העוזר הטכני החכם</h3>
              <p className="text-blue-100 text-sm">מוכן לעזור לך לפתור כל תקלה!</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse'}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={message.isBot ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>
                        {message.isBot ? '🤖' : '👤'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`rounded-2xl p-4 ${
                      message.isBot 
                        ? 'bg-white border border-gray-200 shadow-sm' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      
                      {message.category && (
                        <Badge className="mt-2" variant="outline">
                          {message.category === 'credit-card' ? 'פתרון בעיות אשראי' : 
                           troubleshootingSteps[message.category as keyof typeof troubleshootingSteps]?.title}
                        </Badge>
                      )}
                      
                      {message.hasImage && message.imageUrl && (
                        <div className="mt-3">
                          <img 
                            src={message.imageUrl} 
                            alt="מדריך חזותי"
                            className="rounded-lg max-w-full h-auto"
                          />
                        </div>
                      )}

                      {message.image2Url && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">תמונה 2:</p>
                          <img 
                            src={message.image2Url} 
                            alt="מדריך חזותי - תמונה 2"
                            className="rounded-lg max-w-full h-auto"
                          />
                        </div>
                      )}

                      {message.hasVideo && message.videoUrl && (
                        <div className="mt-3">
                          <video 
                            controls 
                            className="rounded-lg max-w-full h-auto"
                            style={{ maxHeight: '300px' }}
                          >
                            <source src={message.videoUrl} type="video/mp4" />
                            הדפדפן שלך לא תומך בהצגת וידאו
                          </video>
                        </div>
                      )}

                      {message.flowOptions && (
                        <div className="mt-4 space-y-2">
                          {Object.entries(message.flowOptions).map(([option, nextNode]) => (
                            <Button
                              key={option}
                              variant="outline"
                              size="sm"
                              className="block w-full text-right"
                              onClick={() => handleFlowOption(message.currentFlowNode!, option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      {message.steps && (
                        <div className="mt-4 space-y-2">
                          {message.steps.map((step, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-6 h-6 p-0"
                                onClick={() => handleStepComplete(message.id, index)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString('he-IL')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-500 text-white">🤖</AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Quick Replies */}
          <div className="p-4 border-t bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto p-2 flex items-center gap-1"
                  onClick={() => handleSendMessage(reply.text)}
                >
                  <reply.icon className="w-3 h-3" />
                  {reply.text}
                </Button>
              ))}
            </div>
            
            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="תאמר לי איך אוכל לעזור לך..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={() => handleSendMessage()} className="px-6">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechSupportBot;
