"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Loading from "../loading";

const Switch = (props: SwitchProps) => {
  const { className, disabled, value, onChange, loading, buttonProps } = props;

  return (
    <motion.button
      {...buttonProps}
      type="button"
      disabled={disabled}
      className={clsx(
        "w-[45px] h-[26px] shrink-0 rounded-[13px] p-[3px] disabled:cursor-not-allowed disabled:opacity-30",
        className
      )}
      animate={{
        backgroundColor: value ? "#FFDC50" : "#E8E5C7"
      }}
      onClick={onChange}
      
    >
      <motion.div
        className="w-1/2 h-full rounded-full border border-[#BBBBBB] bg-[#FFFDEB] flex justify-center items-center"
        animate={{ x: value ? "100%" : 0 }}
      >
        {loading && <Loading size={12} />}
      </motion.div>
    </motion.button>
  );
};

export default Switch;

interface SwitchProps {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  onChange?: () => void;
  loading?: boolean;
  buttonProps?: any;
}
