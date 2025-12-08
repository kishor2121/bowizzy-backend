const CandidateReview = require("../models/candidateReview");
const InterviewerReview = require("../models/interviewerReview");
const InterviewSchedule = require("../models/interviewSchedule");


exports.create = async (req, res) => {
  try {
    const data = req.body;
    const candidate_id = req.user.user_id;

    if(!candidate_id)
    {
        return res.status(403).json({ message: "Invalid user. Access denied" })
    }

    // Required fields for interviewer review
    const requiredFields = [
      "interview_schedule_id",
      "professionalism_conduct",
      "clarity_of_questions",
      "knowledge_of_role",
      "engagement_during_interview",
      "timeliness_organization",
      "overall_experience",
      "final_comments",
      "professionalism_conduct_rating",
      "clarity_of_questions_rating",
      "knowledge_of_role_rating",
      "engagement_during_interview_rating",
      "timeliness_organization_rating",
      "overall_experience_rating"
    ];

    // Check if all required fields exist and for the ratings the values are in the range of 1-5
    for (const field of requiredFields) {
      if (!data[field]) 
      {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
      if(field.endsWith('rating') && (data[field]<1 || data[field]>5))
      {
        return res.status(400).json({ message: "Rating value Cannot be less than 1 or greater than 5" });
      }
      
    }

    const interviewerInfo  = await InterviewSchedule.query()
      .where({ interview_schedule_id: data.interview_schedule_id })
      .select('interviewer_id')
      .first();

    if(!interviewerInfo)
    {
        return res.status(400).json({ message: "Invalid Inteviewer ID" })
    }

    const interviewer_id = interviewerInfo.interviewer_id;

    // Ensure no duplicate review for this interviewer + schedule
    const exists = await InterviewerReview
      .query()
      .findOne({
        interviewer_id,
        interview_schedule_id: data.interview_schedule_id
      });

    if (exists) {
      return res.status(400).json({
        message: "Review already exists for this interview"
      });
    }

    // Insert new reviewer review
    const newRecord = await InterviewerReview.query().insert({
      ...data,
      candidate_id,
      interviewer_id
    });

    return res.status(201).json(newRecord);

  } catch(err) {
    return res.status(500).json({
      message: "Error creating interviewer review"
    });
  }
};


exports.getByUser = async (req, res) => {
  try {
    const candidate_id = req.user.user_id;

    const list = await CandidateReview.query()
      .where({ candidate_id })
      .orderBy("created_at", "desc");

    return res.status(200).json(list);

  } catch(err) {
    return res.status(500).json({
      message: "Error fetching candidate reviews"
    });
  }
};


exports.getById = async (req, res) => {
  try {
    const candidate_id = req.user.user_id;
    const { id } = req.params; 

    const record = await CandidateReview.query().findOne({
      candidate_id,
      candidate_review_id: id
    });

    if (!record) {
      return res.status(404).json({ message: "Candidate review not found" });
    }

    return res.status(200).json(record);

  } catch(err) {
    return res.status(500).json({
      message: "Error fetching candidate review"
    });
  }
};

