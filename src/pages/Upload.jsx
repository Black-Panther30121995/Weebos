import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

export default function Upload() {
  const { title } = useParams();
  const { currentUser, userRole } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [selectedComic, setSelectedComic] = useState(title || "");
  const [chapterNum, setChapterNum] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [comicsData, setComicsData] = useState({});
  const [selectedChapterToDelete, setSelectedChapterToDelete] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const CLOUDINARY_CLOUD_NAME = "dzvd0wfym";
  const CLOUDINARY_UPLOAD_PRESET = "comic_upload";
  const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  if (!currentUser || userRole !== "publisher") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "comics"));
        const comics = querySnapshot.docs.reduce((acc, doc) => {
          acc[doc.data().title] = doc.data();
          return acc;
        }, {});
        setComicsData(comics);
      } catch (error) {
        console.error("Failed to fetch comics:", error);
      }
    };
    fetchComics();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setImageFiles(imageFiles);
    } else {
      alert("Please drop a folder containing images.");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setImageFiles(imageFiles);
    } else {
      alert("Please select a folder containing images.");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComic) {
      alert("Please select a comic to upload a chapter for.");
      return;
    }

    const chapterKey = `Chapter${chapterNum}`;

    if (!chapterNum || imageFiles.length === 0) {
      alert("Please fill the chapter number and drop a folder of images.");
      return;
    }

    setUploading(true);
    try {
      // Use the exact selected comic title as document ID
      const docRef = doc(db, "comics", selectedComic);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Create new document if it doesn't exist
        await setDoc(docRef, {
          title: selectedComic,
          chapters: {},
          img: "",
          description: "A comic created via upload.",
          ratings: [],
          pages: [],
          info: "",
          genres: comicsData[selectedComic]?.genres || [],
        });
      }

      const sortedImageFiles = [...imageFiles].sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.name.match(/\d+/)?.[0] || "0", 10);
        return numA - numB;
      });

      const imageUrls = await Promise.all(
        sortedImageFiles.map(async (file, index) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
          formData.append("folder", `comics/${selectedComic}/${chapterKey}`);
          formData.append("public_id", `${index}-${file.name}`);

          const response = await axios.post(CLOUDINARY_API_URL, formData);
          return response.data.secure_url;
        })
      );

      await updateDoc(docRef, {
        [`chapters.${chapterKey}`]: imageUrls,
      });

      // Refresh comicsData to reflect the new chapter
      const updatedDoc = await getDoc(docRef);
      setComicsData((prev) => ({
        ...prev,
        [selectedComic]: updatedDoc.data(),
      }));

      alert("Chapter uploaded successfully!");
      setChapterNum("");
      setImageFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      alert(`Failed to upload chapter: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedComic || !selectedChapterToDelete) {
      alert("Please select a comic and chapter to delete.");
      return;
    }

    try {
      const chapterKey = `Chapter${selectedChapterToDelete}`;
      const docRef = doc(db, "comics", selectedComic);
      await updateDoc(docRef, {
        [`chapters.${chapterKey}`]: deleteField(),
      });

      alert("Chapter deleted successfully!");
      const updatedDoc = await getDoc(docRef);
      setComicsData((prev) => ({
        ...prev,
        [selectedComic]: updatedDoc.data(),
      }));
      setSelectedChapterToDelete("");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete chapter: " + error.message);
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center py-8 ${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1
        className={`text-3xl font-bold font-nunito mb-8 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Manage Comic Chapters
      </h1>

      <div className="w-full max-w-md flex flex-col gap-6">
        <div>
          <label
            htmlFor="selectComic"
            className={`text-lg mb-2 block ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Select Comic
          </label>
          <select
            id="selectComic"
            value={selectedComic}
            onChange={(e) => {
              setSelectedComic(e.target.value);
              setChapterNum("");
              setImageFiles([]);
              setSelectedChapterToDelete("");
            }}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-teal-500"
                : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-teal-600"
            }`}
          >
            <option value="">-- Select a Comic --</option>
            {Object.keys(comicsData).map((comic) => (
              <option key={comic} value={comic}>
                {comic}
              </option>
            ))}
          </select>
        </div>

        {selectedComic && (
          <>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <div>
                <label
                  htmlFor="chapterNum"
                  className={`text-lg mb-2 block ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Chapter Number (for {selectedComic})
                </label>
                <input
                  id="chapterNum"
                  type="number"
                  value={chapterNum}
                  onChange={(e) => setChapterNum(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-teal-500"
                      : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-teal-600"
                  }`}
                  placeholder="e.g., 1"
                  min="1"
                />
              </div>
              <div>
                <label
                  className={`text-lg mb-2 block ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Upload Image Folder
                </label>
                <div
                  className={`w-full h-40 largest:border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer ${
                    dragActive
                      ? "border-teal-500 bg-teal-900 bg-opacity-20"
                      : theme === "dark"
                      ? "border-gray-600 text-gray-400"
                      : "border-gray-400 text-gray-600"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleClick}
                >
                  {imageFiles.length > 0 ? (
                    <p>{imageFiles.length} images selected</p>
                  ) : (
                    <p>Drag and drop a folder of images here or click to select</p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  webkitdirectory="true"
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className={`px-6 py-3 rounded-lg transition-colors duration-300 shadow-md ${
                  theme === "dark"
                    ? "bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-600"
                    : "bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-400"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Chapter"}
              </button>
            </form>

            <div className="flex flex-col gap-6 mt-6">
              <h2
                className={`text-2xl font-bold font-nunito ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Delete a Chapter
              </h2>
              <div>
                <label
                  htmlFor="deleteChapter"
                  className={`text-lg mb-2 block ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Select Chapter to Delete (from {selectedComic})
                </label>
                <select
                  id="deleteChapter"
                  value={selectedChapterToDelete}
                  onChange={(e) => setSelectedChapterToDelete(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-teal-500"
                      : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-teal-600"
                  }`}
                >
                  <option value="">-- Select a Chapter --</option>
                  {Object.keys(comicsData[selectedComic]?.chapters || {}).map((chapter) => (
                    <option key={chapter} value={chapter.replace("Chapter", "")}>
                      {chapter}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleDelete}
                className={`px-6 py-3 rounded-lg transition-colors duration-300 shadow-md ${
                  theme === "dark"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Delete Chapter
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}