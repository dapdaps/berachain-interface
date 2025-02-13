import ChainIcon from "@/components/icons/chain";
import clsx from "clsx";
import { IS_MAINNET } from "@/configs";
import { motion } from "framer-motion";

export default function Chain() {
  return (
    <div className="h-[30px] rounded-[18px] border border-[#000000] bg-[#FFE5B8] flex items-center gap-[6px] p-[3px] text-[14px] font-bold text-black">
      <motion.div
        className={clsx(
          "flex items-center gap-[3px] p-[3px] h-[24px] relative cursor-pointer",
          !IS_MAINNET && "rounded-[18px] border-black bg-[#CBCBCB] border"
        )}
        onClick={() => {
          if (!IS_MAINNET) return;
          window.open("https://testnet.beratown.dapdap.net/", "_self");
        }}
      >
        <ChainIcon size={18} className="rounded-[9px]" isMainnet={false} />
        <span>Testnet</span>
      </motion.div>
      <motion.div
        className={clsx(
          "flex items-center gap-[3px] p-[3px] h-[24px] relative cursor-pointer",
          IS_MAINNET && "rounded-[18px] border-black bg-[#FFDC50] border"
        )}
        onClick={() => {
          if (IS_MAINNET) return;
          window.open("https://beratown.dapdap.net/", "_self");
        }}
      >
        <ChainIcon size={18} className="rounded-[9px]" />
        <span>Mainnet</span>
      </motion.div>
    </div>
  );
}
