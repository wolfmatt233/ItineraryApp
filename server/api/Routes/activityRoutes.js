import { Router } from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import Activity from "../Models/Activity.js";
import { hasEmptyInputs } from "../Utils/emptyInputs.js";

const router = Router();

// Activities CUD

const createActivity = async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { date, locationName, locationLat, locationLon, notes, completed } =
    req.body;

  if (hasEmptyInputs(req.body)) {
    return res.status(400).json({ message: "All fields must be completed." });
  }

  try {
    // Find activity to update
    const activity = await Activity.findOne({
      userId: req.user.id,
      _id: id,
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Update activity, only if new value is provided
    activity.date = date || activity.date;
    activity.activity = req.body.activity || activity.activity;
    activity.locationName = locationName || activity.locationName;
    activity.locationLat = locationLat || activity.locationLat;
    activity.locationLon = locationLon || activity.locationLon;
    activity.notes = notes || activity.notes;
    activity.completed =
      completed !== undefined ? completed : activity.completed;

    const updatedActivity = await activity.save();

    res.status(200).json(updatedActivity);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ message: "Error updating activity", error: error });
  }
};

const deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
    // Find activity to update
    const activity = await Activity.findOne({
      userId: req.user.id,
      _id: id,
    });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await activity.deleteOne();
    res.status(200).json({ message: "Successfully deleted activity" });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ message: "Error deleting activity" });
  }
};

// Routes, all auth protected

router.post("/:id", authMiddleware, createActivity);
router.patch("/:id", authMiddleware, updateActivity);
router.delete("/:id", authMiddleware, deleteActivity);

export default router;
