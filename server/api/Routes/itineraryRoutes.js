import { Router } from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import Itinerary from "../Models/Itinerary.js";
import paginate from "../Utils/pagination.js";
import { hasEmptyInputs } from "../Utils/emptyInputs.js";
import Activity from "../Models/Activity.js";

const router = Router();

// Itineraries CRUD

const getItineraries = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    // Find all itineraries for user
    const itineraries = await Itinerary.find({
      userId: req.user.id,
    });

    // Paginate
    // const pagination = paginate(itineraries, parseInt(page), parseInt(limit));

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getItineraryById = async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const createItinerary = async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateItinerary = async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteItinerary = async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// Routes, all auth protected

router.get("/", authMiddleware, getItineraries);
router.get("/:id", authMiddleware, getItineraryById);
router.post("/", authMiddleware, createItinerary);
router.patch("/:id", authMiddleware, updateItinerary);
router.delete("/:id", authMiddleware, deleteItinerary);

export default router;
