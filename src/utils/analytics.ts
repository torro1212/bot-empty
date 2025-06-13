// הגדרת טיפוס עבור Google Analytics
declare global {
  function gtag(...args: any[]): void;
}

export interface ClickData {
  buttonId: string;
  buttonName: string;
  timestamp: string;
  userAgent: string;
  url: string;
  sessionId: string;
  category?: string;
  additionalData?: Record<string, any>;
}

// יצירת session ID אם לא קיים
const getOrCreateSessionId = (): string => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// פונקציה למעקב אחר לחיצות כפתורים
export const trackButtonClick = (
  buttonId: string, 
  buttonName: string, 
  category: string = 'main_buttons',
  additionalData?: Record<string, any>
) => {
  console.log('🚀 trackButtonClick נקרא עם:', { buttonId, buttonName, category });
  
  try {
    // הגנה מפני שגיאות DOM ו-Runtime
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.warn('⚠️ Window או Document לא זמינים - מדלג על מעקב');
      return null;
    }
    
    console.log('✅ Window ו-Document זמינים');

    const clickData: ClickData = {
      buttonId,
      buttonName,
      timestamp: new Date().toISOString(),
      userAgent: navigator?.userAgent || 'Unknown Browser',
      url: window?.location?.href || 'Unknown URL',
      sessionId: getOrCreateSessionId(),
      category,
      additionalData
    };

    // שליחה ל-console לבדיקה ופיתוח
    console.log('🔍 מעקב לחיצת כפתור:', clickData);

    // שמירה ב-localStorage לגיבוי מקומי (עם הגנה)
    try {
      saveClickToLocalStorage(clickData);
      console.log('✅ נשמר מקומית');
    } catch (error) {
      console.warn('⚠️ שגיאה בשמירה מקומית:', error);
    }

    // שליחה ל-Google Analytics (אם זמין) - עם הגנה
    try {
      sendToGoogleAnalytics(clickData);
      console.log('📊 נשלח ל-Google Analytics');
    } catch (error) {
      console.warn('⚠️ שגיאה בשליחה ל-Google Analytics:', error);
    }

    // שליחה למערכת פנימית (אם זמינה) - עם הגנה
    try {
      sendToInternalSystem(clickData);
      console.log('🔗 נשלח למערכת פנימית');
    } catch (error) {
      console.warn('⚠️ שגיאה בשליחה למערכת פנימית:', error);
    }

    // שליחה ל-Google Sheets (אם מוגדר) - עם הגנה
    try {
      sendToGoogleSheets(clickData);
      console.log('📋 נשלח ל-Google Sheets');
    } catch (error) {
      console.warn('⚠️ שגיאה בשליחה ל-Google Sheets:', error);
    }

    return clickData;
  } catch (error) {
    console.error('💥 שגיאה כללית במעקב לחיצה:', error);
    console.error('📍 פרטי השגיאה:', {
      buttonId,
      buttonName,
      category,
      error: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
};

// שמירה ב-localStorage
const saveClickToLocalStorage = (clickData: ClickData) => {
  try {
    const existingClicks = JSON.parse(localStorage.getItem('buttonClicks') || '[]');
    existingClicks.push(clickData);
    
    // שמירה של רק 1000 הלחיצות האחרונות כדי לא למלא את הזיכרון
    if (existingClicks.length > 1000) {
      existingClicks.splice(0, existingClicks.length - 1000);
    }
    
    localStorage.setItem('buttonClicks', JSON.stringify(existingClicks));
  } catch (error) {
    console.warn('שגיאה בשמירת לחיצה ב-localStorage:', error);
  }
};

// שליחה ל-Google Analytics
const sendToGoogleAnalytics = (clickData: ClickData) => {
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'button_click', {
        'button_id': clickData.buttonId,
        'button_name': clickData.buttonName,
        'event_category': clickData.category,
        'event_label': clickData.buttonName,
        'custom_parameter_session_id': clickData.sessionId
      });
    }
  } catch (error) {
    console.warn('שגיאה בשליחה ל-Google Analytics:', error);
  }
};

