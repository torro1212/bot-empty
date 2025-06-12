# מדריך מערכת מעקב לחיצות וזמן - BOTEX

## סקירה כללית
מערכת מעקב מתקדמת שמתעדת לחיצות ומודדת זמן פעילות משתמשים באתר BOTEX:
- **בעיות קופה** (ID: kupa)
- **בעיות אשראי** (ID: ashrai) 
- **בעיות חולץ** (ID: holetz)

## תכונות המערכת

### 📊 מעקב לחיצות
- **זמן לחיצה מדויק** - תאריך ושעה בפורמט ISO
- **מזהה סשן ייחודי** - מעקב אחר משתמשים בין הפעלות
- **מידע טכני** - User Agent, URL, מידע דפדפן
- **קטגוריזציה** - סיווג לחיצות לפי סוג

### ⏱️ מעקב זמן (חדש!)
- **מדידת זמן פתרון** - מהתחלה ועד סיום
- **זמן ממוצע** - חישוב ממוצע זמן פתרון
- **זמנים מינימלי ומקסימלי** - טווח זמני פתרון
- **סטטיסטיקות מתקדמות** - פילוח לפי סוג פעולה ויום
- **נקודות סיום מרובות** - מעקב אחר כל דרכי הסיום:
  - ✅ פתרון הושלם + שליחת משוב
  - ❌ פתרון הושלם + לא רוצה משוב
  - 📧 שליחת דיווח תקלה
  - 🚫 ביטול דיווח תקלה
  - ❌ סגירת טופס משוב

### 💾 שמירת נתונים
- **LocalStorage** - שמירה מקומית בדפדפן (עד 1000 לחיצות ו-500 מדידות זמן)
- **SessionStorage** - מעקב זמן זמני (נמחק כשהכרטיסייה נסגרת)
- **Google Analytics** - שליחה אוטומטית (אם מוגדר)
- **🆕 Google Sheets** - שמירה אוטומטית בגיליונות נפרדים:
  - `BOTEX Analytics - לחיצות` - כל נתוני הלחיצות
  - `BOTEX Analytics - זמנים` - כל מדידות הזמן
  - `סטטיסטיקות משולבות` - דוח מסכם אוטומטי
- **מערכת פנימית** - API endpoint `/api/track-click`
- **Console Logging** - לוגים מפורטים לפיתוח

### 📈 דשבורד אנליטיקס מעודכן
- **סטטיסטיקות לחיצות** - סה"כ לחיצות, סשנים ייחודיים
- **סטטיסטיקות זמן** - זמנים ממוצעים, מינימליים ומקסימליים
- **פילוח לפי כפתור** - איזה כפתור הכי פופולרי
- **פילוח לפי יום** - מגמות לאורך זמן
- **מדידות זמן אחרונות** - רשימה של 20 המדידות האחרונות
- **לחיצות אחרונות** - רשימה של 20 הלחיצות האחרונות

## איך זה עובד

### 1. מעקב אוטומטי - לחיצות
כל לחיצה על אחד משלושת הכפתורים מפעילה:
```typescript
trackButtonClick(buttonId, buttonName, 'main_buttons')
```

### 2. מעקב אוטומטי - זמן (חדש!)
התחלת מעקב זמן:
```typescript
startUserTimer('start_button', buttonId)
```

סיום מעקב זמן:
```typescript
endUserTimer(sessionId, 'solution_complete')
```

### 3. איסוף נתונים מורחב
המערכת אוספת נתוני לחיצות:
```typescript
{
  buttonId: 'kupa' | 'ashrai' | 'holetz',
  buttonName: 'בעיות קופה' | 'בעיות אשראי' | 'בעיות חולץ',
  timestamp: '2024-01-15T10:30:45.123Z',
  userAgent: 'Mozilla/5.0...',
  url: 'https://botex.com',
  sessionId: 'session_1705312245123_abc123def',
  category: 'main_buttons'
}
```

ונתוני זמן:
```typescript
{
  sessionId: 'session_1705312245123_abc123def',
  startTime: '2024-01-15T10:30:00.000Z',
  endTime: '2024-01-15T10:32:30.500Z',
  duration: 150500, // במילישניות
  actionType: 'start_button' | 'solution_complete',
  buttonId: 'kupa',
  completed: true,
  userAgent: 'Mozilla/5.0...',
  url: 'https://botex.com'
}
```

### 4. שליחה למערכות
- ✅ **Console** - תמיד פעיל לפיתוח
- ✅ **LocalStorage** - שמירה מקומית מיידית
- ✅ **SessionStorage** - מעקב זמן זמני
- ⚠️ **Google Analytics** - רק אם gtag מוגדר
- ✅ **Google Sheets** - שמירה אוטומטית אם URL מוגדר
- ⚠️ **API פנימי** - רק אם הendpoint קיים

