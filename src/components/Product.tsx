"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import Whey from "@/images/products/whey.jpg";
import { containerVariants, itemVariants, dividerVariants, cardVariants } from "@/utils/motion";

const WheyProducts = () => {
  const products = [
    { id: 1, name: "WHEY PROTEIN", price: "Rp.12.000", unit: "per scope", image: Whey },
    { id: 2, name: "WHEY PROTEIN", price: "Rp.12.000", unit: "per scope", image: Whey },
    { id: 3, name: "WHEY PROTEIN", price: "Rp.12.000", unit: "per scope", image: Whey },
    { id: 4, name: "WHEY PROTEIN", price: "Rp.12.000", unit: "per scope", image: Whey },
  ];

  return (
    <section className="min-h-screen bg-black py-20">
      <motion.div
        className="max-w-6xl mx-auto px-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Suplemen & <span className="text-base_purple">Whey</span>
          </h1>
          <motion.div
            className="w-24 h-1 bg-base_purple mx-auto mt-6"
            variants={dividerVariants}
          />
          <p className="text-gray-300 max-w-2xl mx-auto mt-4">
            Premium quality whey protein supplements to support your fitness
            goals and recovery.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
              variants={cardVariants}
              custom={i}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Product Image */}
              <div className="h-48 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
                  {product.name}
                </h3>

                <div className="mt-auto">
                  <div className="text-center mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-center text-sm">
                    {product.unit}
                  </p>

                  {/* <button className="w-full mt-4 bg-gradient-to-r from-base_semi_purple to-base_purple hover:from-purple-700 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
                    Add to Cart
                  </button> */}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 bg-gray-800 rounded-2xl p-6 text-center"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Choose Our Whey Protein?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <motion.div className="p-4" variants={itemVariants}>
              <div className="flex justify-center mb-2">✅</div>
              <h3 className="font-semibold mb-2">High Quality</h3>
              <p className="text-gray-300 text-sm">
                Premium ingredients for maximum results
              </p>
            </motion.div>
            <motion.div className="p-4" variants={itemVariants}>
              <div className="flex justify-center mb-2">⚡</div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-300 text-sm">
                Receive your order within 24 hours
              </p>
            </motion.div>
            <motion.div className="p-4" variants={itemVariants}>
              <div className="flex justify-center mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-300 text-sm">
                30-day money-back guarantee
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WheyProducts;
