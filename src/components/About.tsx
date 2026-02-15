"use client";

import Image from "next/image";
import image1 from "../../src/images/about/bodyBuilder2.png";
import image2 from "../../src/images/about/bodyBuilder.png";
import image3 from "../../src/images/about/bodyBuilder3.png";
import { motion } from "framer-motion";
import { containerVariants, itemVariants, dividerVariants } from "@/utils/motion";

export default function AboutSection() {
  return (
    <section className="bg-black text-white py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div className="text-center mb-16" variants={containerVariants}>
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-bold text-white">
               About <span className="text-base_purple">Us</span>
             </h2>
           <motion.div
              className="w-24 h-1 bg-base_purple mx-auto mt-6"
              variants={dividerVariants}
            />
             <p className="text-gray-300 max-w-2xl mx-auto mt-4">
              Explore our diverse about us designed to enhance your affinity
            </p>
            </motion.div>
        </motion.div>

        {/* Grid Image */}
        <motion.div
          className="grid md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Foto besar */}
          <motion.div className="md:row-span-2" variants={itemVariants}>
            <Image
              src={image2}
              alt="Don Gym"
              width={800}
              height={600}
              className="rounded-lg object-cover w-full h-full"
            />
          </motion.div>

          {/* Foto kecil kiri */}
          <motion.div variants={itemVariants}>
            <Image
              src={image1}
              alt="Don Gym"
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-full"
            />
          </motion.div>

          {/* Foto kecil kanan */}
          <motion.div variants={itemVariants}>
            <Image
              src={image3}
              alt="Don Gym"
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-full"
            />
          </motion.div>
        </motion.div>

        {/* Description Box */}
        <motion.div
          className="mt-10 bg-gradient-to-r from-purple-700 to-purple-900 p-6 rounded-xl text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="text-2xl font-bold">
            <span className="text-white">DON</span>
            <span className="text-cyan-300"> GYM</span>
          </h3>
          <p className="mt-4 text-gray-200">
            Sebuah tempat fitness atau gym yang memiliki tarif yang relatif murah
            dengan fasilitas yang lengkap untuk membantu membentuk badan ideal
            sesuai keinginan Anda!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
