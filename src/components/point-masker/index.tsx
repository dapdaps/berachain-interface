import { memo } from "react"
import { motion } from "framer-motion"
export default memo(function PointMasker() {


  return (
    <div className="fixed left-0 top-0 right-0 h-screen opacity-[0.08] pointer-events-none z-50">
      <div className="w-full h-full relative overflow-hidden">
        <motion.div
          className="absolute -inset-[200%] w-[400%] h-[400%] bg-[url('/images/point-masker-bg.png')] will-change-transform"
          animate={{
            translateX: ["-15%", "-5%", "5%", "15%"],
            translateY: ["-20%", "-5%", "5%", "20%"]
          }}
          transition={{
            duration: 1,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
        </motion.div>
      </div>
    </div>
  )
})
