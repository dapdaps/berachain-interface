import React from "react";
import { Gasoek_One } from "next/font/google";

const gasoekOne = Gasoek_One({
  weight: "400",
  subsets: ["latin"]
});

const HomeEntry: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  return (
    <div className="lg:fixed md:absolute lg:top-[-50px] lg:scale-[0.8] lg:left-[calc(50%-159px)] w-[318px] h-[200px] flex justify-center pt-[40px] z-[40] md:scale-[0.8] md:left-[-20px] md:top-[40px]">
      <Paper className="absolute top-1 left-1 z-2 transform -rotate-6" />
      <Paper className="absolute top-1 left-1 z-1 transform -rotate-2" />
      <div className="relative z-10 -rotate-2">
        <h1
          className={`${gasoekOne.className} text-[30px] font-black text-gray-900 uppercase tracking-wide text-center`}
        >
          BOYCO UNLOCK
        </h1>

        <h2
          className={`${gasoekOne.className} text-[16px] font-bold text-gray-800 mt-[-6px] text-center`}
        >
          Check Your Assets and Vaults
        </h2>

        <div className="text-center mt-[10px]">
          <button
            onClick={onOpenModal}
            className={`${gasoekOne.className} bg-gray-900 hover:bg-gray-700 text-[#E7D4B8] font-bold py-2 px-6 rounded transition duration-300`}
          >
            Read Now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeEntry;

const Paper = ({ className }: { className: string }) => {
  return (
    <div
      className={`${className} w-[303.105px] h-[170.518px] border border-[#392C1D] bg-[#E6CFA2] bg-[url(/images/boyco/paper.png)] bg-no-repeat bg-center bg-cover shadow-[6px_-4px_0px_0px_rgba(0,0,0,0.25),inset_0px_0px_30px_30px_#E6C08F] flex-shrink-0`}
    />
  );
};
