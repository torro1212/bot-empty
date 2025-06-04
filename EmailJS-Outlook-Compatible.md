# תבניות EmailJS מותאמות ל-Outlook

## תבנית למשוב (Feedback Template) - תואמת Outlook

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
</head>
<body style="font-family: Arial, sans-serif; direction: rtl; text-align: center; background-color: #f5f5f5; margin: 0; padding: 20px;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px;">
        
        <!-- Header -->
        <tr>
            <td style="background-color: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">⭐ משוב חדש מבוטקס</h1>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="padding: 30px;">
                
                <!-- Rating -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                    <tr>
                        <td style="background-color: #f0f9ff; border: 2px solid #3b82f6; padding: 20px; text-align: center; border-radius: 8px;">
                            <h2 style="margin: 0; color: #1e40af; font-size: 20px;">דירוג החוויה: {{user_rating}}</h2>
                        </td>
                    </tr>
                </table>
                
                <!-- Info Sections -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                    <tr>
                        <td style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">בהירות ההסברים:</strong><br>
                            <span style="color: #6b7280; font-size: 15px;">{{clarity_rating}}</span>
                        </td>
                    </tr>
                </table>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                    <tr>
                        <td style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">שם המשתמש:</strong><br>
                            <span style="color: #6b7280; font-size: 15px;">{{from_name}}</span>
                        </td>
                    </tr>
                </table>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                    <tr>
                        <td style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">הערות נוספות:</strong><br>
                            <span style="color: #6b7280; font-size: 15px;">{{user_comments}}</span>
                        </td>
                    </tr>
                </table>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">תאריך ושעה:</strong><br>
                            <span style="color: #6b7280; font-size: 15px;">{{date}}</span>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 8px 8px;">
                נשלח ממערכת בוטקס - העוזר החכם לפתרון תקלות
            </td>
        </tr>
        
    </table>
    
</body>
</html>
```

## תבנית לדיווח תקלות (Issue Report Template) - תואמת Outlook

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
</head>
<body style="font-family: Arial, sans-serif; direction: rtl; text-align: center; background-color: #fef2f2; margin: 0; padding: 20px;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; border-top: 5px solid #ef4444;">
        
        <!-- Header -->
        <tr>
            <td style="background-color: #ef4444; color: white; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🚨 דיווח תקלה חדשה</h1>
            </td>
        </tr>
        
        <!-- Urgent Notice -->
        <tr>
            <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="background-color: #fee2e2; border: 2px solid #ef4444; padding: 15px; text-align: center; border-radius: 6px; color: #dc2626; font-weight: bold; font-size: 16px;">
                            ⚠️ תקלה דורשת טיפול מיידי ⚠️
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="padding: 0 30px 30px 30px;">
                
                <!-- Info Sections -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                    <tr>
                        <td style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">מותג:</strong><br>
                            <span style="color: #1f2937; font-size: 15px;">{{brand}}</span>
                        </td>
                    </tr>
                </table>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                    <tr>
                        <td style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">סניף:</strong><br>
                            <span style="color: #1f2937; font-size: 15px;">{{branch_name}}</span>
                        </td>
                    </tr>
                </table>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                    <tr>
                        <td style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">מספר קופה:</strong><br>
                            <span style="color: #1f2937; font-size: 15px;">{{register_number}}</span>
                        </td>
                    </tr>
                </table>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                    <tr>
                        <td style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">פירוט התקלה:</strong><br>
                            <span style="color: #1f2937; font-size: 15px;">{{user_comments}}</span>
                        </td>
                    </tr>
                </table>
                
                <!-- Contact Info -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
                    <tr>
                        <td style="background-color: #ecfdf5; border: 2px solidrgb(235, 240, 239); padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">פרטי קשר:</strong><br>
                            <span style="color: #1f2937; font-size: 15px;">
                                שם: {{from_name}}<br>
                                טלפון: {{from_phone}}
                            </span>
                        </td>
                    </tr>
                </table>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="background-color: #f8fafc; padding: 15px; border-radius: 6px; text-align: center;">
                            <strong style="color: #374151; font-size: 16px;">תאריך ושעה:</strong><br>
                            <span style="color: #1f2937; font-size: 15px;">{{date}}</span>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 8px 8px;">
                נשלח ממערכת בוטקס - העוזר החכם לפתרון תקלות<br>
                <strong style="color: #dc2626;">נא לטפל בהקדם האפשרי</strong>
            </td>
        </tr>
        
    </table>
    
</body>
</html>
```

## מה השתנה כדי לתמוך ב-Outlook:

✅ **שימוש בטבלאות** במקום DIV - Outlook אוהב טבלאות
✅ **CSS Inline** - כל הסטיילים בתוך התגים
✅ **פונט Arial** - תמיד עובד ב-Outlook
✅ **צבעים פשוטים** - ללא גרדיאנטים מורכבים
✅ **מבנה פשוט** - ללא CSS מתקדם
✅ **תמיכה ב-RTL** - עובד טוב ב-Outlook

## הוראות עדכון:

1. היכנס ל-EmailJS
2. ערוך את התבניות
3. החלף את כל התוכן HTML בתבניות החדשות מלמעלה
4. שמור

עכשיו המיילים יראו הרבה יותר טוב ב-Outlook! 📧 