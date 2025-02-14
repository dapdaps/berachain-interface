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
