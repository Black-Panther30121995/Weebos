// src/pages/GenrePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import ComicCard from '../components/ComicCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function GenrePage() {
  const { genre } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const decodedGenre = decodeURIComponent(genre || '');
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComicsByGenre = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'comics'));
        const allComics = querySnapshot.docs.map((doc) => doc.data());
        const filteredComics = allComics.filter((comic) =>
          comic.genres?.includes(decodedGenre)
        );
        setComics(filteredComics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching comics:', err);
        setError('Failed to load comics. Please try again later.');
        setLoading(false);
      }
    };
    fetchComicsByGenre();
  }, [decodedGenre]);

  const handleComicClick = (comic) => {
    navigate(`/comic/${encodeURIComponent(comic.title)}`);
  };

  const handleBack = () => navigate('/');

  if (loading) {
    return (
      <div
        className={`flex flex-col min-h-screen ${
          theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="text-center mt-8">Loading comics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col min-h-screen ${
          theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="text-center mt-8 text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 mx-auto px-4 py-2 bg-teal-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <main className="w-full flex-grow flex flex-col items-center py-8">
        <div className="w-full max-w-5xl px-6">
          <button
            onClick={handleBack}
            className={`mb-6 px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-teal-700 hover:bg-teal-800 text-white'
                : 'bg-teal-500 hover:bg-teal-600 text-white'
            }`}
          >
            Back to Home
          </button>
          <h1 className="text-3xl font-bold mb-6 text-center">{decodedGenre} Comics</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {comics.length > 0 ? (
              comics.map((comic) => (
                <ComicCard
                  key={comic.title}
                  comic={comic}
                  onClick={handleComicClick}
                  theme={theme}
                />
              ))
            ) : (
              <p className="col-span-full text-center">No comics available in this genre.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}