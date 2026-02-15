'use client';

import { Variants, motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { locations } from '@/data/FindUsData';
import { 
  containerVariants, 
  itemVariants, 
  dividerVariants, 
  cardVariants,
  titleVariants,
  detailVariants } from '@/data/motion/FindUsMotion';

const FindUsSection = () => {
  const [activeLocation, setActiveLocation] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-6xl font-bold uppercase text-white"
            variants={titleVariants}
            initial="hidden"
            animate="show"
          >
            FIND US <span className="text-base_purple">!!</span>
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-base_purple mx-auto mt-6 origin-left"
            variants={dividerVariants}
            initial="hidden"
            animate="show"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map */}
          <motion.div
            className="lg:w-7/12 bg-gray-900 rounded-xl p-6 border-2 border-base_purple relative overflow-hidden"
            variants={itemVariants}
            initial="hidden"
            animate="show"
          >
            <div className="relative rounded-lg overflow-hidden h-[500px]">
              {isLoading && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse z-10" />
              )}

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.1893506906117!2d110.45667517590732!3d-6.986963468425783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708cc4f9052e23%3A0xa775a0388cbd8f4!2sDon%20Gym%20Fitness!5e0!3m2!1sid!2sid!4v1754574945854!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setIsLoading(false)}
                className="relative z-20"
              />
            </div>
          </motion.div>

          {/* Locations */}
          <motion.div
            className="lg:w-5/12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="bg-gray-900 rounded-xl p-6 border-2 border-base_purple">
              <h3 className="text-2xl font-bold text-white mb-6">
                Our Locations
              </h3>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {locations.map((location, i) => (
                  <motion.div
                    key={location.id}
                    variants={cardVariants}
                    custom={i}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      activeLocation === location.id
                        ? 'bg-base_purple border-2 border-cyan-300'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveLocation(location.id)}
                  >
                    <div className="flex items-start">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          activeLocation === location.id
                            ? 'bg-cyan-300 text-gray-900'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <span className="font-bold">{location.id}</span>
                      </div>
                      <div>
                        <h4
                          className={`font-bold ${
                            activeLocation === location.id
                              ? 'text-white'
                              : 'text-cyan-300'
                          }`}
                        >
                          {location.name}
                        </h4>
                        <p className="text-sm text-gray-300 mt-1">
                          {location.address}
                        </p>
                      </div>
                    </div>

                    {/* Animate details */}
                    <AnimatePresence>
                      {activeLocation === location.id && (
                        <motion.div
                          key="details"
                          variants={detailVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          className="mt-3 pl-14"
                        >
                          <p className="text-gray-200 text-sm">
                            {location.details}
                          </p>
                          <div className="mt-2 flex items-center">
                            <svg
                              className="w-4 h-4 text-cyan-300 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-cyan-200 text-sm">
                              {location.hours}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FindUsSection;
