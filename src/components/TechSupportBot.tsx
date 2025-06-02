import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Settings, Printer, Wifi, Monitor, Users, HelpCircle, CheckCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CSSProperties } from 'react';

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
    borderTopRightRadius: '0.5rem',
    padding: '0.75rem 1.5rem'
  },
  botMessage: {
    backgroundColor: 'white',
    border: '1px solid #e0e7ff',
    color: '#1f2937',
    borderTopRightRadius: '1rem',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  userMessage: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    color: 'white',
    borderTopLeftRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  avatarBg: {
    backgroundColor: '#4f46e5'
  },
  stepsContainer: {
    backgroundColor: '#eef2ff',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #e0e7ff'
  },
  stepButton: {
    borderColor: '#e0e7ff'
  },
  quickReplyButton: {
    borderColor: '#e0e7ff'
  },
  sendButton: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  inputBorder: {
    borderColor: '#e0e7ff'
  }
};

// Hover and focus styles will be applied using className instead

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
      image: 'https://placehold.co/400x300/EEE/31343C'
    },
    printer: {
      title: 'פתרון בעיות מדפסת',
      steps: [
        'בדוק שיש נייר במדפסת ■',
        'ודא שהמדפסת מחוברת לחשמל ■',
        'בדוק שכבל USB/רשת מחובר ■',
        'נסה להדפיס דף בדיקה ■'
      ],
      image: 'https://placehold.co/400x300/EEE/31343C'
    },
    network: {
      title: 'פתרון בעיות רשת',
      steps: [
        'בדוק שהנתב דולק (נורות ירוקות) ■',
        'נתק ומחבר מחדש את כבל הרשת ■',
        'נסה להפעיל מחדש את הנתב ■',
        'בדוק עם ספק האינטרנט ■'
      ],
      image: 'https://placehold.co/400x300/EEE/31343C'
    },
    users: {
      title: 'איפוס סיסמה',
      steps: [
        'לחץ על "שכחתי סיסמה" במסך ההתחברות ■',
        'הזן את כתובת המייל שלך ■',
        'בדוק את תיבת המייל לקישור איפוס ■',
        'צור סיסמה חדשה ■'
      ],
      image: 'https://placehold.co/400x300/EEE/31343C'
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
      <Card style={styles.card} className="h-[500px] sm:h-[600px] flex flex-col">
        <CardHeader style={styles.cardHeader} className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 sm:w-6 sm:h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl">טיפ - העוזר הטכני החכם</h3>
              <p className="text-indigo-100 text-xs sm:text-sm">מוכן לעזור לך לפתור כל תקלה!</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-2 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    style={message.isBot ? styles.botMessage : styles.userMessage}
                    className="max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-4"
                  >
                    {message.isBot && (
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarFallback style={styles.avatarBg}>
                            <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          <span className="font-semibold text-sm sm:text-base">טיפ</span>
                          <Badge variant="outline" className="ml-2 text-xs border-indigo-200">בוט</Badge>
                        </div>
                      </div>
                    )}
                    
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
                    </div>

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
                      <div style={styles.stepsContainer} className="mt-3 space-y-2">
                        <h4 className="font-medium text-sm sm:text-base">{troubleshootingSteps[message.category as keyof typeof troubleshootingSteps]?.title}</h4>
                        <ul className="space-y-1 sm:space-y-2">
                          {message.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-5 w-5 sm:h-6 sm:w-6 rounded-full mt-0.5 hover:bg-indigo-100 hover:text-indigo-700"
                                style={{borderColor: '#e0e7ff'}}
                                onClick={() => handleStepComplete(message.id, index)}
                              >
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <span className="text-xs sm:text-sm">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString('he-IL')}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div style={styles.botMessage} className="max-w-[75%] rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarFallback style={styles.avatarBg}>
                          <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center">
                        <span className="font-semibold text-sm sm:text-base">טיפ</span>
                        <Badge variant="outline" className="ml-2 text-xs border-indigo-200">בוט</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-2 sm:p-4 border-t border-indigo-100 bg-white">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                {quickReplies.map((reply, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    className="text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3 hover:bg-indigo-50 hover:text-indigo-700"
                    style={{borderColor: '#e0e7ff'}}
                    onClick={() => handleSendMessage(reply.text)}
                  >
                    <reply.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {reply.text}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="הקלד את שאלתך כאן..."
                  className="flex-1 text-sm sm:text-base focus-visible:ring-indigo-500"
                  style={{borderColor: '#e0e7ff'}}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  onClick={() => handleSendMessage()} 
                  size="icon"
                  style={styles.sendButton}
                  className="hover:shadow-lg transition-shadow"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechSupportBot;