// שליחה למערכת פנימית
const sendToInternalSystem = (clickData: ClickData) => {
  try {
    fetch('/api/track-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickData)
    }).catch(error => {
      console.warn('שגיאה בשליחת מעקב למערכת פנימית:', error);
    });
  } catch (error) {
    console.warn('שגיאה בשליחת מעקב למערכת פנימית:', error);
  }
};

// שליחה ל-Google Sheets
const sendToGoogleSheets = (clickData: ClickData) => {
  try {
    // בדיקה שיש לנו fetch API
    if (typeof fetch === 'undefined') {
      console.warn('⚠️ Fetch API לא זמין - מדלג על שליחה ל-Google Sheets');
      return;
    }

    // URL של ה-Google Apps Script Web App
    const GOOGLE_SHEETS_URL = localStorage.getItem('googleSheetsUrl') || 
                              'https://script.google.com/macros/s/AKfycbwLmA2kCXRDB96_qnlAetIyNLILmaX_uKcMQozpbP23fSvQZo7Yy92y-nyAoEtwCg10xA/exec';
    
    if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL === '') {
      console.warn('⚠️ Google Sheets URL לא מוגדר עבור לחיצות');
      console.log('💡 להפעלת שליחה בזמן אמת:');
      console.log('   1. פתח את דשבורד האנליטיקס');
      console.log('   2. לחץ על "הגדרות Google Sheets"');
      console.log('   3. הגדר את ה-URL לפי ההוראות');
      return;
    }

    console.log('🖱️📤 שולח נתוני לחיצה ל-Google Sheets בזמן אמת:', GOOGLE_SHEETS_URL);
    console.log('📊 נתוני לחיצה שנשלחים:', {
      buttonId: clickData.buttonId,
      buttonName: clickData.buttonName,
      category: clickData.category,
      sessionId: clickData.sessionId
    });

    // הוספת סוג הנתונים כדי לעזור לשרת לזהות את סוג השליחה
    const dataToSend = {
      ...clickData,
      type: 'click'
    };

    fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
      mode: 'no-cors' // נדרש עבור Google Apps Script
    }).then(() => {
      console.log('✅ נתוני לחיצה נשלחו ל-Google Sheets בהצלחה בזמן אמת!');
      console.log('🎯 הנתונים אמורים להופיע עכשיו בגיליון שלך');
    }).catch(error => {
      console.warn('⚠️ שגיאה ברשת בשליחה ל-Google Sheets:', error);
      console.log('💾 הנתונים נשמרו מקומית בדפדפן כגיבוי');
    });
  } catch (error) {
    console.warn('⚠️ שגיאה כללית בשליחה ל-Google Sheets:', error);
  }
};

