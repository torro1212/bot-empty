/**
 * Google Apps Script מתוקן עם לוגים מפורטים
 * גרסה מתוקנת לפתרון בעיות
 */

// הגדרות בסיסיות - ודא שה-SPREADSHEET_ID נכון!
const SHEET_NAME = 'BOTEX Analytics';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // החלף עם ה-ID האמיתי!

/**
 * פונקציה ראשית - מטפלת בבקשות POST
 */
function doPost(e) {
  console.log('🚀 doPost נקראה - התחלת עיבוד');
  
  try {
    // בדיקה שהבקשה תקינה
    if (!e || !e.postData || !e.postData.contents) {
      console.error('❌ אין נתוני POST');
      return createErrorResponse('אין נתוני POST');
    }
    
    console.log('📥 נתונים התקבלו:', e.postData.contents);
    
    // פענוח הנתונים
    const data = JSON.parse(e.postData.contents);
    console.log('📊 נתונים מפוענחים:', JSON.stringify(data));
    
    // בדיקה שהנתונים תקינים
    if (!data.buttonId || !data.buttonName || !data.timestamp) {
      console.error('❌ נתונים חסרים:', data);
      return createErrorResponse('נתונים חסרים');
    }
    
    // שמירת הנתונים
    const result = saveClickData(data);
    console.log('✅ נתונים נשמרו:', result);
    
    // החזרת תגובה חיובית
    return createSuccessResponse('נתונים נשמרו בהצלחה', result);
    
  } catch (error) {
    console.error('💥 שגיאה כללית:', error.toString());
    return createErrorResponse(error.toString());
  }
}

/**
 * פונקציה לשמירת נתוני לחיצה
 */
function saveClickData(clickData) {
  console.log('💾 מתחיל שמירת נתונים...');
  
  try {
    // בדיקת SPREADSHEET_ID
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID') {
      throw new Error('SPREADSHEET_ID לא הוגדר! החלף את YOUR_SPREADSHEET_ID עם ה-ID האמיתי');
    }
    
    console.log('📋 פותח גיליון:', SPREADSHEET_ID);
    
    // פתיחת הגיליון
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
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
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      console.log('📝 כותרות נוספו');
      
      // עיצוב כותרות
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      console.log('🎨 כותרות עוצבו');
    }
    
    // הכנת הנתונים לשמירה
    const timestamp = new Date(clickData.timestamp);
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
    sheet.appendRow(rowData);
    console.log('✅ שורה נוספה לגיליון');
    
    // עיצוב אוטומטי
    formatSheet(sheet);
    console.log('🎨 גיליון עוצב');
    
    const totalRows = sheet.getLastRow() - 1; // מינוס שורת הכותרות
    console.log('📊 סה"כ שורות בגיליון:', totalRows);
    
    return {
      rowsAdded: 1,
      totalRows: totalRows,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('💥 שגיאה בשמירת נתונים:', error.toString());
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
    
    if (lastRow > 1) {
      // עיצוב כל הנתונים
      const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
      
      // גבולות
      dataRange.setBorder(true, true, true, true, true, true);
      
      // יישור טקסט
      sheet.getRange(2, 1, lastRow - 1, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
      sheet.getRange(2, 2, lastRow - 1, lastCol - 1).setHorizontalAlignment('center');
      
      // צבעים לסירוגין
      for (let i = 2; i <= lastRow; i++) {
        if (i % 2 === 0) {
          sheet.getRange(i, 1, 1, lastCol).setBackground('#f8f9fa');
        }
      }
      
      // התאמת רוחב עמודות
      sheet.autoResizeColumns(1, lastCol);
    }
  } catch (error) {
    console.warn('⚠️ שגיאה בעיצוב:', error.toString());
  }
}

/**
 * פונקציות עזר ליצירת תגובות
 */
function createSuccessResponse(message, data = {}) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: message,
      timestamp: new Date().toISOString(),
      ...data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(error) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: error,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * פונקציה לבדיקת חיבור - להרצה ידנית
 */
function testConnection() {
  console.log('🧪 בדיקת חיבור...');
  
  try {
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID') {
      throw new Error('SPREADSHEET_ID לא הוגדר!');
    }
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ גיליון נפתח בהצלחה:', spreadsheet.getName());
    
    return {
      success: true,
      message: 'החיבור פעיל',
      spreadsheetName: spreadsheet.getName(),
      spreadsheetId: SPREADSHEET_ID
    };
  } catch (error) {
    console.error('❌ בדיקת חיבור נכשלה:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * פונקציה ליצירת נתון בדיקה - להרצה ידנית
 */
function createTestData() {
  console.log('🧪 יוצר נתון בדיקה...');
  
  const testData = {
    buttonId: 'test',
    buttonName: 'בדיקת מערכת',
    timestamp: new Date().toISOString(),
    userAgent: 'Test Agent',
    url: 'https://test.com',
    sessionId: 'test-session-' + Date.now(),
    category: 'test'
  };
  
  try {
    const result = saveClickData(testData);
    console.log('✅ נתון בדיקה נוצר:', result);
    return result;
  } catch (error) {
    console.error('❌ יצירת נתון בדיקה נכשלה:', error.toString());
    throw error;
  }
} 