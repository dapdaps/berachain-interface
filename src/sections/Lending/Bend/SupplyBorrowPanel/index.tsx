import React, { useRef, useState } from "react";

import ActionModal from "../Action";

interface TokenInfo {
  name: string;
  icon: string;
  deposited: number;
  inWallet: number;
  depositedValue: string;
  walletValue: string;
}

interface IProps {
  markets: TokenInfo[];
}

const SupplyBorrowPanel: React.FC<IProps> = ({
  markets,
}) => {
  const [tokens, setTokens] = useState<TokenInfo[]>([
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

  const handleAction = (tokenName: any, action: any) => {
    setOpenModal({ tokenName, action });
  };

  const closeModal = () => {
    setOpenModal(null);
  };

  const handleOutsideClick = (e: any) => {
    if (actionRef.current && !actionRef.current.contains(e.target)) {
      closeModal();
    }
  };

  return (
    <div className="mb-5" onClick={handleOutsideClick}>
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
      <div className="flex space-x-[26px] mt-10 h-[380px]">
        <div className="bg-black bg-opacity-[0.06] w-1/2 rounded-[10px] p-5">
          <p className="font-montserrat text-sm font-medium leading-[17px] my-5 text-[#3D405A]">
            Honey only earns Interest. It cannot be userd as collateral to
            borrow more HONEY
          </p>
          <div className="flex flex-col items-center mt-[46px] mb-11">
            <div className="w-12 h-12 mb-2">
              <img src="/images/dapps/honey.png"></img>
            </div>
            <span className="font-montserrat text-lg font-bold leading-[16px]">
              HONEY
            </span>
          </div>
          <div className="flex justify-around">
            <div className="flex flex-col items-center">
              <span className="font-montserrat text-base font-medium leading-4 text-black">
                Supplied
              </span>
              <span className="font-montserrat text-xl font-semibold leading-5 text-black mt-1">
                0
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-montserrat text-base font-medium leading-4 text-black">
                Earn APY
              </span>
              <span className="font-montserrat text-xl font-semibold leading-5 text-[#7EA82B] mt-1">
                0.87%
              </span>
            </div>
          </div>
          <div className="flex space-x-[14px] mt-[35px]">
            <button className="w-[192px] h-[50px] rounded-[10px] border border-black bg-[#FFDC50] font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30">
              Supply
            </button>
            <button className="w-[192px] h-[50px] rounded-[10px] border border-black bg-white font-montserrat text-base font-medium leading-4 text-center">
              Withdraw
            </button>
          </div>
        </div>
        <div className="bg-black bg-opacity-[0.06] w-1/2 rounded-[10px] p-5">
          <p className="font-montserrat text-sm font-medium leading-[17px] my-5 text-[#3D405A]">
            HONEY that can be borrowed against your deposited collateral
          </p>
          <p className="font-montserrat text-sm font-medium leading-[17px] my-[14px] text-[#3D405A]">
            Your borrow capacity used
          </p>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 mr-3">
              <img src="/images/dapps/honey.png"></img>
            </div>
            <span className="font-montserrat text-lg font-bold leading-[16.2px] text-left">
              0/0
            </span>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <span className="font-montserrat text-base font-medium leading-4 text-black mb-3">
                BGT APY
              </span>
              <span className="font-montserrat text-xl font-semibold leading-5 text-[#7EA82B] mt-1">
                +5.98k%
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-montserrat text-base font-medium leading-4 text-black mb-3">
                Borrow APY
              </span>
              <span className="font-montserrat text-xl font-semibold leading-5 text-[#FF6B6B] mt-1">
                2.09%
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-5">
            <span className="font-montserrat text-base font-medium leading-4 text-black">
              Your BGT rewards
            </span>

            <div className="flex items-center">
              <div className="w-5 h-5 bg-yellow-400 rounded-full mr-2">
                {/* 这里放置 BGT 图标 */}
              </div>
              <span className="font-montserrat text-base font-medium leading-4 text-black mr-2">
                0 BGT
              </span>
              <button className="font-montserrat text-base font-semibold leading-4 text-[#7EA82B] underline">
                Claim
              </button>
            </div>
          </div>
          <div className="flex space-x-[14px] mt-5">
            <button className="w-[192px] h-[50px] rounded-[10px] border border-black bg-[#FFDC50] font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30">
              Borrow
            </button>
            <button className="w-[192px] h-[50px] rounded-[10px] border border-black bg-white font-montserrat text-base font-medium leading-4 text-center">
              Repay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyBorrowPanel;
