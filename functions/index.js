const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

admin.initializeApp();
const app = express();

// Enable CORS for your Firebase Hosting domain
app.use(cors({ origin: "https://weebos-31f97.web.app" }));

// Endpoint to delete chapter images from Cloudinary and update Firestore
app.delete("/delete-chapter", async (req, res) => {
  const { comicName, chapterNum } = req.body;

  if (!comicName || !chapterNum) {
    return res.status(400).json({ error: "Comic name and chapter number are required" });
  }

  try {
    // Delete images from Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${functions.config().cloudinary.cloud_name}/resources/image/upload`;
    const folder = `comics/${comicName}/Chapter${chapterNum}`;

    await axios.delete(cloudinaryUrl, {
      auth: {
        username: functions.config().cloudinary.api_key,
        password: functions.config().cloudinary.api_secret,
      },
      params: {
        prefix: folder,
        type: "upload",
        resource_type: "image",
      },
    });

    // Update Firestore to remove the chapter
    const docRef = admin.firestore().doc(`comics/${comicName}`);
    await docRef.update({
      [`chapters.Chapter${chapterNum}`]: admin.firestore.FieldValue.delete(),
    });

    return res.status(200).json({ message: "Chapter deleted successfully from Cloudinary and Firestore" });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return res.status(500).json({ error: "Failed to delete chapter" });
  }
});

exports.api = functions.https.onRequest(app);