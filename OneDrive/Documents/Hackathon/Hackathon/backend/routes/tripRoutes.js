const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Trip = require("../models/Trip");
const ActivityLog = require("../models/ActivityLog");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create trip
router.post("/", upload.single('coverImage'), async (req, res) => {
  try {
    console.log("Received trip creation request:");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    
    const { tripName, startDate, endDate, userId, description } = req.body;
    
    if (!tripName || !startDate || !endDate || !userId) {
      console.log("Missing required fields:", { tripName, startDate, endDate, userId });
      return res.status(400).json({ 
        success: false,
        error: "Missing required fields. Please provide tripName, startDate, endDate, and userId." 
      });
    }

    const tripData = {
      tripName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description: description || "",
      userId: userId
    };

    // Add cover image if uploaded
    if (req.file) {
      tripData.coverImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
      console.log("Cover image added to trip data");
    }

    console.log("Attempting to save trip:", tripData);
    const savedTrip = await Trip.create(tripData);
    
    // Log activity
    await ActivityLog.create({
      userId: userId,
      action: 'created_trip',
      details: {
        tripId: savedTrip._id,
        tripName: tripName,
        startDate: startDate,
        endDate: endDate
      }
    });
    
    console.log("Trip saved successfully:", savedTrip);
    res.status(201).json({
      success: true,
      data: savedTrip
    });
    
  } catch (err) {
    console.error("Error creating trip:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false,
        error: messages.join('. ') 
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: "A trip with this name already exists for this user." 
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      success: false,
      error: "Server error while creating trip",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Trip API is working!' });
});

// Get trips by user
router.get("/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid user ID format" 
      });
    }
    
    const trips = await Trip.find({ userId: req.params.userId })
      .sort({ startDate: 1 })
      .lean(); // Use lean() for better performance and to get plain JavaScript objects
      
    // Convert Buffer data to base64 for each trip
    const tripsWithBase64Images = trips.map(trip => {
      if (trip.coverImage && trip.coverImage.data) {
        return {
          ...trip,
          coverImage: {
            ...trip.coverImage,
            data: trip.coverImage.data.toString('base64')
          }
        };
      }
      return trip;
    });
      
    res.json({ 
      success: true,
      data: tripsWithBase64Images 
    });
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({ 
      success: false,
      error: "Error fetching trips",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Update trip
router.put("/:id", upload.single('coverImage'), async (req, res) => {
  try {
    console.log("Received trip update request:", req.params.id, req.body);
    console.log("File:", req.file);
    
    const { tripName, startDate, endDate, description } = req.body;
    const tripId = req.params.id;
    
    if (!tripName || !startDate || !endDate) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required fields. Please provide tripName, startDate, and endDate." 
      });
    }

    const tripData = {
      tripName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description: description || ""
    };

    // Add cover image if uploaded
    if (req.file) {
      tripData.coverImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };
      console.log("Cover image added to trip data");
    }

    console.log("Attempting to update trip:", tripId, tripData);
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId, 
      tripData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedTrip) {
      return res.status(404).json({ 
        success: false,
        error: "Trip not found" 
      });
    }
    
    console.log("Trip updated successfully:", updatedTrip);
    res.status(200).json({
      success: true,
      data: updatedTrip
    });
    
  } catch (err) {
    console.error("Error updating trip:", err);
    
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
      error: "Server error while updating trip",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Delete trip
router.delete("/:id", async (req, res) => {
  try {
    console.log("Received trip delete request:", req.params.id);
    
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    
    if (!deletedTrip) {
      return res.status(404).json({ 
        success: false,
        error: "Trip not found" 
      });
    }
    
    console.log("Trip deleted successfully:", deletedTrip);
    res.status(200).json({
      success: true,
      message: "Trip deleted successfully"
    });
    
  } catch (err) {
    console.error("Error deleting trip:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error while deleting trip",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
