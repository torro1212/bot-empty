# תבניות EmailJS מותאמות לעברית - גרסה מעודכנת

## תבנית למשוב (Feedback Template)

### Subject:
```
⭐ התקבל משוב חדש מבוטקס
```

### HTML Content:
```html
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            text-align: center;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .rating-box {
            background: #f0f9ff;
            border: 3px solid #3b82f6;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
        }
        .info-section {
            background: #f8fafc;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .info-title {
            font-weight: bold;
            color: #374151;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .info-value {
            color: #6b7280;
            font-size: 15px;
            line-height: 1.6;
        }
        .footer {
            background: #f1f5f9;
            padding: 25px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>משוב חדש מבוטקס</h1>
        </div>
        
        <div class="content">
            <div class="rating-box">
                דירוג החוויה: {{user_rating}}
            </div>
            
            <div class="info-section">
                <div class="info-title">בהירות ההסברים</div>
                <div class="info-value">{{clarity_rating}}</div>
            </div>
            
            <div class="info-section">
                <div class="info-title">שם המשתמש</div>
                <div class="info-value">{{from_name}}</div>
            </div>
            
            <div class="info-section">
                <div class="info-title">הערות נוספות</div>
                <div class="info-value">{{user_comments}}</div>
            </div>
            
            <div class="info-section">
                <div class="info-title">תאריך ושעה</div>
                <div class="info-value">{{date}}</div>
            </div>
        </div>
        
        <div class="footer">
            נשלח ממערכת בוטקס - העוזר החכם לפתרון תקלות
        </div>
    </div>
</body>
</html>
```

## תבנית לדיווח תקלות (Issue Report Template)

### Subject:
```
🚨 תקלה חדשה‏ : {{brand}} - {{branch_name}}
```

### HTML Content:
```html
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            text-align: center;
            background-color: #fef2f2;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border-top: 5px solid #ef4444;
        }
        .header {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .urgent-notice {
            background: #fee2e2;
            border: 2px solid #ef4444;
            border-radius: 10px;
            padding: 15px;
            margin: 20px;
            color: #dc2626;
            font-weight: bold;
            font-size: 16px;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .info-section {
            background: #f8fafc;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            text-align: center;
        }
        .info-title {
            font-weight: bold;
            color: #374151;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .info-value {
            color: #1f2937;
            font-size: 15px;
            line-height: 1.6;
        }
        .contact-section {
            background: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            background: #f1f5f9;
            padding: 25px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        .priority {
            color: #dc2626;
            font-weight: bold;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>דיווח תקלה חדשה</h1>
        </div>
        
        <div class="urgent-notice">
            תקלה דורשת טיפול מיידי
        </div>
        
        <div class="content">
            <div class="info-section">
                <div class="info-title">מותג</div>
                <div class="info-value">{{brand}}</div>
            </div>
            
            <div class="info-section">
                <div class="info-title">סניף</div>
                <div class="info-value">{{branch_name}}</div>
            </div>
            
            <div class="info-section">
                <div class="info-title">מספר קופה</div>
                <div class="info-value">{{register_number}}</div>
            </div>
            
            <div class="info-section">
                <div class="info-title">פירוט התקלה</div>
                <div class="info-value">{{user_comments}}</div>
            </div>
            
            <div class="contact-section">
                <div class="info-title">פרטי קשר</div>
                <div class="info-value">
                    שם: {{from_name}}<br>
                    טלפון: {{from_phone}}
                </div>
            </div>
            
            <div class="info-section">
                <div class="info-title">תאריך ושעה</div>
                <div class="info-value">{{date}}</div>
            </div>
        </div>
        
        <div class="footer">
            נשלח ממערכת בוטקס - העוזר החכם לפתרון תקלות<br>
            <span class="priority">נא לטפל בהקדם האפשרי</span>
        </div>
    </div>
</body>
</html>
```

## הוראות עדכון ב-EmailJS:

1. היכנס לחשבון EmailJS שלך
2. לך ל-"Email Templates"
3. ערוך את התבניות הקיימות:
   - **תבנית המשוב**: Subject = `התקבל משוב חדש מבוטקס`
   - **תבנית התקלות**: Subject = `דיווח תקלה חדשה מבוטקס`
4. העתק את הקוד HTML המתאים לכל תבנית
5. שמור את השינויים

## מה השתנה:

✅ **Subject פשוט וקבוע** - ללא משתנים מורכבים
✅ **עיצוב מרוכז** - הכל באמצע, נקי וברור
✅ **ללא אמוג'י מיותרים** - רק טקסט ברור
✅ **מידע מסודר** - כל פרט בקופסה נפרדת
✅ **קריאות טובה** - פונטים וצבעים ברורים

## משתנים נוספים שכדאי להוסיף:

- `{{date}}` - תאריך ושעה נוכחיים
- `{{priority}}` - רמת דחיפות
- `{{browser_info}}` - מידע על הדפדפן
- `{{user_ip}}` - כתובת IP של המשתמש 