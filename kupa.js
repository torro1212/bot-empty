const flowData = {
  start: "KUPA",
  KUPA: {
    type: "question",
    text: "נא ללחוץ על כפתור ההדלקה בקופה, לפי הסימון בתמונה",
    subtext: "בדקו אם נורית ההפעלה של הקופה נדלקת",
    image: "https://i.imgur.com/b6nJ727.png",
    options: {
      "נדלקה": "K-DLOKA",
      "לא נדלקה": "K-LODLOKA"
    },
    buttonStyles: {
      "נדלקה": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "לא נדלקה": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "K-DLOKA": {
    type: "end",
    text: "כל הכבוד! התקלה נפתרה בהצלחה! 🎉",
    showFeedbackForm: true
  },
  "K-LODLOKA": {
    type: "question",
    text: "נא לבדוק את החיבורים במסך",
    subtext: "בדקו את החיבורים בהתאם לתמונה ולסרטון",
    video: "https://i.imgur.com/Wv2tOsw.mp4",
    options: {
      "מחובר ונדלקה הקופה": "K-C-OVED",
      "מחובר לא נדלקה": "K-C-LOVED"
    },
    buttonStyles: {
      "מחובר ונדלקה הקופה": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "מחובר לא נדלקה": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "K-C-OVED": {
    type: "end",
    text: "כל הכבוד! התקלה נפתרה בהצלחה! 🎉",
    showFeedbackForm: true
  },
  "K-C-LOVED": {
    type: "question",
    text: "נא לבדוק את החיבורים בארון שבצד הלקוח",
    subtext: "בדקו את החיבורים לפי התמונה והסרטון",
    video: "https://i.imgur.com/YdXOElL.mp4",
    options: {
      "מחובר ונדלקה הקופה": "K-CAB-OVED",
      "מחובר לא נדלקה": "SEND"
    },
    buttonStyles: {
      "מחובר ונדלקה הקופה": {
        background: "linear-gradient(45deg, #22c55e, #16a34a)",
        color: "white",
        icon: "CheckCircle"
      },
      "מחובר לא נדלקה": {
        background: "linear-gradient(45deg, #f97316, #ea580c)",
        color: "white", 
        icon: "AlertCircle"
      }
    }
  },
  "K-CAB-OVED": {
    type: "end",
    text: "כל הכבוד! התקלה נפתרה בהצלחה! 🎉",
    showFeedbackForm: true
  },

  "SEND": {
    type: "end",
    text: "📩 נא למלא *בהודעה אחת* בצ'אט את הפרטים הבאים ⬇️\n(פשוט העתק ומלא את השורות)\n\nמותג + שם סניף:\nמספר קופה:\nפירוט התקלה:\nשם + טלפון:\n\n💬 לאחר השליחה נדאג לחזור אליך בהקדם 🙏\nמחלקת מחשוב 💻",
    showReportForm: true
  }
};

export default { flowData };