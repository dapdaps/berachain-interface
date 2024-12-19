const MoveBg = (props: any) => {
  const {
    width,
    repeat = 3,
    foreground,
    background,
    peoples,
  } = props;

  return (
    <>
      <div
        className="absolute z-[9] left-0 bottom-[200px] h-[235px] bg-repeat-x bg-left animate-slide-to-left"
        style={{
          left: -width / 2,
          width: width * repeat,
          backgroundImage: `url("${background}")`,
          animationDuration: '20s',
        }}
      />
      <div
        className="absolute z-10 left-0 bottom-0 h-[249px] bg-repeat-x bg-left animate-slide-to-left"
        style={{
          left: -width / 2,
          width: width * repeat,
          backgroundImage: `url("${foreground}")`,
        }}
      />

      <div
        className="absolute z-10 left-0 bottom-[197px] h-[250px] bg-repeat-x bg-left animate-slide-to-left bg-contain"
        style={{
          left: -width / 2,
          width: width * repeat,
          backgroundImage: `url("${peoples}")`,
        }}
      />
    </>
  );
};

export default MoveBg;
