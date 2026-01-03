const express = require("express");
const mongoose = require("mongoose");
const Stop = require("../models/Stop");
const router = express.Router();

// Add stop (city)
router.post("/", async (req, res) => {
  try {
    console.log("Received stop creation request:", req.body);
    
    const { tripId, city, startDate, endDate } = req.body;
    
    if (!tripId || !city) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required fields. Please provide tripId and city." 
      });
    }

    const stopData = {
      tripId: tripId,
      city: city,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date()
    };

    console.log("Attempting to save stop:", stopData);
    const savedStop = await Stop.create(stopData);
    
    console.log("Stop saved successfully:", savedStop);
    res.status(201).json({
      success: true,
      data: savedStop
    });
    
  } catch (err) {
    console.error("Error creating stop:", err);
    
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
      error: "Server error while creating stop",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get stops by trip ID
router.get("/trip/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const stops = await Stop.find({ tripId })
      .sort({ startDate: 1 });
      
    res.json({
      success: true,
      data: stops
    });
    
  } catch (err) {
    console.error("Error fetching stops by trip:", err);
    res.status(500).json({ 
      success: false,
      error: "Error fetching stops",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Delete stop
router.delete("/:stopId", async (req, res) => {
  try {
    const { stopId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(stopId)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid stop ID" 
      });
    }
    
    const deletedStop = await Stop.findByIdAndDelete(stopId);
    
    if (!deletedStop) {
      return res.status(404).json({ 
        success: false,
        error: "Stop not found" 
      });
    }
    
    // Also delete all activities associated with this stop
    const Activity = require("../models/Activity");
    await Activity.deleteMany({ stopId: stopId });
    
    console.log("Stop and associated activities deleted successfully:", deletedStop);
    res.json({
      success: true,
      message: "Stop and associated activities deleted successfully",
      data: deletedStop
    });
    
  } catch (err) {
    console.error("Error deleting stop:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error while deleting stop",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
