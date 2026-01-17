const axios = require("axios");

let accessToken = null;

async function getZoomAccessToken() {
  const res = await axios.post(
    process.env.ZOOM_OAUTH_URL,
    null,
    {
      params: {
        grant_type: "account_credentials",
        account_id: process.env.ZOOM_ACCOUNT_ID
      },
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET
      }
    }
  );

  accessToken = res.data.access_token;
  return accessToken;
}

exports.createZoomMeeting = async ({ startTimeUtc }) => {
  if (!accessToken) await getZoomAccessToken();

  const res = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic: "Bowizzy Mock Interview",
      type: 2,
      start_time: startTimeUtc,
      duration: 60,
      settings: {
        join_before_host: true
      }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return res.data.join_url; // ✅ THIS is Zoom meeting link
};
