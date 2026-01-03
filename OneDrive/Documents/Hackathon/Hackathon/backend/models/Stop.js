const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  city: String,
  startDate: Date,
  endDate: Date
});

module.exports = mongoose.model("Stop", StopSchema);
