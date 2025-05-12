import clsx from 'clsx';
import { motion } from 'framer-motion';

const McBeraArrow = (props: any) => {
  const { className } = props;

  return (
    <motion.svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
    >
      <motion.path
        d="M1 8L8 13L15 8"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          opacity: 1,
        }}
        animate={{
          opacity: [1, 0.3, 1],
        }}
        transition={{
          repeat: Infinity,
        }}
      />
      <motion.path
        d="M1 1L8 6L15 1"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          opacity: 0.3,
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          repeat: Infinity,
        }}
      />
    </motion.svg>
  );
};

export default McBeraArrow;
