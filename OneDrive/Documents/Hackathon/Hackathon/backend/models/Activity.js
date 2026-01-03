const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  stopId: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" },
  activityName: String,
  cost: Number,
  day: Date
});

module.exports = mongoose.model("Activity", ActivitySchema);
