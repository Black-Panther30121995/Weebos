const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());

// Enable CORS for local and Firebase Hosting
app.use(cors({ origin: ["http://localhost:3000", "https://weebos-31f97.web.app"] }));

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
    console.error("Error deleting chapter images:", error);
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