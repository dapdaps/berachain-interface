import ReactDOM from "react-dom";
import { Gasoek_One } from "next/font/google";
import IconClose from "@public/images/modal/close.svg";
import clsx from "clsx";
import Positions from "../positions";
import Vaults from "../vaults";
import { motion } from "framer-motion";
import useBoycoData from "@/sections/boyco/use-data";

const gasoekOne = Gasoek_One({
  weight: "400",
  subsets: ["latin"]
});

export default function BoycoModal({ onClose }: { onClose: () => void }) {
  const { totalUsd, positions, assets, vaults, loading } = useBoycoData();

  return ReactDOM.createPortal(
    <div
      className={clsx("fixed top-0 right-0 w-full h-full z-[300] bg-black/50")}
    >
      <motion.div
        className="absolute bottom-[30px] left-[calc(50%-600px)] w-[1200px] h-[800px]"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3 }}
      >
        <button
          className="button absolute z-[7] top-[30px] right-[30px]"
          onClick={onClose}
        >
          <IconClose />
        </button>
        <div className="absolute w-full h-full left-0 top-0 z-[6] pt-[50px]">
          <div
            className={clsx(
              gasoekOne.className,
              "text-[#392C1D] text-[65px] font-normal leading-[90%] text-center"
            )}
          >
            Boyco Unlock & Future Yield
          </div>
          <div className="flex items-center justify-center gap-[10px] mt-[4px]">
            <div className="w-[432px] h-[1px] bg-[#392C1D]" />
            <div className="text-[#392C1D] text-[30px] font-bold">
              6th, May, 2025
            </div>
            <div className="w-[432px] h-[1px] bg-[#392C1D]" />
          </div>
          <div className="px-[40px] pt-[20px] flex">
            <div className="w-1/2 pl-[10px] pr-[30px]">
              <Positions
                positions={positions}
                totalUsd={totalUsd}
                assets={assets}
                loading={loading}
              />
            </div>
            <div className="w-[1px] h-[572px] bg-[#392C1D] mt-[10px]" />
            <div className="w-1/2 pl-[30px] pr-[20px]">
              <Vaults vaults={vaults} assets={assets} loading={loading} />
            </div>
          </div>
        </div>
        <div className="absolute z-[5] w-full h-full bg-[url(/images/boyco/bg.png)] bg-no-repeat bg-center bg-cover" />
      </motion.div>
    </div>,
    document.body
  );
}
