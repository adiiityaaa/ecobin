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
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
} else {
  console.log("⚠️ No MongoDB URI provided. Running in mock mode.");
}

// 🗑️ Hardcoded 10 Pune Dustbins (lat/lon parsed from links)
const mockDustbins = [
  {
    name: "Vanaz Metro Bin",
    location: { type: "Point", coordinates: [73.8026708, 18.5071294] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Vanaz+Metro+Station/@18.5071294,73.8026708,17z/"
  },
  {
    name: "Shivajinagar Metro Bin",
    location: { type: "Point", coordinates: [73.8473869, 18.532233] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Shivajinagar+Metro+Station/@18.532233,73.8473869,17z/"
  },
  {
    name: "Chhatrapati Sambhaji Udyan Metro Bin",
    location: { type: "Point", coordinates: [73.8403732, 18.5240265] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/@18.5240265,73.8403732,19.2z"
  },
  {
    name: "JM Road Bin",
    location: { type: "Point", coordinates: [73.8464401, 18.5209196] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Shivaji+Nagar/@18.5209196,73.8464401,20.03z/"
  },
  {
    name: "Pashan Lake Bin",
    location: { type: "Point", coordinates: [73.779621, 18.532168] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Shiv+Mandir,+Pashan+Lake/@18.532168,73.779621,18.87z/"
  },
  {
    name: "Miscellaneous Bin",
    location: { type: "Point", coordinates: [73.8455069, 18.5263112] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Cafe+89/@18.5263865,73.8456263,21z"
  },
  {
    name: "Miscellaneous Bin",
    location: { type: "Point", coordinates: [73.7957131, 18.5009018] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Whole+Mart/@18.5009018,73.7957131,21z/"
  },
  {
    name: "Dominos Kothrud",
    location: { type: "Point", coordinates: [73.7959325, 18.5017198] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Domino's+Pizza+%7C+Sarthi+Shilp+Society,+Pune/@18.5015992,73.7953275,19.13z"
  },
  {
    name: "Karve Nagar Bin",
    location: { type: "Point", coordinates: [73.8131379, 18.4884785] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/D-Mart,+Karve+Nagar/@18.4850377,73.8019432,14z/"
  },
  {
    name: "Nalstop Metro Bin",
    location: { type: "Point", coordinates: [73.8260992, 18.5073417] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Nal+Stop+Metro+Station/@18.5073417,73.8260992,17z/"
  },
  {
    name: "Kothrud Depot Bin",
    location: { type: "Point", coordinates: [73.7968413, 18.5063462] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Kothrud+Bus+Depot/@18.5063462,73.7968413,17.05z/"
  }
];

// ✅ New: API that returns all bins (for frontend map)
app.get("/api/dustbins", (req, res) => {
  res.json(mockDustbins);
});

// ✅ New: API that returns 5 nearest bins (sorted)
app.get("/findDustbin", (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) return res.status(400).json({ error: "Missing coordinates" });

  // Sort bins by distance
  const binsWithDistance = mockDustbins.map((d) => {
    const dx = d.location.coordinates[1] - parseFloat(lat);
    const dy = d.location.coordinates[0] - parseFloat(lng);
    const dist = Math.sqrt(dx * dx + dy * dy);
    return { ...d, distance: dist };
  });

  const sorted = binsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 5);
  res.json(sorted);
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
