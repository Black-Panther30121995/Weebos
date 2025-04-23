// src/uploadComics.js
import { db } from "../firebase.js"; // Ensure this path matches your firebase.js location
import { doc, setDoc } from "firebase/firestore";
import comics from "./comics.js"; // Adjust path to your comics.js (e.g., "./data/comics")

async function uploadComicsToFirestore() {
  console.log("Starting upload of comics to Firestore...");

  let uploadedCount = 0;
  const totalComics = Object.keys(comics).length;

  for (const [title, data] of Object.entries(comics)) {
    try {
      await setDoc(doc(db, "comics", title), {
        title: data.title,
        info: data.info,
        img: data.img,
        pages: data.pages,
        ratings: data.ratings,
        description: data.description,
        chapters: data.chapters,
        genres: data.genres || [], // Add genres field, default to empty array if not present
      });
      uploadedCount++;
      console.log(`Successfully uploaded: ${title}`);
    } catch (error) {
      console.error(`Error uploading ${title}:`, error.message);
    }
  }

  // Optional: Log all unique genres after upload
  const allGenres = [
    ...new Set(
      Object.values(comics)
        .flatMap((comic) => comic.genres || [])
        .filter(Boolean)
    ),
  ].sort();
  console.log("Unique genres found in uploaded comics:", allGenres);

  console.log(
    `Upload complete! Successfully uploaded ${uploadedCount} out of ${totalComics} comics.`
  );
}

uploadComicsToFirestore()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Upload failed with error:", error);
    process.exit(1);
  });