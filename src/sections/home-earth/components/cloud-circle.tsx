const CloudCircle = (props: any) => {
  const { speed } = props;

  return (
    <div
      className="will-change-transform animate-rotate-reverse w-[3000px] h-[3000px] absolute z-[1] rounded-full top-[24.5dvh] flex justify-center items-center"
      style={{
        animationDuration: `${speed + 60}s`,
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
    </div>
  );
};

export default CloudCircle;