## פונקציות זמינות - מעקב זמן

### התחלת מעקב זמן
```javascript
import { startUserTimer } from '@/utils/analytics';

// התחלת מעקב כשמשתמש לוחץ על כפתור
const sessionId = startUserTimer('start_button', 'kupa');
```

### סיום מעקב זמן
```javascript
import { endUserTimer, formatDuration } from '@/utils/analytics';

// סיום מעקב והחזרת הזמן
const timing = endUserTimer(sessionId, 'solution_complete');
if (timing?.duration) {
  console.log(`זמן פתרון: ${formatDuration(timing.duration)}`);
}
```

### קבלת נתוני זמן
```javascript
import { getAllTimings, getTimingStatistics } from '@/utils/analytics';

// כל מדידות הזמן
const timings = getAllTimings();

// סטטיסטיקות מסוכמות
const stats = getTimingStatistics();
console.log('זמן ממוצע:', formatDuration(stats.averageDuration));
```

### ניהול נתוני זמן
```javascript
import { clearTimingData, exportTimingData } from '@/utils/analytics';

// ניקוי כל נתוני הזמן
clearTimingData();

// ייצוא לקובץ JSON
exportTimingData();
```

### פורמט זמן
```javascript
import { formatDuration } from '@/utils/analytics';

// המרת מילישניות לפורמט קריא
const readable = formatDuration(150500); // "2ד 30ש"
```

## דוגמאות שימוש מתקדמות

### 1. בדיקת זמן פתרון ממוצע
```javascript
const stats = getTimingStatistics();
console.log(`זמן פתרון ממוצע: ${formatDuration(stats.averageDuration)}`);
console.log(`זמן מינימלי: ${formatDuration(stats.minDuration)}`);
console.log(`זמן מקסימלי: ${formatDuration(stats.maxDuration)}`);
```

### 2. מעקב אחר משתמשים איטיים
```javascript
const timings = getAllTimings();
const slowSessions = timings.filter(t => t.duration && t.duration > 300000); // יותר מ-5 דקות
console.log(`סשנים איטיים: ${slowSessions.length}`);
```

### 3. ניתוח מגמות יומיות
```javascript
const stats = getTimingStatistics();
Object.entries(stats.byDay).forEach(([day, totalTime]) => {
  const avgTimePerDay = totalTime / stats.totalSessions;
  console.log(`${day}: ממוצע ${formatDuration(avgTimePerDay)}`);
});
```

### 4. השוואת כפתורים
```javascript
const stats = getTimingStatistics();
Object.entries(stats.byActionType).forEach(([action, totalTime]) => {
  console.log(`${action}: זמן כולל ${formatDuration(totalTime)}`);
});
```

## גישה לדשבורד

### במצב פיתוח (Development)
כפתור "📊 אנליטיקס" מופיע בפינה השמאלית התחתונה

### במצב פרודקשן
הדשבורד מוסתר אוטומטית. לגישה:
1. פתח Developer Tools (F12)
2. הקלד בConsole:
```javascript
// הצגת הדשבורד
document.querySelector('[data-analytics-trigger]')?.click();

// או ישירות:
window.showAnalyticsDashboard = true;
```

### רצף מקשים סודי
הקלד "analytics" באתר כדי לפתוח את הדשבורד

## סטטיסטיקות מעקב זמן - דוגמה

```json
{
  "totalSessions": 25,
  "averageDuration": 125000,
  "minDuration": 30000,
  "maxDuration": 300000,
  "completedSessions": 23,
  "byActionType": {
    "start_button": 2850000,
    "solution_complete": 2850000
  },
  "byDay": {
    "2024-01-15": 450000,
    "2024-01-14": 380000,
    "2024-01-13": 420000
  }
}
```

## אבטחה ופרטיות

### מידע שנשמר
- ✅ **ID כפתור** - מזהה טכני בלבד
- ✅ **זמני פעילות** - לצורכי אנליטיקס ושיפור חוויה
- ✅ **מזהה סשן** - אנונימי, ללא זיהוי אישי
- ❌ **מידע אישי** - לא נשמר כלל

### GDPR ופרטיות
- המערכת לא אוספת מידע אישי מזהה
- כל הנתונים אנונימיים
- המשתמש יכול לנקות נתונים בכל עת
- שמירה מקומית בלבד (אלא אם הוגדר אחרת)
- מעקב זמן נמחק אוטומטית כשהכרטיסייה נסגרת

## לוגים לפיתוח

