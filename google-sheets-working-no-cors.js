/**
 * Google Apps Script עבור BOTEX Analytics - גרסה עובדת
 * ללא CORS headers שגורמים לשגיאות
 */

// הגדרות בסיסיות - עדכן את ה-ID שלך כאן!
const SPREADSHEET_ID = '1sdBiCyPaXuCUBQSTOhrXlrgz48CDDIj9oWhgLVJ91Po';

/**
 * טיפול ב-GET requests - בדיקת מצב
 */
function doGet(e) {
  console.log('📊 GET request התקבל');
  
  const response = {
    status: 'ok',
    message: 'BOTEX Analytics - Google Sheets Integration',
    timestamp: new Date().toISOString(),
    version: '3.0-working',
    spreadsheetId: SPREADSHEET_ID
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * טיפול ב-POST requests - שמירת נתונים
 */
function doPost(e) {
  console.log('🚀 POST request התקבל:', new Date().toISOString());
  
  try {
    // בדיקה שהבקשה תקינה
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse(false, 'אין נתוני POST', null);
    }
    
    console.log('📥 נתונים גולמיים:', e.postData.contents);
    
    // פענוח JSON
    const data = JSON.parse(e.postData.contents);
    console.log('📊 נתונים מפוענחים:', JSON.stringify(data, null, 2));
    
    // זיהוי סוג הנתונים
    if (data.type === 'timing') {
      const result = saveTimingData(data);
      return createResponse(true, 'נתוני זמן נשמרו בהצלחה', result);
    } else if (data.type === 'click' || data.buttonId) {
      const result = saveClickData(data);
      return createResponse(true, 'נתוני לחיצה נשמרו בהצלחה', result);
    } else if (data.type === 'test') {
      console.log('🧪 בדיקת חיבור התקבלה');
      return createResponse(true, 'חיבור תקין!', {
        testTime: new Date().toISOString()
      });
    } else {
      return createResponse(false, 'סוג נתונים לא מוכר', data);
    }
    
  } catch (error) {
    console.error('💥 שגיאה:', error.toString());
    return createResponse(false, 'שגיאה: ' + error.toString(), null);
  }
}

/**
 * שמירת נתוני לחיצות
 */
function saveClickData(clickData) {
  console.log('🖱️ שומר נתוני לחיצה...');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = getOrCreateSheet(spreadsheet, 'BOTEX Analytics - לחיצות');
    
    // יצירת כותרות אם צריך
    if (sheet.getLastRow() === 0) {
      const headers = [
        'תאריך',
        'שעה',
        'מזהה כפתור',
        'שם כפתור',
        'קטגוריה',
        'URL',
        'דפדפן',
        'מזהה סשן',
        'יום בשבוע',
        'שעה מספרית',
        'חודש',
        'שנה'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      formatHeaderRow(sheet, headers.length);
    }
    
    // הכנת הנתונים
    const timestamp = new Date(clickData.timestamp);
    const rowData = [
      timestamp.toLocaleDateString('he-IL'),
      timestamp.toLocaleTimeString('he-IL'),
      clickData.buttonId,
      clickData.buttonName,
      clickData.category || 'main_buttons',
      clickData.url || 'N/A',
      clickData.userAgent || 'N/A',
      clickData.sessionId || 'N/A',
      getDayOfWeek(timestamp),
      timestamp.getHours(),
      timestamp.getMonth() + 1,
      timestamp.getFullYear()
    ];
    
    // הוספת השורה
    sheet.appendRow(rowData);
    console.log('✅ נתוני לחיצה נשמרו');
    
    return {
      type: 'click',
      rowsAdded: 1,
      totalRows: sheet.getLastRow() - 1,
      sheetName: sheet.getName()
    };
    
  } catch (error) {
    console.error('❌ שגיאה בשמירת לחיצה:', error);
    throw error;
  }
}

/**
 * שמירת נתוני זמן
 */
function saveTimingData(timingData) {
  console.log('⏱️ שומר נתוני זמן...');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = getOrCreateSheet(spreadsheet, 'BOTEX Analytics - זמנים');
    
    // יצירת כותרות אם צריך
    if (sheet.getLastRow() === 0) {
      const headers = [
        'תאריך',
        'שעה',
        'מזהה סשן',
        'זמן התחלה',
        'זמן סיום',
        'משך (שניות)',
        'משך (מעוצב)',
        'סוג פעולה',
        'מזהה כפתור',
        'הושלם',
        'דפדפן',
        'URL'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      formatHeaderRow(sheet, headers.length);
    }
    
    // הכנת הנתונים
    const startTime = new Date(timingData.startTime);
    const endTime = timingData.endTime ? new Date(timingData.endTime) : new Date();
    const durationSeconds = timingData.duration || Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    
    const rowData = [
      startTime.toLocaleDateString('he-IL'),
      startTime.toLocaleTimeString('he-IL'),
      timingData.sessionId,
      startTime.toLocaleString('he-IL'),
      endTime.toLocaleString('he-IL'),
      durationSeconds,
      timingData.durationFormatted || formatDuration(durationSeconds * 1000),
      timingData.actionType,
      timingData.buttonId || 'N/A',
      timingData.completed || false,
      timingData.userAgent || 'N/A',
      timingData.url || 'N/A'
    ];
    
    // הוספת השורה
    sheet.appendRow(rowData);
    console.log('✅ נתוני זמן נשמרו');
    
    return {
      type: 'timing',
      rowsAdded: 1,
      totalRows: sheet.getLastRow() - 1,
      sheetName: sheet.getName()
    };
    
  } catch (error) {
    console.error('❌ שגיאה בשמירת זמן:', error);
    throw error;
  }
}

/**
 * יצירה או קבלת גיליון עבודה
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    console.log('📄 נוצר גיליון חדש:', sheetName);
  }
  return sheet;
}

/**
 * עיצוב שורת כותרות
 */
function formatHeaderRow(sheet, numColumns) {
  const headerRange = sheet.getRange(1, 1, 1, numColumns);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4A90E2');
  headerRange.setFontColor('white');
}

/**
 * המרת תאריך ליום בשבוע
 */
function getDayOfWeek(date) {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return days[date.getDay()];
}

/**
 * עיצוב משך זמן
 */
function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  } else {
    return `${seconds} שניות`;
  }
}

/**
 * יצירת תגובה מתוקנת ללא CORS headers
 */
function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 שולח תגובה:', JSON.stringify(response, null, 2));
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * בדיקת התסריט - להרצה ידנית
 */
function testScript() {
  console.log('🧪 מתחיל בדיקת התסריט...');
  
  try {
    // בדיקת חיבור לגיליון
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ חיבור לגיליון תקין:', spreadsheet.getName());
    
    // בדיקת יצירת גיליון
    const testSheet = getOrCreateSheet(spreadsheet, 'BOTEX Analytics - לחיצות');
    console.log('✅ גיליון לחיצות:', testSheet.getName());
    
    const timingSheet = getOrCreateSheet(spreadsheet, 'BOTEX Analytics - זמנים');
    console.log('✅ גיליון זמנים:', timingSheet.getName());
    
    console.log('🎉 התסריט עובד בהצלחה!');
    return true;
    
  } catch (error) {
    console.error('❌ שגיאה בבדיקה:', error);
    return false;
  }
} 