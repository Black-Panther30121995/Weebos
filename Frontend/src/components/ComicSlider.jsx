import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ComicSlider = ({ comics = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (comics.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % comics.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [comics.length, isPaused]);

  useEffect(() => {
    if (comics.length === 0) {
      setCurrentIndex(0);
    }
  }, [comics]);

  const nextSlide = () => {
    if (comics.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % comics.length);
    }
  };

  const prevSlide = () => {
    if (comics.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? comics.length - 1 : prevIndex - 1
      );
    }
  };

  console.log("ComicSlider comics:", comics); // Debug the incoming data
  console.log("Current Index:", currentIndex); // Debug the current index
  console.log("Current Comic:", comics[currentIndex]); // Debug the current comic

  return (
    <div
      className="w-full h-[600px] bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage:
          "url('https://www.shutterstock.com/shutterstock/photos/1552346156/display_1500/stock-photo-blue-background-texture-blue-background-1552346156.jpg')",
      }}
    >
      <div
        className="w-full max-w-5xl mt-6 flex justify-center items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.button
          onClick={prevSlide}
          className="px-4 py-12 bg-black text-white rounded-lg shadow-lg disabled:opacity-50 hover:bg-gray-900 transition-all duration-300 flex items-center justify-center"
          disabled={comics.length === 0}
          aria-label="Previous comic"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        <div className="w-full md:w-[1100px] h-[450px] bg-white shadow-md flex items-center mx-6 rounded-lg overflow-hidden relative">
          {comics.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full h-full flex"
              >
                <img
                  src={comics[currentIndex]?.img}
                  alt={comics[currentIndex]?.title || "Comic image"}
                  onError={(e) => (e.target.src = "/fallback-image.jpg")}
                  className="w-1/2 h-full object-cover"
                />
                <div className="w-1/2 h-full flex flex-col justify-center items-center text-center px-8">
                  <h2 className="font-bold text-3xl mb-4">
                    {comics[currentIndex]?.title || "Untitled"}
                  </h2>
                  <p className="text-gray-600 text-lg overflow-wrap break-word">
                    {comics[currentIndex]?.info}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-gray-500 text-xl">No comics available</p>
            </div>
          )}
        </div>

        <motion.button
          onClick={nextSlide}
          className="px-4 py-12 bg-black text-white rounded-lg shadow-lg disabled:opacity-50 hover:bg-gray-900 transition-all duration-300 flex items-center justify-center"
          disabled={comics.length === 0}
          aria-label="Next comic"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

ComicSlider.propTypes = {
  comics: PropTypes.arrayOf(
    PropTypes.shape({
      img: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired,
    })
  ),
};

export default ComicSlider;