### מעקב זמן
```
⏱️ התחלת מעקב זמן עבור: start_button kupa
✅ מעקב זמן התחיל: { sessionId: "...", startTime: "..." }

# דרכי סיום שונות:
🏁 מסיים מעקב זמן - פתרון הושלם (+ משוב)
🏁 מסיים מעקב זמן - לא רוצה לתת משוב
🏁 מסיים מעקב זמן - דיווח תקלה נשלח
🏁 מסיים מעקב זמן - ביטול דיווח תקלה
🏁 מסיים מעקב זמן - סגירת טופס משוב

✅ מעקב זמן הושלם: { duration: "2ד 30ש", durationMs: 150000 }
```

### מעקב לחיצות
```
🔍 מעקב לחיצת כפתור: {
  buttonId: "kupa",
  buttonName: "בעיות קופה",
  timestamp: "2024-01-15T14:30:22.456Z"
}
```

## שימוש מתקדם

### אינטגרציה עם Google Analytics
```javascript
// הוספת אירועי זמן מותאמים
gtag('event', 'timing_complete', {
  'event_category': 'user_flow',
  'name': 'solution_time',
  'value': timing.duration
});
```

### שליחה לשרת מותאם
```javascript
// API endpoint מותאם למעקב זמן
fetch('/api/track-timing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(timing)
});
```

## 📊 הגדרת Google Sheets (חדש!)

### שלב 1: יצירת Google Apps Script

1. **פתח Google Sheets:**
   - לך ל: https://sheets.google.com
   - צור גיליון חדש

2. **לך ל-**Extensions** → **Apps Script:**
   - מחק את הקוד הקיים
   - הדבק את הקוד הבא:

```javascript
function doPost(e) {
  try {
    // קבלת הנתונים מהבקשה
    const data = JSON.parse(e.postData.contents);
    
    // פתיחת הגיליון הפעיל
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // בדיקה אם זה נתוני זמן או לחיצה
    if (data.type === 'timing') {
      // הוספת נתוני זמן
      sheet.appendRow([
        new Date(data.timestamp),
        data.sessionId,
        data.actionType,
        data.buttonId || 'N/A',
        data.durationFormatted || 'N/A',
        data.duration || 0,
        data.completed ? 'הושלם' : 'לא הושלם',
        data.userAgent,
        data.url
      ]);
    } else {
      // הוספת נתוני לחיצה
      sheet.appendRow([
        new Date(data.timestamp),
        data.buttonId,
        data.buttonName,
        data.category || 'main_buttons',
        data.sessionId,
        data.userAgent,
        data.url
      ]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

3. **עדכן את מזהה הגיליון:**
   ```javascript
   const SPREADSHEET_ID = 'המזהה-שלך-כאן';
   ```

4. **שמור ופרסם:**
   - Ctrl+S לשמירה
   - לחץ על **Deploy** → **New deployment**
   - בחר **Type**: Web app
   - הגדר:
     - **Execute as**: Me
     - **Who has access**: Anyone
   - לחץ **Deploy**
   - העתק את ה-**Web app URL**

### שלב 2: הגדרה באתר

1. **פתח את הדשבורד האנליטיקס:**
   - במצב פיתוח: לחץ על כפתור "📊 אנליטיקס"
   - במצב פרודקשן: הקלד "analytics"

2. **הזן את ה-URL:**
   - לחץ על כפתור "הגדרות Google Sheets"
   - הדבק את ה-URL שהעתקת מהפריסה
   - לחץ "שמור"

3. **בדוק חיבור:**
   - לחץ "בדוק חיבור לגיליונות"
   - וודא שמופיע "✅ מחובר לגיליונות"

### שלב 3: סנכרון נתונים

**סנכרון ידני:**
- לחץ "סנכרן לחיצות לגיליונות" - לנתוני לחיצות
- לחץ "סנכרן זמנים לגיליונות" - לנתוני זמן

**סנכרון אוטומטי:**
- כל לחיצה חדשה נשמרת אוטומטית
- כל מדידת זמן חדשה נשמרת אוטומטית

### מה תקבל ב-Google Sheets:

**גיליון 1: `BOTEX Analytics - לחיצות`**
- תאריך ושעה
- מזהה כפתור (kupa/ashrai/holetz)
- שם כפתור
- קטגוריה
- מזהה סשן
- דפדפן
- כתובת דף

**גיליון 2: `BOTEX Analytics - זמנים`** 🆕
- תאריך התחלה
- תאריך סיום  
- משך זמן (מילישניות)
- משך זמן (קריא)
- מזהה סשן
- סוג פעולה
- מזהה כפתור
- הושלם (כן/לא)
- דפדפן
- כתובת דף

**גיליון 3: `סטטיסטיקות משולבות`** 🆕
- דוח מסכם אוטומטי
- סטטיסטיקות לחיצות וזמנים
- פילוח לפי כפתור וסוג פעולה

---

**פותח על ידי:** Shahar Barsheshet  
**עדכון אחרון:** ${new Date().toLocaleDateString('he-IL')}  
**גרסה:** 2.1.0 - עם מעקב זמן ו-Google Sheets מלא! 