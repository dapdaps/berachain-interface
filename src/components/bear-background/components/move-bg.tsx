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

      {/* <div className="flex items-center absolute z-10 left-0 bottom-[197px] h-[250px] animate-slide-to-left"
        style={{
          left: -(width + window.screen.availWidth),
          animationDuration: '40s',
          width: (width + window.screen.availWidth) * repeat,
        }}
      >
        {
          new Array(repeat).fill(null).map((_, index) => {
            return (
              <div style={{
                width: width + window.screen.availWidth
              }}>
                <div className="w-[1541px]" key={index}>
                  <img src={peoples} />
                </div>
              </div>
            )
          })
        }
      </div> */}
    </>
  );
};

export default MoveBg;
