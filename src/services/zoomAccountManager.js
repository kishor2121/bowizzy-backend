/**
 * Zoom Account Manager
 * Handles multiple Zoom accounts and distributes meetings across them
 */

/**
 * Get all configured Zoom accounts from environment variables
 * Supports: ZOOM_ACCOUNT_ID, ZOOM_ACCOUNT_ID1, ZOOM_ACCOUNT_ID2, etc.
 */
function getAvailableZoomAccounts() {
  const accounts = [];
  let index = 0;

  // First account (no suffix)
  if (
    process.env.ZOOM_ACCOUNT_ID &&
    process.env.ZOOM_CLIENT_ID &&
    process.env.ZOOM_CLIENT_SECRET
  ) {
    accounts.push({
      accountIndex: 0,
      ZOOM_ACCOUNT_ID: process.env.ZOOM_ACCOUNT_ID,
      ZOOM_CLIENT_ID: process.env.ZOOM_CLIENT_ID,
      ZOOM_CLIENT_SECRET: process.env.ZOOM_CLIENT_SECRET,
      ZOOM_OAUTH_URL: process.env.ZOOM_OAUTH_URL,
    });
    index++;
  }

  // Additional accounts (with suffix: ZOOM_ACCOUNT_ID1, ZOOM_ACCOUNT_ID2, etc.)
  while (true) {
    const accountIdKey = `ZOOM_ACCOUNT_ID${index}`;
    const clientIdKey = `ZOOM_CLIENT_ID${index}`;
    const clientSecretKey = `ZOOM_CLIENT_SECRET${index}`;
    const oauthUrlKey = `ZOOM_OAUTH_URL${index}`;

    if (
      process.env[accountIdKey] &&
      process.env[clientIdKey] &&
      process.env[clientSecretKey]
    ) {
      accounts.push({
        accountIndex: index,
        ZOOM_ACCOUNT_ID: process.env[accountIdKey],
        ZOOM_CLIENT_ID: process.env[clientIdKey],
        ZOOM_CLIENT_SECRET: process.env[clientSecretKey],
        ZOOM_OAUTH_URL: process.env[oauthUrlKey] || process.env.ZOOM_OAUTH_URL,
      });
      index++;
    } else {
      break;
    }
  }

  return accounts;
}

/**
 * Get account by index
 * @param {number} accountIndex - Index of the account (0, 1, 2, etc.)
 * @returns {object} Account configuration or null
 */
function getAccountByIndex(accountIndex) {
  const accounts = getAvailableZoomAccounts();
  return accounts.find((acc) => acc.accountIndex === accountIndex) || null;
}

/**
 * Get next available account in round-robin fashion
 * Useful for distributing meetings across accounts
 * @returns {object} Next account configuration
 */
function getNextAccount() {
  const accounts = getAvailableZoomAccounts();
  if (accounts.length === 0) {
    throw new Error("No Zoom accounts configured");
  }

  // Get round-robin count from environment or initialize
  const currentIndex =
    (parseInt(process.env._ZOOM_ACCOUNT_INDEX || "0")) % accounts.length;
  process.env._ZOOM_ACCOUNT_INDEX = (currentIndex + 1).toString();

  return accounts[currentIndex];
}

/**
 * Get account for specific meeting count
 * Useful for predictable account distribution
 * @param {number} meetingNumber - Which meeting this is (1, 2, 3, etc.)
 * @returns {object} Account configuration
 */
function getAccountForMeeting(meetingNumber) {
  const accounts = getAvailableZoomAccounts();
  if (accounts.length === 0) {
    throw new Error("No Zoom accounts configured");
  }

  // meetingNumber starts from 1
  const accountIndex = (meetingNumber - 1) % accounts.length;
  return accounts[accountIndex];
}

/**
 * Get total number of configured Zoom accounts
 */
function getTotalAccountsCount() {
  return getAvailableZoomAccounts().length;
}

module.exports = {
  getAvailableZoomAccounts,
  getAccountByIndex,
  getNextAccount,
  getAccountForMeeting,
  getTotalAccountsCount,
};
