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
    location: { type: "Point", coordinates: [73.805251, 18.507112] },
    image: "https://i.imgur.com/3v0Qdty.jpg",
    mapLink: "https://www.google.com/maps/place/Vanaz/@18.507112,73.805251"
  },
  {
    name: "FC Road Bin",
    location: { type: "Point", coordinates: [73.8403732, 18.5240265] },
    image: "https://i.imgur.com/hSu3ztP.jpg",
    mapLink: "https://www.google.com/maps/@18.5240265,73.8403732,19.2z"
  },
  {
    name: "JM Road Bin",
    location: { type: "Point", coordinates: [73.8466613, 18.5211987] },
    image: "https://i.imgur.com/ffskl5b.jpg",
    mapLink: "https://www.google.com/maps/@18.5211987,73.8466613,21z"
  },
  {
    name: "Pashan Lake Bin",
    location: { type: "Point", coordinates: [73.7800778, 18.5322] },
    image: "https://i.imgur.com/dgH8IGF.jpg",
    mapLink: "https://www.google.com/maps/@18.5322,73.7800778,19.69z"
  },
  {
    name: "Misc Bin 1",
    location: { type: "Point", coordinates: [73.8455069, 18.5263112] },
    image: "https://i.imgur.com/rF9g8G2.jpg",
    mapLink: "https://www.google.com/maps/@18.5263112,73.8455069,20.4z"
  },
  {
    name: "Misc Bin 2",
    location: { type: "Point", coordinates: [73.7957131, 18.5009018] },
    image: "https://i.imgur.com/jfDLmvx.jpg",
    mapLink: "https://www.google.com/maps/@18.5009018,73.7957131,21z"
  },
  {
    name: "Dominos Near Bin",
    location: { type: "Point", coordinates: [73.7959325, 18.5017198] },
    image: "https://i.imgur.com/MrDFZGo.jpg",
    mapLink: "https://www.google.com/maps/@18.5017198,73.7959325,20.13z"
  },
  {
    name: "Karve Nagar Bin",
    location: { type: "Point", coordinates: [73.8305, 18.4962] },
    image: "https://i.imgur.com/FXKfZqK.jpg",
    mapLink: "https://www.google.com/maps/@18.4962,73.8305,18z"
  },
  {
    name: "Erandwane Bin",
    location: { type: "Point", coordinates: [73.8341, 18.5054] },
    image: "https://i.imgur.com/tnySgkB.jpg",
    mapLink: "https://www.google.com/maps/@18.5054,73.8341,18z"
  },
  {
    name: "Kothrud Depot Bin",
    location: { type: "Point", coordinates: [73.8145, 18.5099] },
    image: "https://i.imgur.com/Yv3AJiI.jpg",
    mapLink: "https://www.google.com/maps/@18.5099,73.8145,18z"
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
