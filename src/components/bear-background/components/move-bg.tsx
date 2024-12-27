import { useMemo } from "react";

const MoveBg = (props: any) => {
  const {
    width,
    repeat = 3,
    foreground,
    background,
    peoples,
  } = props;


  const ScreenWidth = useMemo(() => window.screen.availWidth, [])
  const Peoples_Width = 2286
  return (
    <>
      <div
        className="absolute z-[9] left-0 bottom-[200px] h-[235px] bg-repeat-x bg-left animate-slide-to-left will-change-transform"
        style={{
          left: -width / 2,
          width: width * repeat,
          backgroundImage: `url("${background}")`,
          animationDuration: '40s',
        }}
      />
      <div
        className="absolute z-10 left-0 bottom-0 h-[249px] bg-repeat-x bg-left animate-slide-to-left will-change-transform"
        style={{
          left: -width / 2,
          width: width * repeat,
          backgroundImage: `url("${foreground}")`,
          animationDuration: '20s',
        }}
      />

      <div className="flex items-center absolute z-10 left-0 bottom-[197px] h-[250px] animate-slide-to-left will-change-transform"
        style={{
          left: -(2 * Peoples_Width + ScreenWidth),
          animationDuration: '120s',
          width: (Peoples_Width + ScreenWidth) * repeat,
          animationDelay: '3s'
        }}
      >
        {
          new Array(repeat).fill(null).map((_, index) => {
            return (
              <div
                key={index}
                style={{
                  width: Peoples_Width + ScreenWidth
                }}
              >
                <div style={{ width: Peoples_Width }} key={index}>
                  <img src={peoples} />
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  );
};

export default MoveBg;
