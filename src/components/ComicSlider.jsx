import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ComicSlider({ comics = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (comics.length === 0) {
            setCurrentIndex(0); // Reset index if no comics
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

    return (
        <div
            className="w-full h-[500px] bg-cover bg-center flex justify-center items-center"
            style={{
                backgroundImage:
                    "url('https://www.shutterstock.com/shutterstock/photos/1552346156/display_1500/stock-photo-blue-background-texture-blue-background-1552346156.jpg')",
            }}
        >
            <div className="w-full max-w-screen-lg mt-6 flex justify-center bg-slate-oklch(0.554 0.046 257.417)">
                <button
                    onClick={prevSlide}
                    className="p-2 rounded-lg disabled:opacity-50 text-slate-oklch(0.554 0.046 257.417)"
                    disabled={comics.length === 0}
                >
                    {"<"}
                </button>


                {/* Slider Box */}
                <div className="w-[900px] h-[350px] bg-white shadow-md flex items-center mx-4 rounded-lg overflow-hidden relative">
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
                                {/* Image Section */}
                                <img
                                    src={comics[currentIndex]?.img}
                                    alt={comics[currentIndex]?.title}
                                    className="w-1/2 h-full object-cover"
                                />

                                {/* Title & Info Section */}
                                <div className="w-1/2 h-full flex flex-col justify-center items-center text-center px-6">
                                    <h2 className="font-bold text-2xl">{comics[currentIndex]?.title}</h2>
                                    <p className="text-gray-600">{comics[currentIndex]?.info}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        // Fallback UI when no comics are available
                        <div className="w-full h-full flex justify-center items-center">
                            <p className="text-gray-500">No comics available</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={nextSlide}
                    className="p-2 bg-gray-300 rounded-lg disabled:opacity-50"
                    disabled={comics.length === 0}
                >
                    {">"}
                </button>
            </div>
        </div>
    );
}
