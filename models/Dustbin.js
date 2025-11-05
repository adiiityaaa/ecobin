import mongoose from "mongoose";

const DustbinSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number]
  },
  image: String,
  mapLink: String
});

DustbinSchema.index({ location: "2dsphere" });
export default mongoose.model("Dustbin", DustbinSchema);
