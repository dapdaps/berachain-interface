import Button from "@/components/button";
import CloseBox from "./close-box";
import { motion } from "framer-motion";

export default function CloseStatus({ box, loading, onOpen, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center"
    >
      <CloseBox className="mt-[-60px]" />
      <div className="text-[26px] font-CherryBomb mt-[20px]">
        Merry Christmas!
      </div>
      <div className="text-[14px] font-medium mt-[6px]">
        You got <span className="font-bold">{box}</span> gift box from BeraTown
      </div>
      <div className="flex items-center gap-[12px] mt-[18px]">
        <Button
          type="primary"
          className="w-[140px] h-[50px] text-[18px] font-semibold flex justify-center items-center"
          onClick={onOpen}
          loading={loading}
          isOnlyLoading
        >
          Open it
        </Button>
        <Button
          type="primary"
          className="w-[140px] h-[50px] text-[18px] font-semibold"
          onClick={onClose}
        >
          Later
        </Button>
      </div>
    </motion.div>
  );
}
