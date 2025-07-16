import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

export default function Loading({ size = 18, mr, className }: { size?: number; mr?: string; className?: string; }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={clsx("inline-block text-center", className)}
        transition={{
          times: [0, 1],
          duration: 1,
          ease: 'linear',
          repeat: Infinity,
        }}
        animate={{
          rotate: [0, 360],
        }}
        style={{
          width: size,
          height: size,
        }}
      >
        <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.2" cx="9" cy="9" r="8" stroke="white" strokeWidth="2" />
          <path
            d="M1 9C1 13.4183 4.58172 17 9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}
