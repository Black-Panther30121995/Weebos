import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath, pathToFileURL } from "url";

// Derive __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Load initial comics data dynamically
const comicsPath = pathToFileURL(path.join(__dirname, "../src/data/comics.js")).href;
let comics = (await import(comicsPath)).default;
console.log("Initial comics loaded:", Object.keys(comics));

// API to get all comics
app.get("/comics", (req, res) => {
  console.log("Serving /comics, current comics:", Object.keys(comics));
  res.json(comics);
});

// Set up multer for file uploads (for chapters)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../public/uploads", req.body.comicName);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// API to handle chapter uploads
app.post("/upload", upload.array("images"), (req, res) => {
  const { comicName, chapterNum } = req.body;
  const chapterKey = `Chapter${chapterNum}`;
  const imagePaths = req.files.map((file) => `/uploads/${comicName}/${file.filename}`);

  if (!comics[comicName]) {
    comics[comicName] = {
      title: comicName,
      info: "User-uploaded comic",
      img: imagePaths[0] || comics[comicName]?.img,
      pages: [],
      description: "A user-uploaded comic.",
      chapters: {},
      genre: "Unknown",
      ratings: [], // Initialize ratings array
    };
  }

  comics[comicName].chapters[chapterKey] = imagePaths;
  console.log(`Updated comics after upload for ${comicName}:`, comics[comicName]);

  const content = `export default ${JSON.stringify(comics, null, 2)};\n`;
  try {
    fs.writeFileSync(path.join(__dirname, "../src/data/comics.js"), content);
    console.log(`Successfully wrote to comics.js for ${comicName}, Chapter ${chapterNum}`);
  } catch (err) {
    console.error("Failed to write to comics.js:", err);
    return res.status(500).json({ message: "Failed to save comic data." });
  }

  res.json({ message: `Chapter ${chapterNum} uploaded for ${comicName} with ${imagePaths.length} images!` });
});

// API to add a new comic (no file upload, just metadata)
app.post("/add-comic", express.json(), (req, res) => {
  const { comicName, imageUrl, genre } = req.body;

  if (!comicName || !imageUrl) {
    console.log("Missing required fields:", { comicName, imageUrl });
    return res.status(400).json({ message: "Comic name and image URL are required." });
  }

  if (comics[comicName]) {
    console.log(`Comic '${comicName}' already exists`);
    return res.status(400).json({ message: `Comic '${comicName}' already exists.` });
  }

  comics[comicName] = {
    title: comicName,
    info: "User-added comic",
    img: imageUrl,
    pages: [],
    description: "A user-added comic.",
    chapters: {},
    genre: genre || "Unknown",
    ratings: [], // Initialize ratings array
  };
  console.log(`Added new comic: ${comicName}`, comics[comicName]);

  const content = `export default ${JSON.stringify(comics, null, 2)};\n`;
  try {
    fs.writeFileSync(path.join(__dirname, "../src/data/comics.js"), content);
    console.log(`Successfully wrote new comic '${comicName}' to comics.js`);
  } catch (err) {
    console.error("Failed to write to comics.js:", err);
    return res.status(500).json({ message: "Failed to save comic data." });
  }

  res.json({ message: `Comic '${comicName}' added successfully!` });
});

// API to delete a chapter
app.delete("/upload", express.json(), (req, res) => {
  const { comicName, chapterNum } = req.body;
  const chapterKey = `Chapter${chapterNum}`;

  console.log(`Attempting to delete ${chapterKey} from ${comicName}`);

  if (!comics[comicName]) {
    console.log(`Comic '${comicName}' not found`);
    return res.status(404).json({ message: `Comic '${comicName}' not found.` });
  }

  if (!comics[comicName].chapters[chapterKey]) {
    console.log(`Chapter ${chapterNum} not found in '${comicName}'`);
    return res.status(404).json({ message: `Chapter ${chapterNum} not found in '${comicName}'.` });
  }

  delete comics[comicName].chapters[chapterKey];
  console.log(`Deleted ${chapterKey} from ${comicName}, updated chapters:`, comics[comicName].chapters);

  const content = `export default ${JSON.stringify(comics, null, 2)};\n`;
  try {
    fs.writeFileSync(path.join(__dirname, "../src/data/comics.js"), content);
    console.log(`Successfully updated comics.js after deleting ${chapterKey} from ${comicName}`);
  } catch (err) {
    console.error("Failed to write to comics.js:", err);
    return res.status(500).json({ message: "Failed to save comic data after deletion." });
  }

  res.json({ message: `Chapter ${chapterNum} deleted from '${comicName}'.` });
});

// New API to rate a comic
app.post("/rate-comic", express.json(), (req, res) => {
  const { comicName, rating } = req.body;

  if (!comicName || !rating || rating < 1 || rating > 5) {
    console.log("Invalid rating data:", { comicName, rating });
    return res.status(400).json({ message: "Comic name and a rating between 1-5 are required." });
  }

  if (!comics[comicName]) {
    console.log(`Comic '${comicName}' not found`);
    return res.status(404).json({ message: `Comic '${comicName}' not found.` });
  }

  // Add the rating to the comic's ratings array
  comics[comicName].ratings = comics[comicName].ratings || [];
  comics[comicName].ratings.push(Number(rating));
  console.log(`Added rating ${rating} to '${comicName}', ratings:`, comics[comicName].ratings);

  const content = `export default ${JSON.stringify(comics, null, 2)};\n`;
  try {
    fs.writeFileSync(path.join(__dirname, "../src/data/comics.js"), content);
    console.log(`Successfully updated comics.js with rating for '${comicName}'`);
  } catch (err) {
    console.error("Failed to write to comics.js:", err);
    return res.status(500).json({ message: "Failed to save rating." });
  }

  res.json({ message: `Rating ${rating} added to '${comicName}' successfully!` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});