import React from "react";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import MainSection from "./components/MainSection";
import ChatInterface from "./components/ChatInterface";
import { ChatProvider, useChatContext } from "./context/chat-context";

const ChatLayoutContent: React.FC = () => {
  const { chatMode } = useChatContext(); 
  console.log("chatMode", chatMode);

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
