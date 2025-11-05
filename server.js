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
    mapLink: "https://www.google.com/maps/place/Vanaz+Metro+Station/@18.4909824,73.7869824,14z/data=!4m6!3m5!1s0x3bc2bf3bdc1f9c8d:0xb9f3b41e377598d!8m2!3d18.5071294!4d73.8052511!16s%2Fg%2F11q39vglgq?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Shivajinagar Metro Bin",
    location: { type: "Point", coordinates: [73.8473869, 18.532233] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Shivajinagar+Metro+Station/@18.532233,73.8473869,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2c18b4f202eef:0xd5c4f25f63936128!8m2!3d18.532233!4d73.8499672!16s%2Fg%2F11pw9mt_p_?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Chhatrapati Sambhaji Udyan Metro Bin",
    location: { type: "Point", coordinates: [73.8403732, 18.5240265] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Chhatrapati+Sambhaji+Maharaj+Udyan+Metro+Station/@18.532233,73.8473869,17z/data=!4m6!3m5!1s0x3bc2c19f971f1359:0xf5bb82e8706d7e0f!8m2!3d18.5201773!4d73.8475516!16s%2Fg%2F11kjlrv88f?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "JM Road Bin",
    location: { type: "Point", coordinates: [73.8464401, 18.5209196] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Shivaji+Nagar/@18.5202709,73.8463733,18.88z/data=!4m14!1m7!3m6!1s0x3bc2c19f971f1359:0xf5bb82e8706d7e0f!2sChhatrapati+Sambhaji+Maharaj+Udyan+Metro+Station!8m2!3d18.5201773!4d73.8475516!16s%2Fg%2F11kjlrv88f!3m5!1s0x3bc2c0796e1aa907:0xbec918cb6812d8ac!8m2!3d18.5210946!4d73.8467327!16s%2Fg%2F11fhvwb287?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
    {
    name: "FC Road Bin",
    location: { type: "Point", coordinates: [73.8416752, 18.5193981] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Westside/@18.5193981,73.8416752,17z/data=!4m6!3m5!1s0x3bc2bf703a3f62f7:0xa1b43e03f22e96e2!8m2!3d18.5181617!4d73.8412424!16s%2Fg%2F11gdknm9m8?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Pashan Lake Bin",
    location: { type: "Point", coordinates: [73.779621, 18.532168] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Shiv+Mandir,+Pashan+Lake/@18.5338876,73.7793845,17.64z/data=!4m14!1m7!3m6!1s0x3bc2befadc9c087b:0x19a6ecd1a140986c!2sPashan+Lake!8m2!3d18.5343969!4d73.7852922!16s%2Fg%2F1tp8yhfp!3m5!1s0x3bc2bef0527186f3:0x7510346394ccf1b7!8m2!3d18.5325253!4d73.7803523!16s%2Fg%2F11g69hg0fv?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Miscellaneous Bin",
    location: { type: "Point", coordinates: [73.8455069, 18.5263112] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Cafe+89/@18.5262536,73.8455984,20.33z/data=!4m9!1m2!2m1!1scafe+69+modern+college!3m5!1s0x3bc2c1b1308f3ebf:0x11f71d5c132a46f9!8m2!3d18.5264162!4d73.8455382!16s%2Fg%2F11tk24fgfr?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Whole Mart Bin",
    location: { type: "Point", coordinates: [73.7957131, 18.5009018] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Whole+Mart/@18.5008134,73.7909624,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bfed33a9ea95:0x734019d7f90e3599!8m2!3d18.5008135!4d73.795828!16s%2Fg%2F11gxmw8l8b?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Dominos Kothrud",
    location: { type: "Point", coordinates: [73.7959325, 18.5017198] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Domino's+Pizza+%7C+Sarthi+Shilp+Society,+Pune/@18.5008134,73.7909624,17z/data=!3m1!5s0x3bc2bfb55a1e2a07:0x94b5415ab3d64681!4m6!3m5!1s0x3bc2bff83677678b:0x6d0524a96d5921ac!8m2!3d18.5018536!4d73.7958259!16s%2Fg%2F11hnn9m3h_?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Karve Nagar Bin",
    location: { type: "Point", coordinates: [73.8131379, 18.4884785] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/D-Mart,+Karve+Nagar/@18.4850663,73.8087309,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf9ec7efff6d:0xa6b851f01122aad2!8m2!3d18.4850663!4d73.8113112!16s%2Fg%2F11sgcwnkfg?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Nalstop Metro Bin",
    location: { type: "Point", coordinates: [73.8260992, 18.5073417] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Nal+Stop+Metro+Station/@18.5073417,73.8260992,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bfae63241c83:0xe4e2bec8a96299dc!8m2!3d18.5073417!4d73.8286795!16s%2Fg%2F11qh19zgh6?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
    {
    name: "Bund Garden Metro Bin",
    location: { type: "Point", coordinates: [73.8439009, 18.5407943] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Bund+Garden/@18.5407943,73.8439009,13z/data=!4m10!1m2!2m1!1smetro+station!3m6!1s0x3bc2c0fc8691948d:0x8a28d6de7ebbaa52!8m2!3d18.540793!4d73.8835771!15sCg1tZXRybyBzdGF0aW9ukgEOc3Vid2F5X3N0YXRpb26qAUgQASoRIg1tZXRybyBzdGF0aW9uKAAyHhABIhr2UBftHmSouCA8pWTO8vgp9yy-QXKCiZkDSjIREAIiDW1ldHJvIHN0YXRpb27gAQA!16s%2Fg%2F11y3hph4cy?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
    {
    name: "Pashan-Sus Road Bin",
    location: { type: "Point", coordinates: [73.7558182, 18.506238] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Adar+Poonawala+Dustbin+Poorva+Heights/@18.506238,73.7558182,13z/data=!4m10!1m2!2m1!1sdustbin!3m6!1s0x3bc2bf49951b8eb7:0x514229cdb090f6fc!8m2!3d18.543403!4d73.7868331!15sCgdkdXN0YmluWgkiB2R1c3RiaW6SARpnYXJiYWdlX2NvbGxlY3Rpb25fc2VydmljZZoBJENoZERTVWhOTUc5blMwVkpRMEZuU1VONmVUbExhWFpSUlJBQqoBSAoJL20vMGJqeWo1EAEqCyIHZHVzdGJpbigAMh8QASIbalymO0mMGA6nZ6hMV5xTEHIDTzR5Gk1Ty6XAMgsQAiIHZHVzdGJpbuABAPoBBAgAEEU!16s%2Fg%2F11s0twfgl0?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
    {
    name: "Swargate Bin",
    location: { type: "Point", coordinates: [73.8568521, 18.500435] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Swargate+Bus+Stand/@18.500435,73.8568521,17.66z/data=!4m9!1m2!2m1!1sgarbage!3m5!1s0x3bc2c010c1e2d447:0x6357bea26143f875!8m2!3d18.4989302!4d73.8588567!16s%2Fg%2F11dxdd8650?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
    {
    name: "Ramwadi Metro Bin",
    location: { type: "Point", coordinates: [73.9044958, 18.557341] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Ramwadi+Metro+Station+(Vanaz+Side+Platform)/@18.557341,73.9044958,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2c1002df96871:0xe72d29e4c115057e!8m2!3d18.5573411!4d73.9093614!16s%2Fg%2F11wj5q0rst?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Kothrud Depot Bin",
    location: { type: "Point", coordinates: [73.7968413, 18.5063462] },
    image: "https://postimg.cc/dkygqgBr",
    mapLink: "https://www.google.com/maps/place/Kothrud+Bus+Depot/@18.5062425,73.7945343,17z/data=!4m15!1m8!3m7!1s0x3bc2bfc1414686b5:0xa3563ce7de7f822e!2sKothrud+Bus+Stand+Rd,+Kothrud,+Pune,+Maharashtra!3b1!8m2!3d18.498622!4d73.813755!16s%2Fg%2F1ptvtfzgh!3m5!1s0x3bc2bfaeebc922b9:0x4919e29c74a33db5!8m2!3d18.5067644!4d73.7953819!16s%2Fg%2F11vr50b7yk?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
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
