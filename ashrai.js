const flowData = {
  start: "ASHRAI",
  ASHRAI: {
    type: "question",
    text: "האם מכשיר האשראי דולק?",
    image: "https://i.imgur.com/3HbntNU.jpeg",
    options: {
      "דלוק": "A-DALOK",
      "לא דלוק": "A-LODALOK"
    }
  },
  "A-DALOK": {
    type: "question",
    text: "יש ללחוץ על הכפתור הירוק. האם מופיעים שלושה ריבועים בצד שמאל – כמו בתמונה 1 או כמו בתמונה 2?",
    image: "https://i.imgur.com/iUXJPVo.jpeg",
    image2: "https://i.imgur.com/umUOoUc.png",
    options: {
      "תמונה 1": "A-PIC-1-V",
      "תמונה 2": "A-PIC-2-X"
    }
  },
  "A-PIC-1-V": {
    type: "question",
    text: "יש ללחוץ על כוכבית או על כפתור F, ולאחר מכן להקליד 7277 ולסיים שוב בלחיצה על כוכבית או F – כפי שמוצג בסרטון",
    image: "https://i.imgur.com/UZLWIlt.jpeg",
    video: "https://i.imgur.com/hCqwr4B.mp4",
    options: {
      "הבא": "A-NEXT",
      "כבר ביצעתי לא עזר": "DONELOVED"
    }
  },
  "A-NEXT": {
    type: "question",
    text: "נא ללחוץ על כפתור ה-ROUTE. מה מופיע במסך – כמו בתמונה 1, תמונה 2 או משהו אחר?",
    image: "https://i.imgur.com/1Ut0dKU.jpeg",
    image2: "https://i.imgur.com/OyqOLJg.png",
    options: {
      "תמונה 1": "Route-PIC1-3-V",
      "תמונה 2 \\ אחר": "Route-PIC4-X"
    }
  },
  "Route-PIC1-3-V": {
    type: "question",
    text: "נא לבצע כיבוי והדלקה (כפי שמוצג בסרטון). האם התקלה נפתרה?",
    video: "https://i.imgur.com/Ps5UHMg.mp4",
    options: {
      "כן": "YES",
      "לא": "NO"
    }
  },
  "YES": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "NO": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "Route-PIC4-X": {
    type: "question",
    text: "נא לבצע 'הצמדה' של האשראי לקופה כפי שמתואר בסרטון",
    video: "https://i.imgur.com/srw8fHO.mp4",
    options: {
      "הצליח ועובד": "WORKOVED",
      "הצליח ולא עובד": "WORKLOVED"
    }
  },
  "WORKOVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "WORKLOVED": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "DONELOVED": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "A-PIC-2-X": {
    type: "question",
    text: "נא לעקוב אחר הכבל כפי שמוצג בסרטון, ולוודא שהוא מחובר כפי שמתואר בתמונה",
    video: "https://i.imgur.com/tyZBRer.mp4",
    options: {
      "מחובר ועובד": "A-CA-OVED",
      "מחובר ולא עובד": "A-CA-LOVED"
    }
  },
  "A-CA-OVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "A-CA-LOVED": {
    type: "question",
    text: "נא ללחוץ על הכפתור שמסומן בתמונה 1 לבדוק שמופיע כמו בתמונה 2",
    image: "https://i.imgur.com/VreUuab.png",
    options: {
      "תקין-ירוק": "TAKINYAROK",
      "לא תקין": "LOTAKIN"
    }
  },
  "TAKINYAROK": {
    type: "question",
    text: "נא לבצע 'הצמדה' של האשראי לקופה כפי שמתואר בסרטון",
    video: "https://i.imgur.com/srw8fHO.mp4",
    options: {
      "הצליח ועובד": "WORKOVED",
      "הצליח ולא עובד": "WORKLOVED"
    }
  },
  "LOTAKIN": {
    type: "question",
    text: "נא לבדוק שהכבל רשת מחובר כמו בסרטון ומופיע חיבורים ירוקים כמו בתמונה",
    video: "https://i.imgur.com/J6tKRYe.mp4",
    options: {
      "מחובר-ירוק": "MHO-YAROK",
      "מחובר-לא ירוק": "LO-YAROK"
    }
  },
  "MHO-YAROK": {
    type: "question",
    text: "נא לבצע 'הצמדה' של האשראי לקופה כפי שמתואר בסרטון",
    video: "https://i.imgur.com/srw8fHO.mp4",
    options: {
      "הצליח ועובד": "WORKOVED",
      "הצליח ולא עובד": "WORKLOVED"
    }
  },
  "LO-YAROK": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "A-LODALOK": {
    type: "question",
    text: "נא לעקוב אחר הכבל בהתאם לסרטון, ולוודא שהוא מחובר כפי שמוצג בתמונה",
    video: "https://i.imgur.com/eKLaeYO.mp4",
    options: {
      "נדלק ועובד": "A-CAH-OVED",
      "נדלק ולא עובד": "A-CAH-LOVED",
      "מחובר וכבוי": "A-CAH-LONDLAK"
    }
  },
  "A-CAH-OVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "A-CAH-LOVED": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "A-CAH-LONDLAK": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "SEND": {
    type: "end",
    text: "📩 נא למלא *בהודעה אחת* בצ'אט את הפרטים הבאים ⬇️\n(פשוט העתק ומלא את השורות)\n\nמותג + שם סניף:\nמספר קופה:\nפירוט התקלה:\nשם + טלפון:\n\n💬 לאחר השליחה נדאג לחזור אליך בהקדם 🙏\nמחלקת מחשוב 💻"
  }
};

export default { flowData };
