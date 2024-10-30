import { Router } from "express";
import authMiddleware from "../../auth/middleware/authMiddleware.js";
import Itinerary from "../models/Itinerary.js";
import paginate from "../../utils/pagination.js";

const router = Router();

// CRUD Operations

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
  const { title, startDate, endDate } = req.body; //retrieve input vars

  try {
    // Create and save the new user
    const newItinerary = new Itinerary({
      userId: req.user.id,
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await newItinerary.save();

    res.status(201).json({ message: "Itinerary created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating itinerary" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, startDate, endDate, activities } = req.body;

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
    itinerary.startDate = new Date(startDate) || itinerary.startDate;
    itinerary.endDate = new Date(endDate) || itinerary.endDate;
    itinerary.activities = activities || itinerary.activities;
    itinerary.updatedAt = new Date();

    const updatedItinerary = await itinerary.save();

    res.status(200).json(updatedItinerary);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ message: "Error updating itinerary" });
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

export default router;
