"use client";

import {
  containerVariants,
  itemVariants,
  dividerVariants
} from "@/data/motion/MemberMotion"

import { motion } from "framer-motion"

export default function MemberCard() {
  return (
    <section className="py-20 bg-black">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Title */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            Mem<span className="text-base_purple">ber</span>ship Plan
          </h2>
          <motion.div
           className="w-24 h-1 bg-base_purple mx-auto mt-6"
           variants={dividerVariants}
           />
           <p className="text-gray-300 max-w-2xl mx-auto mt-4">
            See our membership plans and benefits, tailored for you, designed to help you achieve your fitness goals.
          </p>
        </motion.div>

        {/* Card Section */}
        <motion.div
          className="relative border-2 border-base_purple rounded-2xl shadow-lg overflow-hidden max-w-5xl mx-auto flex flex-col lg:flex-row bg-white"
          variants={itemVariants}
        >
          {/* Purple glow effect */}
          <div className="absolute inset-0 rounded-2xl ring-4 ring-base_purple/30 ring-inset pointer-events-none" />

          {/* Member Section */}
          <div className="lg:w-2/3 p-12  relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Member</h1>
              <p className="text-gray-600 mt-2">Exclusive membership benefits</p>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
              <div className="flex-1 bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Registration Fee
                </h3>
                <p className="text-3xl font-bold text-gray-900">Rp.80.000</p>
                <p className="text-sm text-gray-600 mt-2">One-time payment</p>
              </div>

              <div className="flex-1 bg-green-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Per Visit
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-gray-400 line-through mr-2 text-lg">
                    Rp.14.000
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    Rp.7.000
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  After 50% discount
                </p>
              </div>
            </div>

            <div className="mt-8 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-center text-yellow-800 font-medium">
                For 3 years to get{" "}
                <span className="font-extrabold">50% discount</span> per visit
              </p>
            </div>

            <button className="w-full mt-8 bg-gradient-to-r from-base_purple to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1">
              Register Now
            </button>
          </div>

          {/* Terms Section */}
          <div className="lg:w-1/3 bg-gray-50 p-8 border-t lg:border-t-0 lg:border-l border-gray-200 relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Terms & Conditions
            </h2>

            <div className="space-y-4">
              {[
                "Membership is valid for 3 years from registration date",
                "50% discount applies to standard visit rates only",
                "Non-transferable and non-refundable",
                "Present membership card at each visit",
              ].map((term, i) => (
                <div key={i} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 fill-current text-green-500 mt-0.5"
                      viewBox="0 0 20 20"
                    >
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 ml-3">{term}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                For complete terms, visit our website or contact customer
                service
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
