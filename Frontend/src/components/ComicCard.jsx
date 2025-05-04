import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const ComicCard = ({ comic, onClick }) => {
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  return (
    <div
      className="group relative w-full h-40 bg-white shadow-lg rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
      aria-label={`Comic: ${comic.title}`}
      onClick={() => onClick(comic)}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)} // Show info on hover
      onMouseLeave={() => setIsHovered(false)} // Hide info on leave
    >
      <img
        src={comic.img}
        alt={comic.title}
        onError={(e) => (e.target.src = "/fallback-image.jpg")}
        className="absolute w-full h-full object-cover" // Image always visible
      />
      <AnimatePresence mode="wait">
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} // Matches ComicSlider's fade duration
            className="absolute w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-2" // Semi-transparent background
          >
            <h2 className="font-bold text-lg text-white mb-1">{comic.title}</h2>
            <p className="text-sm text-white overflow-wrap break-word line-clamp-3">
              {comic.info}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// PropTypes for validation
ComicCard.propTypes = {
  comic: PropTypes.shape({
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

// Default props
ComicCard.defaultProps = {
  onClick: () => {},
};

export default ComicCard;