// שליחת נתוני זמן ל-Google Sheets
const sendTimingToGoogleSheets = (timing: SessionTiming) => {
  try {
    // בדיקה שיש לנו fetch API
    if (typeof fetch === 'undefined') {
      console.warn('⚠️ Fetch API לא זמין - מדלג על שליחה ל-Google Sheets');
      return;
    }

    // URL של ה-Google Apps Script Web App
    const GOOGLE_SHEETS_URL = localStorage.getItem('googleSheetsUrl') || 
                              'https://script.google.com/macros/s/AKfycbwLmA2kCXRDB96_qnlAetIyNLILmaX_uKcMQozpbP23fSvQZo7Yy92y-nyAoEtwCg10xA/exec';
    
    if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL === '') {
      console.warn('⚠️ Google Sheets URL לא מוגדר עבור זמנים');
      console.log('💡 להפעלת שליחה בזמן אמת:');
      console.log('   1. פתח את דשבורד האנליטיקס');
      console.log('   2. לחץ על "הגדרות Google Sheets"');
      console.log('   3. הגדר את ה-URL לפי ההוראות');
      return;
    }

    console.log('⏱️📤 שולח נתוני זמן ל-Google Sheets בזמן אמת:', GOOGLE_SHEETS_URL);
    console.log('📊 נתוני זמן שנשלחים:', {
      sessionId: timing.sessionId,
      duration: timing.duration ? formatDuration(timing.duration) : 'N/A',
      actionType: timing.actionType,
      buttonId: timing.buttonId,
      completed: timing.completed
    });

    // המרת הזמן למילישניות לשניות עבור הגיליון
    const durationInSeconds = timing.duration ? Math.round(timing.duration / 1000) : null;

    // יצירת אובייקט נתונים למשלוח
    const timingData = {
      type: 'timing', // מזהה סוג הנתונים
      sessionId: timing.sessionId,
      startTime: timing.startTime,
      endTime: timing.endTime,
      duration: durationInSeconds, // שולחים את הזמן בשניות
      durationFormatted: timing.duration ? formatDuration(timing.duration) : 'N/A',
      actionType: timing.actionType,
      buttonId: timing.buttonId || 'N/A',
      completed: timing.completed,
      userAgent: timing.userAgent,
      url: timing.url,
      timestamp: timing.endTime || timing.startTime
    };

    fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timingData),
      mode: 'no-cors' // נדרש עבור Google Apps Script
    }).then(() => {
      console.log('✅ נתוני זמן נשלחו ל-Google Sheets בהצלחה בזמן אמת!');
      console.log('🎯 הנתונים אמורים להופיע עכשיו בגיליון שלך');
    }).catch(error => {
      console.warn('⚠️ שגיאה ברשת בשליחת זמנים ל-Google Sheets:', error);
      console.log('💾 הנתונים נשמרו מקומית בדפדפן כגיבוי');
    });
  } catch (error) {
    console.warn('⚠️ שגיאה כללית בשליחת זמנים ל-Google Sheets:', error);
  }
};

// פונקציה לקבלת כל הלחיצות מ-localStorage
export const getAllClicks = (): ClickData[] => {
  try {
    return JSON.parse(localStorage.getItem('buttonClicks') || '[]');
  } catch (error) {
    console.warn('שגיאה בקריאת לחיצות מ-localStorage:', error);
    return [];
  }
};

// פונקציה לקבלת סטטיסטיקות לחיצות
export const getClickStatistics = () => {
  const clicks = getAllClicks();
  const stats = {
    totalClicks: clicks.length,
    clicksByButton: {} as Record<string, number>,
    clicksByCategory: {} as Record<string, number>,
    clicksByDay: {} as Record<string, number>,
    lastClick: clicks.length > 0 ? clicks[clicks.length - 1] : null
  };

  clicks.forEach(click => {
    // ספירה לפי כפתור
    stats.clicksByButton[click.buttonId] = (stats.clicksByButton[click.buttonId] || 0) + 1;
    
    // ספירה לפי קטגוריה
    stats.clicksByCategory[click.category || 'unknown'] = (stats.clicksByCategory[click.category || 'unknown'] || 0) + 1;
    
    // ספירה לפי יום
    const day = click.timestamp.split('T')[0];
    stats.clicksByDay[day] = (stats.clicksByDay[day] || 0) + 1;
  });

  return stats;
};

// פונקציה לניקוי נתוני מעקב
export const clearClickData = () => {
  try {
    localStorage.removeItem('buttonClicks');
    console.log('נתוני מעקב נוקו בהצלחה');
  } catch (error) {
    console.warn('שגיאה בניקוי נתוני מעקב:', error);
  }
};

