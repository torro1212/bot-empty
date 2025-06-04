const flowData = {
  start: "ASHRAI",
  ASHRAI: {
    type: "question",
    text: "האם מכשיר האשראי דולק?",
    subtext: "בדקו אם נורית ההפעלה של מכשיר האשראי דולקת",
    image: "https://i.imgur.com/3HbntNU.jpeg",
    options: {
      "דלוק": "A-DALOK",
      "לא דלוק": "A-LODALOK"
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
  "A-DALOK": {
    type: "question",
    text: "יש ללחוץ על הכפתור הירוק. האם מופיעים שלושה ריבועים בצד שמאל?",
    subtext: "בדקו אם המסך נראה כמו בתמונה 1 או כמו בתמונה 2",
    image: "https://i.imgur.com/iUXJPVo.jpeg",
    image2: "https://i.imgur.com/umUOoUc.png",
    options: {
      "תמונה 1": "A-PIC-1-V",
      "תמונה 2": "A-PIC-2-X"
    },
    buttonStyles: {
      "תמונה 1": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "תמונה 2": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "A-PIC-1-V": {
    type: "question",
    text: "יש ללחוץ על כוכבית או על כפתור F, ולאחר מכן להקליד 7277 ולסיים שוב בלחיצה על כוכבית או F",
    subtext: "פעלו בדיוק כפי שמוצג בסרטון",
    image: "https://i.imgur.com/UZLWIlt.jpeg",
    video: "https://i.imgur.com/hCqwr4B.mp4",
    options: {
      "הבא": "A-NEXT",
      "כבר ביצעתי לא עזר": "DONELOVED"
    },
    buttonStyles: {
      "הבא": {
        background: "linear-gradient(45deg, #3b82f6, #2563eb)",
        color: "white",
        icon: "ArrowRight"
      },
      "כבר ביצעתי לא עזר": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "A-NEXT": {
    type: "question",
    text: "נא ללחוץ על כפתור ה-ROUTE. מה מופיע במסך?",
    subtext: "האם המסך נראה כמו בתמונה 1, תמונה 2 או משהו אחר?",
    image: "https://i.imgur.com/1Ut0dKU.jpeg",
    image2: "https://i.imgur.com/OyqOLJg.png",
    options: {
      "תמונה 1": "Route-PIC1-3-V",
      "תמונה 2 \\ אחר": "Route-PIC4-X"
    },
    buttonStyles: {
      "תמונה 1": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "תמונה 2 \\ אחר": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "Route-PIC1-3-V": {
    type: "question",
    text: "נא לבצע כיבוי והדלקה של מכשיר האשראי",
    subtext: "פעלו בדיוק כפי שמוצג בסרטון. האם התקלה נפתרה?",
    video: "https://i.imgur.com/Ps5UHMg.mp4",
    options: {
      "כן": "YES",
      "לא": "NO"
    },
    buttonStyles: {
      "כן": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "לא": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "YES": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊",
    showFeedbackForm: true
  },
  "NO": {
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
  "Route-PIC4-X": {
    type: "question",
    text: "נא לבצע 'הצמדה' של האשראי לקופה",
    subtext: "פעלו בדיוק כפי שמתואר בסרטון",
    video: "https://i.imgur.com/srw8fHO.mp4",
    options: {
      "הצליח ועובד": "WORKOVED",
      "הצליח ולא עובד": "WORKLOVED"
    },
    buttonStyles: {
      "הצליח ועובד": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "הצליח ולא עובד": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "WORKOVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊",
    showFeedbackForm: true
  },
  "WORKLOVED": {
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
  "DONELOVED": {
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
  "A-PIC-2-X": {
    type: "question",
    text: "נא לעקוב אחר הכבל כפי שמוצג בסרטון",
    subtext: "ולוודא שהוא מחובר כפי שמתואר בתמונה",
    video: "https://i.imgur.com/tyZBRer.mp4",
    options: {
      "מחובר ועובד": "A-CA-OVED",
      "מחובר ולא עובד": "A-CA-LOVED"
    },
    buttonStyles: {
      "מחובר ועובד": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "מחובר ולא עובד": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "A-CA-OVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊",
    showFeedbackForm: true
  },
  "A-CA-LOVED": {
    type: "question",
    text: "נא ללחוץ על הכפתור שמסומן בתמונה 1",
    subtext: "בדקו שמופיע כמו בתמונה 2",
    image: "https://i.imgur.com/VreUuab.png",
    options: {
      "תקין-ירוק": "TAKINYAROK",
      "לא תקין": "LOTAKIN"
    },
    buttonStyles: {
      "תקין-ירוק": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "לא תקין": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "TAKINYAROK": {
    type: "question",
    text: "נא לבצע 'הצמדה' של האשראי לקופה",
    subtext: "פעלו בדיוק כפי שמתואר בסרטון",
    video: "https://i.imgur.com/srw8fHO.mp4",
    options: {
      "הצליח ועובד": "WORKOVED",
      "הצליח ולא עובד": "WORKLOVED"
    },
    buttonStyles: {
      "הצליח ועובד": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "הצליח ולא עובד": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "LOTAKIN": {
    type: "question",
    text: "נא לבדוק שהכבל רשת מחובר כמו בסרטון",
    subtext: "וודאו שמופיעים חיבורים ירוקים כמו בתמונה",
    video: "https://i.imgur.com/J6tKRYe.mp4",
    options: {
      "מחובר-ירוק": "MHO-YAROK",
      "מחובר-לא ירוק": "LO-YAROK"
    },
    buttonStyles: {
      "מחובר-ירוק": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "מחובר-לא ירוק": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "MHO-YAROK": {
    type: "question",
    text: "נא לבצע 'הצמדה' של האשראי לקופה",
    subtext: "פעלו בדיוק כפי שמתואר בסרטון",
    video: "https://i.imgur.com/srw8fHO.mp4",
    options: {
      "הצליח ועובד": "WORKOVED",
      "הצליח ולא עובד": "WORKLOVED"
    },
    buttonStyles: {
      "הצליח ועובד": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "הצליח ולא עובד": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "LO-YAROK": {
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
  "A-LODALOK": {
    type: "question",
    text: "נא לעקוב אחר הכבל בהתאם לסרטון",
    subtext: "ולוודא שהוא מחובר כפי שמוצג בתמונה",
    video: "https://i.imgur.com/eKLaeYO.mp4",
    options: {
      "נדלק ועובד": "A-CAH-OVED",
      "נדלק ולא עובד": "A-CAH-LOVED",
      "מחובר וכבוי": "A-CAH-LONDLAK"
    },
    buttonStyles: {
      "נדלק ועובד": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "נדלק ולא עובד": {
        background: "linear-gradient(45deg, #eab308, #ca8a04)",
        color: "white",
        icon: "AlertTriangle"
      },
      "מחובר וכבוי": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "A-CAH-OVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊",
    showFeedbackForm: true
  },
  "A-CAH-LOVED": {
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
  "A-CAH-LONDLAK": {
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
  "SEND": {
    type: "end",
    text: "📩 נא למלא *בהודעה אחת* בצ'אט את הפרטים הבאים ⬇️\n(פשוט העתק ומלא את השורות)\n\nמותג + שם סניף:\nמספר קופה:\nפירוט התקלה:\nשם + טלפון:\n\n💬 לאחר השליחה נדאג לחזור אליך בהקדם 🙏\nמחלקת מחשוב 💻"
  }
};

export default { flowData };
