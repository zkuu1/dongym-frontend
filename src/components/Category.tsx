"use client";

import { motion, Variants } from "framer-motion";
import { FaUsers, FaImages, FaPills, FaQuestionCircle } from "react-icons/fa";
import { containerVariants, itemVariants, dividerVariants, cardVariants } from "@/data/motion/CategoryMotion";

const categories = [
  {
    id: 1,
    name: "Member",
    icon: <FaUsers className="text-5xl" />,
  },
  {
    id: 2,
    name: "Gallery",
    icon: <FaImages className="text-5xl" />,
  },
  {
    id: 3,
    name: "Supplement",
    icon: <FaPills className="text-5xl" />,
  },
  {
    id: 4,
    name: "Question",
    icon: <FaQuestionCircle className="text-5xl" />,
  },
];

export default function CategorySection() {
  return (
    <section className="py-32 bg-black">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Title */}
        <motion.div className="text-center mb-16" variants={containerVariants}>
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-bold text-white">
               Category <span className="text-base_purple">Sec</span>tion
             </h2>
           <motion.div
              className="w-24 h-1 bg-base_purple mx-auto mt-6"
              variants={dividerVariants}
            />
             <p className="text-gray-300 max-w-2xl mx-auto mt-4">
              Explore our diverse categories designed to enhance your fitness journey, from memberships to supplements and more.
            </p>
            </motion.div>
        </motion.div>

        {/* Box dengan border & glow */}
        <motion.div
          className="relative border-2 border-base_purple rounded-xl p-6 shadow-lg max-w-6xl mx-auto"
          variants={itemVariants}
        >
          {/* Purple glow effect */}
          <div className="absolute inset-0 rounded-xl ring-4 ring-base_purple/30 ring-inset pointer-events-none" />

          {/* Grid sama dengan FitnessEquipment */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="flex flex-col items-center bg-white rounded-xl p-6 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                variants={cardVariants}
                custom={index}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Ikon */}
                <div className="text-base_purple text-6xl mb-4 transition-colors duration-300 group-hover:text-white">
                  {category.icon}
                </div>
                {/* Judul */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 uppercase tracking-wider text-center">
                  {category.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
