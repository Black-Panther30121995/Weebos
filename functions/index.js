const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Configure CORS
const corsOptions = {
  origin: ["http://localhost:5173", "https://weebos-31f97.web.app"],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware first
app.use(cors(corsOptions));

// Explicitly handle OPTIONS for /delete-chapter
app.options("/delete-chapter", cors(corsOptions), (req, res) => {
  console.log("Handling OPTIONS request for /delete-chapter", {
    origin: req.get("Origin"),
    headers: req.headers,
  });
  res.status(200).end();
});

// Log all requests and responses for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
    origin: req.get("Origin"),
    headers: req.headers,
  });
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Response for ${req.method} ${req.url}`, {
      status: res.statusCode,
      headers: res.getHeaders(),
    });
    return originalSend.call(this, body);
  };
  next();
});

// Parse JSON bodies
app.use(express.json());

// Endpoint to delete chapter images from Cloudinary
app.delete("/delete-chapter", async (req, res) => {
  const { comicName, chapterNum } = req.body;

  if (!comicName || !chapterNum) {
    return res.status(400).json({ error: "Comic name and chapter number are required" });
  }

  try {
    // Delete images from Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image/upload`;
    const folder = `comics/${comicName}/Chapter${chapterNum}`;

    await axios.delete(cloudinaryUrl, {
      auth: {
        username: process.env.CLOUDINARY_API_KEY,
        password: process.env.CLOUDINARY_API_SECRET,
      },
      params: {
        prefix: folder,
        type: "upload",
        resource_type: "image",
      },
    });

    return res.status(200).json({ message: "Chapter images deleted successfully from Cloudinary" });
  } catch (error) {
    console.error("Error deleting chapter images:", {
      message: error.message,
      response: error.response ? error.response.data : null,
    });
    return res.status(500).json({ error: "Failed to delete chapter images" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});