// פונקציה לייצוא נתונים
export const exportClickData = () => {
  const clicks = getAllClicks();
  const stats = getClickStatistics();
  
  const exportData = {
    exportDate: new Date().toISOString(),
    statistics: stats,
    rawData: clicks
  };

  // יצירת קובץ להורדה
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `click-analytics-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// פונקציות Google Sheets
export const setGoogleSheetsUrl = (url: string) => {
  localStorage.setItem('googleSheetsUrl', url);
  console.log('✅ Google Sheets URL הוגדר בהצלחה:', url);
  console.log('🌐 Environment:', typeof window !== 'undefined' ? window.location.hostname : 'Server');
};

export const getGoogleSheetsUrl = (): string => {
  return localStorage.getItem('googleSheetsUrl') || 
         'https://script.google.com/macros/s/AKfycbwLmA2kCXRDB96_qnlAetIyNLILmaX_uKcMQozpbP23fSvQZo7Yy92y-nyAoEtwCg10xA/exec';
};

export const testGoogleSheetsConnection = async (): Promise<boolean> => {
  const url = getGoogleSheetsUrl();
  if (!url) {
    console.warn('Google Sheets URL לא מוגדר');
    return false;
  }

  try {
    const testData = {
      buttonId: 'test',
      buttonName: 'בדיקת חיבור',
      timestamp: new Date().toISOString(),
      userAgent: 'Test Agent',
      url: window.location.href,
      sessionId: 'test-session',
      category: 'test'
    };

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
      mode: 'no-cors'
    });

    console.log('✅ בדיקת חיבור ל-Google Sheets הצליחה');
    return true;
  } catch (error) {
    console.error('❌ בדיקת חיבור ל-Google Sheets נכשלה:', error);
    return false;
  }
};

export const syncAllDataToGoogleSheets = async () => {
  const clicks = getAllClicks();
  const url = getGoogleSheetsUrl();
  
  if (!url) {
    throw new Error('Google Sheets URL לא מוגדר');
  }

  if (clicks.length === 0) {
    throw new Error('אין נתונים לסנכרון');
  }

  let successCount = 0;
  let errorCount = 0;

  for (const click of clicks) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(click),
        mode: 'no-cors'
      });
      successCount++;
      
      // השהייה קטנה בין בקשות כדי לא להעמיס על Google
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.warn('שגיאה בסנכרון נתון:', error);
      errorCount++;
    }
  }

  return {
    total: clicks.length,
    success: successCount,
    errors: errorCount
  };
};

// ##### מערכת מעקב זמן מתקדמת #####

export interface SessionTiming {
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // במילישניות
  actionType: 'start_button' | 'wizard_start' | 'solution_complete' | 'form_submit' | 'wizard_complete';
  buttonId?: string;
  completed: boolean;
  userAgent: string;
  url: string;
}

// התחלת מעקב זמן למשתמש
export const startUserTimer = (actionType: 'start_button' | 'wizard_start' = 'start_button', buttonId?: string): string => {
  console.log('⏱️ התחלת מעקב זמן עבור:', actionType, buttonId);
  
  try {
    if (typeof window === 'undefined') {
      console.warn('⚠️ Window לא זמין - מדלג על מעקב זמן');
      return '';
    }

    const sessionId = getOrCreateSessionId();
    const startTime = new Date().toISOString();
    
    const timing: SessionTiming = {
      sessionId,
      startTime,
      actionType,
      buttonId,
      completed: false,
      userAgent: navigator?.userAgent || 'Unknown Browser',
      url: window?.location?.href || 'Unknown URL'
    };

    // שמירה ב-sessionStorage (נמחק כשהכרטיסייה נסגרת)
    sessionStorage.setItem(`timing_${sessionId}`, JSON.stringify(timing));
    console.log('✅ מעקב זמן התחיל בזמן אמת עבור סשן:', sessionId);
    console.log('🎯 כשהמשתמש יסיים את התהליך, הזמן יישלח אוטומטית ל-Google Sheets');
    
    return sessionId;
  } catch (error) {
    console.error('💥 שגיאה בהתחלת מעקב זמן:', error);
    return '';
  }
};

// סיום מעקב זמן והחזרת משך הזמן
export const endUserTimer = (sessionId?: string, actionType: 'solution_complete' | 'form_submit' | 'wizard_complete' = 'solution_complete'): SessionTiming | null => {
  console.log('🏁 סיום מעקב זמן עבור:', actionType, sessionId);
  
  try {
    if (typeof window === 'undefined') {
      console.warn('⚠️ Window לא זמין - מדלג על סיום מעקב');
      return null;
    }

    const currentSessionId = sessionId || getOrCreateSessionId();
    const timingKey = `timing_${currentSessionId}`;
    const savedTiming = sessionStorage.getItem(timingKey);
    
    if (!savedTiming) {
      console.warn('⚠️ לא נמצא מעקב זמן עבור סשן:', currentSessionId);
      return null;
    }

    const timing: SessionTiming = JSON.parse(savedTiming);
    const endTime = new Date().toISOString();
    const duration = new Date(endTime).getTime() - new Date(timing.startTime).getTime();
    
    // עדכון הזמן עם הסיום
    timing.endTime = endTime;
    timing.duration = duration;
    timing.completed = true;
    
    // שמירה ב-localStorage לארכיון
    saveTimingToStorage(timing);
    
    // שליחה ל-Google Sheets
    sendTimingToGoogleSheets(timing);
    
    // ניקוי sessionStorage
    sessionStorage.removeItem(timingKey);
    
    console.log('✅ מעקב זמן הושלם בהצלחה!', {
      duration: formatDuration(duration),
      durationMs: duration,
      startTime: timing.startTime,
      endTime: timing.endTime,
      actionType: timing.actionType
    });
    console.log('📤 הנתונים נשלחים עכשיו בזמן אמת ל-Google Sheets...');
    
    return timing;
  } catch (error) {
    console.error('💥 שגיאה בסיום מעקב זמן:', error);
    return null;
  }
};

// שמירת מעקב זמן ב-localStorage
const saveTimingToStorage = (timing: SessionTiming) => {
  try {
    const existingTimings = JSON.parse(localStorage.getItem('userTimings') || '[]');
    existingTimings.push(timing);
    
    // שמירה של רק 500 המדידות האחרונות
    if (existingTimings.length > 500) {
      existingTimings.splice(0, existingTimings.length - 500);
    }
    
    localStorage.setItem('userTimings', JSON.stringify(existingTimings));
    console.log('💾 מעקב זמן נשמר ב-localStorage');
  } catch (error) {
    console.warn('⚠️ שגיאה בשמירת מעקב זמן:', error);
  }
};

// פורמט זמן לקריאה נוחה
export const formatDuration = (milliseconds: number): string => {
  // המרה לשניות
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}ש ${minutes % 60}ד ${seconds % 60}ש`;
  } else if (minutes > 0) {
    return `${minutes}ד ${seconds % 60}ש`;
  } else {
    return `${seconds}ש`;
  }
};

