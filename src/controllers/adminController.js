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
    const slots = await InterviewSlot.query()
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
      .where("interview_status", "open")
      .whereNot("candidate_id", req.user.user_id)
      .orderBy("start_time_utc", "asc");

    return res.status(200).json(slots);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching interview slots" });
  }
};

