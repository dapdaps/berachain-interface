import OpenBox from "./open-box";
import Button from "@/components/button";
import config from "../present-icons/config";
import { motion } from "framer-motion";
import { useMemo } from "react";
import clsx from "clsx";

export default function OpenStatus() {
  const {
    icon: Icon,
    positionClassName,
    name,
    renderHints
  } = useMemo(() => config["sleigh"], []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center"
    >
      <motion.div
        initial={{
          y: 120
        }}
        animate={{
          y: 0,
          zIndex: 3
        }}
        className={clsx("absolute z-[1]", positionClassName)}
      >
        <Icon />
      </motion.div>
      <OpenBox className="mt-[-133px] relative z-[2]" />
      <div className="text-[26px] font-CherryBomb mt-[14px]">Good Luck!</div>
      {renderHints({ name })}
      <Button
        type="primary"
        className="w-[233px] h-[50px] text-[18px] font-semibold mt-[10px]"
      >
        OK
      </Button>
    </motion.div>
  );
}
