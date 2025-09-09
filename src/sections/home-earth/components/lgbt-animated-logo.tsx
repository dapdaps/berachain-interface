import React from 'react';
import { motion } from 'framer-motion';

const HeartSVG = () => (
  <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36.235 50.5781L39.2486 51.8445L40.2523 48.7335C41.8603 43.7495 43.6562 35.0769 44.1347 26.8839C44.374 22.7866 44.2934 18.6658 43.6319 15.1202C42.9906 11.6834 41.698 8.20534 39.0138 6.10582C36.7306 4.31996 34.2453 3.48191 31.732 3.88395C29.2903 4.27455 27.3864 5.7479 26.0082 7.41539C24.3449 9.42776 23.1493 12.0665 22.4311 14.7375C19.8443 13.3857 16.915 12.4213 14.1484 12.2373C11.9158 12.0888 9.46897 12.4318 7.42956 13.8603C5.29711 15.354 4.06315 17.714 3.7468 20.6513C3.33238 24.4992 4.83531 28.0481 7.05486 31.0831C9.2765 34.1209 12.3979 36.9034 15.7572 39.3576C22.4843 44.2724 30.6953 48.2502 36.235 50.5781Z" fill="#FF74BA" stroke="#FF4C4C" strokeWidth="6"/>
  </svg>
);

const RisingHeart = ({ delay, startX, initialAngle, pathOffset }: {
  delay: number,
  startX: string,
  initialAngle: number,
  pathOffset: number[],
}) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: 56,
        left: startX,
        rotate: initialAngle,
        zIndex: 1,
      }}
      animate={{
        y: [0, -250],  // 从下往上飘
        x: pathOffset,
        opacity: [0, 1, 1, 0],
        rotate: [initialAngle, initialAngle + 5, initialAngle - 5, initialAngle],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.2, 0.8, 1],
      }}
    >
      <HeartSVG />
    </motion.div>
  );
};

const AnimatedLogo = () => {
  const hearts = [
    { delay: 0, startX: "20%", initialAngle: -10, pathOffset: [0, -20, -10, 0] },
    { delay: 1, startX: "40%", initialAngle: -5, pathOffset: [0, 20, -20, 0] },
    { delay: 2, startX: "60%", initialAngle: 35, pathOffset: [0, -20, 20, 0] },
    { delay: 3, startX: "80%", initialAngle: 50, pathOffset: [0, 20, 10, 0] },
  ];

  return (
    <div className="w-[420px] h-[214px] flex justify-center items-center relative pointer-events-none">
      {hearts.map((heart, index) => (
        <RisingHeart 
          key={index} 
          delay={heart.delay} 
          startX={heart.startX} 
          initialAngle={heart.initialAngle}
          pathOffset={heart.pathOffset}
        />
      ))}
      <motion.img 
        src="/images/home-earth/lgbt-town-logo.png" 
        className="w-[275px] h-[214px] relative z-10" 
        variants={{
          visible: {
            opacity: 1,
            scale: 1,
          },
          invisible: {
            opacity: 0,
            scale: 0.5,
          },
        }}
        animate="visible"
        initial="invisible"
        transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 1, delay: 0.3 }}
        alt="LGBT Town Logo" 
      />
    </div>
  );
};

export default AnimatedLogo;