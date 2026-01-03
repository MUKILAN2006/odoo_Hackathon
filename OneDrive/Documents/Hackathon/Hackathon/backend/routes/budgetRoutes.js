const express = require("express");
const Stop = require("../models/Stop");
const Activity = require("../models/Activity");
const router = express.Router();

// Get total budget for a trip
router.get("/:tripId", async (req, res) => {
  try {
    const stops = await Stop.find({ tripId: req.params.tripId });
    const stopIds = stops.map(stop => stop._id);

    const result = await Activity.aggregate([
      { $match: { stopId: { $in: stopIds } } },
      { $group: { _id: null, total: { $sum: "$cost" } } }
    ]);

    res.json(result[0] || { total: 0 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
