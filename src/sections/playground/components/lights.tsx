import clsx from "clsx";

const Lights = (props: any) => {
  const { className, delay = 0} = props;

  const lightBalls = [
    { right: "0px", top: "5px" },
    { right: "100px", top: "50px" },
    { right: "200px", top: "80px" },
    { right: "300px", top: "105px" },
    { right: "400px", top: "125px" },
    { right: "500px", top: "145px" },
    { right: "600px", top: "160px" },
    { right: "700px", top: "175px" },
    { right: "800px", top: "185px" },
  ];

  return (
    <div className={clsx("relative w-[829px] h-[189px] bg-[url('/images/playground/lights-line.svg')] bg-contain bg-center bg-no-repeat", className)}>
      {lightBalls.map((ball, index) => (
        <div
          key={index}
          className="absolute w-[23px] h-[23px] rounded-full bg-[#fff] drop-shadow-[0_0_10px_#FFE0A8]"
          style={{
            right: ball.right,
            top: ball.top,
            animationName: "flickering-light",
            animationDuration: "2s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationFillMode: "both",
            animationDelay: `${delay}s`, //  + index * 0.1
          }}
        />
      ))}
    </div>
  );
};

export default Lights;
