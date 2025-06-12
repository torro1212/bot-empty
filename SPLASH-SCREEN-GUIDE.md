# מדריך לדפי המקדים (Splash Screen)

## מה זה?
דף מקדים הוא הדף הראשון שמוצג למשתמש כשהוא נכנס לאתר, לפני שהוא רואה את התוכן הראשי. הוא יכול להציג את הלוגו של החברה עם אנימציות יפות ומרשימות.

## איך להשתמש?

### שלב 1: הוספת הלוגו שלך
1. העתק את קובץ הלוגו שלך לתיקייה `public/`
2. עדכן את הנתיב ב-`App.tsx`:
```jsx
logoUrl="/הנתיב-ללוגו-שלך.png" // במקום "/placeholder.svg"
```

### שלב 2: בחירת סגנון אנימציה
יש לך 5 סגנונות לבחירה:

#### 1. `gradient` - גרדיאנט צבעוני
```jsx
<SplashScreenVariations 
  variant="gradient"
  onComplete={handleSplashComplete}
  logoUrl="/הלוגו-שלך.png"
/>
```
- רקע גרדיאנט מתחלף
- לוגו מסתובב בכניסה
- כפתור "כנס לאתר"

#### 2. `particles` - חלקיקים מרחפים
```jsx
<SplashScreenVariations 
  variant="particles"
  onComplete={handleSplashComplete}
  logoUrl="/הלוגו-שלך.png"
/>
```
- חלקיקים מרחפים ברקע
- לוגו מסתובב ברציפות
- טקסט: "הכנו משהו מיוחד בשבילכם"

#### 3. `minimalist` - מינימליסטי
```jsx
<SplashScreenVariations 
  variant="minimalist"
  onComplete={handleSplashComplete}
  logoUrl="/הלוגו-שלך.png"
/>
```
- עיצוב נקי ופשוט
- רקע לבן
- קו מתארך מתחת לטקסט

#### 4. `rotating` - עיגולים מסתובבים
```jsx
<SplashScreenVariations 
  variant="rotating"
  onComplete={handleSplashComplete}
  logoUrl="/הלוגו-שלך.png"
/>
```
- עיגולים מסתובבים ברקע
- לוגו עם אפקט הגדלה
- כפתור צבעוני עם אימוג'י

#### 5. `brands` - מותגי אופנה מובילים
```jsx
<SplashScreenVariations 
  variant="brands"
  onComplete={handleSplashComplete}
/>
```
- מציג את כל הלוגואים של מותגי האופנה המובילים
- המותגים מתחלפים במרכז כל 1.5 שניות
- לוגואים מרחפים ברקע עם אנימציות
- רקע גרדיאנט מתחלף בצבעים
- טקסט: "אופנה ללא גבולות - המותגים המובילים בעולם במקום אחד"

### שלב 3: התאמה אישית

#### שינוי זמן התצוגה
בקובץ `SplashScreenVariations.tsx`, שנה את הזמן (במילישניות):
```jsx
const timer = setTimeout(() => {
  setIsVisible(false);
  setTimeout(onComplete, 500);
}, 4000); // 4 שניות - שנה את המספר הזה
```

#### שינוי טקסטים
כל וריאציה יכולה להתאים אישית:
- שנה את הטקסט "ברוכים הבאים" לכל טקסט שתרצה
- שנה את טקסט הכפתור
- הוסף טקסטים נוספים

#### שינוי צבעים
כל וריאציה יש לה צבעים שונים שאתה יכול לשנות:
- `from-purple-900 via-blue-900 to-indigo-900` - לחלקיקים
- `from-cyan-500 to-blue-500` - לעיגולים מסתובבים
- `#667eea, #764ba2` - לגרדיאנט

### שלב 4: ביטול הדף המקדים
אם אתה רוצה לבטל את הדף המקדים זמנית, ב-`App.tsx`:
```jsx
const [showSplash, setShowSplash] = useState(false); // שנה ל-false
```

## טיפים להתאמה אישית

### הוספת צלילים
```jsx
useEffect(() => {
  const audio = new Audio('/sound.mp3');
  audio.play();
}, []);
```

### הוספת אפקטים נוספים
```jsx
// הוספת רעידות לטלפון
if (navigator.vibrate) {
  navigator.vibrate(200);
}
```

### שמירת העדפת המשתמש
```jsx
// אם המשתמש כבר ראה את הדף המקדים
const hasSeenSplash = localStorage.getItem('hasSeenSplash');
const [showSplash, setShowSplash] = useState(!hasSeenSplash);

const handleSplashComplete = () => {
  setShowSplash(false);
  localStorage.setItem('hasSeenSplash', 'true');
};
```

## בעיות נפוצות ופתרונות

### הלוגו לא נטען
- ודא שהקובץ נמצא בתיקייה `public/`
- ודא שהנתיב נכון (עם `/` בהתחלה)
- בדוק שהקובץ לא פגום

### האנימציה לא חלקה
- ודא ש-`framer-motion` מותקן: `npm install framer-motion`
- בדוק שאין שגיאות ב-console

### הדף לא נעלם
- בדוק שהפונקציה `onComplete` מתבצעת
- ודא שאין שגיאות JavaScript

### התצוגה לא טובה במובייל
- כל הווריאציות מותאמות למובייל
- אם יש בעיה, בדוק את התצוגה ב-DevTools

## דוגמאות שימוש

### לעסק רגיל
```jsx
<SplashScreenVariations 
  variant="minimalist"
  logoUrl="/business-logo.png"
/>
```

### לאפליקציה צעירה
```jsx
<SplashScreenVariations 
  variant="particles"
  logoUrl="/app-logo.png"
/>
```

### לחברת טכנולוgiה
```jsx
<SplashScreenVariations 
  variant="rotating"
  logoUrl="/tech-logo.png"
/>
```

### לחנות אופנה
```jsx
<SplashScreenVariations 
  variant="brands"
/>
```

זה הכל! עכשיו יש לך דף מקדים מרשים עם האנימציות הכי יפות 🚀 