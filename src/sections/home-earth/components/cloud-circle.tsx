import { useContext, useEffect } from 'react';
import { HomeEarthContext } from '@/sections/home-earth/context';
import { AnimatePresence, motion } from 'framer-motion';
import { VisibleAnimation } from '@/sections/home-earth/utils';

const CloudCircle = (props: any) => {
  const {} = props;

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
              <motion.img
                key={i + 'down'}
                src="/images/home-earth/cloud-earth-rainy.svg"
                alt=""
                className="absolute -top-[0px] w-[913px] h-[251px]"
                {...VisibleAnimation}
                style={{
                  transform: `rotate(${45 * i}deg) translateY(-150px)`,
                  transformOrigin: 'center 1500px',
                }}
              />
            ) : (
              <motion.img
                key={i + 'up'}
                src="/images/home-earth/cloud-earth.svg"
                alt=""
                className="absolute -top-[0px] w-[913px] h-[251px]"
                {...VisibleAnimation}
                style={{
                  transform: `rotate(${45 * i}deg) translateY(-150px)`,
                  transformOrigin: 'center 1500px',
                }}
              />
            )
          ))
        }
      </AnimatePresence>
    </motion.div>
  );
};

export default CloudCircle;
