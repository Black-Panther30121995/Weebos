// src/pages/Home.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import ComicSlider from '../components/ComicSlider';
import ComicCard from '../components/ComicCard';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase'; // Import db from firebase.js
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'; // Import Firestore methods
import '../styles/GenreBar.css'; // Import CSS for genre bar

export default function Home() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { currentUser, userRole, setUserRole, signInWithGoogle } = useAuth();
  const [comicList, setComicList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newComicName, setNewComicName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [publisherPassword, setPublisherPassword] = useState('');

  // Extract unique genres for the genre bar
  const genres = [...new Set(comicList.flatMap((comic) => comic.genres || []))];

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true); // Ensure loading state is set before fetching
        const querySnapshot = await getDocs(collection(db, "comics"));
        const comicsData = querySnapshot.docs.map((doc) => doc.data());
        setComicList(comicsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching comics:', err);
        setError('Failed to load comics. Please try again later.');
        setLoading(false);
      }
    };
    fetchComics();

    if (!currentUser) {
      const timer = setTimeout(() => setShowAuthPrompt(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = comicList.filter((comic) =>
        comic.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, comicList]);

  const featuredComics = comicList.slice(0, 3);
  const categorizedComics = {
    Thriller: comicList.filter((comic) =>
      ['MoonChild', 'Flawless', 'Bastard', 'Pigpen', 'Ghost Teller'].includes(comic.title)
    ),
    Romance: comicList.filter((comic) =>
      ['Mafia Nanny', 'I am the Villain', 'Your Smile is A Trap', 'When Jasy Whistles', 'Lore Olympus'].includes(comic.title)
    ),
    Action: comicList.filter((comic) =>
      ['Eleceed', 'Omniscient Reader', 'Tower Of God', 'Return Of The Crazy Demon', 'Lookism'].includes(comic.title)
    ),
  };

  const handleComicClick = (comic) => {
    setSearchQuery('');
    setSuggestions([]);
    navigate(`/comic/${encodeURIComponent(comic.title)}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUploadComic = async (e) => {
    e.preventDefault();
    if (!newComicName || !newImageUrl) {
      alert('Please provide both comic name and image URL.');
      return;
    }

    try {
      const comicData = {
        title: newComicName,
        info: newGenre || "New comic",
        img: newImageUrl,
        pages: [],
        ratings: [],
        description: "A new comic added dynamically.",
        chapters: {}
      };
      await setDoc(doc(db, "comics", newComicName), comicData);
      alert('Comic added successfully!');
      setNewComicName('');
      setNewImageUrl('');
      setNewGenre('');
      setShowUploadModal(false);

      // Refresh comic list after adding
      const querySnapshot = await getDocs(collection(db, "comics"));
      const updatedComics = querySnapshot.docs.map((doc) => doc.data());
      setComicList(updatedComics);
    } catch (err) {
      console.error('Error adding comic:', err);
      alert('Failed to add comic: ' + err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (publisherPassword === '30121995') {
      await setUserRole('publisher'); // Use context's setUserRole to update Firestore
      setPublisherPassword('');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const handleGenreClick = (genre) => {
    navigate(`/genre/${encodeURIComponent(genre)}`);
  };

  if (error && !loading) {
    return (
      <div className="flex flex-col min-h-screen bg-red-500 text-white">
        <p className="text-center mt-8">Error: {error}</p>
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
    <div className='flex flex-col min-h-screen'>
      <main
        className={`w-full flex-grow flex flex-col items-center transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
        }`}
      >
        {/* Show Upload Comic button only for confirmed publishers */}
        {currentUser && userRole === 'publisher' && (
          <div className='w-full flex justify-end px-6 pt-4'>
            <button
              onClick={() => setShowUploadModal(true)}
              className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
            >
              Upload Comic
            </button>
          </div>
        )}

        {/* Auth Prompt for Unauthenticated Users */}
        {showAuthPrompt && !currentUser && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20'>
            <div
              className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
                theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
              }`}
            >
              <h2 className='text-xl font-bold mb-4'>Please Sign Up or Sign In</h2>
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  document.querySelector('.signup-btn')?.click();
                }}
                className={`w-full px-4 py-2 rounded-lg mb-4 ${
                  theme === 'dark'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  document.querySelector('.signin-btn')?.click();
                }}
                className={`w-full px-4 py-2 rounded-lg mb-4 ${
                  theme === 'dark'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={signInWithGoogle}
                className={`w-full px-4 py-2 rounded-lg mb-4 ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Sign In with Google
              </button>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-gray-400 hover:bg-gray-500 text-white'
                }`}
              >
                Not Now
              </button>
            </div>
          </div>
        )}

        {/* Publisher Password Prompt */}
        {currentUser && userRole === 'publisher-pending' && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20'>
            <div
              className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
                theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
              }`}
            >
              <h2 className='text-xl font-bold mb-4'>Enter Publisher Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type='password'
                  value={publisherPassword}
                  onChange={(e) => setPublisherPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border mb-4 ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-200 border-gray-600'
                      : 'bg-gray-100 text-gray-900 border-gray-300'
                  }`}
                  placeholder='Password'
                />
                <button
                  type='submit'
                  className={`w-full px-4 py-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        <div className='w-full flex flex-col items-center'>
          <div className='w-full max-w-2xl mt-6 px-4 relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Search comics by title...'
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-200 border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
            {suggestions.length > 0 && (
              <div
                className={`absolute w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
                }`}
              >
                {suggestions.map((comic) => (
                  <div
                    key={comic.title}
                    onClick={() => handleComicClick(comic)}
                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-opacity-10 hover:bg-teal-500 transition-colors duration-200 ${
                      theme === 'dark' ? 'hover:bg-teal-700' : 'hover:bg-teal-100'
                    }`}
                  >
                    {comic.img ? (
                      <img
                        src={comic.img} // Remove localhost prefix logic since we’re using Firestore with external URLs
                        alt={`${comic.title} thumbnail`}
                        className='w-10 h-10 object-cover rounded mr-3'
                      />
                    ) : (
                      <div className='w-10 h-10 bg-gray-500 rounded mr-3 flex items-center justify-center text-white'>
                        N/A
                      </div>
                    )}
                    <span>{comic.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Genre Bar */}
          {genres.length > 0 && (
            <div className="w-full overflow-hidden bg-gray-800 py-2 mt-4">
              <div className="genre-bar flex space-x-6 animate-marquee">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    onClick={() => handleGenreClick(genre)}
                    className={`px-4 py-2 whitespace-nowrap cursor-pointer text-white hover:text-teal-300`}
                  >
                    {genre}
                  </span>
                ))}
                {genres.map((genre) => (
                  <span
                    key={`${genre}-duplicate`}
                    onClick={() => handleGenreClick(genre)}
                    className={`px-4 py-2 whitespace-nowrap cursor-pointer text-white hover:text-teal-300`}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Upload Modal only for publishers */}
          {currentUser && userRole === 'publisher' && showUploadModal && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20'>
              <div
                className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
                }`}
              >
                <h2 className='text-xl font-bold mb-4'>Upload New Comic</h2>
                <form onSubmit={handleUploadComic} className='flex flex-col gap-4'>
                  <div>
                    <label htmlFor='newComicName' className='block mb-1'>
                      Comic Name
                    </label>
                    <input
                      id='newComicName'
                      type='text'
                      value={newComicName}
                      onChange={(e) => setNewComicName(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 border-gray-600'
                          : 'bg-gray-100 text-gray-900 border-gray-300'
                      }`}
                      placeholder='e.g., NewComic'
                    />
                  </div>
                  <div>
                    <label htmlFor='newImageUrl' className='block mb-1'>
                      Image URL
                    </label>
                    <input
                      id='newImageUrl'
                      type='text'
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 border-gray-600'
                          : 'bg-gray-100 text-gray-900 border-gray-300'
                      }`}
                      placeholder='e.g., https://example.com/image.jpg'
                    />
                  </div>
                  <div>
                    <label htmlFor='newGenre' className='block mb-1'>
                      Genre
                    </label>
                    <input
                      id='newGenre'
                      type='text'
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 border-gray-600'
                          : 'bg-gray-100 text-gray-900 border-gray-300'
                      }`}
                      placeholder='e.g., Thriller, Romance, Action'
                    />
                  </div>
                  <div className='flex gap-4'>
                    <button
                      type='submit'
                      className={`flex-1 px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-teal-600 hover:bg-teal-700 text-white'
                          : 'bg-teal-500 hover:bg-teal-600 text-white'
                      }`}
                    >
                      Add Comic
                    </button>
                    <button
                      type='button'
                      onClick={() => setShowUploadModal(false)}
                      className={`flex-1 px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-gray-400 hover:bg-gray-500 text-white'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <p className='text-center mt-8 text-white'>Loading comics...</p>
          ) : error ? (
            <p className='text-red-400 mt-8 text-center'>{error}</p>
          ) : (
            <>
              <section className='w-full mt-8'>
                <ComicSlider comics={featuredComics} theme={theme} />
              </section>
              {Object.entries(categorizedComics).map(([category, comicsList]) => (
                <section key={category} className='mt-12 w-full max-w-5xl'>
                  <h2 className='text-2xl font-bold mb-4 text-center'>{category}</h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-3'>
                    {comicsList.length > 0 ? (
                      comicsList.map((comic) => (
                        <ComicCard key={comic.title} comic={comic} onClick={handleComicClick} theme={theme} />
                      ))
                    ) : (
                      <p className='col-span-full text-center'>No comics available in this category</p>
                    )}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}