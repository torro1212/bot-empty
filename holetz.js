const flowData = {
  start: "HOLETZ",
  HOLETZ: {
    type: "question",
    text: "האם החולץ דלוק?",
    subtext: "בדקו אם נורית ההפעלה של החולץ דולקת",
    image: "https://i.imgur.com/WgaaVDE.jpeg",
    options: {
      "דלוק": "Holetz-dlok",
      "לא דלוק": "Holetz-lodlok"
    },
    buttonStyles: {
      "דלוק": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "לא דלוק": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "Holetz-dlok": {
    type: "question",
    text: "יש לוודא שמכשיר ה-READER (עם הכבל האדום) דלוק, ושגם הכבל\\ים המסומן מחובר כראוי",
    subtext: "בדקו את החיבורים לפי התמונה",
    image: "https://i.imgur.com/9hU6oRw.jpeg",
    options: {
      "דלוק": "Reader-dlok",
      "לא דלוק": "Reader-lodlok"
    },
    buttonStyles: {
      "דלוק": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "לא דלוק": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "Reader-dlok": {
    type: "question",
    text: "נא לנתק את החולץ, מכשיר-READER והקופה מהחשמל למשך שתי דקות, ולאחר מכן לחבר אותם מחדש",
    subtext: "האם התקלה הסתדרה לאחר הניתוק והחיבור מחדש?",
    video: "https://i.imgur.com/YKAPvzf.mp4",
    options: {
      "כן, התקלה הסתדרה": "POSITIVE-FEEDBACK",
      "לא, התקלה לא הסתדרה": "REPORT-FORM"
    },
    buttonStyles: {
      "כן, התקלה הסתדרה": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "לא, התקלה לא הסתדרה": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "POSITIVE-FEEDBACK": {
    type: "end",
    text: "כל הכבוד! התקלה נפתרה בהצלחה! 🎉",
    showFeedbackForm: true
  },
  "NEGATIVE-FEEDBACK": {
    type: "question",
    text: "מצטערים שלא הצלחנו לפתור את הבעיה",
    subtext: "נשמח לעזור לכם באופן אישי",
    buttonStyles: {
      "פתיחת קריאת שירות": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    },
    options: {
      "פתיחת קריאת שירות": "REPORT-FORM"
    }
  },
  "REPORT-FORM": {
    type: "end",
    text: "טופס פתיחת תקלה",
    showReportForm: true
  },
  "GOODREADER": {
    type: "end",
    text: "כל הכבוד! התקלה נפתרה בהצלחה! 🎉",
    showFeedbackForm: true
  },
  "NOGOODREADER": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה?",
    subtext: "לחצו על \"שליחת תקלה\" ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    },
    buttonStyles: {
      "שליחת תקלה": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "Reader-lodlok": {
    type: "question",
    text: "בדקי את הכבל עם הראש הכסוף (מסומן בתמונה)",
    subtext: "עקבי אחריו ובדקי האם השנאי \\ השקע מחובר כמו בסרטון",
    video: "https://i.imgur.com/8uCjX5B.mp4",
    options: {
      "נדלק ועובד": "R-ONOVED",
      "לא נדלק": "REPORT-FORM",
      "נדלק ולא עובד": "Reader-dlok"
    },
    buttonStyles: {
      "נדלק ועובד": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "לא נדלק": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      },
      "נדלק ולא עובד": {
        background: "linear-gradient(45deg, #eab308, #ca8a04)",
        color: "white",
        icon: "AlertTriangle"
      }
    }
  },
  "R-SUCCESS-CHECK": {
    type: "question",
    text: "האם הצלחת לפתור את התקלה?",
    subtext: "בחר באפשרות המתאימה:",
    buttonStyles: {
      "כן, הבעיה נפתרה": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "לא, אני רוצה לפתוח קריאת שירות": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    },
    options: {
      "כן, הבעיה נפתרה": "POSITIVE-FEEDBACK",
      "לא, אני רוצה לפתוח קריאת שירות": "REPORT-FORM"
    }
  },
  "R-ONOVED": {
    type: "end",
    text: "כל הכבוד! התקלה נפתרה בהצלחה! 🎉",
    showFeedbackForm: true
  },
  "R-OFF": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה?",
    subtext: "לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    },
    buttonStyles: {
      "שליחת תקלה": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "R-NDLOVED": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה?",
    subtext: "לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    },
    buttonStyles: {
      "שליחת תקלה": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "Holetz-lodlok": {
    type: "question",
    text: "נא לעקוב אחרי כבל החשמל של החולץ ולוודא שהשנאי והכבל מחוברים כראוי",
    subtext: "בדקו בהתאם לתמונה ולסרטון",
    video: "https://i.imgur.com/AVYVPXy.mp4",
    options: {
      "נדלק ועובד": "Ho-ND+OVED",
      "לא נדלק": "REPORT-FORM",
      "נדלק ולא עובד": "Holetz-dlok"
    },
    buttonStyles: {
      "נדלק ועובד": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "לא נדלק": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      },
      "נדלק ולא עובד": {
        background: "linear-gradient(45deg, #eab308, #ca8a04)",
        color: "white",
        icon: "AlertTriangle"
      }
    }
  },
  "Ho-ND+OVED": {
    type: "end",
    text: "כל הכבוד! התקלה נפתרה בהצלחה! 🎉",
    showFeedbackForm: true
  },
  "Ho-LONDLAK": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה?",
    subtext: "לחצו על 'שליחת תקלה' ונחזור אליכם בהקדם 😊",
    options: {
      "שליחת תקלה": "SEND"
    },
    buttonStyles: {
      "שליחת תקלה": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "HO-ND-LOVED": {
    type: "end",
    text: "טופס פתיחת תקלה",
    showReportForm: true
  },
  "SEND": {
    type: "end",
    text: "📩 נא למלא *בהודעה אחת* בצ'אט את הפרטים הבאים ⬇️\n(פשוט העתק ומלא את השורות)\n\nמותג + שם סניף:\nמספר קופה:\nפירוט התקלה:\nשם + טלפון:\n\n💬 לאחר השליחה נדאג לחזור אליך בהקדם 🙏\nמחלקת מחשוב 💻",
    showReportForm: true
  }
};

export default { flowData };