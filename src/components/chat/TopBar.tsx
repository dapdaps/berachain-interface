import React from "react";

const Divider = () => (
  <div className="w-px h-6 bg-[#392C1D]/10 mx-3" />
);

const TopBar: React.FC = () => {
  return (
    <div className="h-[36px] w-full flex items-center px-4 text-sm text-black border-b border-[#392C1D]/10">
      <div className="flex items-center flex-1 overflow-hidden">
        <span className="text-[18px] leading-[18px] font-CherryBomb whitespace-nowrap">GM! Beratown</span>
        <Divider />
        <div className="whitespace-nowrap font-Montserrat text-[12px] font-[500]">Account: <span className="font-[700]">0x32...b416</span></div>
        <Divider />
        <div className="whitespace-nowrap font-Montserrat text-[12px] font-[500]">Total Assets: <span className="font-[700]">$3,235.92</span></div>
        <Divider />
        <div className="whitespace-nowrap font-Montserrat text-[12px] font-[500]">Invested: <span className="font-[700]">$1,235.92</span></div>
        <Divider />
        <div className="whitespace-nowrap font-Montserrat text-[12px] font-[500]">Yield: <span className="text-[#4F912E] font-[700]">+$180.35</span></div>
      </div>
      <div className="ml-4 flex items-center">
        <Divider />
        <div className="whitespace-nowrap font-Montserrat text-[12px] font-[500]">20 MAY, 2025</div>
      </div>
    </div>
  );
};

export default TopBar;
