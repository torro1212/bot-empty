# רשימת המשימות להגדרת EmailJS 📧

## ✅ שלבים שצריך לבצע:

### 1. יצירת חשבון EmailJS
- [ ] עבור לאתר: https://www.emailjs.com
- [ ] צור חשבון חדש (חינם)
- [ ] התחבר לחשבון

### 2. הגדרת שירות Gmail
- [ ] לך ל-"Email Services" 
- [ ] לחץ "Add Service"
- [ ] בחר "Gmail"
- [ ] חבר את חשבון ה-Gmail שלך
- [ ] **שמור את ה-Service ID** (דומה ל-service_abc123)

### 3. יצירת תבניות מייל

#### תבנית לדיווח תקלות:
- [ ] לך ל-"Email Templates"
- [ ] צור תבנית חדשה: "Issue Report Template"
- [ ] הוסף את התוכן:
```
Subject: דיווח תקלה חדשה: {{brand}} - {{branch_name}}

שם: {{from_name}}
טלפון: {{from_phone}}
מותג: {{brand}}
סניף: {{branch_name}}
מספר קופה: {{register_number}}

פירוט התקלה:
{{description}}
```
- [ ] **שמור את ה-Template ID** (דומה ל-template_xyz789)

#### תבנית למשוב:
- [ ] צור תבנית נוספת: "Feedback Template"
- [ ] הוסף את התוכן:
```
Subject: משוב חדש מהאתר - דירוג: {{rating}}/5

שם: {{from_name}}
דירוג: {{rating}}/5
בהירות: {{clarity}}

הערות:
{{comments}}
```
- [ ] **שמור את ה-Template ID השני** (דומה ל-template_feedback456)

### 4. קבלת Public Key
- [ ] לך ל-"Account"
- [ ] **העתק את ה-Public Key** (דומה ל-user_abcdef123456)

### 5. עדכון הקוד

#### עדכן בקובץ `src/pages/Index.tsx`:
```typescript
const EMAILJS_SERVICE_ID = 'השם את ה-Service ID כאן';
const EMAILJS_TEMPLATE_ID = 'השם את Template ID לתקלות כאן';
const EMAILJS_FEEDBACK_TEMPLATE_ID = 'השם את Template ID למשוב כאן';
const EMAILJS_PUBLIC_KEY = 'השם את ה-Public Key כאן';
const RECIPIENT_EMAIL = 'השם את המייל שלך כאן';
```

#### עדכן בקובץ `src/lib/config.ts`:
```typescript
export const EMAIL_CONFIG = {
  SERVICE_ID: 'השם את ה-Service ID כאן',
  TEMPLATE_ID: 'השם את Template ID לתקלות כאן',
  FEEDBACK_TEMPLATE_ID: 'השם את Template ID למשוב כאן',
  PUBLIC_KEY: 'השם את ה-Public Key כאן',
  RECIPIENT_EMAIL: 'השם את המייל שלך כאן'
};
```

### 6. בדיקה
- [ ] שמור את הקבצים
- [ ] הפעל את האפליקציה: `npm run dev`
- [ ] נסה לשלוח טופס דיווח תקלה
- [ ] נסה לשלוח טופס משוב
- [ ] בדוק שהמיילים מגיעים לתיבת הדואר שלך

## 🔧 אם משהו לא עובד:

1. **בדוק את הקונסול** - יהיו שגיאות מפורטות שם
2. **בדוק תיבת הספאם** - מיילים ראשונים עלולים להגיע לשם
3. **ודא שכל ה-IDs נכונים** - Service ID, Template IDs, Public Key
4. **ודא שהתבניות שמורות** ב-EmailJS

## 📝 הערות חשובות:

- **EmailJS חינם עד 200 מיילים בחודש**
- **ה-Public Key בטוח לחשיפה** - הוא מיועד לשימוש בצד הלקוח
- **מצב הדגמה כבוי** - האפליקציה תשלח מיילים אמיתיים
- **המיילים ישלחו מחשבון ה-Gmail שלך**

## 🆘 צריך עזרה?

אם אתה נתקל בבעיות, בדוק את המדריך המלא בקובץ `EmailJS-Setup-Guide.md` 