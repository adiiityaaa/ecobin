import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Dustbin from "./models/Dustbin.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
} else {
  console.log("⚠️ No MongoDB URI provided. Running in mock mode.");
}

const mockDustbins = [
  {
    name: "FC Road Bin",
    location: { type: "Point", coordinates: [73.842, 18.520] },
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Recycling_bin_in_Hong_Kong.jpg/320px-Recycling_bin_in_Hong_Kong.jpg",
    mapLink: "https://goo.gl/maps/example1"
  },
  {
    name: "JM Road Bin",
    location: { type: "Point", coordinates: [73.855, 18.516] },
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Trash_can_icon.svg/240px-Trash_can_icon.svg.png",
    mapLink: "https://goo.gl/maps/example2"
  }
];

app.get("/findDustbin", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) return res.status(400).json({ error: "Missing coordinates" });

  if (!MONGO_URI) {
    let nearest = mockDustbins[0];
    let minDist = Infinity;
    mockDustbins.forEach(d => {
      const dx = d.location.coordinates[1] - parseFloat(lat);
      const dy = d.location.coordinates[0] - parseFloat(lng);
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < minDist) {
        minDist = dist;
        nearest = d;
      }
    });
    return res.json(nearest);
  }

  const nearest = await Dustbin.findOne({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: 5000
      }
    }
  });

  if (!nearest) return res.status(404).json({ error: "No dustbins nearby" });
  res.json(nearest);
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
