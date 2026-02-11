/**
 * Example API endpoints for managing multiple Zoom accounts
 * Add these to your Express router if you want admin endpoints
 */

const express = require("express");
const router = express.Router();
const {
  getTotalZoomAccounts,
} = require("../services/zoomMeetService");
const {
  createMultipleMeetings,
  getAllAccountsInfo,
  validateZoomConfiguration,
} = require("../services/zoomMeetingHelpers");

/**
 * GET /api/zoom/status
 * Check Zoom configuration status
 */
router.get("/zoom/status", (req, res) => {
  try {
    const config = validateZoomConfiguration();
    return res.status(200).json(config);
  } catch (error) {
    return res.status(500).json({
      valid: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/zoom/accounts
 * Get all configured accounts (without secrets)
 */
router.get("/zoom/accounts", (req, res) => {
  try {
    const accounts = getAllAccountsInfo();
    return res.status(200).json({
      total: accounts.length,
      accounts,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /api/zoom/accounts/count
 * Get total number of configured accounts
 */
router.get("/zoom/accounts/count", (req, res) => {
  try {
    const count = getTotalZoomAccounts();
    return res.status(200).json({
      total: count,
      message: `${count} Zoom account(s) configured`,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * POST /api/zoom/test-multiple
 * Test creating multiple meetings at same time
 * Body: {
 *   count: 2,
 *   startTime: "2024-02-09T14:00:00Z"
 * }
 */
router.post("/zoom/test-multiple", async (req, res) => {
  try {
    const { count = 2, startTime } = req.body;

    if (!startTime) {
      return res.status(400).json({
        error: "startTime is required (ISO format)",
      });
    }

    const meetings = Array(count)
      .fill(null)
      .map(() => ({
        startTimeUtc: startTime,
      }));

    const results = await createMultipleMeetings(meetings);

    return res.status(200).json({
      requested: count,
      created: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      details: results,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