// קבלת כל מדידות הזמן
export const getAllTimings = (): SessionTiming[] => {
  try {
    return JSON.parse(localStorage.getItem('userTimings') || '[]');
  } catch (error) {
    console.warn('שגיאה בקריאת מדידות זמן:', error);
    return [];
  }
};

// קבלת סטטיסטיקות זמן
export const getTimingStatistics = () => {
  const timings = getAllTimings().filter(t => t.completed && t.duration);
  
  if (timings.length === 0) {
    return {
      totalSessions: 0,
      averageDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      completedSessions: 0,
      byActionType: {},
      byDay: {}
    };
  }
  
  const durations = timings.map(t => t.duration!);
  const sum = durations.reduce((a, b) => a + b, 0);
  
  const stats = {
    totalSessions: timings.length,
    averageDuration: Math.round(sum / timings.length),
    minDuration: Math.min(...durations),
    maxDuration: Math.max(...durations),
    completedSessions: timings.filter(t => t.completed).length,
    byActionType: {} as Record<string, number>,
    byDay: {} as Record<string, number>
  };

  // חישוב לפי סוג פעולה
  timings.forEach(timing => {
    const actionType = timing.actionType || 'unknown';
    if (!stats.byActionType[actionType]) {
      stats.byActionType[actionType] = 0;
    }
    stats.byActionType[actionType] += timing.duration || 0;
  });

  // חישוב לפי יום
  timings.forEach(timing => {
    const day = timing.startTime.split('T')[0];
    if (!stats.byDay[day]) {
      stats.byDay[day] = 0;
    }
    stats.byDay[day] += timing.duration || 0;
  });

  return stats;
};

