const flowData = {
  start: "KUPA",
  KUPA: {
    type: "question",
    text: "בחר את סוג התקלה בקופה",
    options: {
      "קופה לא נדלקת": "KUPA-NO-POWER",
      "בעיות בתוכנה": "KUPA-SOFTWARE"
    }
  },
  "KUPA-NO-POWER": {
    type: "question",
    text: "האם כבל החשמל מחובר היטב?",
    options: {
      "כן": "KUPA-CABLE-OK",
      "לא": "KUPA-CABLE-FIX"
    }
  },
  "KUPA-CABLE-FIX": {
    type: "end",
    text: "חבר את הכבל היטב ובדוק אם הקופה נדלקת. אם הבעיה נמשכת, פנה לתמיכה."
  },
  "KUPA-CABLE-OK": {
    type: "question",
    text: "האם יש חשמל בשקע?",
    options: {
      "כן": "KUPA-POWER-OK",
      "לא": "KUPA-NO-POWER-FIX"
    }
  },
  "KUPA-NO-POWER-FIX": {
    type: "end",
    text: "בדוק את החשמל בחנות או חבר לשקע אחר. אם הבעיה נמשכת, פנה לתמיכה."
  },
  "KUPA-POWER-OK": {
    type: "question",
    text: "האם ניסית לכבות ולהדליק את הקופה?",
    options: {
      "כן, לא עזר": "KUPA-REBOOT-FAIL",
      "לא": "KUPA-TRY-REBOOT"
    }
  },
  "KUPA-TRY-REBOOT": {
    type: "end",
    text: "כבה את הקופה, המתן 30 שניות והדלק מחדש. אם הבעיה נמשכת, פנה לתמיכה."
  },
  "KUPA-REBOOT-FAIL": {
    type: "end",
    text: "נראה שיש בעיה חמורה יותר. אנא פנה לתמיכה הטכנית."
  },
  "KUPA-SOFTWARE": {
    type: "question",
    text: "איזו בעיה אתה חווה בתוכנה?",
    options: {
      "תקיעות/איטיות": "KUPA-SW-SLOW",
      "הודעות שגיאה": "KUPA-SW-ERROR",
      "בעיה אחרת": "KUPA-SW-OTHER"
    }
  },
  "KUPA-SW-SLOW": {
    type: "end",
    text: "נסה להפעיל מחדש את הקופה. אם הבעיה נמשכת, פנה לתמיכה הטכנית."
  },
  "KUPA-SW-ERROR": {
    type: "end",
    text: "אנא צלם את הודעת השגיאה ושלח לתמיכה הטכנית."
  },
  "KUPA-SW-OTHER": {
    type: "end",
    text: "לבעיות מורכבות יותר, אנא פנה ישירות לתמיכה הטכנית."
  }
};

export default { flowData };