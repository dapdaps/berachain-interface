import React, { useEffect, useRef, useState } from "react";
import IconPlus from "@public/images/modal/plus.svg";
import IconMinus from "@public/images/modal/minus.svg";
import ActionModal from "../Action";
import { formatDisplayCurrency, formatDisplayNumber } from "@/utils/formatMoney";
import { TokenInfo } from "../useBend";
import NetBase from "../NetBase";
import useMarketStore from "@/stores/useMarketStore";



interface IProps {
  markets: TokenInfo[];
  userAccountData: any;
}

const DepositPanel: React.FC<IProps> = ({
  markets,
  userAccountData
}) => {
  
  const [openModal, setOpenModal] = useState<any>(null);
  const actionRef = useRef<any>(null);
  
  const handleAction = (token: any, action: any) => {
    setOpenModal({ token, action });
  };

  const closeModal = () => {
    setOpenModal(null);
  };


  const handleClickOutside = (e) => {
    if (actionRef.current && !actionRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterMarkets = markets.filter((market) => market.symbol !== 'HONEY');
  
  
  return (
    <div className="h-[490px]">
      <NetBase />
      <div className="flex justify-center items-center my-5 mt-[20px] mb-[24px]">
        <p className="font-Montserrat text-sm font-medium leading-[17.07px] text-center text-[#3D405A]">
          You can deposit the following assets to borrow HONEY
        </p>
      </div>
      <div>
        <div className="flex items-center px-[26px] py-2 font-Montserrat text-sm font-medium leading-[17.07px] text-[#3D405A] w-[910px]">
          <div className="w-[340px]">Token</div>
          <div className="w-[219px]">Deposited</div>
          <div className="w-[219px]">In Wallet</div>
          <div className="w-[80px]">Action</div>
        </div>
        {(filterMarkets || []).map((token, index) => (
          <div
            key={index}
            className="flex items-center px-[26px] py-3 w-[910px] bg-black bg-opacity-[0.06] rounded-[10px] mb-[10px] last:mb-0"
          >
            <div className="w-[340px] flex items-center">
              <div className="w-10 h-10 rounded-full mr-2 flex items-center justify-center">
                <img className="w-full" src={token.icon} alt="" />
              </div>
              <span className="font-Montserrat text-base font-medium leading-4 text-left">
                {token.symbol}
              </span>
            </div>
            <div className="w-[219px]">
              <div
                className={`truncate font-Montserrat text-base font-semibold leading-4 text-left ${
                  token.deposited === 0
                    ? "text-black text-opacity-30"
                    : "text-black"
                }`}
              >
                {formatDisplayNumber(token.underlyingBalance)}
              </div>
              <div className="mt-2 font-Montserrat text-[10px] font-normal leading-[9px] text-left text-gray-500">
                {formatDisplayNumber(token.underlyingBalanceUSD)}
              </div>
            </div>
            <div className="w-[219px]">
              <div className="truncate font-Montserrat text-base font-semibold leading-4 text-left">
                {formatDisplayNumber(token.balance)}
              </div>
              <div className="mt-2 font-Montserrat text-[10px] font-normal leading-[9px] text-left text-gray-500">
                {formatDisplayCurrency(token.balanceInUSD)}
              </div>
            </div>
            <div className="w-[80px] flex justify-end space-x-2 relative">
              <button
                onClick={() => handleAction(token, "deposit")}
                disabled={token.inWallet === 0}
                className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${
                  token.inWallet === 0
                    ? "border border-black border-opacity-30 text-black text-opacity-30"
                    : "bg-white text-black border border-[#373A53] hover:bg-[#FFDC50]"
                }`}
              >
                <IconPlus />
              </button>
              <button
                onClick={() => handleAction(token, "withdraw")}
                disabled={token.deposited === 0}
                className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${
                  token.deposited === 0
                    ? "border border-black border-opacity-30 text-black text-opacity-30"
                    : "bg-white text-black border border-[#373A53] hover:bg-[#FFDC50]"
                }`}
              >
                <IconMinus />
              </button>
              {openModal && openModal.token.name === token.name && (
                  <ActionModal
                    isOpen={true}
                    onClose={closeModal}
                    action={openModal.action}
                    token={token}
                    ref={actionRef}
                  />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepositPanel;
