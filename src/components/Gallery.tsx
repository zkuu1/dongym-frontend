"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

import Lobby from "@/images/lobby.jpg";
import Place from "@/images/place.jpg";
import MainHall from "@/images/main_hall.jpg";
import BackHall from "@/images/back_hall.jpg";
import { containerVariants, itemVariants, dividerVariants } from "@/utils/motion";


const GallerySlider = () => {
  const images = [
    { id: 1, name: "Inside Room", kategori: "Don Gym", image: Lobby },
    { id: 2, name: "Main Room", kategori: "Don Gym", image: Place },
    { id: 3, name: "Mirror & Treadmill Room", kategori: "Don Gym", image: MainHall },
    { id: 4, name: "Legpress Room", kategori: "Don Gym", image: BackHall },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // lebih lama biar enak dilihat
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="py-20 bg-black">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
       <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            Gallery <span className="text-base_purple">Sec</span>tion
          </h2>
      <motion.div
          className="w-24 h-1 bg-base_purple mx-auto mt-6"
          variants={dividerVariants}
      />
          <p className="text-gray-300 max-w-2xl mx-auto mt-4">
            Explore our gallery showcasing the vibrant atmosphere and state-of-the-art facilities at Don Gym, designed to inspire your fitness journey.
          </p>
      </motion.div>

        {/* Wrapper with border & glow */}
        <motion.div
          className="relative border-2 border-base_purple rounded-xl p-6 shadow-lg max-w-6xl mx-auto"
          variants={itemVariants}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl ring-4 ring-base_purple/30 ring-inset pointer-events-none" />

          {/* Slider Container */}
          <div className="overflow-hidden rounded-lg shadow-lg relative">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((item) => (
                <div
                  key={item.id}
                  className="w-full flex-shrink-0 relative"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 md:h-[28rem] object-cover rounded-lg"
                    width={1200}
                    height={600}
                    priority
                  />
                  {/* Overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white rounded-b-lg">
                    <h3 className="font-bold text-xl">{item.name}</h3>
                    <p className="text-sm opacity-80">{item.kategori}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentIndex
                    ? "bg-base_purple scale-110"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GallerySlider;
