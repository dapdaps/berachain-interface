import OpenBox from "./open-box";
import Button from "@/components/button";
import config from "./config";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function OpenStatus() {
  const { icon, renderHints } = useMemo(() => config["sleigh"], []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center"
    >
      {icon}
      <OpenBox className="mt-[-133px] relative z-[2]" />
      <div className="text-[26px] font-CherryBomb mt-[14px]">Good Luck!</div>
      {renderHints()}
      <Button
        type="primary"
        className="w-[233px] h-[50px] text-[18px] font-semibold mt-[10px]"
      >
        OK
      </Button>
    </motion.div>
  );
}
