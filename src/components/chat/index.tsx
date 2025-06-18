import React, { useRef } from 'react';
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import MainSection from "./components/MainSection";
import ChatInterface from "./components/ChatInterface";
import { ChatProvider, useChatContext } from "./context/chat-context";
import VaultsV2ContextProvider, { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { useVaultsV2 } from '@/sections/vaults/v2/hooks';
import ActionModal from '@/sections/vaults/v2/components/action/modal';
import { useList } from '@/sections/vaults/v2/hooks/list';
import ClaimModal from '@/sections/vaults/v2/components/claim/modal';
import ClaimSuccessModal from '@/sections/vaults/v2/components/claim/success';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const vaultsV2 = useVaultsV2();
  // Need all data to calculate user stake assets and support popup
  const list = useList();

  return (
    <ChatProvider vaultsList={list}>
      <VaultsV2ContextProvider
        value={{
          ...vaultsV2,
          ...list,
          containerRef,
        }}
      >
        <ChatLayoutContent />
        <ActionModal />
        <ClaimModal />
        <ClaimSuccessModal />
      </VaultsV2ContextProvider>
    </ChatProvider>
  );
};
