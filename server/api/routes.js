import { Router } from "express";
import authRoutes from "./auth/routes/authRoutes.js";
import itineraryRoutes from "./itineraries/routes/itineraryRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/itineraries", itineraryRoutes);

router.get("/", (req, res) => {
  res.send("Server home confirmed.");
});

export default router;
