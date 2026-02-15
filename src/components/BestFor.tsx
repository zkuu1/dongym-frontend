"use client";

import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/data/motion/BestForMotion";
import { Items } from "@/data/BestForData";

const BestForSection = () => {
  return (
    <section className="py-20 bg-black">
  <div className="max-w-7xl mx-auto px-4"> 
    {/* Section Title */}
    <motion.div
      className="text-center mb-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h2
        className="text-5xl md:text-6xl font-bold uppercase text-white"
        variants={itemVariants}
      >
        Why Is DON GYM Best For
      </motion.h2>
      <motion.h2
        className="text-5xl md:text-6xl font-bold uppercase text-white mt-2"
        variants={itemVariants}
      >
        You
      </motion.h2>
      <motion.div
        className="w-24 h-1 bg-base_purple mx-auto mt-6"
        variants={itemVariants}
      />
    </motion.div>

    {/* Equipment Grid */}
    <motion.div
      className="relative border-2 border-base_purple rounded-xl p-6 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 rounded-xl ring-4 ring-base_purple/30 ring-inset pointer-events-none"></div>

      {/* Wrapper */}
      <div
        className="
          flex gap-4 overflow-x-auto scrollbar-hide
          md:grid md:grid-cols-3 md:gap-6 md:overflow-x-visible
        "
      >
        {Items.map((item) => (
          <motion.div
            key={item.id}
            className="min-w-[250px] md:min-w-0 bg-base_purple rounded-xl overflow-hidden shadow-lg border-2 border-white"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative h-6 sm:h-10 md:h-12 bg-base_purple" />
            <div className="p-3 sm:p-4 md:p-6">
              <h3 className="text-xl sm:text-3xl md:text-5xl font-bold text-cyan-300 mb-1 sm:mb-2 md:mb-4">
                {item.title}
              </h3>
              <h2 className="text-base sm:text-xl md:text-2xl text-white font-bold mb-1">
                {item.subtitle}
              </h2>
              <p className="text-sm sm:text-base text-white">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
</section>

  );
};

export default BestForSection;
