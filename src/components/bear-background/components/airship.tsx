import { memo, useEffect } from "react";
import { motion, useAnimation } from "framer-motion"
import { useRouter } from "next/navigation";
export default memo(function AirShip() {
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
      onClick={() => {
        router.push("/compaign")
      }}
      className="fixed top-[88px] w-[264px] cursor-pointer"
      variants={variants}
      initial="initial"
      animate={controls}
    >
      <img src="/images/compaign/airship.svg" alt="airship" />
      <div className="absolute w-[186px] top-[18px] -right-[169px]">
        <img src="/images/compaign/flag.gif" alt="flag" />
      </div>
    </motion.div>
  )
})
