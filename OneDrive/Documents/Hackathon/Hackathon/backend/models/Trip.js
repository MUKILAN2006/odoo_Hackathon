const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: [true, "User ID is required"]
  },
  tripName: {
    type: String,
    required: [true, "Trip name is required"],
    trim: true,
    minlength: [3, "Trip name must be at least 3 characters long"],
    maxlength: [100, "Trip name cannot exceed 100 characters"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: "End date must be after start date"
    }
  },
  description: {
    type: String,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  coverImage: {
    data: Buffer,
    contentType: String,
    filename: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Trip", TripSchema);
