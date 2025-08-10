import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { nanoid } from "nanoid";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Schema
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_code: { type: String, required: true, unique: true },
  visits: { type: Number, default: 0 }
}, { timestamps: true });

const Url = mongoose.model("Url", urlSchema);

// Helper function to validate URL
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Routes
app.post("/api/shorten", async (req, res) => {
  try {
    const { longUrl } = req.body;
    
    if (!longUrl) {
      return res.status(400).json({ error: "URL is required" });
    }
    
    if (!isValidUrl(longUrl)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }
    
    if (!process.env.BASE_URL) {
      return res.status(500).json({ error: "Server configuration error" });
    }
    
    // Check if URL already exists
    const existingUrl = await Url.findOne({ original_url: longUrl });
    if (existingUrl) {
      return res.json({ shortUrl: `${process.env.BASE_URL}/${existingUrl.short_code}` });
    }
    
    const shortCode = nanoid(8); // 8 characters, more secure than shortid
    const url = new Url({ original_url: longUrl, short_code: shortCode });
    await url.save();
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (err) {
    console.error("Error shortening URL:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ short_code: shortcode });
    if (!url) return res.status(404).send("Not Found");
    url.visits++;
    await url.save();
    res.redirect(url.original_url);
  } catch (err) {
    console.error("Error redirecting:", err);
    res.status(500).send("Server error");
  }
});

// Get URL analytics
app.get("/api/analytics/:shortcode", async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ short_code: shortcode });
    if (!url) return res.status(404).json({ error: "URL not found" });
    
    res.json({
      shortCode: url.short_code,
      originalUrl: url.original_url,
      visits: url.visits,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// List all URLs (for admin/debugging)
app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 }).limit(50);
    res.json(urls);
  } catch (err) {
    console.error("Error fetching URLs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
