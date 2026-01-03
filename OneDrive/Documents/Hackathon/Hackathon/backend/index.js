const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/stops", require("./routes/stopRoutes"));
app.use("/api/activities", require("./routes/activityRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use("/api/activity-log", require("./routes/activityLogRoutes"));

app.get("/", (req, res) => {
  res.send("GlobeTrotter Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
