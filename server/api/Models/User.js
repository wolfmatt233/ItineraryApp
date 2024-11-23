import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, //hashed
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: Date.now },
  itineraries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" }],
  refreshToken: { type: String },
});

export default mongoose.model("User", userSchema);
