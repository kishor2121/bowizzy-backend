const db = require("../db/knex");

exports.getProfileProgress = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    let totalSections = 6;
    let completed = 0;

    let completedSectionsList = [];
    let pendingSectionsList = [];

    const personal = await db("personal_details").where({ user_id }).first();
    if (personal) {
      completed++;
      completedSectionsList.push("personal_details");
    } else {
      pendingSectionsList.push("personal_details");
    }

    const education = await db("education_details").where({ user_id });
    if (education.length > 0) {
      completed++;
      completedSectionsList.push("education");
    } else {
      pendingSectionsList.push("education");
    }

    const experience = await db("work_experience").where({ user_id });
    if (experience.length > 0) {
      completed++;
      completedSectionsList.push("experience");
    } else {
      pendingSectionsList.push("experience");
    }

    const projects = await db("projects").where({ user_id });
    if (projects.length > 0) {
      completed++;
      completedSectionsList.push("projects");
    } else {
      pendingSectionsList.push("projects");
    }

    const skills = await db("skills").where({ user_id });
    const links = await db("links").where({ user_id });
    if (skills.length > 0 || links.length > 0) {
      completed++;
      completedSectionsList.push("skills_links");
    } else {
      pendingSectionsList.push("skills_links");
    }

    const certificates = await db("certificates").where({ user_id });
    if (certificates.length > 0) {
      completed++;
      completedSectionsList.push("certifications");
    } else {
      pendingSectionsList.push("certifications");
    }

    const percentage = Math.round((completed / totalSections) * 100);

    return res.json({
      user_id,
      completedSections: completed,
      totalSections,
      percentage,
      completedSectionsList,
      pendingSectionsList
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculating progress" });
  }
};
