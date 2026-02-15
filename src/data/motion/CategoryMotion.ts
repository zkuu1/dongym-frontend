import { motion, Variants } from "framer-motion";


const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const dividerVariants: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.8,
      delay: 0.5,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.6,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1], // backOut feel
    },
  }),
};

const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.16, 1, 0.3, 1], duration: 0.8 },
    },
  };

    const detailVariants: Variants = {
      hidden: { opacity: 0, y: -10 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
    };

export { containerVariants, itemVariants, dividerVariants, cardVariants, titleVariants, detailVariants };