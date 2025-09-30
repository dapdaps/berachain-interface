import clsx from "clsx";
import { motion } from "framer-motion";
import { Moves, EMove } from "../config";

const ResultHat = (props: any) => {
  const { className, result, room } = props;

  return (
    <div className={clsx("w-[171px] h-[127px] shrink-0 absolute translate-x-[40px] bottom-[260px] flex justify-center", className)}>
      <motion.img
        src="/images/playground/magician/hat-invert.png"
        alt=""
        className="w-full h-full object-center object-contain shrink-0 relative z-[2]"
        initial={{
          rotate: 180,
        }}
        animate={{
          rotate: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
      />
      <div
        className="w-[116px] h-[110px] absolute z-[3] overflow-hidden [clip-path:polygon(0_0,100%_0,100%_91%,75%_92.5%,50%_93%,25%_92.5%,0_91%)]"
        style={{
          transform: `translateY(${Moves[result.moves as EMove].imgYellowY}px)`,
        }}
      >
        <motion.img
          src={Moves[result.moves as EMove].imgYellow}
          alt=""
          className="w-full h-full object-center object-contain shrink-0"
          initial={{
            y: "100%",
          }}
          animate={{
            y: 0,
          }}
          transition={{
            ease: "easeInOut",
            duration: 1,
            delay: 1,
          }}
        />
      </div>
    </div>
  );
};

export default ResultHat;
