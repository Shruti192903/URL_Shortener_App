import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { nanoid } from "nanoid";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage (for testing - data will be lost on restart)
const urls = [];

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
    
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    
    // Check if URL already exists
    const existingUrl = urls.find(url => url.original_url === longUrl);
    if (existingUrl) {
      return res.json({ shortUrl: `${baseUrl}/${existingUrl.short_code}` });
    }
    
    const shortCode = nanoid(8);
    const urlData = {
      original_url: longUrl,
      short_code: shortCode,
      visits: 0,
      created_at: new Date()
    };
    
    urls.push(urlData);
    res.json({ shortUrl: `${baseUrl}/${shortCode}` });
  } catch (err) {
    console.error("Error shortening URL:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/:shortcode", (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = urls.find(u => u.short_code === shortcode);
    
    if (!url) {
      return res.status(404).send("Not Found");
    }
    
    url.visits++;
    res.redirect(url.original_url);
  } catch (err) {
    console.error("Error redirecting:", err);
    res.status(500).send("Server error");
  }
});

// Debug endpoint to see all URLs (for testing)
app.get("/api/urls", (req, res) => {
  res.json(urls);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Using in-memory storage - data will be lost on restart");
});
