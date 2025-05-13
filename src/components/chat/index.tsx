import React from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import MainSection from "./MainSection";
import ChatInterface from "./ChatInterface";
import { ChatProvider, useChatContext } from "./context/chat-context";

const ChatLayoutContent: React.FC = () => {
  const { chatMode } = useChatContext(); 

  return (
    <div className="w-[984px] h-[608px] mx-auto mt-[6px]">
      <div className="w-full h-full bg-[#FFFDEB] rounded-[16px]">
        <TopBar />
        <div className="flex flex-1 overflow-hidden mt-2.5">
          <Sidebar />
          {chatMode === 'initial' ? <MainSection /> : <ChatInterface />}
        </div>
      </div>
    </div>
  );
};

export const ChatLayout: React.FC = () => {
  return (
    <ChatProvider>
      <ChatLayoutContent />
    </ChatProvider>
  );
};
