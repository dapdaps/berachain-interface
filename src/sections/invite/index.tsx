import { motion } from "framer-motion";

const InviteViews = () => {
  return (
    <div className="flex min-h-screen justify-center items-center relative">
      <div className="absolute left-0 bottom-0 z-0 w-[603px] h-[748px] bg-[url(/images/invite/cloud-left.png)] bg-no-repeat bg-center bg-contain">
        <div className="w-full h-full relative">
          <img
            src="/images/invite/fllower-left.png"
            className="absolute bottom-0 left-0 w-[310px] h-[202px] z-0"
            alt=""
          />
          <div className="absolute left-0 bottom-0 w-[224px] h-[377px] z-10">
            <div className="w-full h-full relative">
              <motion.img
                src="/images/invite/flowers-left.png"
                className="w-full h-full object-contain"
                alt="Flowers"
                animate={{
                    rotate: [0, 2, -2, 0], 
                  }}
                  transition={{
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                  }}
                  style={{
                    transformOrigin: "left bottom",
                  }}
              />
              <motion.img
                src="/images/invite/bee.svg"
                className="absolute right-0 top-0 w-[44px] h-[40px]"
                alt="Bee"
                animate={{
                  x: [0, -20, 0], 
                  y: [0, -10, 0], 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut", 
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[url(/images/invite-bera.png)] absolute left-1/2 -translate-x-1/2 bottom-0 z-10 bg-no-repeat bg-center bg-contain w-[993px] h-[817px]">
        <Content></Content>
      </div>
      <div className="absolute right-0 bottom-0 z-0 w-[663px] h-[765px] bg-[url(/images/invite/cloud-right.png)] bg-no-repeat bg-center bg-contain">
        <div className="w-full h-full relative">
          <img
            src="/images/invite/fllower-right.png"
            className="absolute bottom-0 right-0 w-[270px] h-[294px] z-0"
            alt=""
          />
          <div className="absolute w-[362px] h-[216px] right-0 bottom-0 z-10 overflow-hidden">
            <div className="relative w-full h-full flex justify-between items-baseline">
                <motion.img 
                  animate={{
                    rotate: [0, 2, -2, 0], 
                  }}
                  transition={{
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                  }}
                  style={{
                    transformOrigin: "left bottom",
                  }} 
                  src="/images/invite/flowers-right-2.png" 
                  className="w-[221px] h-[162px]" alt="" />
                <motion.img 
                  animate={{
                    rotate: [0, 2, -2, 0], 
                  }}
                  transition={{
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                  }}
                  style={{
                    transformOrigin: "left bottom",
                  }}  
                  src="/images/invite/flowers-right-1.png" className="w-[144px] h-[229px]" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Content = () => {
  return (
    <div className="relative z-10 w-full h-full">
      <div className="flex justify-center overflow-hidd">
        <div className="w-[480px] h-auto">
          dqwwqeqwe
        </div>
      </div>
    </div>
  )
}

export default InviteViews;
