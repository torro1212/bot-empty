import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import emailjs from '@emailjs/browser';

// בדיקה עם קונפיגורציה ישירה
const SERVICE_ID = 'service_1u9y5e1';  // נסיון עם ID שירות חדש 
const TEMPLATE_ID = 'template_94n4ms8';
const PUBLIC_KEY = '6RjrhWpav2fs1C9Dq';
const RECIPIENT_EMAIL = 'Support@Mutagim.com';

const EmailTest = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState<any>(null);
  
  const sendTestEmail = async () => {
    setStatus('sending');
    setErrorMessage('');
    setResponse(null);
    
    try {
      console.log('בדיקת איתחול EmailJS');
      emailjs.init(PUBLIC_KEY);
      console.log('EmailJS initialized successfully');
      
      const templateParams = {
        to_email: RECIPIENT_EMAIL,
        from_name: 'בדיקת מערכת',
        from_phone: '000-000-0000',
        brand: 'בדיקה',
        branch_name: 'בדיקה',
        register_number: '0000',
        description: 'זוהי הודעת בדיקה מ-EmailTest.tsx',
        subject: 'בדיקת EmailJS'
      };
      
      console.log('שולח בדיקת מייל עם הפרמטרים:', templateParams);
      console.log('Service ID:', SERVICE_ID);
      console.log('Template ID:', TEMPLATE_ID);
      
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );
      
      console.log('Email sent successfully!', result);
      setStatus('success');
      setResponse(result);
    } catch (error) {
      console.error('Error sending test email:', error);
      setStatus('error');
      if (error instanceof Error) {
        setErrorMessage(error.message);
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      } else {
        setErrorMessage('שגיאה לא ידועה');
      }
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="bg-blue-500 text-white">
        <CardTitle className="text-center">בדיקת EmailJS</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center">
          <Button 
            onClick={sendTestEmail} 
            disabled={status === 'sending'}
            className="mb-4"
          >
            {status === 'sending' ? 'שולח...' : 'שלח מייל בדיקה'}
          </Button>
          
          {status === 'success' && (
            <div className="p-4 bg-green-100 text-green-800 rounded-md mt-4">
              <p className="font-bold">המייל נשלח בהצלחה!</p>
              <pre className="mt-2 text-sm text-left bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
          
          {status === 'error' && (
            <div className="p-4 bg-red-100 text-red-800 rounded-md mt-4">
              <p className="font-bold">שגיאה בשליחת המייל</p>
              <p className="mt-2">{errorMessage}</p>
            </div>
          )}
          
          <div className="mt-4 text-left text-sm text-gray-600">
            <p className="font-bold mb-2">הגדרות נוכחיות:</p>
            <p>Service ID: {SERVICE_ID}</p>
            <p>Template ID: {TEMPLATE_ID}</p>
            <p>Public Key: {PUBLIC_KEY}</p>
            <p>Recipient Email: {RECIPIENT_EMAIL}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTest; 