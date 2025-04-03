import { motion } from "framer-motion";
import ChainIcon from "@/components/icons/chain";
import { IS_MAINNET } from "@/configs";

const Chain = (props: any) => {
  const { chainDropdownShow, chainListRef, handleChainDropdown } = props;

  return (
    <motion.div
      className={`relative rounded-[10px] py-[6px] flex justify-center items-center cursor-pointer transition-all duration-300 ${
        chainDropdownShow ? "bg-[rgba(0,0,0,0.04)]" : ""
      }`}
      ref={chainListRef}
      // onClick={handleChainDropdown}
    >
      {IS_MAINNET ? (
        <ChainIcon size={32} className="rounded-[9px]" />
      ) : (
        <ChainIcon size={32} className="rounded-[9px]" isMainnet={false} />
      )}
    </motion.div>
  );
};

export default Chain;
