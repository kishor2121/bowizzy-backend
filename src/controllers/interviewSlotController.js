// controllers/interviewSlotController.js
const InterviewSlot = require("../models/interviewSlot");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

// statuses considered blocking
const ACTIVE_STATUSES = ['open', 'confirmed'];

const DOMAIN_MAP = {
  "python": 'PY',
  "java": 'JV',
  "node": 'ND',
  ".net": 'DN',
};

const MONTH_MAP = {
  1: 'JN', 2: 'FB', 3: 'MR', 4: 'AP', 5: 'MY', 6: 'JU',
  7: 'JY', 8: 'AG', 9: 'ST', 10: 'OT', 11: 'NV', 12: 'DC',
};

const generateInterviewCodePrefix = (domain, date) =>
{
  const [year, month, day] = date.split('-');
  const domain_code = DOMAIN_MAP[domain];
  const month_code = MONTH_MAP[Number(month)];
  return `${domain_code}${year}${month_code}${day}`
}

// Returns { conflict: true, reason, rows } or { conflict: false }
async function checkCandidateConflictFull(trx, candidateId, startTimeUtc, endTimeUtc) {
  // normalize to minute precision and ISO strings
  const startISO = dayjs(startTimeUtc).startOf('minute').toISOString();
  const endISO = dayjs(endTimeUtc).startOf('minute').toISOString();

  // return true if any row has an active (blocking) status
  const hasActive = (rows) => {
    if (!rows) return false;
    if (!Array.isArray(rows)) rows = [rows];
    return rows.some(r => ACTIVE_STATUSES.includes(String(r.interview_status)));
  };

  // 1) OVERLAP: any candidate-created slot that overlaps the proposed range
  // Query ALL overlapping rows (no status filter), then decide by status
  const slotOverlaps = await trx('interview_slots')
    .select('*')
    .where('candidate_id', candidateId)
    .andWhere(function () {
      this.whereRaw('ts_range && tstzrange(?, ?, \'[)\')', [startISO, endISO]);
    });

  if (slotOverlaps && slotOverlaps.length > 0) {
    if (hasActive(slotOverlaps)) {
      return { conflict: true, reason: 'slot_overlap', rows: slotOverlaps };
    }
    // else all overlapping slots are non-blocking (cancelled/expired/completed) -> allow
  }

  // 2) OVERLAP: any schedule that overlaps the proposed range
  const scheduleOverlaps = await trx('interview_schedules')
    .select('*')
    .where('candidate_id', candidateId)
    .andWhere(function () {
      this.whereRaw('ts_range && tstzrange(?, ?, \'[)\')', [startISO, endISO]);
    });

  if (scheduleOverlaps && scheduleOverlaps.length > 0) {
    if (hasActive(scheduleOverlaps)) {
      return { conflict: true, reason: 'schedule_overlap', rows: scheduleOverlaps };
    }
    // else all overlapping schedules are non-blocking -> allow
  }

  // 3) SAME-DAY + SAME-START-TIME (IST local day)
  const localStart = dayjs(startTimeUtc).tz('Asia/Kolkata');
  const dayStartUtcISO = localStart.startOf('day').utc().toISOString();
  const dayEndUtcISO = localStart.endOf('day').utc().toISOString();
  const startISOeq = dayjs(startTimeUtc).startOf('minute').toISOString();

  // slots with exact same start_time_utc within same local day
  const slotSameDayRows = await trx('interview_slots')
    .select('*')
    .where('candidate_id', candidateId)
    .andWhere('start_time_utc', startISOeq)
    .andWhereBetween('start_time_utc', [dayStartUtcISO, dayEndUtcISO]);

  if (slotSameDayRows && slotSameDayRows.length > 0) {
    if (hasActive(slotSameDayRows)) {
      return { conflict: true, reason: 'slot_same_day_time', rows: slotSameDayRows };
    }
  }

  // schedules with exact same start_time_utc within same local day
  const scheduleSameDayRows = await trx('interview_schedules')
    .select('*')
    .where('candidate_id', candidateId)
    .andWhere('start_time_utc', startISOeq)
    .andWhereBetween('start_time_utc', [dayStartUtcISO, dayEndUtcISO]);

  if (scheduleSameDayRows && scheduleSameDayRows.length > 0) {
    if (hasActive(scheduleSameDayRows)) {
      return { conflict: true, reason: 'schedule_same_day_time', rows: scheduleSameDayRows };
    }
  }

  return { conflict: false };
}

