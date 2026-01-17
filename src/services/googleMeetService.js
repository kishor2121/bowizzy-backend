// "Future need"
// const { google } = require("googleapis");

// const auth = new google.auth.JWT({
//   email: process.env.GOOGLE_CLIENT_EMAIL,
//   key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   scopes: ["https://www.googleapis.com/auth/calendar"]
// });

// const calendar = google.calendar({
//   version: "v3",
//   auth
// });

// exports.createMeet = async ({ startTimeUtc, endTimeUtc }) => {
//   const event = {
//     summary: "Bowizzy Mock Interview",
//     description: "Interview scheduled via Bowizzy",
//     start: {
//       dateTime: startTimeUtc
//     },
//     end: {
//       dateTime: endTimeUtc
//     }
//   };

//   const response = await calendar.events.insert({
//     calendarId: "primary",
//     resource: event
//   });

//   // ✅ THIS is the link you will share
//   return response.data.htmlLink;
// };
