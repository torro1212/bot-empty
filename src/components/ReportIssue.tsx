
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Upload, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
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
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      const ticketNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
      
      toast({
        title: "תקלה דווחה בהצלחה!",
        description: `מספר טיקט: ${ticketNumber}. נחזור אליך בקרוב.`,
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        issueType: '',
        priority: '',
        description: '',
        stepsAttempted: '',
        attachments: []
      });

      setIsSubmitting(false);
    }, 2000);
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">דיווח תקלה חדשה</h2>
        <p className="text-lg text-gray-600">
          לא הצלחת לפתור את הבעיה עם טיפ? דווח על התקלה ואנחנו נחזור אליך במהירות
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">תגובה מהירה</h3>
            <p className="text-sm text-gray-600">זמן תגובה ממוצע: 2 דקות</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">פתרון יעיל</h3>
            <p className="text-sm text-gray-600">95% מהבעיות נפתרות באותו יום</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Phone className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">תמיכה אישית</h3>
            <p className="text-sm text-gray-600">מעקב צמוד עד לפתרון מלא</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardTitle className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            פרטי התקלה
          </CardTitle>
          <CardDescription className="text-red-100">
            אנא מלא את כל השדות כדי שנוכל לעזור לך בצורה הטובה ביותר
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם מלא *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="הזן את שמך המלא"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">טלפון *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="050-1234567"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            {/* Issue Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueType">סוג התקלה *</Label>
                <Select value={formData.issueType} onValueChange={(value) => handleInputChange('issueType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג תקלה" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">עדיפות *</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר עדיפות" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <span className={priority.color}>{priority.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.priority && (
                  <p className="text-sm text-gray-600">
                    זמן תגובה משוער: <strong>{getEstimatedResponseTime(formData.priority)}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור התקלה *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="תאר את הבעיה בפירוט - מה קרה? מתי זה התחיל? איך זה משפיע על העבודה?"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stepsAttempted">מה ניסית לעשות?</Label>
              <Textarea
                id="stepsAttempted"
                value={formData.stepsAttempted}
                onChange={(e) => handleInputChange('stepsAttempted', e.target.value)}
                placeholder="תאר את הפעולות שכבר ביצעת לפתרון הבעיה (למשל: הפעלה מחדש, בדיקת כבלים וכו')"
                rows={3}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="attachments">צרף תמונות או וידאו (אופציונלי)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="attachments" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    לחץ לבחירת קבצים או גרור לכאן
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    תמונות ווידאו עד 10MB לכל קובץ
                  </p>
                </label>
              </div>
              
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">קבצים שנבחרו:</p>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        הסר
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'שולח...' : 'שלח דיווח תקלה'}
              </Button>
              <Button type="button" variant="outline" className="px-8">
                ביטול
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIssue;
