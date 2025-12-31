const User = require("../models/User");
const UserSubscription = require("../models/UserSubscription");
const InterviewSlot = require("../models/interviewSlot");

exports.getInterviewerRequests = async (req, res) => {
  try {
    if (req.user.user_type !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const list = await User.query()
      .where('is_interviewer_verified', 'requesting')
      .orderBy('user_id', 'asc');

    return res.json(list);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching interviewer requests" });
  }
};

exports.verifyInterviewer = async (req, res) => {
  try {
    if (req.user.user_type !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { user_id } = req.params;

    const updated = await User.query()
      .patch({ is_interviewer_verified: true })
      .where({
        user_id,
        user_type: "interviewer"
      });

    if (updated === 0) {
      return res.status(404).json({ message: "Interviewer not found" });
    }

    return res.json({ message: "Interviewer verified successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying interviewer" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const {
      name,
      email,
      user_type,
      is_interviewer_verified
    } = req.body;

    const updated = await User.query()
      .patch({
        name,
        email,
        user_type,
        is_interviewer_verified
      })
      .where({ user_id });

    if (updated === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
};

exports.getUserPlanStats = async (req, res) => {
  try {
    // admin only
    if (req.user.user_type !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalUsers = await UserSubscription.query().resultSize();

    const freeUsers = await UserSubscription.query()
      .where("plan_type", "free")
      .resultSize();

    const plusUsers = await UserSubscription.query()
      .where("plan_type", "plus")
      .resultSize();

    const premiumUsers = await UserSubscription.query()
      .where("plan_type", "premium")
      .resultSize();

    return res.json({
      total_users: totalUsers,
      free_users: freeUsers,
      plus_users: plusUsers,
      premium_users: premiumUsers
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user stats" });
  }
};

exports.getInterviewSlots = async (req, res) => {
  try {
    const {
      from, // e.g. 2025-12-01
      to, // e.g. 2025-12-31
      mode, // interview_mode e.g. offline/online
      status, // interview_status (overrides default 'open' filter)
      job_role, // optional job role filter
      page, // pagination page (1-based)
      limit // pagination limit
    } = req.query;

    const query = InterviewSlot.query()
      .select(
        "interview_slots.*",

        "users.user_id as candidate_user_id",
        "users.email as candidate_email",
        "users.user_type as candidate_user_type",
        "users.is_interviewer_verified as candidate_is_interviewer_verified",

        "personal_details.first_name as candidate_first_name",
        "personal_details.last_name as candidate_last_name",
        "personal_details.profile_photo_url as candidate_profile_photo_url",
        "personal_details.linkedin_url as candidate_linkedin_url",
        "personal_details.mobile_number as candidate_mobile_number"
      )
      .leftJoin("users", "interview_slots.candidate_id", "users.user_id")
      .leftJoin("personal_details", "users.user_id", "personal_details.user_id")
      .whereNot("candidate_id", req.user.user_id)
      .orderBy("start_time_utc", "asc");

    if (status) {
      query.where("interview_status", status);
    } else {
      query.where("interview_status", "open");
    }

    if (mode) {
      const modes = mode.split(",").map((m) => m.trim()).filter(Boolean);
      if (modes.length === 1) {
        query.whereRaw("LOWER(interview_mode) = LOWER(?)", [modes[0]]);
      } else if (modes.length > 1) {
        const lcModes = modes.map((m) => m.toLowerCase());
        query.whereRaw(
          `LOWER(interview_mode) IN (${lcModes.map(() => "?").join(",")})`,
          lcModes
        );
      }
    }

    if (job_role) {
      query.whereRaw("LOWER(job_role) LIKE LOWER(?)", [`%${job_role}%`]);
    }

    if (from || to) {
      let fromDate = null;
      let toDate = null;

      if (from) {
        fromDate = new Date(from);
        if (isNaN(fromDate.getTime())) {
          return res.status(400).json({ message: "Invalid 'from' date" });
        }
      }

      if (to) {
        toDate = new Date(to);
        if (isNaN(toDate.getTime())) {
          return res.status(400).json({ message: "Invalid 'to' date" });
        }
        // include entire 'to' day
        toDate.setHours(23, 59, 59, 999);
      }

      if (fromDate && toDate) {
        query.whereBetween("start_time_utc", [fromDate.toISOString(), toDate.toISOString()]);
      } else if (fromDate) {
        query.where("start_time_utc", ">=", fromDate.toISOString());
      } else if (toDate) {
        query.where("start_time_utc", "<=", toDate.toISOString());
      }
    }

    // pagination: if page/limit provided, use Objection's page (page is 1-based)
    const pageNum = page ? parseInt(page, 10) : null;
    const pageLimit = limit ? parseInt(limit, 10) : null;

    if (pageNum && pageLimit) {
      // Objection page uses zero-based page index
      const result = await query.page(pageNum - 1, pageLimit);
      return res.status(200).json({ total: result.total, results: result.results });
    }

    const rows = await query;
    return res.status(200).json(rows);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching interview slots" });
  }
};

