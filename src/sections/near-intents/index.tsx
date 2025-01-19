"use client";

import { useEffect } from "react";
import SwapViews from "./views/SwapViews";
import { useTokensStore } from "./providers/TokensStoreProvider";
import { LIST_TOKENS } from "./constants/tokens";
import { useTokenList } from "./hooks/useTokenList";
import Portfolio from "./views/Portfolio";
import { useModalStore } from "./providers/ModalStoreProvider";
import { ModalType } from "./stores/modalStore";

const NearIntents = () => {
  const { updateTokens } = useTokensStore((state) => state);
  const tokenList = useTokenList(LIST_TOKENS);
  const { setModalType } = useModalStore(
    (state) => state
  )

  useEffect(() => {
    updateTokens(tokenList);
  }, []);

  const handleDeposit = () => {
    setModalType(ModalType.MODAL_REVIEW_DEPOSIT)
  }
  

  return (
    <div className="flex justify-between items-start w-full">
      <div className="w-[520px] flex flex-col justify-center mx-auto">
        <div className="mb-[18px] flex justify-between items-center p-[17px] bg-[#FFFDEB] border border-[#373A53] rounded-[20px] shadow-shadow1">
          <div className="font-Montserrat font-[600]">
            Complete a Deposit to Start Your Trading Journey.
          </div>
          <div className="font-[600] w-[130px] flex items-center gap-1 rounded-[10px] p-[5px] bg-[#FFDC50] border border-black cursor-pointer hover:opacity-60" onClick={handleDeposit}>
            Deposit first
          </div>
        </div>
        <SwapViews />
      </div>
      <Portfolio />
    </div>
  );
};

export default NearIntents;