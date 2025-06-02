const flowData = {
  start: "HOLETZ",
  HOLETZ: {
    type: "question",
    text: "האם החולץ דלוק?",
    image: "https://i.imgur.com/WgaaVDE.jpeg",
    options: {
      "דלוק": "Holetz-dlok",
      "לא דלוק": "Holetz-lodlok"
    }
  },
  "Holetz-dlok": {
    type: "question",
    text: "יש לוודא שמכשיר ה-READER (עם הכבל האדום) דלוק, ושגם הכבל\\ים המסומן מחובר כראוי",
    image: "https://i.imgur.com/9hU6oRw.jpeg",
    options: {
      "דלוק": "Reader-dlok",
      "לא דלוק": "Reader-lodlok"
    }
  },
  "Reader-dlok": {
    type: "question",
    text: "נא לנתק את החולץ, מכשיר-READER והקופה מהחשמל למשך שתי דקות, ולאחר מכן לחבר אותם מחדש. האם התקלה הסתדרה?",
    video: "https://i.imgur.com/YKAPvzf.mp4",
    options: {
      "הסתדרה": "GOODREADER",
      "לא הסתדרה": "NOGOODREADER"
    }
  },
  "GOODREADER": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "NOGOODREADER": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על \"שליחת תקלה\" ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "Reader-lodlok": {
    type: "question",
    text: "בדקי את הכבל עם הראש הכסוף (מסומן בתמונה) עקבי אחריו ובדקי האם השנאי \\ השקע מחובר כמו בסרטון",
    video: "https://i.imgur.com/8uCjX5B.mp4",
    options: {
      "נדלק ועובד": "R-ONOVED",
      "לא נדלק": "R-OFF",
      "נדלק ולא עובד": "R-NDLOVED"
    }
  },
  "R-ONOVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "R-OFF": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "R-NDLOVED": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "Holetz-lodlok": {
    type: "question",
    text: "נא לעקוב אחרי כבל החשמל של החולץ ולוודא שהשנאי והכבל מחוברים כראוי – בהתאם לתמונה ולסרטון",
    video: "https://i.imgur.com/AVYVPXy.mp4",
    options: {
      "נדלק ועובד": "Ho-ND+OVED",
      "לא נדלק": "Ho-LONDLAK",
      "נדלק ולא עובד": "HO-ND-LOVED"
    }
  },
  "Ho-ND+OVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "Ho-LONDLAK": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    }
  },
  "HO-ND-LOVED": {
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