'use client';

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import hero from "../images/Hero.png";
import { containerVariants, itemVariants } from "@/utils/motion";

const HeroSection = () => {
  // Variants untuk animasi


  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src={hero}
          alt="Gym Background"
          layout="fill"
          objectFit="cover"
          className="opacity-1"
        />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          className="text-2xl md:text-7xl font-extrabold text-white mb-3"
          variants={itemVariants}
        >
          DON GYM
        </motion.h1>

        <motion.h2
          className="text-lg md:text-4xl text-white mb-8 font-bold"
          variants={itemVariants}
        >
          BEST PLACE TO TRAIN YOUR MUSCLE
        </motion.h2>

        <motion.button
          className="mt-10 bg-base_purple text-white px-8 py-4 rounded-full text-xl font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          SWIPE OUT
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
