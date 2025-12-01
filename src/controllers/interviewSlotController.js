const InterviewSlot = require("../models/interviewSlot");

const dayjs = require('dayjs');
require('dayjs/plugin/timezone');
require('dayjs/plugin/utc');
dayjs.extend(require('dayjs/plugin/timezone'));
dayjs.extend(require('dayjs/plugin/utc'));


exports.create = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const data = req.body;

    if (!data.raw_date_string || !data.raw_time_string) {
      return res.status(400).json({ message: "date and time are required" });
    }

    const localDateTime = `${data.raw_date_string} ${data.raw_time_string}`;
    const format = "YYYY-MM-DD hh:mm A";
    const local = dayjs.tz(localDateTime, format, "Asia/Kolkata");

    if (!local.isValid()) {
      return res.status(400).json({ message: "Invalid format. Expected date=YYYY-MM-DD and time=hh:mm AM/PM" });
    }

    const start_time_utc = local.utc().toDate();

    // Adding 59 minutes to make end time approximately an hour later
    const end_time_utc = local.add(59, "minute").utc().toDate();

    let skills = null;
    if (data.skills) {
      if (Array.isArray(data.skills)) skills = data.skills;
      else if (typeof data.skills === "string") skills = data.skills.includes(",") ? data.skills.split(",").map(s => s.trim()).filter(Boolean) : [data.skills.trim()];
    }

    // Check only candidate's existing bookings for overlap
    const conflict = await InterviewSlot.query()
      .where("user_id", user_id)
      .andWhere("start_time_utc", "<=", end_time_utc)
      .andWhere("end_time_utc", ">=", start_time_utc)
      .first();

    if (conflict) {
      return res.status(409).json({ message: "candidate already have a slot at this time" });
    }

    const record = await InterviewSlot.query().insert({
      ...data,
      user_id,
      skills,
      start_time_utc,
      end_time_utc
    });

    return res.status(201).json(record);
  } catch (err) {
    return res.status(500).json({ message: "Error creating interview slot" });
  }
};


exports.getByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const list = await InterviewSlot.query()
      .where({ user_id })
      .orderBy("start_time_utc", "asc");

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching interview slots" });
  }
};


  exports.getById = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const record = await InterviewSlot.query().findOne({
      user_id,
      interview_slot_id: id
    });

    if (!record) {
      return res.status(404).json({ message: "Interview slot not found" });
    }

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching interview slot" });
  }
};

exports.update = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;
    const data = req.body;

    const updatedCount = await InterviewSlot.query()
      .patch(data)
      .where({ user_id, interview_slot_id: id });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Interview slot not found" });
    }

    const updated = await InterviewSlot.query().findOne({
      user_id,
      interview_slot_id: id
    });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating interview slot" });
  }
};



exports.remove = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const deleted = await InterviewSlot.query()
      .delete()
      .where({
        user_id,
        interview_slot_id: id
      });

    if (!deleted) {
      return res.status(404).json({ message: "Interview slot not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting interview slot" });
  }
};


