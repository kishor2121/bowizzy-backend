const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Allow JSON in requests
app.use(express.json());

// Logging
const morgan = require("morgan");
app.use(morgan("dev"));

// 2. Import your routes
const usersRouter = require("./routes/users");
const personalDetailsRouter = require("./routes/personalDetails");


// 3. Use routes under specific paths
app.use("/users", usersRouter);
app.use("/personal-details", personalDetailsRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Node backend is working!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


