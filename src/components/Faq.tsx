"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { containerVariants, itemVariants } from "@/data/motion/FaqMotion";
import { faqData } from "@/data/FaqData";

const FAQComponent = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-black">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Title */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold uppercase text-white">
            <span className="text-base_purple">F</span>requently <span className="text-base_purple">A</span>sked <span className="text-base_purple">Q</span>uestions
          </h2>
          <motion.div
            className="w-24 h-1 bg-base_purple mx-auto mt-6"
            variants={itemVariants}
          />
        </motion.div>

        {/* FAQ Items with border & glow */}
        <motion.div 
          className="max-w-6xl mx-auto border-2 border-base_purple rounded-xl p-6 shadow-lg relative"
          variants={itemVariants}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl ring-4 ring-base_purple/30 ring-inset pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            {faqData.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="border border-base_purple/30 rounded-lg overflow-hidden bg-gray-900"
                variants={itemVariants}
              >
                <button
                  className="flex justify-between items-center w-full p-5 text-left font-medium text-white hover:bg-base_purple/10 transition-colors"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={activeIndex === index}
                >
                  <span className="text-lg font-semibold">{item.question}</span>
                  <motion.svg
                    className="w-5 h-5 text-base_purple flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                
                <motion.div
                  className="overflow-hidden"
                  initial={false}
                  animate={{ 
                    height: activeIndex === index ? "auto" : 0,
                    opacity: activeIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-5 bg-gray-800 border-t border-base_purple/20">
                    <p className="text-gray-300">{item.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FAQComponent;