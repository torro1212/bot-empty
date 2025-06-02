const flow = {
  start: "KUPA",
  KUPA: {
    type: "question",
    text: "נא ללחוץ על כפתור ההדלקה בקופה, לפי הסימון בתמונה",
    image: "https://i.imgur.com/b6nJ727.png",
    options: [
      { text: "נדלקה", next: "K-DLOKA" },
      { text: "לא נדלקה", next: "K-LODLOKA" }
    ]
  },
  "K-DLOKA": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "K-LODLOKA": {
    type: "question",
    text: "נא לבדוק את החיבורים במסך בהתאם לתמונה ולסרטון",
    video: "https://i.imgur.com/Wv2tOsw.mp4",
    options: [
      { text: "מחובר ונדלקה הקופה", next: "K-C-OVED" },
      { text: "מחובר לא נדלקה", next: "K-C-LOVED" }
    ]
  },
  "K-C-OVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "K-C-LOVED": {
    type: "question",
    text: "נא לבדוק את החיבורים בארון שבצד הלקוח, לפי התמונה והסרטון",
    video: "https://i.imgur.com/YdXOElL.mp4",
    options: [
      { text: "מחובר ונדלקה הקופה", next: "K-CAB-OVED" },
      { text: "מחובר לא נדלקה", next: "K-CAB-LOVED" }
    ]
  },
  "K-CAB-OVED": {
    type: "end",
    text: "הצלחת? איזה כיף! ספרו לנו איך היה במייל: Support@mutagim.com 😊"
  },
  "K-CAB-LOVED": {
    type: "question",
    text: "לא הצלחת לפתור את התקלה? לחצו על \"שליחת תקלה\" ונחזור אליכם בהקדם 😊",
    options: [{ text: "שליחת תקלה", next: "SEND" }]
  },
  SEND: {
    type: "end",
    text: ""
  }
};

export default flow;