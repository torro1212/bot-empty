# מדריך מערכת מעקב לחיצות - BOTEX

## סקירה כללית
מערכת מעקב לחיצות מתקדמת שמתעדת כל לחיצה על כפתורי הבעיות הראשיים באתר BOTEX:
- **בעיות קופה** (ID: kupa)
- **בעיות אשראי** (ID: ashrai) 
- **בעיות חולץ** (ID: holetz)

## תכונות המערכת

### 📊 מעקב מקיף
- **זמן לחיצה מדויק** - תאריך ושעה בפורמט ISO
- **מזהה סשן ייחודי** - מעקב אחר משתמשים בין הפעלות
- **מידע טכני** - User Agent, URL, מידע דפדפן
- **קטגוריזציה** - סיווג לחיצות לפי סוג

### 💾 שמירת נתונים
- **LocalStorage** - שמירה מקומית בדפדפן (עד 1000 לחיצות)
- **Google Analytics** - שליחה אוטומטית (אם מוגדר)
- **מערכת פנימית** - API endpoint `/api/track-click`
- **Console Logging** - לוגים מפורטים לפיתוח

### 📈 דשבורד אנליטיקס
- **סטטיסטיקות כלליות** - סה"כ לחיצות, סשנים ייחודיים
- **פילוח לפי כפתור** - איזה כפתור הכי פופולרי
- **פילוח לפי יום** - מגמות לאורך זמן
- **לחיצות אחרונות** - רשימה של 20 הלחיצות האחרונות

## איך זה עובד

### 1. מעקב אוטומטי
כל לחיצה על אחד משלושת הכפתורים מפעילה את הפונקציה:
```typescript
trackButtonClick(buttonId, buttonName, 'main_buttons')
```

### 2. איסוף נתונים
המערכת אוספת:
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

### 3. שליחה למערכות
- ✅ **Console** - תמיד פעיל לפיתוח
- ✅ **LocalStorage** - שמירה מקומית מיידית
- ⚠️ **Google Analytics** - רק אם gtag מוגדר
- ⚠️ **API פנימי** - רק אם הendpoint קיים

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

## פונקציות זמינות

### קבלת נתונים
```javascript
import { getAllClicks, getClickStatistics } from '@/utils/analytics';

// כל הלחיצות
const clicks = getAllClicks();

// סטטיסטיקות מסוכמות
const stats = getClickStatistics();
```

### ניהול נתונים
```javascript
import { clearClickData, exportClickData } from '@/utils/analytics';

// ניקוי כל הנתונים
clearClickData();

// ייצוא לקובץ JSON
exportClickData();
```

### מעקב ידני
```javascript
import { trackButtonClick } from '@/utils/analytics';

// מעקב אחר לחיצה מותאמת
trackButtonClick('custom-button', 'כפתור מותאם', 'custom-category');
```

## דוגמאות שימוש

### 1. בדיקת הכפתור הפופולרי ביותר
```javascript
const stats = getClickStatistics();
const mostClicked = Object.entries(stats.clicksByButton)
  .sort(([,a], [,b]) => b - a)[0];
console.log(`הכפתור הפופולרי: ${mostClicked[0]} עם ${mostClicked[1]} לחיצות`);
```

### 2. מעקב אחר מגמות יומיות
```javascript
const stats = getClickStatistics();
const dailyTrends = Object.entries(stats.clicksByDay)
  .sort(([a], [b]) => b.localeCompare(a))
  .slice(0, 7);
console.log('לחיצות בשבוע האחרון:', dailyTrends);
```

### 3. ניתוח סשנים
```javascript
const clicks = getAllClicks();
const uniqueSessions = new Set(clicks.map(c => c.sessionId)).size;
const avgClicksPerSession = clicks.length / uniqueSessions;
console.log(`ממוצע לחיצות לסשן: ${avgClicksPerSession.toFixed(2)}`);
```

## אבטחה ופרטיות

### מידע שנשמר
- ✅ **ID כפתור** - מזהה טכני בלבד
- ✅ **זמן לחיצה** - לצורכי אנליטיקס
- ✅ **מזהה סשן** - אנונימי, ללא זיהוי אישי
- ❌ **מידע אישי** - לא נשמר כלל

### GDPR ופרטיות
- המערכת לא אוספת מידע אישי מזהה
- כל הנתונים אנונימיים
- המשתמש יכול לנקות נתונים בכל עת
- שמירה מקומית בלבד (אלא אם הוגדר אחרת)

## התקנה ותצורה

### הוספת Google Analytics
```html
<!-- הוסף לראש הדף -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### הגדרת API פנימי
צור endpoint בשרת:
```javascript
// POST /api/track-click
app.post('/api/track-click', (req, res) => {
  const clickData = req.body;
  // שמור במסד נתונים
  database.saveClick(clickData);
  res.json({ success: true });
});
```

## פתרון בעיות

### הנתונים לא נשמרים
1. בדוק שLocalStorage פעיל
2. ודא שאין חוסמי תוכן
3. נקה cache הדפדפן

### Google Analytics לא עובד
1. ודא שgtag מוגדר נכון
2. בדוק שהMeasurement ID נכון
3. ודא שאין חוסמי פרסומות

### הדשבורד לא מופיע
1. ודא שאתה במצב פיתוח
2. בדוק שהקומפוננט מיובא נכון
3. ודא שאין שגיאות JavaScript

## סטטיסטיקות לדוגמה

```json
{
  "totalClicks": 156,
  "clicksByButton": {
    "kupa": 67,
    "ashrai": 52,
    "holetz": 37
  },
  "clicksByCategory": {
    "main_buttons": 156
  },
  "clicksByDay": {
    "2024-01-15": 23,
    "2024-01-14": 31,
    "2024-01-13": 28
  },
  "lastClick": {
    "buttonId": "kupa",
    "buttonName": "בעיות קופה",
    "timestamp": "2024-01-15T14:30:22.456Z"
  }
}
```

## תמיכה ועזרה

### לוגים לפיתוח
כל לחיצה מדפיסה לוג מפורט:
```
🔍 מעקב לחיצת כפתור: {
  buttonId: "kupa",
  buttonName: "בעיות קופה",
  timestamp: "2024-01-15T14:30:22.456Z",
  sessionId: "session_1705312245123_abc123def"
}
```

### בדיקת תקינות
```javascript
// בדיקה שהמערכת עובדת
console.log('מערכת מעקב פעילה:', typeof trackButtonClick === 'function');

// בדיקת נתונים קיימים
console.log('נתונים קיימים:', getAllClicks().length);
```

---

**פותח על ידי:** Shahar Barsheshet  
**עדכון אחרון:** ${new Date().toLocaleDateString('he-IL')}  
**גרסה:** 1.0.0 