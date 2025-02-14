import { useContext, useEffect } from 'react';
import { HomeEarthContext } from '@/sections/home-earth/context';
import { motion } from 'framer-motion';

const CloudCircle = (props: any) => {
  const {} = props;

  const {
    cloudRef,
    speed,
    size,
    cloudRotation,
    cloudControls,
    cloudRotateAnimation,
  } = useContext(HomeEarthContext);

  useEffect(() => {
    cloudRotateAnimation();

    return () => {
      cloudControls.current?.stop?.();
    };
  }, []);

  return (
    <motion.div
      ref={cloudRef}
      className="will-change-transform absolute z-[1] rounded-full top-[24.5dvh] flex justify-center items-center"
      style={{
        rotate: cloudRotation,
        animationDuration: `${speed + 60}s`,
        width: size,
        height: size,
      }}
    >
      {
        [...new Array(8)].map((_, i) => (
          <img
            key={i}
            src="/images/home-earth/cloud-earth.svg"
            alt=""
            className="absolute -top-[0px] w-[913px] h-[251px]"
            style={{
              transform: `rotate(${45 * i}deg) translateY(-150px)`,
              transformOrigin: 'center 1500px',
            }}
          />
        ))
      }
    </motion.div>
  );
};

export default CloudCircle;
