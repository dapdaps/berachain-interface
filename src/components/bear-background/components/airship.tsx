import { memo, useEffect } from "react";
import { motion, useAnimation } from "framer-motion"
import { useRouter } from "next/navigation";
import clsx from 'clsx';
export default memo(function AirShip(props: any) {
  const { className, ...motionProps } = props;

  const router = useRouter()
  const controls = useAnimation();
  const variants = {
    initial: {
      right: "10vw"
    },
    stage1: {
      right: ["10vw", "69vw"]
    },
    stage2: {
      transform: ["rotate(0deg)", "rotate(-1deg)", "rotate(0deg)", "rotate(1deg)"]
    }
  };

  useEffect(() => {
    const sequence = async () => {
      await controls.start("stage1", {
        duration: 8,
        ease: "linear"
      });

      await controls.start("stage2", {
        duration: 1,
        ease: "linear",
        repeat: Infinity
      });
    };
    sequence();
  }, [])

  return (
    <motion.div
      data-bp="1023-001"
      onClick={() => {
        router.push("/bintent-trading-challenge")
      }}
      className={clsx("fixed top-[88px] w-[264px] cursor-pointer", className)}
      variants={variants}
      initial="initial"
      animate={controls}
      {...motionProps}
    >
      <img src="/images/campaign/airship.svg" alt="airship" />
      <div className="absolute w-[186px] top-[17px] -right-[166px]">
        <img src="/images/campaign/flag.gif" alt="flag" />
      </div>
    </motion.div>
  )
})
