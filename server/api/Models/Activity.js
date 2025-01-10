import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary", required: true },
    date: { type: String, required: true },
    activity: { type: String, required: true },
    locationName: { type: String, required: true },
    locationLat: { type: Number, required: true },
    locationLon: { type: Number, required: true },
    notes: { type: String },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

export default mongoose.model("Activity", activitySchema);
