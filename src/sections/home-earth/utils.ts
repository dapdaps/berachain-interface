import { animate } from 'framer-motion';

export const createRotateAnimation = (params: any) => {
  const { controls, rotation, endRotationRef, speed } = params;

  controls.current = animate(
    rotation,
    [endRotationRef.current, endRotationRef.current - 360],
    {
      duration: speed,
      repeat: Infinity,
      ease: "linear"
    }
  );
};

export const VisibleAnimation = {
  variants: {
    visible: { opacity: 1, },
    invisible: { opacity: 0 },
  },
  animate: "visible",
  initial: "invisible",
  exit: "invisible",
  transition: {
    duration: 0.3,
  },
};
