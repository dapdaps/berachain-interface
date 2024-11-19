import { motion } from "framer-motion";
import Header from "./header";
import { useState } from "react";

export default function WithdrawalPanel() {
  const [expand, setExpand] = useState(false);
  return (
    <motion.div
      animate={{
        y: expand ? 0 : "calc(100% - 60px)"
      }}
      className="fixed z-[10] right-[20px] bottom-[0px] w-[386px] bg-[#FFFDEB] rounded-t-[10px] p-[20px] border border-black shadow-shadow1"
    >
      <Header
        expand={expand}
        onExpand={() => {
          setExpand(!expand);
        }}
      />
      <div>
        {[1, 2].map((item: any, i: number) => (
          <div className="mt-[20px] flex items-start" key={i}>
            <div className="text-[16px]">
              <span className="font-bold mr-[5px]">10M sPepe</span>
              <span>is available to be withdrawal now!</span>
            </div>
            <button className="shrink-0 w-[105px] h-[36px] rounded-[10px] border border-black bg-[#FFDC50] font-semibold">
              Withdraw
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
