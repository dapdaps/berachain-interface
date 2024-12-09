import { motion } from "framer-motion";

export default function Header({ expand, onExpand, num }: any) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-[7px]">
        <div className="text-[16px] font-bold">Withdrawal</div>
        <div className="px-[9px] py-[2px] border border-black bg-[#FFDC50] rounded-[10px] text-[12px] font-semibold">
          {num}
        </div>
      </div>
      <button onClick={onExpand} className="md:hidden">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="9"
          viewBox="0 0 16 9"
          fill="none"
          animate={{
            rotate: expand ? 0 : 180
          }}
        >
          <path
            d="M2 2L8 6.8L14 2"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.svg>
      </button>
    </div>
  );
}
