const pdfParse = require("pdf-parse");
const { extractResumeUsingAI } = require("../utils/aiExtractor");

const PersonalDetails = require("../models/PersonalDetails");
const Education = require("../models/Education");
const JobRole = require("../models/JobRole");
const WorkExperience = require("../models/WorkExperience");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Link = require("../models/Link");
const Certificate = require("../models/Certificate");

const LOCKED_FIELDS = ["first_name", "last_name", "email", "mobile_number", "gender"];

function normalizeEducationType(type) {
  if (!type) return "other";

  const t = type.toLowerCase();

  if (t.includes("sslc") || t.includes("10")) return "sslc";
  if (t.includes("puc") || t.includes("12")) return "puc";

  if (
    t.includes("b.") ||
    t.includes("btech") ||
    t.includes("b.e") ||
    t.includes("bachelor") ||
    t.includes("master") ||
    t.includes("m.") ||
    t.includes("degree")
  ) {
    return "higher";
  }

  return "other";
}

async function updatePersonalDetails(userId, pd) {
  const existing = await PersonalDetails.query().findOne({ user_id: userId });
  if (!existing) return "not_found";

  const updateData = {
    date_of_birth: pd.date_of_birth || existing.date_of_birth,
    address: pd.address || existing.address,
    city: pd.city || existing.city,
    state: pd.state || existing.state,
    country: pd.country || existing.country
  };

  await PersonalDetails.query()
    .patch(updateData)
    .where("user_id", userId);

  return "updated";
}

async function saveEducation(userId, list) {
  const saved = [];
  if (!Array.isArray(list)) return saved;

  for (let edu of list) {
    const record = {
      user_id: userId,
      education_type: normalizeEducationType(edu.education_type),
      institution_name: edu.institution_name || null,
      board_type: edu.board_type || null,
      subject_stream: edu.subject_stream || null,
      degree: edu.degree || null,
      field_of_study: edu.field_of_study || null,
      university_name: edu.university_name || null,
      start_year: edu.start_year || null,
      end_year: edu.end_year || null,
      currently_pursuing: edu.currently_pursuing || false,
      result_format: edu.result_format || null,
      result: edu.result || null
    };

    const inserted = await Education.query().insert(record);
    saved.push(inserted);
  }

  return saved;
}

async function saveJobRole(userId, workList) {
  if (!Array.isArray(workList) || workList.length === 0) return null;

  // take latest job title
  const latestJobTitle = workList[0].job_title;

  if (!latestJobTitle) return null;

  return await JobRole.query().insert({
    user_id: userId,
    job_role: latestJobTitle
  });
}

async function saveProjects(userId, projectList) {
  const saved = [];

  if (!Array.isArray(projectList)) return saved;

  for (let proj of projectList) {
    const record = {
      user_id: userId,
      project_title: proj.project_title || null,
      project_type: proj.project_type || null,
      start_date: proj.start_date || null,
      end_date: proj.end_date || null,
      currently_working: proj.currently_working || false,
      description: proj.description || null,
      roles_responsibilities: proj.roles_responsibilities || null
    };

    const inserted = await Project.query().insert(record);
    saved.push(inserted);
  }

  return saved;
}

async function saveWorkExperience(userId, list) {
  const saved = [];
  if (!Array.isArray(list)) return saved;

  for (let w of list) {
    const record = {
      user_id: userId,
      company_name: w.company_name || null,
      job_title: w.job_title || null,
      employment_type: w.employment_type || null,
      location: w.location || null,
      work_mode: w.work_mode || null,
      start_date: w.start_date || null,
      end_date: w.end_date || null,
      currently_working_here: w.currently_working_here || false,
      description: w.description || null
    };

    const inserted = await WorkExperience.query().insert(record);
    saved.push(inserted);
  }

  return saved;
}

async function saveSkills(userId, skillsList) {
  for (let s of skillsList) {
    await Skill.query().insert({
      user_id: userId,
      skill_name: s.skill_name,
      skill_level: s.skill_level
    });
  }
}

async function saveLinks(userId, links) {
  const saved = [];

  if (!Array.isArray(links)) return saved;

  for (let link of links) {
    const record = {
      user_id: userId,
      link_type: link.link_type || null,
      url: link.url || null,
      description: link.description || null
    };

    const inserted = await Link.query().insert(record);
    saved.push(inserted);
  }

  return saved;
}

async function saveCertificates(userId, list) {
  const saved = [];

  if (!Array.isArray(list)) return saved;

  for (let c of list) {
    const record = {
      user_id: userId,
      certificate_type: c.certificate_type || null,
      certificate_title: c.certificate_title || null,
      domain: c.domain || null,
      certificate_provided_by: c.certificate_provided_by || null,
      date: c.date || null,
      description: c.description || null,
      file_url: c.file_url || null,
      file_type: c.file_type || null
    };

    const inserted = await Certificate.query().insert(record);
    saved.push(inserted);
  }

  return saved;
}

exports.extractResume = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const pdf = await pdfParse(req.file.buffer);
    const text = pdf.text;

    const extracted = await extractResumeUsingAI(text);
    const userId = req.user.user_id;

    const personalStatus = await updatePersonalDetails(
      userId,
      extracted.personal_details
    );

    if (personalStatus === "not_found") {
      return res.status(400).json({ message: "Personal details not found" });
    }


    const savedEducation = await saveEducation(userId, extracted.education);
    const savedJobRole = await saveJobRole(userId, extracted.work_experience);
    const savedProjects = await saveProjects(userId, extracted.projects);
    const savedSkills = await saveSkills(userId, extracted.skills);
    const savedLinks = await saveLinks(userId, extracted.links);
    const savedCertificates = await saveCertificates(userId, extracted.certificates);

    const savedWorkExp = await saveWorkExperience(
      userId,
      extracted.work_experience
    );

    return res.json({
      message: "Resume extracted & saved successfully",
      personal_details_updated: true,
      education_saved: savedEducation,
      job_role_saved: savedJobRole,
      work_experience_saved: savedWorkExp,
      ai_output: extracted
    });

  } catch (err) {
    console.error("AI Extract Error:", err);
    return res.status(500).json({ message: "AI extraction failed" });
  }
};
