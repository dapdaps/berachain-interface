import { motion } from 'framer-motion';

const LogoAnimation = {
  animate: {
    opacity: [0, 1],
    y: [20, 0],
    scale: [0.7, 1]
  },
  transition: {
    duration: 0.4,
    delay: 0.3,
    type: 'spring',
    stiffness: 300,
    damping: 20
  },
};

function BeraTown(props: any) {
  const { isChristmas, className, style } = props;

  return (
    <div style={style} className={`absolute bottom-[389px] left-1/2 translate-x-[-149px] flex flex-col items-center ${className}`}>
      {
        !isChristmas && (
          <motion.img
            src='/images/background/beratown.png'
            width={401}
            height={290}
            {...LogoAnimation}
          />
        )
      }
      {
        isChristmas && (
          <motion.img
            src='/images/background/christmas/beratown.svg'
            width={347}
            height={218}
            {...LogoAnimation}
          />
        )
      }
    </div>
  );
}

export default BeraTown;
