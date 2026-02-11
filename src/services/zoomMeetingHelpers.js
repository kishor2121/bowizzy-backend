/**
 * Advanced Zoom Meeting Creation Helpers
 * Useful for complex scenarios with multiple interviews
 */

const { createZoomMeeting, getTotalZoomAccounts } = require("./zoomMeetService");

/**
 * Create multiple Zoom meetings for simultaneous interviews
 * Automatically distributes across available Zoom accounts
 * @param {array} meetings - Array of meeting configs
 *   [{ startTimeUtc, duration?: 60 }, ...]
 * @returns {array} Array of created meetings with account info
 */
exports.createMultipleMeetings = async (meetings) => {
  const results = [];
  let meetingNumber = 1;

  for (const meeting of meetings) {
    try {
      const zoomMeeting = await createZoomMeeting({
        startTimeUtc: meeting.startTimeUtc,
        meetingNumber: meetingNumber,
      });

      results.push({
        success: true,
        ...zoomMeeting,
        error: null,
      });

      meetingNumber++;
    } catch (error) {
      results.push({
        success: false,
        join_url: null,
        zoom_meeting_id: null,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Schedule meetings with load balancing across accounts
 * Useful when you have multiple simultaneous slots
 * @param {array} slots - Array of interview slots
 * @returns {array} Slots with assigned Zoom accounts
 */
exports.scheduleWithLoadBalancing = async (slots) => {
  const accountCount = getTotalZoomAccounts();
  const results = [];

  for (let i = 0; i < slots.length; i++) {
    const accountIndex = i % accountCount;

    try {
      const zoomMeeting = await createZoomMeeting({
        startTimeUtc: slots[i].start_time_utc,
        accountIndex: accountIndex,
      });

      results.push({
        slot_id: slots[i].interview_slot_id,
        account_index: accountIndex,
        zoom_meeting_id: zoomMeeting.zoom_meeting_id,
        join_url: zoomMeeting.join_url,
        error: null,
      });
    } catch (error) {
      results.push({
        slot_id: slots[i].interview_slot_id,
        account_index: accountIndex,
        error: error.message,
      });
    }
  }

  return results;
};

/**
 * Get account info for all configured accounts
 * Useful for dashboard/admin purposes
 */
exports.getAllAccountsInfo = () => {
  const {
    getAvailableZoomAccounts,
  } = require("./zoomAccountManager");

  const accounts = getAvailableZoomAccounts();
  return accounts.map((acc) => ({
    index: acc.accountIndex,
    accountId: acc.ZOOM_ACCOUNT_ID,
    clientId: acc.ZOOM_CLIENT_ID,
    // Don't expose secrets
  }));
};

/**
 * Check which account would be used for a specific meeting number
 */
exports.getAccountForMeetingNumber = (meetingNumber) => {
  const accountCount = getTotalZoomAccounts();
  if (accountCount === 0) {
    throw new Error("No Zoom accounts configured");
  }

  const accountIndex = (meetingNumber - 1) % accountCount;
  return {
    meetingNumber,
    accountIndex,
    accountCount,
  };
};

/**
 * Validate Zoom configuration
 * Check if all accounts are properly configured
 */
exports.validateZoomConfiguration = () => {
  const {
    getAvailableZoomAccounts,
  } = require("./zoomAccountManager");

  const accounts = getAvailableZoomAccounts();

  if (accounts.length === 0) {
    return {
      valid: false,
      message: "No Zoom accounts configured",
      accountsCount: 0,
    };
  }

  const validAccounts = accounts.filter((acc) => {
    return (
      acc.ZOOM_ACCOUNT_ID &&
      acc.ZOOM_CLIENT_ID &&
      acc.ZOOM_CLIENT_SECRET &&
      acc.ZOOM_OAUTH_URL
    );
  });

  return {
    valid: validAccounts.length === accounts.length,
    message:
      validAccounts.length === accounts.length
        ? "All accounts are properly configured"
        : `${accounts.length - validAccounts.length} accounts are missing credentials`,
    accountsCount: validAccounts.length,
    accounts: validAccounts.map((a) => ({
      index: a.accountIndex,
      accountId: a.ZOOM_ACCOUNT_ID,
    })),
  };
};

/**
 * Get Zoom access token for testing purposes
 * Exported for manual testing
 */
exports.getZoomAccessToken = async (accountIndex) => {
  const { getAccountByIndex } = require("./zoomAccountManager");
  const account = getAccountByIndex(accountIndex || 0);
  
  if (!account) {
    throw new Error(`Account with index ${accountIndex} not found`);
  }

  const { createZoomMeeting } = require("./zoomMeetService");
  // This is a bit of a workaround - the function is internal
  // For actual token retrieval, use the function from zoomMeetService
  return "Check zoomMeetService.js for getZoomAccessToken implementation";
};