// ניקוי נתוני זמן
export const clearTimingData = () => {
  localStorage.removeItem('userTimings');
  // ניקוי sessionStorage גם כן
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('timing_')) {
      sessionStorage.removeItem(key);
    }
  });
  console.log('🧹 נתוני מעקב זמן נוקו');
};

// ייצוא נתוני זמן
export const exportTimingData = () => {
  const timings = getAllTimings();
  const stats = getTimingStatistics();
  
  const exportData = {
    exportDate: new Date().toISOString(),
    totalTimings: timings.length,
    statistics: stats,
    timings: timings
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `timing-data-${new Date().toLocaleDateString('he-IL')}.json`;
  link.click();
  
  console.log('📊 נתוני מעקב זמן יוצאו:', exportData);
};

// סנכרון כל נתוני הזמן ל-Google Sheets
export const syncAllTimingDataToGoogleSheets = async () => {
  const timings = getAllTimings();
  const GOOGLE_SHEETS_URL = localStorage.getItem('googleSheetsUrl') || '';
  
  if (!GOOGLE_SHEETS_URL) {
    console.warn('⚠️ Google Sheets URL לא מוגדר - לא ניתן לסנכרן נתוני זמן');
    return { success: false, error: 'Google Sheets URL לא מוגדר' };
  }

  if (timings.length === 0) {
    console.log('ℹ️ אין נתוני זמן לסנכרון');
    return { success: true, message: 'אין נתונים לסנכרון' };
  }

  console.log(`🔄 מתחיל סנכרון ${timings.length} נתוני זמן ל-Google Sheets...`);

  let successCount = 0;
  let errorCount = 0;

  for (const timing of timings) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // המתנה קצרה בין בקשות
      sendTimingToGoogleSheets(timing);
      successCount++;
    } catch (error) {
      console.error('❌ שגיאה בסנכרון נתוני זמן:', error);
      errorCount++;
    }
  }

  const result = {
    success: errorCount === 0,
    total: timings.length,
    success_count: successCount,
    error_count: errorCount,
    message: `סונכרנו ${successCount} מתוך ${timings.length} נתוני זמן`
  };

  console.log('✅ סנכרון נתוני זמן הושלם:', result);
  return result;
};

// ניקוי נתוני זמן מ-Google Sheets (אם נדרש)
export const clearTimingDataFromGoogleSheets = async () => {
  const GOOGLE_SHEETS_URL = localStorage.getItem('googleSheetsUrl') || '';
  
  if (!GOOGLE_SHEETS_URL) {
    console.warn('⚠️ Google Sheets URL לא מוגדר');
    return { success: false, error: 'Google Sheets URL לא מוגדר' };
  }

  try {
    const clearCommand = {
      type: 'clear_timings',
      timestamp: new Date().toISOString()
    };

    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clearCommand),
      mode: 'no-cors'
    });

    console.log('✅ פקודת ניקוי נתוני זמן נשלחה ל-Google Sheets');
    return { success: true, message: 'פקודת ניקוי נשלחה' };
  } catch (error) {
    console.error('❌ שגיאה בשליחת פקודת ניקוי:', error);
    return { success: false, error: error };
  }
}; 