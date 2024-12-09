import clsx from "clsx";
import { motion } from "framer-motion";

export default function VaultsEnterance({ className, onClick, imgSrc }: any) {
  return (
    <div
      className={clsx(
        "cursor-pointer flex flex-col items-end gap-[16px] mt-[130px]",
        className
      )}
      onClick={onClick}
      data-bp="1010-013"
    >
      <div className="flex items-center justify-end gap-[27px] pr-[19px] md:hidden">
        <div className="text-[20px] text-black font-CherryBomb leading-[90%]">
          Vaults
        </div>
      </div>
      <motion.img
        src={imgSrc}
        initial={{
          rotateZ: 0
        }}
        animate={{
          rotateZ: [-5, 5, -5, 5, -5, 5]
        }}
        transition={{
          duration: 0.4,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="origin-center"
      />
    </div>
  );
}
