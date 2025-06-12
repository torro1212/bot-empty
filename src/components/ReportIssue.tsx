import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Upload, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';

// EmailJS configuration
// You need to create an account at https://www.emailjs.com/
// And set up a Gmail service and email template
const EMAILJS_SERVICE_ID = 'default_service'; // שימוש בשירות ברירת המחדל
const EMAILJS_TEMPLATE_ID = 'template_94n4ms8'; // Replace with your template ID
const EMAILJS_PUBLIC_KEY = '6RjrhWpav2fs1C9Dq'; // Replace with your public key
const RECIPIENT_EMAIL = 'Support@Mutagim.com'; // Replace with the email you want to send to

// מותגים וסניפים
const brandsAndStores = {
  'ZARA': [
    'מילנו', 'קוק התרן', 'מלחה', 'בת אביב', 'דיזינגוף', 'איילון', 'חולון', 'קריון',
    'באר שבע', 'חיפה גרנד', 'פתח תקווה', 'איילת', 'רחובות', 'אשדוד', 'רעננה',
    'עזריאלי', 'עיר ימים', 'באר שבע גרנד', 'שברת', 'לפי סבא', 'TLV', 'הדריה',
    'מודיעין', 'גלילות BIG'
  ],
  'ZARA-HOME': [
    'TLV', 'גלילות BIG', 'BIG אשדוד'
  ],
  'PULL & BEAR': [
    'רחובות', 'מלחה', 'דיזינגוף', 'אשדוד', 'עזריאלי', 'חיפה גרנד', 'קריון',
    'מודיעין', 'איילון', 'שברת', 'פתח תקווה', 'איילת', 'באר שבע גרנד', 'TLV',
    'חשמונאים', 'חולון', 'הדריה', 'נתצרת', 'עיר ימים', 'בן יהודה', 'BIG אשדוד',
    'BIG גלילות'
  ],
  'MASSIMO': [
    'TLV', 'BIG גלילות'
  ],
  'LEFTIES': [
    'הדריה', 'באר שבע גרנד'
  ],
  'BERSHKA': [
    'איילון', 'רחובות', 'באר שבע גרנד', 'פתח תקווה', 'חיפה גרנד', 'קוק התרן',
    'קריון', 'TLV', 'אשדוד', 'עזריאלי', 'שברת', 'הדריה', 'בת ש"ן', 'איילת',
    'עמונה'
  ],
  'STRADIVARIUS': [
    'עזריאלי', 'איילון', 'אשדוד', 'באר שבע גרנד', 'חשמונאים', 'עיר ימים',
    'פתח תקווה', 'הדריה', 'איילת', 'רעננה', 'מלחה', 'קוק התרן', 'דיזינגוף',
    'פי"פ', 'BIG גלילות', 'BIG אשדוד', 'עמונה'
  ],
  'שסף': [
    'BIG גלילות'
  ]
};

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    brand: '',
    store: '',
    issueType: '',
    priority: '',
    description: '',
    stepsAttempted: '',
    attachments: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const issueTypes = [
    { value: 'pos', label: 'בעיות קופה (POS)' },
    { value: 'printer', label: 'בעיות מדפסת/סורק' },
    { value: 'network', label: 'בעיות רשת/אינטרנט' },
    { value: 'users', label: 'בעיות משתמשים/גישה' },
    { value: 'software', label: 'בעיות תוכנה' },
    { value: 'hardware', label: 'בעיות חומרה' },
    { value: 'other', label: 'אחר' }
  ];

  const priorities = [
    { value: 'low', label: 'נמוכה - לא משפיע על העבודה', color: 'text-green-600' },
    { value: 'medium', label: 'בינונית - משפיע חלקית', color: 'text-yellow-600' },
    { value: 'high', label: 'גבוהה - משפיע משמעותית', color: 'text-orange-600' },
    { value: 'critical', label: 'קריטית - עוצר עבודה', color: 'text-red-600' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      // אם המותג משתנה, נאפס את הסניף
      if (field === 'brand') {
        return { ...prev, [field]: value, store: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // קבלת הסניפים הזמינים לפי המותג הנבחר
  const getAvailableStores = () => {
    return formData.brand ? brandsAndStores[formData.brand as keyof typeof brandsAndStores] || [] : [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get issue type label
    const issueTypeLabel = issueTypes.find(type => type.value === formData.issueType)?.label || formData.issueType;
    
    // Get priority label
    const priorityLabel = priorities.find(priority => priority.value === formData.priority)?.label || formData.priority;

    try {
      // Prepare template parameters
      const templateParams = {
        to_email: RECIPIENT_EMAIL,
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        brand: formData.brand || 'לא צוין',
        store: formData.store || 'לא צוין',
        issue_type: issueTypeLabel,
        priority: priorityLabel,
        description: formData.description,
        steps_attempted: formData.stepsAttempted || 'לא צוינו צעדים קודמים',
        attachments_info: formData.attachments.length > 0 
          ? `צורפו ${formData.attachments.length} קבצים` 
          : 'לא צורפו קבצים',
        subject: `דיווח תקלה חדשה: ${formData.brand} - ${formData.store} (${priorityLabel})`,
        response_time: getEstimatedResponseTime(formData.priority)
      };

      // Initialize EmailJS with your public key
      emailjs.init(EMAILJS_PUBLIC_KEY);
      
      // Send the email
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      console.log('Email sent successfully:', result);
      toast({
        title: 'דיווח נשלח בהצלחה!',
        description: 'התקלה דווחה ותטופל בקרוב.',
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        phone: '',
        email: '',
        brand: '',
        store: '',
        issueType: '',
        priority: '',
        description: '',
        stepsAttempted: '',
        attachments: []
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'שגיאה בשליחה',
        description: 'לא הצלחנו לשלוח את הדיווח. נסה שוב.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEstimatedResponseTime = (priority: string) => {
    switch(priority) {
      case 'critical': return '15 דקות';
      case 'high': return '1 שעה';
      case 'medium': return '4 שעות';
      case 'low': return '24 שעות';
      default: return 'לא צוין';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">דיווח תקלה חדשה</h2>
        <p className="text-base sm:text-lg text-gray-600">
          לא הצלחת לפתור את הבעיה עם טיפ? דווח על התקלה ואנחנו נחזור אליך במהירות
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
        <Card className="text-center">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-1 sm:mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">תגובה מהירה</h3>
            <p className="text-xs sm:text-sm text-gray-600">זמן תגובה ממוצע: 2 דקות</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-1 sm:mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">פתרון יעיל</h3>
            <p className="text-xs sm:text-sm text-gray-600">95% מהבעיות נפתרות באותו יום</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-1 sm:mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">תמיכה אישית</h3>
            <p className="text-xs sm:text-sm text-gray-600">מעקב צמוד עד לפתרון מלא</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6" />
            פרטי התקלה
          </CardTitle>
          <CardDescription className="text-red-100 text-xs sm:text-sm">
            אנא מלא את כל השדות כדי שנוכל לעזור לך בצורה הטובה ביותר
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="name" className="text-xs sm:text-sm">שם מלא *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="הזן את שמך המלא"
                  required
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="phone" className="text-xs sm:text-sm">טלפון *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="050-1234567"
                  required
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className="text-sm"
              />
            </div>

            {/* Brand and Store Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="brand" className="text-xs sm:text-sm">מותג *</Label>
                <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="בחר מותג" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(brandsAndStores).map((brand) => (
                      <SelectItem key={brand} value={brand} className="text-sm">
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="store" className="text-xs sm:text-sm">סניף *</Label>
                <Select 
                  value={formData.store} 
                  onValueChange={(value) => handleInputChange('store', value)}
                  disabled={!formData.brand}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={formData.brand ? "בחר סניף" : "בחר מותג תחילה"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableStores().map((store) => (
                      <SelectItem key={store} value={store} className="text-sm">
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Issue Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="issueType" className="text-xs sm:text-sm">סוג התקלה *</Label>
                <Select value={formData.issueType} onValueChange={(value) => handleInputChange('issueType', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="בחר סוג תקלה" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-sm">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="priority" className="text-xs sm:text-sm">דחיפות *</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="בחר דחיפות" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value} className={`${priority.color} text-sm`}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.priority && (
                  <p className="text-xs text-gray-500 mt-1">
                    זמן תגובה משוער: <span className="font-medium">{getEstimatedResponseTime(formData.priority)}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">תיאור התקלה *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="תאר את התקלה בפירוט רב ככל האפשר"
                required
                className="min-h-[100px] text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="stepsAttempted" className="text-xs sm:text-sm">צעדים שכבר ניסית</Label>
              <Textarea
                id="stepsAttempted"
                value={formData.stepsAttempted}
                onChange={(e) => handleInputChange('stepsAttempted', e.target.value)}
                placeholder="פרט אילו פתרונות כבר ניסית"
                className="min-h-[80px] text-sm"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="attachments" className="text-xs sm:text-sm">צרף קבצים (תמונות/מסמכים)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs sm:text-sm h-8 sm:h-10"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  בחר קבצים
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <span className="text-xs text-gray-500">מקסימום 5 קבצים, עד 5MB לקובץ</span>
              </div>
              
              {formData.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-xs truncate max-w-[200px]">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeFile(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 sm:pt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'שולח...' : 'שלח דיווח תקלה'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-4 sm:mt-8 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          צריך עזרה דחופה? התקשר למוקד התמיכה: <a href="tel:+972501234567" className="text-blue-600 font-medium">050-1234567</a>
        </p>
      </div>
    </div>
  );
};

export default ReportIssue;