// Function to create new interview slot
exports.create = async (req, res) => {
  try {
    const user_id = req.user && req.user.user_id;
    const data = req.body || {};

    if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

    if (!data.raw_date_string || !data.raw_time_string || !data.job_role || !data.interview_mode || !data.experience || !data.skills || !data.resume_url) {
      return res.status(400).json({ message: 'Interview informations like date, time, job role, interview mode,.... are required' });
    }

    // validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.raw_date_string)) {
      return res.status(400).json({ message: 'raw_date_string must be YYYY-MM-DD' });
    }

    // validate time format HH:mm (24-hour)
    if (!/^[0-2]\d:[0-5]\d$/.test(data.raw_time_string)) {
      return res.status(400).json({ message: 'raw_time_string must be HH:mm (24-hour)' });
    }

    // Date time parsing format: "YYYY-MM-DD HH:mm"
    const localDateTime = `${data.raw_date_string} ${data.raw_time_string}`;
    const local = dayjs.tz(localDateTime, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata').startOf('minute');
    if (!local.isValid()) {
      return res.status(400).json({ message: 'Invalid date/time. Expected YYYY-MM-DD and HH:mm (24-hour)' });
    }

    // Convert to JS Date (UTC) for DB
    const start_time_utc = local.toDate();
    const end_time_utc = local.add(1, 'hour').toDate();

    let skills = null;
    if (data.skills) {
      if (Array.isArray(data.skills)) skills = data.skills;
      else if (typeof data.skills === 'string') {
        skills = data.skills.includes(',') ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [data.skills.trim()];
      }
    }

    const domain = (data.job_role || '').split(' ')[0].toLowerCase();

    // generate interviewCodePrefix from domain + date
    const interviewCodePrefix = generateInterviewCodePrefix(domain, data.raw_date_string);

    const knex = InterviewSlot.knex();

    const created = await knex.transaction(async trx => {
      // Acquire a transaction-scoped advisory lock for this candidate id to avoid races.
      // This serializes concurrent slot-creation attempts for the same candidate.
      // pg_advisory_xact_lock accepts a signed 64-bit integer; candidate ids (int) are fine.
      await trx.raw('SELECT pg_advisory_xact_lock(?);', [user_id]);

      // run conflict checks under the same transaction
      const conflict = await checkCandidateConflictFull(trx, user_id, start_time_utc, end_time_utc);
      if (conflict.conflict) {
        const e = new Error('Candidate conflict: ' + conflict.reason);
        e.status = 409;
        throw e;
      }

      const insertPayload = {
        interview_code_prefix: interviewCodePrefix,
        candidate_id: user_id,
        job_role: data.job_role,
        interview_mode: data.interview_mode,
        experience: data.experience,
        skills,
        resume_url: data.resume_url,
        start_time_utc,
        end_time_utc,
      };

      // plain insert; any database constraint failures (unique, not null, etc.) will surface as errors
      const inserted = await trx('interview_slots').insert(insertPayload).returning('*');
      const createdRow = inserted && (inserted.rows ? inserted.rows[0] : inserted[0] || inserted);
      return createdRow;
    });

    return res.status(201).json(created);
  } catch (err) {
    if (err && err.status === 409) return res.status(409).json({ message: err.message });
    return res.status(500).json({ message: 'Error creating interview slot' });
  }
};


exports.getAll = async (req, res) => {
  try {
    const list = await InterviewSlot.query()
      .orderBy("start_time_utc", "asc");

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching interview slots" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const list = await InterviewSlot.query()
      .where({ candidate_id: user_id })
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
      candidate_id: user_id,
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

exports.cancel = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const slot = await InterviewSlot.query().findOne({
      candidate_id: user_id,
      interview_slot_id: id
    });

    if (!slot) {
      return res.status(404).json({ message: "Interview slot not found" });
    }

    const knex = InterviewSlot.knex();
    const status = String(slot.interview_status);

    if (status === "open") {
      await InterviewSlot.query()
        .patch({
          interview_status: "cancelled",
          updated_at: knex.raw("now()")
        })
        .where({
          interview_slot_id: slot.interview_slot_id,
          candidate_id: user_id
        });

      return res.json({ message: "Cancelled successfully" });
    }

    else if (status === "confirmed") {
      await knex.transaction(async (trx) => {
        // Cancel in interview_slots
        await trx("interview_slots")
          .where({
            interview_slot_id: slot.interview_slot_id,
            candidate_id: user_id
          })
          .update({
            interview_status: "cancelled",
            updated_at: knex.raw("now()")
          });

        // Cancel in interview_schedules
        await trx("interview_schedules")
          .where({
            interview_slot_id: slot.interview_slot_id,
            candidate_id: user_id
          })
          .update({
            interview_status: "cancelled",
            updated_at: knex.raw("now()")
          });
      });

      return res.json({ message: "Cancelled successfully" });
    }

    else {
      return res.status(400).json({
        message: "Only open or confirmed slots can be cancelled"
      });
    }

  } catch (err) {
    return res.status(500).json({ message: "Error updating interview slot" });
  }
};



