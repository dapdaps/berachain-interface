import React, { useEffect, useRef, useState } from "react";
import IconPlus from "@public/images/modal/plus.svg";
import IconMinus from "@public/images/modal/minus.svg";
import ActionModal from "../Action";
import useAaveConfig from "@/stores/useAaveConfig";
interface TokenInfo {
  name: string;
  icon: string;
  deposited: number;
  inWallet: number;
  depositedValue: string;
  walletValue: string;
}

const DepositPanel: React.FC = () => {
  const [markets, setMarkets] = useState<TokenInfo[]>([
    {
      name: "WETH",
      icon: "eth-icon",
      deposited: 0.23,
      inWallet: 0.0,
      depositedValue: "$1.56",
      walletValue: "$0.00",
    },
    {
      name: "WBTC",
      icon: "btc-icon",
      deposited: 0.0,
      inWallet: 0.001,
      depositedValue: "$0.00",
      walletValue: "$64.25",
    },
  ]);
  const [openModal, setOpenModal] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const actionRef = useRef<any>(null);

  const { network } = useAaveConfig()  

  useEffect(() => {
    if (!network) return
    const markets = network?.rawMarkets?.map((item: any) => ({
      ...item,
      // tokenPrice: network?.prices[item?.symbol] || 1
      tokenPrice:  1
    }));
    setMarkets(markets)
  }, [network])
 
  
  const handleAction = (tokenName: any, action: any) => {
    setOpenModal({ tokenName, action });
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


  return (
    <div className="h-[490px]">
      <div className="bg-[#FFE873] rounded-[10px] p-4 flex justify-between items-center">
        <div className="flex">
          <div>
            <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
              You Supplied
            </div>
            <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
              $0.00
            </div>
          </div>
          <div className="ml-[80px]">
            <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
              Net APY
            </div>
            <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
              -
            </div>
          </div>
          <div className="ml-[80px]">
            <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
              Account Health
            </div>
            <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-[#7EA82B]">
              ∞
            </div>
          </div>
        </div>
        <div className="flex ml-[140px]">
          <div>
            <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
              Borrow up to
            </div>
            <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
              -
            </div>
          </div>
          <div className="ml-[38px]">
            <div className="font-Montserrat text-sm font-medium leading-[17.07px] text-left text-[#3D405A] mb-[12px]">
              Funds eligible for deposit
            </div>
            <div className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">
              -
            </div>
          </div>
        </div>
      </div>
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
        {markets.map((token, index) => (
          <div
            key={index}
            className="flex items-center px-[26px] py-3 w-[910px] bg-black bg-opacity-[0.06] rounded-[10px] mb-[10px] last:mb-0"
          >
            <div className="w-[340px] flex items-center">
              <div className="w-10 h-10 bg-[#FFE873] rounded-full mr-2 flex items-center justify-center">
                <img className="w-full" src={token.icon} alt="" />
              </div>
              <span className="font-Montserrat text-base font-medium leading-4 text-left">
                {token.name}
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
                {/* {token.deposited.toFixed(token.deposited === 0 ? 2 : 3)} */}
              </div>
              <div className="mt-2 font-Montserrat text-[10px] font-normal leading-[9px] text-left text-gray-500">
                {/* {token.depositedValue} */}
              </div>
            </div>
            <div className="w-[219px]">
              <div className="truncate font-Montserrat text-base font-semibold leading-4 text-left">
                {/* {token.inWallet.toFixed(3)} */}
              </div>
              <div className="mt-2 font-Montserrat text-[10px] font-normal leading-[9px] text-left text-gray-500">
                {/* {token.walletValue} */}
              </div>
            </div>
            <div className="w-[80px] flex justify-end space-x-2 relative">
              <button
                onClick={() => handleAction(token.name, "deposit")}
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
                onClick={() => handleAction(token.name, "withdraw")}
                disabled={token.deposited === 0}
                className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${
                  token.deposited === 0
                    ? "border border-black border-opacity-30 text-black text-opacity-30"
                    : "bg-white text-black border border-[#373A53] hover:bg-[#FFDC50]"
                }`}
              >
                <IconMinus />
              </button>
              {openModal && openModal.tokenName === token.name && (
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
