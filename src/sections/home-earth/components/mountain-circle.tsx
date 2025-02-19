import { useContext, useEffect } from 'react';
import { HomeEarthContext } from '../context';
import { motion } from 'framer-motion';

const MountainCircle = (props: any) => {
  const {} = props;
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
          <img
            key={i}
            src="/images/home-earth/mountain.svg"
            alt=""
            className="absolute -top-[0px] w-[1888px] h-[588px]"
            style={{
              transform: `rotate(${90 * i}deg) translateY(-110px) translateX(190px)`,
              transformOrigin: 'center 1500px',
            }}
          />
        ))
      }
    </motion.div>
  );
};

export default MountainCircle;
