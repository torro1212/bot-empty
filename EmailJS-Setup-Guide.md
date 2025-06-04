# מדריך הגדרת EmailJS עם Gmail

## שלב 1: יצירת חשבון EmailJS

1. **עבור לאתר EmailJS**:
   - פתח את הדפדפן ועבור לאתר: https://www.emailjs.com
   - לחץ על "Sign Up Free"
   - צור חשבון חדש עם המייל שלך

## שלב 2: הגדרת שירות Gmail 

1. **הוספת Email Service**:
   - בחשבון EmailJS, לך לעמוד "Email Services"
   - לחץ על "Add Service"
   - בחר "Gmail" מהרשימה
   - תן לשירות שם (למשל "Gmail Service")
   - לחץ על "Connect Account" וחבר את חשבון ה-Gmail שלך
   - שמור את ה-**Service ID** שיוצג (תצטרך אותו בקוד)

## שלב 3: יצירת תבניות מייל

### תבנית לדיווח תקלות:
1. לך לעמוד "Email Templates"
2. לחץ על "Create New Template"
3. תן שם לתבנית: "Issue Report Template"
4. הוסף את התוכן הבא:

```
Subject: דיווח תקלה חדשה: {{brand}} - {{branch_name}}

From: {{from_name}} <{{from_email}}>
Phone: {{from_phone}}
Brand: {{brand}}
Branch: {{branch_name}}
Register Number: {{register_number}}

Issue Description:
{{description}}

---
This email was sent from your website contact form.
```

5. שמור את התבנית ושמור את ה-**Template ID**

### תבנית למשוב:
1. צור תבנית נוספת: "Feedback Template"
2. הוסף את התוכן הבא:

```
Subject: משוב חדש מהאתר - דירוג: {{rating}}/5

From: {{from_name}}
Rating: {{rating}}/5
Clarity: {{clarity}}

Comments:
{{comments}}

---
This feedback was sent from your website.
```

3. שמור את התבנית ושמור את ה-**Template ID**

## שלב 4: קבלת Public Key

1. בחשבון EmailJS, לך לעמוד "Account"
2. חפש את ה-"Public Key"
3. העתק את המפתח (יהיה דומה ל-"user_xxxxxxxxx")

## שלב 5: עדכון הקוד

עכשיו עדכן את הקבועים בקובץ `src/pages/Index.tsx`:

```typescript
// EmailJS configuration - החלף עם הפרטים שלך מ-EmailJS
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // החלף עם ה-Service ID מהשלב 2
const EMAILJS_TEMPLATE_ID = 'YOUR_ISSUE_TEMPLATE_ID'; // החלף עם Template ID של תבנית התקלות
const EMAILJS_FEEDBACK_TEMPLATE_ID = 'YOUR_FEEDBACK_TEMPLATE_ID'; // החלף עם Template ID של תבנית המשוב
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // החלף עם ה-Public Key מהשלב 4
const RECIPIENT_EMAIL = 'your-email@gmail.com'; // החלף עם המייל שלך שאליו ישלח
```

### דוגמה מלאה:
```typescript
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_ID = 'template_xyz789';
const EMAILJS_FEEDBACK_TEMPLATE_ID = 'template_feedback456';
const EMAILJS_PUBLIC_KEY = 'user_abcdef123456';
const RECIPIENT_EMAIL = 'my-email@gmail.com';
```

## שלב 6: בדיקת התקנה

1. שמור את הקובץ
2. הפעל את האפליקציה: `npm run dev`
3. נסה לשלוח טופס דיווח תקלה או משוב
4. בדוק שהמייל הגיע לתיבת הדואר שלך

## טיפים חשובים:

1. **זכור לכבות את מצב ההדגמה**: במשתנה `DEMO_MODE` בקובץ `src/lib/config.ts` - שנה אותו ל-`false`
2. **בדוק תיבת הספאם**: מיילים ראשונים עלולים להגיע לספאם
3. **גבולות שליחה**: EmailJS מאפשר 200 מיילים חינם בחודש
4. **אבטחה**: ה-Public Key בטוח לחשיפה - הוא מיועד לשימוש בצד הלקוח

## פתרון בעיות נפוצות:

### שגיאת "Invalid user ID":
- ודא שה-Public Key נכון
- ודא שאתחלת את emailjs.init() עם המפתח הנכון

### שגיאת "Invalid service ID":
- בדוק שה-Service ID נכון
- ודא שהשירות פעיל בחשבון EmailJS

### שגיאת "Invalid template ID":
- בדוק שה-Template ID נכון
- ודא שהתבנית שמורה ופעילה

### המייל לא מגיע:
- בדוק תיבת הספאם
- ודא שהמייל הנמען נכון
- בדוק את הקונסול לשגיאות JavaScript

## תמיכה נוספת:

אם אתה נתקל בבעיות, תוכל:
1. לבדוק את התיעוד של EmailJS: https://www.emailjs.com/docs/
2. להריץ בדיקות בסביבת הפיתוח
3. לבדוק את הקונסול לשגיאות מפורטות 