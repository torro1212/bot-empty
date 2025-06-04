// Configuration constants
export const DEMO_MODE = false; // ביטול מצב הדגמה - נשתמש בשליחה אמיתית

// EmailJS configuration - המידע האמיתי שלך
export const EMAIL_CONFIG = {
  SERVICE_ID: 'SendMail',                    // Service ID שלך
  TEMPLATE_ID: 'IssueReport',               // Template ID לטופס דיווח תקלה
  FEEDBACK_TEMPLATE_ID: 'Feedback',         // Template ID לטופס המשוב
  PUBLIC_KEY: '6RjrhWpav2fs1C9Dq',          // Public Key שלך
  RECIPIENT_EMAIL: 'Support@mutagim.com'    // המייל שאליו ישלח הטופס
};

// RTL support configuration
export const RTL_SUPPORT = {
  ENABLED: true,                           // האם לאפשר תמיכה ב-RTL
  DEFAULT_DIRECTION: 'rtl',                // כיוון ברירת מחדל
  DEFAULT_FONT: 'Heebo, sans-serif'        // פונט ברירת מחדל לעברית
}; 