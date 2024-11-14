import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  activities: [
    {
      datetime: { type: String, required: true },
      activity: { type: String, required: true },
      location: {
        name: { type: String, required: true },
        coordinates: {
          lat: { type: Number, required: true },
          lon: { type: Number, required: true },
        },
      },
      notes: { type: String },
      completed: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model("Itinerary", itinerarySchema);
