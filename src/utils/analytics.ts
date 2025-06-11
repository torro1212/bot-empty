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
    const GOOGLE_SHEETS_URL = localStorage.getItem('googleSheetsUrl') || '';
    
    if (!GOOGLE_SHEETS_URL) {
      console.warn('⚠️ Google Sheets URL לא מוגדר');
      return;
    }

    console.log('📤 שולח ל-Google Sheets:', GOOGLE_SHEETS_URL);

    fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickData),
      mode: 'no-cors' // נדרש עבור Google Apps Script
    }).then(() => {
      console.log('✅ נתונים נשלחו ל-Google Sheets בהצלחה');
    }).catch(error => {
      console.warn('⚠️ שגיאה ברשת בשליחה ל-Google Sheets:', error);
    });
  } catch (error) {
    console.warn('⚠️ שגיאה כללית בשליחה ל-Google Sheets:', error);
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
  console.log('Google Sheets URL הוגדר בהצלחה');
};

export const getGoogleSheetsUrl = (): string => {
  return localStorage.getItem('googleSheetsUrl') || '';
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