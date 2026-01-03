const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // 'created_trip', 'updated_trip', 'deleted_trip', 'created_stop', 'updated_stop', 'deleted_stop', 'created_activity', 'updated_activity', 'deleted_activity'
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

// Index for faster queries
ActivityLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
