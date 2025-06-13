/**
 * Google Apps Script עם תמיכה ב-CORS מלאה - BOTEX Analytics
 * גרסה מתוקנת שמאפשרת גישה מכל domain
 */

// הגדרות בסיסיות - עדכן את ה-ID שלך כאן!
const SPREADSHEET_ID = '1VTuFkUeiPjZ1HtdDg-47cVmpcw-lZvxWTaxg50DFdO4';

/**
 * טיפול ב-OPTIONS request (CORS preflight)
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    });
}

/**
 * טיפול ב-GET requests - בדיקת מצב
 */
function doGet(e) {
  console.log('📊 GET request התקבל');
  
  const response = {
    status: 'ok',
    message: 'BOTEX Analytics - Google Sheets Integration',
    timestamp: new Date().toISOString(),
    version: '2.0',
    cors: 'enabled',
    spreadsheetId: SPREADSHEET_ID
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response, null, 2))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
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
      return createResponse(true, 'חיבור תקין - CORS פעיל!', {
        testTime: new Date().toISOString(),
        corsEnabled: true
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
      timingData.completed ? 'כן' : 'לא',
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
      sheetName: sheet.getName(),
      duration: durationSeconds
    };
    
  } catch (error) {
    console.error('❌ שגיאה בשמירת זמן:', error);
    throw error;
  }
}

/**
 * פונקציות עזר
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    console.log('🆕 גיליון חדש נוצר:', sheetName);
  }
  return sheet;
}

function formatHeaderRow(sheet, numColumns) {
  const headerRange = sheet.getRange(1, 1, 1, numColumns);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
}

function getDayOfWeek(date) {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return days[date.getDay()];
}

function formatDuration(milliseconds) {
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
}

function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString(),
    data: data
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response, null, 2))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
}

/**
 * פונקציית בדיקה
 */
function testScript() {
  console.log('🧪 מתחיל בדיקת סקריפט...');
  
  // בדיקת נתוני לחיצה
  const testClick = {
    type: 'click',
    buttonId: 'test',
    buttonName: 'כפתור בדיקה',
    timestamp: new Date().toISOString(),
    sessionId: 'test-session-' + Date.now(),
    category: 'test',
    url: 'https://test.com',
    userAgent: 'Test Browser'
  };
  
  const clickResult = saveClickData(testClick);
  console.log('✅ בדיקת לחיצה:', clickResult);
  
  // בדיקת נתוני זמן
  const testTiming = {
    type: 'timing',
    sessionId: 'test-timing-' + Date.now(),
    startTime: new Date(Date.now() - 30000).toISOString(),
    endTime: new Date().toISOString(),
    duration: 30000,
    actionType: 'test',
    buttonId: 'test',
    completed: true,
    userAgent: 'Test Browser',
    url: 'https://test.com'
  };
  
  const timingResult = saveTimingData(testTiming);
  console.log('✅ בדיקת זמן:', timingResult);
  
  console.log('🎉 כל הבדיקות עברו בהצלחה!');
} 