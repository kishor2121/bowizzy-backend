const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
const morgan = require("morgan");
const db = require("./db/knex");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
const authRouter = require("./routes/auth");
const personalDetailsRouter = require("./routes/personalDetails");
const educationRouter = require("./routes/education");
const workExperienceRouter = require("./routes/workExperience");
const projectRouter = require("./routes/projects");
const skillsRouter = require("./routes/skills");
const linksRouter = require("./routes/links");
const certificatesRouter = require("./routes/certificates");
const resumeTemplatesRouter = require("./routes/resumeTemplates");
const locationRouter = require("./routes/location");
const dashboardRouter = require("./routes/dashboard");
const interviewSlotRouter = require("./routes/interviewSlot");
const technicalSummaryRouter = require("./routes/technicalSummary");

app.use("/auth", authRouter);
app.use("/", personalDetailsRouter);
app.use("/", educationRouter);
app.use("/", workExperienceRouter);
app.use("/", projectRouter);
app.use("/", skillsRouter);
app.use("/", linksRouter);
app.use("/", certificatesRouter);
app.use("/", resumeTemplatesRouter);
app.use("/", locationRouter);
app.use("/", dashboardRouter);
app.use("/", interviewSlotRouter); 
app.use("/", technicalSummaryRouter);

app.get("/", (req, res) => {
  res.send("Node backend is working!");
});

db.raw("SELECT 1")
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
