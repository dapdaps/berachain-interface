import { useContext, useEffect } from 'react';
import { HomeEarthContext } from '../context';
import { motion } from 'framer-motion';

const MountainCircle = (props: any) => {
  const { } = props;
  const {
    mountainRef,
    speed,
    size,
    mountainRotation,
    mountainControls,
    mountainRotateAnimation,
  } = useContext(HomeEarthContext);

  useEffect(() => {
    mountainRotateAnimation();

    return () => {
      mountainControls.current?.stop?.();
    };
  }, []);

  return (
    <motion.div
      ref={mountainRef}
      className="will-change-transform absolute z-[2] rounded-full top-[24.5dvh] flex justify-center items-center"
      style={{
        rotate: mountainRotation,
        animationDuration: `${speed + 30}s`,
        width: size,
        height: size,
      }}
    >
      {
        [...new Array(4)].map((_, i) => (
          <div
            className="absolute w-[1888px] origin-bottom top-0 flex justify-center"
            style={{
              height: size / 2,
              transform: `rotate(${90 * i}deg)`,
            }}
          >
            <img
              key={i}
              src="/images/home-earth/mountain.svg"
              alt=""
              className="w-full h-[588px] rotate-[-8deg] translate-y-[-120px]"
            />
          </div>
        ))
      }
    </motion.div>
  );
};

export default MountainCircle;
