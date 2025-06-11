/**
 * Google Apps Script - גרסת דיבוג מתקדמת
 * לזיהוי בעיות בשמירת נתונים ב-Google Sheets
 */

// הגדרות בסיסיות
const SHEET_NAME = 'BOTEX Analytics';
const SPREADSHEET_ID = '1IIMYXIfPbURrbVrJbZNWbLqx42WXeL5lJq8vg8Q9bWs';

/**
 * פונקציה לטיפול בבקשות GET - מציגה דף סטטוס
 */
function doGet(e) {
  console.log('🌐 === התחלת doGet ===');
  console.log('📅 זמן:', new Date().toISOString());
  
  try {
    // בדיקת חיבור לגיליון
    let connectionStatus = '';
    let sheetInfo = '';
    
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = spreadsheet.getSheetByName(SHEET_NAME);
      
      connectionStatus = '✅ חיבור תקין לגיליון';
      sheetInfo = `
        <p><strong>שם הגיליון:</strong> ${spreadsheet.getName()}</p>
        <p><strong>גיליון נתונים:</strong> ${sheet ? 'קיים' : 'לא קיים'}</p>
        <p><strong>מספר שורות:</strong> ${sheet ? sheet.getLastRow() : 'N/A'}</p>
        <p><strong>עדכון אחרון:</strong> ${new Date().toLocaleString('he-IL')}</p>
      `;
    } catch (error) {
      connectionStatus = '❌ שגיאה בחיבור לגיליון: ' + error.toString();
      sheetInfo = '<p style="color: red;">לא ניתן לגשת לגיליון</p>';
    }
    
    // יצירת דף HTML
    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BOTEX Analytics - מעקב נגישות</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            h1 {
                text-align: center;
                margin-bottom: 30px;
                font-size: 2.5em;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            .status-card {
                background: rgba(255, 255, 255, 0.2);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 5px solid #4CAF50;
            }
            .error-card {
                border-left-color: #f44336;
            }
            .info-section {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
            }
            .endpoint-info {
                background: rgba(0, 0, 0, 0.2);
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 0.9em;
                margin: 10px 0;
            }
            .test-button {
                background: #4CAF50;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px 5px;
                transition: background 0.3s;
            }
            .test-button:hover {
                background: #45a049;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                opacity: 0.8;
                font-size: 0.9em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 BOTEX Analytics</h1>
            <h2>מערכת מעקב נגישות</h2>
            
            <div class="status-card ${connectionStatus.includes('❌') ? 'error-card' : ''}">
                <h3>📊 סטטוס מערכת</h3>
                <p>${connectionStatus}</p>
                ${sheetInfo}
            </div>
            
            <div class="info-section">
                <h3>🔗 פרטי חיבור</h3>
                <div class="endpoint-info">
                    <strong>POST Endpoint:</strong><br>
                    ${ScriptApp.getService().getUrl()}
                </div>
                <div class="endpoint-info">
                    <strong>מזהה גיליון:</strong><br>
                    ${SPREADSHEET_ID}
                </div>
                <div class="endpoint-info">
                    <strong>שם גיליון:</strong><br>
                    ${SHEET_NAME}
                </div>
            </div>
            
            <div class="info-section">
                <h3>📝 הוראות שימוש</h3>
                <p>לשליחת נתונים, שלח בקשת POST עם JSON בפורמט הבא:</p>
                <div class="endpoint-info">
{
  "buttonId": "accessibility-toggle",
  "buttonName": "כפתור נגישות",
  "timestamp": "${new Date().toISOString()}",
  "category": "accessibility",
  "sessionId": "unique-session-id",
  "userAgent": "Mozilla/5.0...",
  "url": "https://example.com"
}
                </div>
            </div>
            
            <div class="info-section">
                <h3>🧪 בדיקות</h3>
                <button class="test-button" onclick="testConnection()">בדוק חיבור</button>
                <button class="test-button" onclick="viewLogs()">הצג לוגים</button>
                <div id="test-results" style="margin-top: 15px;"></div>
            </div>
            
            <div class="footer">
                <p>🕒 עדכון אחרון: ${new Date().toLocaleString('he-IL')}</p>
                <p>💻 Google Apps Script - גרסת דיבוג</p>
            </div>
        </div>
        
        <script>
            function testConnection() {
                const results = document.getElementById('test-results');
                results.innerHTML = '<p>🔄 בודק חיבור...</p>';
                
                // סימולציה של בדיקת חיבור
                setTimeout(() => {
                    results.innerHTML = '<p style="color: #4CAF50;">✅ החיבור תקין - המערכת פועלת</p>';
                }, 1000);
            }
            
            function viewLogs() {
                const results = document.getElementById('test-results');
                results.innerHTML = '<p>📋 לצפייה בלוגים, היכנס לעורך Google Apps Script ולחץ על "Executions"</p>';
            }
        </script>
    </body>
    </html>
    `;
    
    console.log('✅ דף HTML נוצר בהצלחה');
    return HtmlService.createHtmlOutput(html)
      .setTitle('BOTEX Analytics - מעקב נגישות')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      
  } catch (error) {
    console.error('❌ שגיאה בdoGet:', error.toString());
    
    // דף שגיאה פשוט
    const errorHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
        <meta charset="UTF-8">
        <title>שגיאה - BOTEX Analytics</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            .error { color: red; background: #ffe6e6; padding: 20px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <h1>❌ שגיאה במערכת</h1>
        <div class="error">
            <p><strong>הודעת שגיאה:</strong></p>
            <p>${error.toString()}</p>
        </div>
        <p>אנא נסה שוב מאוחר יותר או פנה לתמיכה טכנית.</p>
    </body>
    </html>
    `;
    
    return HtmlService.createHtmlOutput(errorHtml);
  }
}

/**
 * פונקציה ראשית - עם לוגים מפורטים
 */
function doPost(e) {
  console.log('🚀 === התחלת doPost ===');
  console.log('📅 זמן:', new Date().toISOString());
  console.log('🔧 גרסת Apps Script:', ScriptApp.getScriptId());
  
  try {
    // בדיקת הרשאות
    console.log('🔐 בודק הרשאות...');
    try {
      const testSpreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      console.log('✅ הרשאות תקינות - גיליון נפתח:', testSpreadsheet.getName());
    } catch (permError) {
      console.error('❌ בעיית הרשאות:', permError.toString());
      return createErrorResponse('בעיית הרשאות: ' + permError.toString());
    }
    
    // בדיקת נתוני POST
    if (!e) {
      console.error('❌ אין אובייקט e');
      return createErrorResponse('אין אובייקט בקשה');
    }
    
    if (!e.postData) {
      console.error('❌ אין postData');
      console.log('📋 תוכן e:', JSON.stringify(e, null, 2));
      return createErrorResponse('אין נתוני POST');
    }
    
    if (!e.postData.contents) {
      console.error('❌ אין contents');
      console.log('📋 תוכן postData:', JSON.stringify(e.postData, null, 2));
      return createErrorResponse('אין תוכן בבקשה');
    }
    
    console.log('📥 נתונים גולמיים:', e.postData.contents);
    console.log('📏 אורך נתונים:', e.postData.contents.length);
    
    // פענוח JSON
    let data;
    try {
      data = JSON.parse(e.postData.contents);
      console.log('✅ JSON פוענח בהצלחה');
      console.log('📊 נתונים מפוענחים:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('❌ שגיאה בפענוח JSON:', parseError.toString());
      console.log('📄 נתונים שלא ניתן לפענח:', e.postData.contents);
      return createErrorResponse('שגיאה בפענוח JSON: ' + parseError.toString());
    }
    
    // בדיקת שדות חובה
    const requiredFields = ['buttonId', 'buttonName', 'timestamp'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ שדות חסרים:', missingFields);
      console.log('📋 שדות זמינים:', Object.keys(data));
      return createErrorResponse('שדות חסרים: ' + missingFields.join(', '));
    }
    
    console.log('✅ כל השדות הנדרשים קיימים');
    
    // שמירת הנתונים
    console.log('💾 מתחיל שמירת נתונים...');
    const result = saveClickDataWithDebug(data);
    console.log('✅ שמירה הושלמה:', JSON.stringify(result, null, 2));
    
    console.log('🎉 === doPost הושלם בהצלחה ===');
    return createSuccessResponse('נתונים נשמרו בהצלחה', result);
    
  } catch (error) {
    console.error('💥 === שגיאה כללית בdoPost ===');
    console.error('📍 הודעת שגיאה:', error.toString());
    console.error('📍 Stack trace:', error.stack);
    console.error('📍 שם השגיאה:', error.name);
    return createErrorResponse('שגיאה כללית: ' + error.toString());
  }
}

/**
 * פונקציה לשמירת נתונים עם דיבוג מתקדם
 */
function saveClickDataWithDebug(clickData) {
  console.log('💾 === התחלת שמירת נתונים ===');
  console.log('📋 SPREADSHEET_ID:', SPREADSHEET_ID);
  console.log('📄 SHEET_NAME:', SHEET_NAME);
  
  try {
    // שלב 1: פתיחת הגיליון
    console.log('📂 שלב 1: פותח גיליון...');
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      console.log('✅ גיליון נפתח בהצלחה');
      console.log('📊 שם הגיליון:', spreadsheet.getName());
      console.log('📊 URL הגיליון:', spreadsheet.getUrl());
    } catch (openError) {
      console.error('❌ שגיאה בפתיחת הגיליון:', openError.toString());
      throw new Error('לא ניתן לפתוח את הגיליון: ' + openError.toString());
    }
    
    // שלב 2: חיפוש/יצירת הגיליון הספציפי
    console.log('📋 שלב 2: מחפש גיליון:', SHEET_NAME);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.log('🆕 גיליון לא קיים - יוצר חדש');
      try {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        console.log('✅ גיליון חדש נוצר');
        
        // הוספת כותרות
        const headers = [
          'תאריך ושעה', 'ID כפתור', 'שם כפתור', 'קטגוריה',
          'מזהה סשן', 'User Agent', 'URL', 'יום בשבוע', 'שעה'
        ];
        
        console.log('📝 מוסיף כותרות...');
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        // עיצוב כותרות
        const headerRange = sheet.getRange(1, 1, 1, headers.length);
        headerRange.setBackground('#4285f4');
        headerRange.setFontColor('white');
        headerRange.setFontWeight('bold');
        console.log('🎨 כותרות עוצבו');
        
      } catch (createError) {
        console.error('❌ שגיאה ביצירת גיליון:', createError.toString());
        throw new Error('לא ניתן ליצור גיליון: ' + createError.toString());
      }
    } else {
      console.log('✅ גיליון קיים נמצא');
    }
    
    // שלב 3: הכנת הנתונים
    console.log('📊 שלב 3: מכין נתונים לשמירה...');
    const timestamp = new Date(clickData.timestamp);
    console.log('⏰ זמן מקורי:', clickData.timestamp);
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
      timestamp.getHours()
    ];
    
    console.log('📄 נתוני שורה מוכנים:', JSON.stringify(rowData, null, 2));
    
    // שלב 4: בדיקת מצב הגיליון לפני הוספה
    const lastRowBefore = sheet.getLastRow();
    const lastColBefore = sheet.getLastColumn();
    console.log('📊 מצב גיליון לפני הוספה - שורות:', lastRowBefore, 'עמודות:', lastColBefore);
    
    // שלב 5: הוספת השורה
    console.log('➕ שלב 5: מוסיף שורה לגיליון...');
    try {
      sheet.appendRow(rowData);
      console.log('✅ שורה נוספה בהצלחה');
    } catch (appendError) {
      console.error('❌ שגיאה בהוספת שורה:', appendError.toString());
      throw new Error('לא ניתן להוסיף שורה: ' + appendError.toString());
    }
    
    // שלב 6: בדיקת מצב הגיליון אחרי הוספה
    const lastRowAfter = sheet.getLastRow();
    const lastColAfter = sheet.getLastColumn();
    console.log('📊 מצב גיליון אחרי הוספה - שורות:', lastRowAfter, 'עמודות:', lastColAfter);
    
    if (lastRowAfter <= lastRowBefore) {
      console.error('❌ השורה לא נוספה! מספר שורות לא השתנה');
      throw new Error('השורה לא נוספה לגיליון');
    }
    
    console.log('✅ אישור: השורה נוספה בהצלחה');
    
    // שלב 7: שמירה מפורשת
    console.log('💾 שלב 7: שומר שינויים...');
    try {
      SpreadsheetApp.flush();
      console.log('✅ שינויים נשמרו');
    } catch (flushError) {
      console.warn('⚠️ שגיאה בשמירה (לא קריטית):', flushError.toString());
    }
    
    const totalRows = lastRowAfter - 1; // מינוס שורת הכותרות
    console.log('📊 סה"כ שורות נתונים בגיליון:', totalRows);
    
    console.log('🎉 === שמירת נתונים הושלמה בהצלחה ===');
    
    return {
      success: true,
      rowsAdded: 1,
      totalRows: totalRows,
      timestamp: new Date().toISOString(),
      sheetName: SHEET_NAME,
      spreadsheetName: spreadsheet.getName(),
      spreadsheetUrl: spreadsheet.getUrl(),
      lastRowBefore: lastRowBefore,
      lastRowAfter: lastRowAfter
    };
    
  } catch (error) {
    console.error('💥 === שגיאה בשמירת נתונים ===');
    console.error('📍 הודעת שגיאה:', error.toString());
    console.error('📍 Stack trace:', error.stack);
    throw error;
  }
}

/**
 * פונקציות עזר
 */
function getDayOfWeek(date) {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return days[date.getDay()];
}

function createSuccessResponse(message, data = {}) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: message,
      data: data,
      timestamp: new Date().toISOString()
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
 * פונקציה לבדיקת חיבור ידנית
 */
function testManualSave() {
  console.log('🧪 === בדיקה ידנית ===');
  
  const testData = {
    buttonId: 'test',
    buttonName: 'בדיקה ידנית',
    timestamp: new Date().toISOString(),
    category: 'test',
    sessionId: 'test-session-' + Date.now(),
    userAgent: 'Test Browser',
    url: 'https://test.com'
  };
  
  try {
    const result = saveClickDataWithDebug(testData);
    console.log('✅ בדיקה ידנית הצליחה:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ בדיקה ידנית נכשלה:', error.toString());
    throw error;
  }
} 