import { Router } from "express";
import authRoutes from "./Routes/authRoutes.js";
import itineraryRoutes from "./Routes/itineraryRoutes.js";
import activityRoutes from "./Routes/activityRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/itineraries/:id/activities", activityRoutes);
router.use("/itineraries", itineraryRoutes);

router.get("/", (req, res) => {
  res.send("Server home confirmed.");
});

export default router;
