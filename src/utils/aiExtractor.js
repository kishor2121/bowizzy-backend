const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function extractResumeUsingAI(text) {
  const prompt = `
Extract structured resume data **ONLY AS PURE JSON**.
❗ DO NOT return markdown.
❗ DO NOT return \`\`\`json or code blocks.
❗ Return ONLY valid JSON.

TEXT:
${text}

Return JSON ONLY in this format:
{
  "personal_details": {
    "first_name": "",
    "last_name": "",
    "email": "",
    "phone": "",
    "address": "",
    "city": "",
    "state": "",
    "country": "",
    "date_of_birth": ""
  },
  "job_role": "",
  "summary": "",
  "education": [
    {
      "education_type": "",
      "degree": "",
      "institution_name": "",
      "university_name": "",
      "start_year": "",
      "end_year": "",
      "currently_pursuing": false
    }
  ],
  "work_experience": [
    {
      "company_name": "",
      "job_title": "",
      "start_date": "",
      "end_date": "",
      "currently_working_here": false,
      "description": ""
    }
  ],
  "projects": [
    {
      "project_title": "",
      "description": "",
      "roles_responsibilities": "",
      "start_date": "",
      "end_date": "",
      "currently_working": false
    }
  ]
}
  "skills": [
  {
    "skill_name": "",
    "skill_level": ""
  }
]
  "links": [
  {
    "link_type": "",
    "url": "",
    "description": ""
  }
]
"certificates": [
  {
    "certificate_type": "",
    "certificate_title": "",
    "domain": "",
    "certificate_provided_by": "",
    "date": "",
    "description": "",
    "file_url": "",
    "file_type": ""
  }
]

`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Return ONLY valid JSON without code blocks." },
      { role: "user", content: prompt }
    ]
  });

  // 🛑 FIX: Strip ```json or ``` from the response before parsing
  let content = response.choices[0].message.content;

  content = content.replace(/```json/g, "")
                   .replace(/```/g, "")
                   .trim();

  return JSON.parse(content);
}

module.exports = { extractResumeUsingAI };
