const express = require("express");
const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const router = express.Router();

// Add activity
router.post("/", async (req, res) => {
  try {
    console.log("Received activity creation request:", req.body);
    
    const { stopId, activityName, cost, day } = req.body;
    
    if (!stopId || !activityName) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required fields. Please provide stopId and activityName." 
      });
    }

    const activityData = {
      stopId: stopId,
      activityName: activityName,
      cost: cost || 0,
      day: day ? new Date(day) : new Date()
    };

    console.log("Attempting to save activity:", activityData);
    const savedActivity = await Activity.create(activityData);
    
    console.log("Activity saved successfully:", savedActivity);
    res.status(201).json({
      success: true,
      data: savedActivity
    });
    
  } catch (err) {
    console.error("Error creating activity:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false,
        error: messages.join('. ') 
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      success: false,
      error: "Server error while creating activity",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get activities by stop ID
router.get("/stop/:stopId", async (req, res) => {
  try {
    const { stopId } = req.params;
    
    const activities = await Activity.find({ stopId })
      .sort({ day: 1, time: 1 });
      
    res.json({
      success: true,
      data: activities
    });
    
  } catch (err) {
    console.error("Error fetching activities by stop:", err);
    res.status(500).json({ 
      success: false,
      error: "Error fetching activities",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Delete activity
router.delete("/:activityId", async (req, res) => {
  try {
    const { activityId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid activity ID" 
      });
    }
    
    const deletedActivity = await Activity.findByIdAndDelete(activityId);
    
    if (!deletedActivity) {
      return res.status(404).json({ 
        success: false,
        error: "Activity not found" 
      });
    }
    
    console.log("Activity deleted successfully:", deletedActivity);
    res.json({
      success: true,
      message: "Activity deleted successfully",
      data: deletedActivity
    });
    
  } catch (err) {
    console.error("Error deleting activity:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error while deleting activity",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
