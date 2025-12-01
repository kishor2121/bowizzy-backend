const pdfParse = require("pdf-parse");
const PersonalDetails = require("../models/PersonalDetails");
const Education = require("../models/Education");
const JobRole = require("../models/JobRole");
const WorkExperience = require("../models/WorkExperience");

const {
  extractDetails,
  extractEducation,
  extractWorkExperience,
  extractJobRole
} = require("../utils/resumeExtractor");

exports.extractResume = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    const extractedPersonal = extractDetails(text);
    const extractedEducation = extractEducation(text);
    const extractedJobRole = extractJobRole(text);
    const extractedWork = extractWorkExperience(text);

    const existing = await PersonalDetails.query().findOne({ user_id });

    if (!existing) {
      return res.status(404).json({ message: "Personal details not found" });
    }

    const updatedPersonal = await PersonalDetails.query()
      .patchAndFetchById(existing.personal_id, {
        address: extractedPersonal.address || existing.address,
        city: extractedPersonal.city || existing.city,
        state: extractedPersonal.state || existing.state,
        country: extractedPersonal.country || existing.country,
        pincode: extractedPersonal.pincode || existing.pincode
      });

    const createdEducations = [];
    for (let edu of extractedEducation) {
      const newEdu = await Education.query().insert({
        user_id,
        ...edu
      });
      createdEducations.push(newEdu);
    }

 
    let createdJobRole = null;
    if (extractedJobRole) {
      createdJobRole = await JobRole.query().insert({
        user_id,
        job_role: extractedJobRole
      });
    }

    const createdWork = [];
    for (let exp of extractedWork) {
      const newWork = await WorkExperience.query().insert({
        user_id,
        ...exp
      });
      createdWork.push(newWork);
    }

    return res.json({
      message: "PDF extracted & data updated successfully",
      personal_details: updatedPersonal,
      job_role_extracted: extractedJobRole,
      job_role_saved: createdJobRole,
      education_extracted: extractedEducation,
      education_saved: createdEducations,
      work_experience_extracted: extractedWork,
      work_experience_saved: createdWork
    });

  } catch (err) {
    console.error("PDF Extract Error:", err);
    res.status(500).json({ message: "Error extracting PDF" });
  }
};
