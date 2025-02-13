import { useContext } from 'react';
import { HomeEarthContext } from '../context';

const MountainCircle = (props: any) => {
  const { speed } = props;
  const { mountainRef } = useContext(HomeEarthContext);

  return (
    <div
      ref={mountainRef}
      className="will-change-transform animate-rotate-reverse w-[3000px] h-[3000px] absolute z-[2] rounded-full top-[24.5dvh] flex justify-center items-center"
      style={{
        animationDuration: `${speed + 30}s`,
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
    </div>
  );
};

export default MountainCircle;
