import { useContext, useEffect } from 'react';
import { HomeEarthContext } from '@/sections/home-earth/context';
import { AnimatePresence, motion } from 'framer-motion';
import { VisibleAnimation } from '@/sections/home-earth/utils';

const CloudCircle = (props: any) => {
  const { } = props;

  const {
    isRainyDay,
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
      className="will-change-transform absolute z-[1] rounded-full top-[24.5dvh] flex justify-center items-center pointer-events-none"
      style={{
        rotate: cloudRotation,
        animationDuration: `${speed + 60}s`,
        width: size,
        height: size,
      }}
    >
      <AnimatePresence mode="wait">
        {
          [...new Array(8)].map((_, i) => (
            isRainyDay ? (
              <motion.div
                key={i + 'down'}
                className="absolute top-0 origin-bottom w-[913px] flex justify-center"
                style={{
                  height: size / 2,
                  transform: `rotate(${45 * i}deg)`,
                }}
                {...VisibleAnimation}
              >
                <img
                  src="/images/home-earth/cloud-earth-rainy.svg"
                  alt=""
                  className="w-full h-[251px]"
                />
              </motion.div>
            ) : (
              <motion.div
                key={i + 'up'}
                className="absolute top-0 origin-bottom w-[913px] flex justify-center"
                style={{
                  height: size / 2,
                  transform: `rotate(${45 * i}deg)`,
                }}
                {...VisibleAnimation}
              >
                <img
                  src="/images/home-earth/cloud-earth.svg"
                  alt=""
                  className="w-full h-[251px] rotate-[0deg] translate-y-[-170px]"
                />
              </motion.div>
            )
          ))
        }
      </AnimatePresence>
    </motion.div>
  );
};

export default CloudCircle;
