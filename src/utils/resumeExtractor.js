function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function extractDetails(text) {
  const cleaned = cleanText(text);

  const locationRegex =
    /(Bangalore|Chennai|Hyderabad|Mumbai|Delhi|Karnataka|Tamil Nadu|Telangana|New York|California|Texas|London|Dubai)/gi;

  const locations = [...cleaned.matchAll(locationRegex)].map(m => m[0]);

  const countries = [
    "India", "USA", "United States", "UK", "United Kingdom", "Canada",
    "Australia", "Germany", "France", "Singapore", "UAE", "Dubai", "Qatar"
  ];

  let foundCountry = "";
  for (let c of countries) {
    const re = new RegExp(c, "i");
    if (re.test(cleaned)) {
      foundCountry = c;
      break;
    }
  }

  return {
    address: locations[0] || "",
    city: locations[0] || "",
    state: locations[1] || "",
    country: foundCountry || "",
    pincode: ""
  };
}

function extractEducation(text) {
  const cleaned = cleanText(text);

  const eduMatch = cleaned.match(
    /EDUCATION(.*?)(LANGUAGE|ACHIEVEMENTS|SKILLS|EXPERIENCE)/i
  );

  if (!eduMatch) return [];

  const eduText = eduMatch[1];

  const degreeRegex =
    /(B\.?E\.?|BTech|MTech|Bachelor|Master|B\.?Sc|M\.?Sc|B\.?Com|MBA)/i;

  const institutionRegex =
    /\b([A-Z][A-Za-z0-9 .,&-]{3,}(University|College|Institute|School))\b/i;

  const yearRegex = /(19|20)\d{2}/g;

  const degree = eduText.match(degreeRegex)?.[0] || "";
  const institution = eduText.match(institutionRegex)?.[0] || "";

  const years = eduText.match(yearRegex);
  const startYear = years?.[0] ? parseInt(years[0]) : null;
  const endYear = years?.[1] ? parseInt(years[1]) : null;

  let currentlyPursuing = null;
  if (endYear) currentlyPursuing = false;

  return [
    {
      education_type: "higher",
      degree: degree,
      institution_name: institution,
      university_name: institution,
      field_of_study: "",
      start_year: startYear,
      end_year: endYear,
      currently_pursuing: currentlyPursuing,
      result_format: "",
      result: ""
    }
  ];
}

function extractWorkExperience(text) {
  const cleaned = text.replace(/\r?\n/g, "\n");

  const match = cleaned.match(
    /PROFESSIONAL EXPERIENCE([\s\S]*?)(EDUCATION|LANGUAGE|ACHIEVEMENTS|SKILLS|$)/i
  );

  if (!match) return [];

  const section = match[1].trim();

  const companySplit = section.split(/\n(?=[A-Z][A-Za-z .,&-]+(Pvt|Ltd|Solution|Technologies|Technology|Inc))/);

  let results = [];

  companySplit.forEach(block => {
    block = block.trim();
    if (!block) return;

    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);

    if (lines.length < 2) return;

    const companyName = lines[0];

    const titleLine = lines[1];

    const jobTitleMatch = titleLine.match(/^[A-Za-z ]+/);
    const jobTitle = jobTitleMatch ? jobTitleMatch[0].trim() : "";

    const dateMatch = titleLine.match(
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4} *[-–] *((Present|Current)|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}))/i
    );

    let startDate = null, endDate = null, current = false;

    if (dateMatch) {
      startDate = dateMatch[0].split(/[-–]/)[0].trim();
      const end = dateMatch[0].split(/[-–]/)[1].trim();

      if (end.includes("Present") || end.includes("Current")) {
        current = true;
        endDate = null;
      } else {
        endDate = end;
      }
    }

    const descriptionLines = lines.slice(2)
      .filter(line => line.startsWith("•") || line.startsWith("-"))
      .map(line => line.replace(/^[-•●]\s*/, ""))
      .join("\n");

    results.push({
      company_name: companyName,
      job_title: jobTitle,
      employment_type: "",
      location: "",
      work_mode: "",
      start_date: startDate,
      end_date: endDate,
      currently_working_here: current,
      description: descriptionLines
    });
  });

  return results;
}

function extractJobRole(text) {
  const cleaned = cleanText(text);

  const jobRoleRegex =
    /(Software Developer|Software Engineer|Backend Developer|Frontend Developer|ROR Developer|Ruby Developer)/i;

  const match = cleaned.match(jobRoleRegex);

  return match ? match[0] : "";
}

module.exports = {
  extractDetails,
  extractEducation,
  extractWorkExperience,
  extractJobRole
};
