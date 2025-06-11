/**
 * Google Apps Script מלא למעקב לחיצות BOTEX
 * גרסה מלאה ומעודכנת עם SPREADSHEET_ID נכון
 */

// הגדרות בסיסיות - עם ה-ID הנכון שלך!
const SHEET_NAME = 'BOTEX Analytics';
const SPREADSHEET_ID = '1IIMYXIfPbURrbVrJbZNWbLqx42WXeL5lJq8vg8Q9bWs';

/**
 * פונקציה ראשית - מטפלת בבקשות POST מהאתר
 */
function doPost(e) {
  console.log('🚀 doPost נקראה - התחלת עיבוד');
  console.log('📅 זמן:', new Date().toISOString());
  
  try {
    // בדיקה שהבקשה תקינה
    if (!e || !e.postData || !e.postData.contents) {
      console.error('❌ אין נתוני POST');
      return createErrorResponse('אין נתוני POST');
    }
    
    console.log('📥 נתונים התקבלו:', e.postData.contents);
    
    // פענוח הנתונים
    const data = JSON.parse(e.postData.contents);
    console.log('📊 נתונים מפוענחים:', JSON.stringify(data, null, 2));
    
    // בדיקה שהנתונים תקינים
    if (!data.buttonId || !data.buttonName || !data.timestamp) {
      console.error('❌ נתונים חסרים:', data);
      return createErrorResponse('נתונים חסרים: buttonId, buttonName או timestamp');
    }
    
    // שמירת הנתונים
    const result = saveClickData(data);
    console.log('✅ נתונים נשמרו בהצלחה:', result);
    
    // החזרת תגובה חיובית
    return createSuccessResponse('נתונים נשמרו בהצלחה ב-Google Sheets', result);
    
  } catch (error) {
    console.error('💥 שגיאה כללית בdoPost:', error.toString());
    console.error('📍 Stack trace:', error.stack);
    return createErrorResponse('שגיאה כללית: ' + error.toString());
  }
}

/**
 * פונקציה לשמירת נתוני לחיצה בגיליון
 */
function saveClickData(clickData) {
  console.log('💾 מתחיל שמירת נתונים...');
  console.log('📋 SPREADSHEET_ID:', SPREADSHEET_ID);
  
  try {
    // פתיחת הגיליון
    console.log('📂 פותח גיליון...');
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ גיליון נפתח:', spreadsheet.getName());
    
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // יצירת גיליון חדש אם לא קיים
    if (!sheet) {
      console.log('🆕 יוצר גיליון חדש:', SHEET_NAME);
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // הוספת כותרות
      const headers = [
        'תאריך ושעה',
        'ID כפתור', 
        'שם כפתור',
        'קטגוריה',
        'מזהה סשן',
        'User Agent',
        'URL',
        'יום בשבוע',
        'שעה',
        'חודש',
        'שנה'
      ];
      
      console.log('📝 מוסיף כותרות:', headers);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // עיצוב כותרות
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      console.log('🎨 כותרות עוצבו');
    } else {
      console.log('📋 גיליון קיים נמצא:', SHEET_NAME);
    }
    
    // הכנת הנתונים לשמירה
    const timestamp = new Date(clickData.timestamp);
    console.log('⏰ זמן מעובד:', timestamp);
    
    const rowData = [
      timestamp,
      clickData.buttonId,
      clickData.buttonName,
      clickData.category || 'main_buttons',
      clickData.sessionId,
      clickData.userAgent || 'Unknown',
      clickData.url || 'Unknown',
      getDayOfWeek(timestamp),
      timestamp.getHours(),
      timestamp.getMonth() + 1,
      timestamp.getFullYear()
    ];
    
    console.log('📄 נתוני שורה מוכנים:', rowData);
    
    // הוספת השורה לגיליון
    const lastRow = sheet.getLastRow();
    console.log('📊 שורה אחרונה לפני הוספה:', lastRow);
    
    sheet.appendRow(rowData);
    console.log('✅ שורה נוספה לגיליון');
    
    // עיצוב אוטומטי
    formatSheet(sheet);
    console.log('🎨 גיליון עוצב');
    
    const totalRows = sheet.getLastRow() - 1; // מינוס שורת הכותרות
    console.log('📊 סה"כ שורות נתונים בגיליון:', totalRows);
    
    return {
      rowsAdded: 1,
      totalRows: totalRows,
      timestamp: new Date().toISOString(),
      sheetName: SHEET_NAME,
      spreadsheetName: spreadsheet.getName()
    };
    
  } catch (error) {
    console.error('💥 שגיאה בשמירת נתונים:', error.toString());
    console.error('📍 Stack trace:', error.stack);
    throw error;
  }
}

/**
 * פונקציה לקבלת יום בשבוע בעברית
 */
function getDayOfWeek(date) {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return days[date.getDay()];
}

