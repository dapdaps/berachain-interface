import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import { Clouds } from "../clouds";
import Ground from "../components/ground";
import { useActivityStore } from "@/stores/useActivityStore";
import PegAirshipSvg from '@public/images/campaign/peg_airship.svg'
import LighthouseSvg from '@public/images/campaign/lighthouse.svg'
import LakeSurfaceSvg from '@public/images/campaign/lake_surface.svg'
import BridgeSvg from '@public/images/campaign/bridge.svg'
import ShipSvg from '@public/images/campaign/ship.svg'


export default memo(function BeraBgcampaign() {
  const { isDefaultTheme } = useActivityStore()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Clouds />
        <div className="absolute w-[762px] left-[5vw] bottom-[194px] z-10">
          <img src="/images/campaign/peg_airship.svg" alt="peg_airship" />
          <div className="absolute w-[261px] top-[36px] -right-[14px]">
            <img src="/images/campaign/flag.gif" alt="flag" />
          </div>
        </div>
        <LighthouseSvg className="absolute w-[73px] left-[16.55vw] bottom-[233px] z-10" />
        <LakeSurfaceSvg className="absolute w-[766px] right-0 bottom-0 z-10" />
        <BridgeSvg className="absolute w-[446px] right-[246px] bottom-[128px] z-[11]" />
        <motion.div
          className="absolute w-[301px] right-0 bottom-[138px] z-10"
          animate={{
            transform: ["rotate(-2deg)", "rotate(2deg)", "rotate(-2deg)"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        >
          <ShipSvg />
        </motion.div>
        <Ground isDefaultTheme={isDefaultTheme} />
      </motion.div>
    </AnimatePresence>
  )
})
