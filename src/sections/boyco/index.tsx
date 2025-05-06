import { useState, memo } from "react";
import HomeEntry from "./components/home-entry";
import BoycoModal from "./components/modal";
import BoycoProvider from "./boyco-provider";

export const RPC_API_KEYS: {
  [chain_id: number]: string;
} = {
  1: "https://api.zan.top/node/v1/eth/mainnet/ff581749dd63422abccd9be5ed56f09d"
};

export default memo(function Boyco() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <HomeEntry onOpenModal={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <BoycoProvider>
          {isModalOpen && (
            <>
              <BoycoModal onClose={() => setIsModalOpen(false)} />
            </>
          )}
        </BoycoProvider>
      )}
    </>
  );
});
