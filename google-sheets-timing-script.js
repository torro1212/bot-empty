/**
 * BOTEX Analytics - Google Sheets Integration Script
 * מערכת מעקב זמן וניתוח ביצועים
 */

function doPost(e) {
  try {
    // בדיקה שהפרמטר e קיים ויש לו את postData.contents
    if (!e || !e.postData || !e.postData.contents) {
      console.error('שגיאה: הבקשה חסרה או לא תקינה', e);
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: 'בקשה לא תקינה'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    console.log('נתונים שהתקבלו:', data);
    
    if (data.type === 'timing') {
      return handleTimingData(data);
    } else if (data.type === 'click') {
      return handleClickData(data);
    } else {
      // Handle regular click data (for backward compatibility)
      return handleClickData({...data, type: 'click'});
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'סוג נתונים לא מוכר'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('שגיאה:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'הסקריפט פועל כראוי',
      info: 'השתמש בבקשת POST כדי לשלוח נתונים'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleTimingData(data) {
  try {
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = getOrCreateSheet(spreadsheet, 'BOTEX Analytics - זמנים');
    
    // יצירת כותרות אם הגיליון ריק
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
      
      // עיצוב כותרות
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4CAF50');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // המרת מילישניות לשניות
    const durationInSeconds = data.duration ? Math.round(data.duration / 1000) : null;
    
    // הוספת הנתונים
    const row = [
      new Date(data.startTime).toLocaleDateString('he-IL'),
      new Date(data.startTime).toLocaleTimeString('he-IL'),
      data.sessionId,
      new Date(data.startTime).toLocaleString('he-IL'),
      new Date(data.endTime).toLocaleString('he-IL'),
      durationInSeconds,
      data.durationFormatted || (data.duration ? formatDuration(data.duration) : 'N/A'),
      data.actionType,
      data.buttonId,
      data.completed ? 'כן' : 'לא',
      data.userAgent,
      data.url
    ];
    
    sheet.appendRow(row);
    
    // יצירת דוח סטטיסטיקות
    updateStatisticsSheet(spreadsheet);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'נתוני זמן נשמרו בהצלחה'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('שגיאה בשמירת נתוני זמן:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleClickData(data) {
  try {
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = getOrCreateSheet(spreadsheet, 'BOTEX Analytics - לחיצות');
    
    // יצירת כותרות אם הגיליון ריק
    if (sheet.getLastRow() === 0) {
      const headers = [
        'תאריך',
        'שעה',
        'מזהה כפתור',
        'טקסט כפתור',
        'סוג פעולה',
        'URL',
        'דפדפן',
        'רזולוציה',
        'מיקום X',
        'מיקום Y',
        'מזהה סשן',
        'זמן פתרון (שניות)',
        'זמן פתרון (מעוצב)', 
        'הושלם'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // עיצוב כותרות
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#2196F3');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // בדיקה אם יש מידע על זמן פתרון מתוך הנתונים שהתקבלו
    let resolutionTime = null;
    let formattedResolutionTime = 'N/A';
    let completed = 'N/A';
    
    if (data.sessionId) {
      // ננסה למצוא את נתוני הזמן המשויכים לסשן זה
      const timingSheet = spreadsheet.getSheetByName('BOTEX Analytics - זמנים');
      if (timingSheet && timingSheet.getLastRow() > 0) {
        const timingData = timingSheet.getDataRange().getValues();
        const sessionColumn = 2; // מזהה סשן בעמודה ג'
        
        // חיפוש שורה עם מזהה הסשן
        for (let i = timingData.length - 1; i >= 1; i--) { // התחל מהסוף - הכי עדכני
          if (timingData[i][sessionColumn] === data.sessionId) {
            resolutionTime = timingData[i][5]; // משך זמן בשניות
            formattedResolutionTime = timingData[i][6]; // משך זמן מעוצב
            completed = timingData[i][9]; // הושלם?
            break;
          }
        }
      }
    }
    
    // הוספת הנתונים
    const row = [
      new Date(data.timestamp).toLocaleDateString('he-IL'),
      new Date(data.timestamp).toLocaleTimeString('he-IL'),
      data.buttonId,
      data.buttonName || data.buttonText,
      data.category || data.actionType,
      data.url,
      data.userAgent,
      data.screenResolution || 'N/A',
      data.clickX || 'N/A',
      data.clickY || 'N/A',
      data.sessionId || 'N/A',
      resolutionTime || 'N/A',
      formattedResolutionTime || 'N/A',
      completed || 'N/A'
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'נתוני לחיצה נשמרו בהצלחה'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('שגיאה בשמירת נתוני לחיצה:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSpreadsheet() {
  const spreadsheetName = 'BOTEX Analytics Dashboard';
  
  // חיפוש קובץ קיים
  const files = DriveApp.getFilesByName(spreadsheetName);
  
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  } else {
    // יצירת קובץ חדש
    const spreadsheet = SpreadsheetApp.create(spreadsheetName);
    console.log('נוצר גיליון חדש:', spreadsheet.getUrl());
    return spreadsheet;
  }
}

function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  
  return sheet;
}

function updateStatisticsSheet(spreadsheet) {
  try {
    const sheet = getOrCreateSheet(spreadsheet, 'סטטיסטיקות');
    const timingSheet = spreadsheet.getSheetByName('BOTEX Analytics - זמנים');
    
    if (!timingSheet || timingSheet.getLastRow() <= 1) {
      return;
    }
    
    // ניקוי הגיליון
    sheet.clear();
    
    // כותרת
    sheet.getRange(1, 1).setValue('📊 דוח סטטיסטיקות BOTEX');
    sheet.getRange(1, 1).setFontSize(16).setFontWeight('bold').setBackground('#FF9800').setFontColor('white');
    sheet.getRange(1, 1, 1, 4).merge();
    
    // קבלת כל הנתונים
    const data = timingSheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    if (rows.length === 0) return;
    
    // חישוב סטטיסטיקות - עכשיו בשניות ולא במילישניות
    const durations = rows.map(row => row[5]).filter(d => d && d > 0); // עמודת משך בשניות
    const completed = rows.filter(row => row[9] === 'כן').length; // עמודת הושלם
    const abandoned = rows.filter(row => row[9] === 'לא').length;
    
    if (durations.length === 0) return;
    
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    // הצגת הסטטיסטיקות
    let row = 3;
    const stats = [
      ['📈 סך הכל סשנים:', rows.length],
      ['✅ הושלמו בהצלחה:', completed],
      ['❌ נזנחו:', abandoned],
      ['🎯 אחוז השלמה:', `${((completed / rows.length) * 100).toFixed(1)}%`],
      ['⏱️ זמן ממוצע:', `${avgDuration.toFixed(1)} שניות`],
      ['⚡ זמן מינימלי:', `${minDuration} שניות`],
      ['🐌 זמן מקסימלי:', `${maxDuration} שניות`],
      ['📅 עודכן לאחרונה:', new Date().toLocaleString('he-IL')]
    ];
    
    stats.forEach(([label, value]) => {
      sheet.getRange(row, 1).setValue(label).setFontWeight('bold');
      sheet.getRange(row, 2).setValue(value);
      row++;
    });
    
    // עיצוב
    sheet.autoResizeColumns(1, 2);
    
  } catch (error) {
    console.error('שגיאה ביצירת סטטיסטיקות:', error);
  }
}

function formatDuration(ms) {
  if (!ms || ms < 0) return '0ש';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}ד ${hours % 24}ש ${minutes % 60}ד`;
  } else if (hours > 0) {
    return `${hours}ש ${minutes % 60}ד`;
  } else if (minutes > 0) {
    return `${minutes}ד ${seconds % 60}ש`;
  } else {
    return `${seconds}ש`;
  }
}

function testScript() {
  const testData = {
    buttonId: 'test-button',
    buttonName: 'Test Button',
    timestamp: new Date().toISOString(),
    userAgent: 'Test Script',
    url: 'https://test.com',
    sessionId: `test_${new Date().getTime()}`,
    category: 'test'
  };
  
  const testResult = handleClickData(testData);
  console.log('תוצאת בדיקה:', testResult);
  
  const testTimingData = {
    type: 'timing',
    sessionId: testData.sessionId,
    startTime: new Date(Date.now() - 60000).toISOString(),
    endTime: new Date().toISOString(),
    duration: 60000,
    actionType: 'test',
    buttonId: testData.buttonId,
    completed: true,
    userAgent: testData.userAgent,
    url: testData.url
  };
  
  const testTimingResult = handleTimingData(testTimingData);
  console.log('תוצאת בדיקת זמן:', testTimingResult);
} 