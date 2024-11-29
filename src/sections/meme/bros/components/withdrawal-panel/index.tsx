import { motion } from "framer-motion";
import Header from "./header";
import { useState } from "react";
import List from "./list";

export default function WithdrawalPanel({ list, onSuccess }: any) {
  const [expand, setExpand] = useState(false);

  return (
    <motion.div
      initial={{
        y: "100%"
      }}
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
        num={list.length}
      />
      <List list={list} onSuccess={onSuccess} />
    </motion.div>
  );
}
