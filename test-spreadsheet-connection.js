/**
 * סקריפט בדיקה פשוט לוודא שה-SPREADSHEET_ID נכון
 * הרץ את הפונקציה testSpreadsheetConnection() ב-Google Apps Script
 */

const SPREADSHEET_ID = '1VTuFkUeiPjZ1HtdDg-47cVmpcw-lZvxWTaxg50DFdO4';

function testSpreadsheetConnection() {
  console.log('🧪 בודק חיבור לגיליון...');
  console.log('📋 SPREADSHEET_ID:', SPREADSHEET_ID);
  
  try {
    // ניסיון פתיחת הגיליון
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    console.log('✅ הגיליון נפתח בהצלחה!');
    console.log('📊 שם הגיליון:', spreadsheet.getName());
    console.log('📊 URL הגיליון:', spreadsheet.getUrl());
    
    // בדיקה אם יש הרשאות כתיבה
    try {
      const testSheet = spreadsheet.getSheets()[0];
      const testValue = 'בדיקה - ' + new Date().toISOString();
      
      // ניסיון כתיבה
      testSheet.getRange('A1').setValue(testValue);
      console.log('✅ יש הרשאות כתיבה');
      
      // מחיקת הבדיקה
      testSheet.getRange('A1').clear();
      console.log('✅ בדיקה הושלמה');
      
    } catch (writeError) {
      console.error('❌ אין הרשאות כתיבה:', writeError.toString());
    }
    
    return {
      success: true,
      spreadsheetName: spreadsheet.getName(),
      spreadsheetUrl: spreadsheet.getUrl(),
      canWrite: true
    };
    
  } catch (error) {
    console.error('❌ שגיאה בחיבור:', error.toString());
    
    if (error.toString().includes('not found')) {
      console.error('💡 הסיבה האפשרית: SPREADSHEET_ID לא נכון');
    } else if (error.toString().includes('permission')) {
      console.error('💡 הסיבה האפשרית: אין הרשאות לגיליון');
    }
    
    return {
      success: false,
      error: error.toString()
    };
  }
} 