const axios = require("axios");
const {
  getAccountByIndex,
  getAccountForMeeting,
  getNextAccount,
  getTotalAccountsCount,
} = require("./zoomAccountManager");

// Store access tokens for each account to avoid redundant API calls
const accessTokens = {};

/**
 * Get access token for a specific Zoom account
 * @param {object} account - Account configuration with ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, etc.
 * @returns {string} Access token
 */
async function getZoomAccessToken(account) {
  // If token already exists and valid, return it
  const accountId = account.ZOOM_ACCOUNT_ID;
  if (accessTokens[accountId]) {
    return accessTokens[accountId];
  }

  const res = await axios.post(
    account.ZOOM_OAUTH_URL || process.env.ZOOM_OAUTH_URL,
    null,
    {
      params: {
        grant_type: "account_credentials",
        account_id: accountId,
      },
      auth: {
        username: account.ZOOM_CLIENT_ID,
        password: account.ZOOM_CLIENT_SECRET,
      },
    }
  );

  accessTokens[accountId] = res.data.access_token;
  return res.data.access_token;
}

/**
 * Create a Zoom meeting using a specific account
 * @param {object} options
 *   - startTimeUtc: ISO format start time
 *   - accountIndex: (optional) Account index to use (0, 1, 2, etc.)
 *   - meetingNumber: (optional) Meeting number for round-robin distribution
 *   - useNextAccount: (optional) Use next available account in rotation
 * @returns {object} { join_url, zoom_meeting_id, accountIndex }
 */
exports.createZoomMeeting = async ({
  startTimeUtc,
  accountIndex = null,
  meetingNumber = null,
  useNextAccount = false,
}) => {
  let account;

  // Determine which account to use
  if (accountIndex !== null) {
    // Use specific account index
    account = getAccountByIndex(accountIndex);
    if (!account) {
      throw new Error(
        `Zoom account with index ${accountIndex} not found. Total accounts: ${getTotalAccountsCount()}`
      );
    }
  } else if (meetingNumber !== null) {
    // Use round-robin based on meeting number
    account = getAccountForMeeting(meetingNumber);
  } else if (useNextAccount) {
    // Use next available in rotation
    account = getNextAccount();
  } else {
    // Default: use account 0
    account = getAccountByIndex(0);
  }

  const accessToken = await getZoomAccessToken(account);

  const res = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic: "Bowizzy Mock Interview",
      type: 2,
      start_time: startTimeUtc,
      duration: 60,
      settings: {
        join_before_host: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return {
    join_url: res.data.join_url,
    zoom_meeting_id: res.data.id,
    accountIndex: account.accountIndex,
    accountId: account.ZOOM_ACCOUNT_ID,
  };
};

/**
 * Get total available Zoom accounts
 */
exports.getTotalZoomAccounts = () => {
  return getTotalAccountsCount();
};
