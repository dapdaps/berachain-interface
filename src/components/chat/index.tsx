import React from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import MainSection from "./MainSection";

export const ChatLayout: React.FC = () => {
  return (
    <div className="w-[984px] h-[600px] mx-auto mt-[25px]">
      <div className="w-full h-full bg-[#FFFDEB] rounded-[16px]">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainSection />
        </div>
      </div>
    </div>
  );
};