/**
 * פונקציה לעיצוב הגיליון
 */
function formatSheet(sheet) {
  try {
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    console.log('🎨 מעצב גיליון - שורות:', lastRow, 'עמודות:', lastCol);
    
    if (lastRow > 1) {
      // עיצוב כל הנתונים
      const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
      
      // גבולות
      dataRange.setBorder(true, true, true, true, true, true);
      
      // יישור טקסט ועיצוב תאריכים
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
        sheet.getRange(2, 2, lastRow - 1, lastCol - 1).setHorizontalAlignment('center');
      }
      
      // צבעים לסירוגין
      for (let i = 2; i <= lastRow; i++) {
        if (i % 2 === 0) {
          sheet.getRange(i, 1, 1, lastCol).setBackground('#f8f9fa');
        }
      }
      
      // התאמת רוחב עמודות
      sheet.autoResizeColumns(1, lastCol);
      console.log('✅ עיצוב הושלם');
    }
  } catch (error) {
    console.warn('⚠️ שגיאה בעיצוב (לא קריטית):', error.toString());
  }
}

/**
 * פונקציות עזר ליצירת תגובות JSON
 */
function createSuccessResponse(message, data = {}) {
  const response = {
    success: true,
    message: message,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  console.log('📤 שולח תגובה חיובית:', JSON.stringify(response, null, 2));
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(error) {
  const response = {
    success: false,
    error: error,
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 שולח תגובת שגיאה:', JSON.stringify(response, null, 2));
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * פונקציה לבדיקת חיבור - להרצה ידנית בלבד
 */
function testConnection() {
  console.log('🧪 מתחיל בדיקת חיבור...');
  console.log('📋 SPREADSHEET_ID:', SPREADSHEET_ID);
  console.log('📋 SHEET_NAME:', SHEET_NAME);
  
  try {
    console.log('📂 מנסה לפתוח גיליון...');
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    console.log('✅ גיליון נפתח בהצלחה!');
    console.log('📊 שם הגיליון:', spreadsheet.getName());
    console.log('📊 מזהה הגיליון:', spreadsheet.getId());
    console.log('📊 URL הגיליון:', spreadsheet.getUrl());
    
    // בדיקת גיליון עבודה ספציפי
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (sheet) {
      console.log('✅ גיליון עבודה נמצא:', SHEET_NAME);
      console.log('📊 מספר שורות:', sheet.getLastRow());
      console.log('📊 מספר עמודות:', sheet.getLastColumn());
    } else {
      console.log('⚠️ גיליון עבודה לא נמצא:', SHEET_NAME);
      console.log('💡 יווצר אוטומטית בפעם הראשונה');
    }
    
    return {
      success: true,
      message: 'החיבור פעיל בהצלחה!',
      spreadsheetName: spreadsheet.getName(),
      spreadsheetId: SPREADSHEET_ID,
      spreadsheetUrl: spreadsheet.getUrl(),
      sheetExists: !!sheet,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ בדיקת חיבור נכשלה:', error.toString());
    console.error('📍 Stack trace:', error.stack);
    
    return {
      success: false,
      error: error.toString(),
      spreadsheetId: SPREADSHEET_ID,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * פונקציה ליצירת נתון בדיקה - להרצה ידנית בלבד
 */
function createTestData() {
  console.log('🧪 יוצר נתון בדיקה...');
  
  const testData = {
    buttonId: 'test',
    buttonName: 'בדיקת מערכת',
    timestamp: new Date().toISOString(),
    userAgent: 'Google Apps Script Test',
    url: 'https://script.google.com/test',
    sessionId: 'test-session-' + Date.now(),
    category: 'test'
  };
  
  console.log('📊 נתוני בדיקה:', JSON.stringify(testData, null, 2));
  
  try {
    const result = saveClickData(testData);
    console.log('✅ נתון בדיקה נוצר בהצלחה:', result);
    
    return {
      success: true,
      message: 'נתון בדיקה נוצר בהצלחה!',
      testData: testData,
      result: result,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ יצירת נתון בדיקה נכשלה:', error.toString());
    console.error('📍 Stack trace:', error.stack);
    
    return {
      success: false,
      error: error.toString(),
      testData: testData,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * פונקציה ליצירת דוח סטטיסטיקות
 */
function createStatisticsReport() {
  console.log('📈 יוצר דוח סטטיסטיקות...');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dataSheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!dataSheet || dataSheet.getLastRow() <= 1) {
      console.log('⚠️ אין נתונים זמינים לדוח');
      return { 
        success: false, 
        error: 'אין נתונים זמינים לדוח',
        timestamp: new Date().toISOString()
      };
    }
    
    // מחיקת דוח קיים
    let statsSheet = spreadsheet.getSheetByName('סטטיסטיקות');
    if (statsSheet) {
      spreadsheet.deleteSheet(statsSheet);
      console.log('🗑️ דוח קיים נמחק');
    }
    
    // יצירת דוח חדש
    statsSheet = spreadsheet.insertSheet('סטטיסטיקות');
    console.log('📊 דוח חדש נוצר');
    
    // כותרת ראשית
    statsSheet.getRange('A1').setValue('📊 דוח סטטיסטיקות - BOTEX Analytics');
    statsSheet.getRange('A1').setFontSize(16).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    
    // תאריך הדוח
    statsSheet.getRange('A2').setValue('📅 תאריך הדוח: ' + new Date().toLocaleDateString('he-IL'));
    statsSheet.getRange('A2').setFontWeight('bold');
    
    // קריאת נתונים
    const data = dataSheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log('📊 נתונים נקראו:', rows.length, 'שורות');
    
    // סטטיסטיקות כלליות
    statsSheet.getRange('A4').setValue('📈 סטטיסטיקות כלליות:');
    statsSheet.getRange('A4').setFontWeight('bold').setFontSize(14);
    
    statsSheet.getRange('A5').setValue('• סה"כ לחיצות: ' + rows.length);
    
    // ספירת סשנים ייחודיים
    const uniqueSessions = new Set(rows.map(row => row[4])).size; // עמודה E - מזהה סשן
    statsSheet.getRange('A6').setValue('• סשנים ייחודיים: ' + uniqueSessions);
    
    // לחיצות לפי כפתור
    const buttonStats = {};
    rows.forEach(row => {
      const buttonName = row[2]; // עמודה C - שם כפתור
      buttonStats[buttonName] = (buttonStats[buttonName] || 0) + 1;
    });
    
    statsSheet.getRange('A8').setValue('🔘 לחיצות לפי כפתור:');
    statsSheet.getRange('A8').setFontWeight('bold').setFontSize(14);
    
    let currentRow = 9;
    Object.entries(buttonStats).forEach(([button, count]) => {
      statsSheet.getRange(`A${currentRow}`).setValue(`• ${button}: ${count} לחיצות`);
      currentRow++;
    });
    
    // לחיצות לפי יום
    const dayStats = {};
    rows.forEach(row => {
      const day = row[7]; // עמודה H - יום בשבוע
      dayStats[day] = (dayStats[day] || 0) + 1;
    });
    
    currentRow += 1;
    statsSheet.getRange(`A${currentRow}`).setValue('📅 לחיצות לפי יום בשבוע:');
    statsSheet.getRange(`A${currentRow}`).setFontWeight('bold').setFontSize(14);
    currentRow++;
    
    Object.entries(dayStats).forEach(([day, count]) => {
      statsSheet.getRange(`A${currentRow}`).setValue(`• יום ${day}: ${count} לחיצות`);
      currentRow++;
    });
    
    // עיצוב כללי
    statsSheet.autoResizeColumns(1, 1);
    
    console.log('✅ דוח סטטיסטיקות נוצר בהצלחה');
    
    return { 
      success: true, 
      message: 'דוח סטטיסטיקות נוצר בהצלחה!',
      totalClicks: rows.length,
      uniqueSessions: uniqueSessions,
      buttonStats: buttonStats,
      dayStats: dayStats,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ שגיאה ביצירת דוח:', error.toString());
    return { 
      success: false, 
      error: error.toString(),
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * פונקציה לניקוי נתונים ישנים
 */
function cleanOldData(daysToKeep = 90) {
  console.log('🧹 מנקה נתונים ישנים מעל', daysToKeep, 'ימים');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet || sheet.getLastRow() <= 1) {
      console.log('⚠️ אין נתונים לניקוי');
      return { 
        success: true, 
        message: 'אין נתונים לניקוי',
        timestamp: new Date().toISOString()
      };
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    console.log('📅 תאריך חיתוך:', cutoffDate);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // סינון שורות חדשות
    const newRows = rows.filter(row => {
      const rowDate = new Date(row[0]); // עמודה A - תאריך ושעה
      return rowDate >= cutoffDate;
    });
    
    console.log('📊 שורות לפני ניקוי:', rows.length);
    console.log('📊 שורות אחרי ניקוי:', newRows.length);
    console.log('🗑️ שורות שיימחקו:', rows.length - newRows.length);
    
    // ניקוי הגיליון והוספת נתונים מסוננים
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    if (newRows.length > 0) {
      sheet.getRange(2, 1, newRows.length, headers.length).setValues(newRows);
    }
    
    // עיצוב מחדש
    formatSheet(sheet);
    
    console.log('✅ ניקוי הושלם בהצלחה');
    
    return {
      success: true,
      message: `נוקו ${rows.length - newRows.length} שורות ישנות`,
      deletedRows: rows.length - newRows.length,
      remainingRows: newRows.length,
      cutoffDate: cutoffDate.toISOString(),
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ שגיאה בניקוי נתונים:', error.toString());
    return {
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    };
  }
} 