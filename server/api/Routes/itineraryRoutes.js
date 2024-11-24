import { Router } from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import Itinerary from "../Models/Itinerary.js";
import paginate from "../Utils/pagination.js";
import { hasEmptyInputs } from "../Utils/emptyInputs.js";
import Activity from "../Models/Activity.js";

const router = Router();

// Itineraries CRUD

router.get("/", authMiddleware, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    // Find all itineraries
    const itineraries = await Itinerary.find({
      userId: req.user.id,
    });

    // Paginate
    const pagination = paginate(itineraries, parseInt(page), parseInt(limit));

    res.status(200).json(pagination);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving itineraries" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find Itinerary
    const itinerary = await Itinerary.findOne({
      userId: req.user.id,
      _id: id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving itineraries" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { title, startDate, endDate } = req.body;

  if (hasEmptyInputs(req.body)) {
    return res.status(400).json({ message: "All fields must be completed." });
  }

  try {
    // Create and save the new user
    const newItinerary = new Itinerary({
      userId: req.user.id,
      title,
      startDate,
      endDate,
    });

    await newItinerary.save();

    res.status(201).json(newItinerary);
  } catch (error) {
    res.status(500).json({ message: "Error creating itinerary" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, startDate, endDate, activities, notes, completed } = req.body;

  if (hasEmptyInputs(req.body)) {
    return res.status(400).json({ message: "All fields must be completed." });
  }

  try {
    // Find itinerary to update
    const itinerary = await Itinerary.findOne({
      userId: req.user.id,
      _id: id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Update itinerary, only if new value is provided
    itinerary.title = title || itinerary.title;
    itinerary.startDate = startDate || itinerary.startDate;
    itinerary.endDate = endDate || itinerary.endDate;
    itinerary.activities = activities || itinerary.activities;
    itinerary.notes = notes || itinerary.notes;
    itinerary.completed = completed || itinerary.compeleted;

    const updatedItinerary = await itinerary.save();

    res.status(200).json(updatedItinerary);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ message: "Error updating itinerary", error: error });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find itinerary to update
    const itinerary = await Itinerary.findOne({
      userId: req.user.id,
      _id: id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    await itinerary.deleteOne();
    res.status(200).json({ message: "Successfully deleted itinerary" });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ message: "Error deleting itinerary" });
  }
});

// Activities via Itinerary id: read and create

router.get("/:id/activities", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const activities = await Activity.find({
      userId: req.user.id,
      itineraryId: id,
    });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving activities" });
  }
});

router.post("/:id/activities", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { date, activity, locationName, locationLat, locationLon, notes } =
    req.body;

  if (hasEmptyInputs(req.body)) {
    return res.status(400).json({ message: "All fields must be completed." });
  }

  try {
    const newActivity = new Activity({
      userId: req.user.id,
      itineraryId: id,
      date,
      activity,
      locationName,
      locationLat,
      locationLon,
      notes,
      completed: false,
    });

    await newActivity.save();

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: "Error creating activity" });
  }
});

export default router;
