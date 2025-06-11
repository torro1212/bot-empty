/**
 * Google Apps Script לקבלת נתוני לחיצות ושמירתם ב-Google Sheets
 * 
 * הוראות התקנה:
 * 1. פתח https://script.google.com
 * 2. צור פרויקט חדש
 * 3. העתק את הקוד הזה
 * 4. שמור ופרסם כ-Web App
 * 5. העתק את ה-URL שתקבל
 */

// הגדרות בסיסיות
const SHEET_NAME = 'BOTEX Analytics'; // שם הגיליון
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // מזהה הגיליון (מה-URL)

/**
 * פונקציה ראשית שמטפלת בבקשות HTTP
 */
function doPost(e) {
  try {
    // פענוח הנתונים שהתקבלו
    const data = JSON.parse(e.postData.contents);
    
    // שמירת הנתונים בגיליון
    const result = saveClickData(data);
    
    // החזרת תגובה חיובית
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'נתונים נשמרו בהצלחה',
        timestamp: new Date().toISOString(),
        rowsAdded: result.rowsAdded
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // החזרת שגיאה
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * פונקציה לשמירת נתוני לחיצה בגיליון
 */
function saveClickData(clickData) {
  // פתיחת הגיליון
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // יצירת גיליון חדש אם לא קיים
  if (!sheet) {
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
    
    // עיצוב כותרות
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
  }
  
  // הכנת הנתונים לשמירה
  const timestamp = new Date(clickData.timestamp);
  const rowData = [
    timestamp,
    clickData.buttonId,
    clickData.buttonName,
    clickData.category || 'main_buttons',
    clickData.sessionId,
    clickData.userAgent,
    clickData.url,
    getDayOfWeek(timestamp),
    timestamp.getHours(),
    timestamp.getMonth() + 1,
    timestamp.getFullYear()
  ];
  
  // הוספת השורה לגיליון
  sheet.appendRow(rowData);
  
  // עיצוב אוטומטי
  formatSheet(sheet);
  
  return {
    rowsAdded: 1,
    totalRows: sheet.getLastRow() - 1 // מינוס שורת הכותרות
  };
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
}

/**
 * פונקציה ליצירת דוח סטטיסטיקות
 */
function createStatisticsReport() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const dataSheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!dataSheet || dataSheet.getLastRow() <= 1) {
    return { error: 'אין נתונים זמינים' };
  }
  
  // יצירת גיליון סטטיסטיקות
  let statsSheet = spreadsheet.getSheetByName('סטטיסטיקות');
  if (statsSheet) {
    spreadsheet.deleteSheet(statsSheet);
  }
  statsSheet = spreadsheet.insertSheet('סטטיסטיקות');
  
  // כותרת
  statsSheet.getRange('A1').setValue('דוח סטטיסטיקות - BOTEX Analytics');
  statsSheet.getRange('A1').setFontSize(16).setFontWeight('bold');
  
  // תאריך הדוח
  statsSheet.getRange('A2').setValue('תאריך הדוח: ' + new Date().toLocaleDateString('he-IL'));
  
  // סטטיסטיקות כלליות
  const data = dataSheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  statsSheet.getRange('A4').setValue('סטטיסטיקות כלליות:');
  statsSheet.getRange('A4').setFontWeight('bold');
  
  statsSheet.getRange('A5').setValue('סה"כ לחיצות: ' + rows.length);
  
  // לחיצות לפי כפתור
  const buttonStats = {};
  rows.forEach(row => {
    const buttonName = row[2]; // שם כפתור
    buttonStats[buttonName] = (buttonStats[buttonName] || 0) + 1;
  });
  
  statsSheet.getRange('A7').setValue('לחיצות לפי כפתור:');
  statsSheet.getRange('A7').setFontWeight('bold');
  
  let currentRow = 8;
  Object.entries(buttonStats).forEach(([button, count]) => {
    statsSheet.getRange(`A${currentRow}`).setValue(`${button}: ${count} לחיצות`);
    currentRow++;
  });
  
  return { success: true, message: 'דוח נוצר בהצלחה' };
}

/**
 * פונקציה לבדיקת חיבור
 */
function testConnection() {
  return {
    success: true,
    message: 'החיבור ל-Google Sheets פעיל',
    timestamp: new Date().toISOString(),
    spreadsheetId: SPREADSHEET_ID
  };
}

/**
 * פונקציה לניקוי נתונים ישנים (אופציונלי)
 */
function cleanOldData(daysToKeep = 90) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet || sheet.getLastRow() <= 1) {
    return { message: 'אין נתונים לניקוי' };
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  // סינון שורות חדשות
  const newRows = rows.filter(row => {
    const rowDate = new Date(row[0]);
    return rowDate >= cutoffDate;
  });
  
  // ניקוי הגיליון והוספת נתונים מסוננים
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  if (newRows.length > 0) {
    sheet.getRange(2, 1, newRows.length, headers.length).setValues(newRows);
  }
  
  formatSheet(sheet);
  
  return {
    success: true,
    message: `נוקו ${rows.length - newRows.length} שורות ישנות`,
    remainingRows: newRows.length
  };
} 