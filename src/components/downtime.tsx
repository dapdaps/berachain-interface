import { AnimatePresence, motion } from "framer-motion";
import useIsMobile from "@/hooks/use-isMobile";
import clsx from "clsx";

const size = 3500;
const systemMaintenanceDowntimeExpected = process.env.NEXT_PUBLIC_SYSTEM_MAINTENANCE_DOWNTIME_EXPECTED || "July 8, 2025 at 14:00 UTC";

const Downtime = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-screen h-screen relative md:fixed">
      <img src="/images/home-earth/cloud-left.svg" alt="" className="md:hidden absolute top-0 left-0 w-[30.5vw] h-[24vw] max-w-[472px] max-h-[371px]" />
      <img src="/images/home-earth/cloud-right.svg" alt="" className="md:hidden absolute top-0 right-0 w-[31.9vw] h-[24vw] max-w-[493px] max-h-[370px]" />
      <img src="/images/home-earth/beratown-logo.png" alt="" className="w-[340px] h-[209px] md:w-[280px] md:h-[174px] mx-auto mt-[10.56vw]" />
      <div
        className={clsx(
          "w-full absolute bottom-0 overflow-hidden flex justify-center shrink-0",
          isMobile ? "h-[calc(100%_-_174px_-_10.56vw)]" : "h-[calc(100%_-_209px_-_10.56vw)]"
        )}
      >
        <motion.div
          className="will-change-transform absolute z-[1] rounded-full top-[24.5dvh] flex justify-center items-center pointer-events-none"
          style={{
            width: size,
            height: size,
          }}
          animate={{
            transform: `rotate(360deg)`,
          }}
          transition={{
            duration: 260,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <AnimatePresence mode="wait">
            {
              [...new Array(8)].map((_, i) => (
                <motion.img
                  key={i + 'up'}
                  src="/images/home-earth/cloud-earth.svg"
                  alt=""
                  className="absolute -top-[0px] w-[913px] h-[251px]"
                  style={{
                    transform: `rotate(${45 * i}deg) translateY(-150px)`,
                    transformOrigin: `center ${size / 2}px`,
                  }}
                />
              ))
            }
          </AnimatePresence>
        </motion.div>
        <motion.div
          className="will-change-transform absolute z-[2] rounded-full top-[24.5dvh] flex justify-center items-center"
          style={{
            width: size,
            height: size,
          }}
          animate={{
            transform: `rotate(360deg)`,
          }}
          transition={{
            duration: 230,
            repeat: Infinity,
            repeatType: "loop",
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
                  transformOrigin: `center ${size / 2}px`,
                }}
              />
            ))
          }
        </motion.div>
        <motion.div
          className="will-change-transform absolute z-[2] rounded-full top-[24.5dvh] flex justify-center bg-[#B6DF5D] border border-[#5A6F2F]"
          style={{
            width: size,
            height: size,
          }}
        >
          <div className="w-[500px] md:w-screen md:px-[10px] flex items-center flex-col translate-y-[-110px] font-CherryBomb font-normal leading-[100%] text-black text-center">
            <img src="/images/downtime/icon-traffic-cone.png" alt="" className="w-[101px] h-[167px] object-contain object-bottom" />
            <div className="text-[32px] mt-[19px]">
              Under Maintenance
            </div>
            <div className="text-[20px] mt-[25px]">
              We're currently performing scheduled maintenance to improve your experience. Please check back soon.
            </div>
            <div className="text-[16px] mt-[6px]">
              Expected to be back online: {systemMaintenanceDowntimeExpected}
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute left-0 bottom-0 z-[5] w-[300px] h-[174px] pointer-events-none overflow-hidden md:scale-50 md:translate-x-[-100px] md:translate-y-[50px]">
        <img
          src="/images/home-earth/follower-1.svg"
          alt=""
          className="animate-shake2 w-[159px] h-[174px] absolute left-[20px] bottom-0"
          style={{
            animationDuration: '10s',
            transformOrigin: 'center bottom',
            animationTimingFunction: 'ease-in-out',
          }}
        />
        <img
          src="/images/home-earth/follower-2.svg"
          alt=""
          className="animate-shake2 w-[169px] h-[83px] absolute right-0 bottom-0"
          style={{
            animationDuration: '10s',
            transformOrigin: 'center bottom',
            animationTimingFunction: 'ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

export default Downtime;
