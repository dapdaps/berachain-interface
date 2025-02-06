import { AnimatePresence, motion } from "framer-motion";
import LazyImage from "@/components/layz-image";
import Image from "next/image";
import { IS_MAINNET } from "@/configs";
import ChainIcon from "../../icons/chain";

const Chain = (props: any) => {
  const { chainDropdownShow, chainListRef, handleChainDropdown, chainId } =
    props;

  return (
    <motion.div
      className={`relative rounded-[10px] py-[6px] flex justify-center items-center cursor-pointer transition-all duration-300 ${
        chainDropdownShow ? "bg-[rgba(0,0,0,0.04)]" : ""
      }`}
      ref={chainListRef}
      onClick={handleChainDropdown}
    >
      <div className="flex items-center gap-x-[8px]">
        {IS_MAINNET ? (
          <ChainIcon size={26} />
        ) : (
          <ChainIcon size={26} isMainnet={false} />
        )}
        <LazyImage src="/images/icon-arrow.svg" width={11} height={5} alt="" />
      </div>
      {/*#region dropdown*/}
      <AnimatePresence mode="wait">
        {chainDropdownShow && (
          <motion.div
            animate={{
              opacity: [0, 1],
              y: [10, 0],
              display: "block",
              transition: {
                duration: 0.3
              }
            }}
            className="absolute pt-[11px] top-[30px] left-[-114px] w-[228px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-[6px] pb-[5px] rounded-[12px] bg-white border border-[#F0F0F0] shadow-[0px_15px_30px_0px_rgba(0,_0,_0,_0.30)]">
              {[
                {
                  name: "Berachain bArtio (Testnet)",
                  icon: <ChainIcon size={20} isMainnet={false} />,
                  link: "https://testnet.beratown.dapdap.net/"
                },
                {
                  name: "Berachain Mainnet",
                  icon: <ChainIcon size={20} />,
                  link: "https://beratown.dapdap.net/"
                }
              ].map((_chain: any, i: number) => (
                <div
                  key={_chain.name}
                  className="w-full h-[45px] flex justify-start gap-[9px] items-center px-[20px] cursor-pointer hover:bg-[#F2F2F2] transition-all ease-in-out duration-300"
                  style={{
                    background: chainId === _chain.id ? "#F2F2F2" : ""
                  }}
                  onClick={(e) => {
                    if (i === 0 && !IS_MAINNET) return;
                    if (i === 1 && IS_MAINNET) return;
                    window.open(_chain.link, "_self");
                  }}
                >
                  {_chain.icon}
                  <div className="text-black text-[16px] font-medium">
                    {_chain.name}
                  </div>
                  {chainId === _chain.id && (
                    <div className="ml-auto">
                      <svg
                        width="13"
                        height="10"
                        viewBox="0 0 13 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3.72727L5 8L12 1"
                          stroke="black"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/*#endregion*/}
    </motion.div>
  );
};

export default Chain;
