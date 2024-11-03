import React, { useEffect, useMemo, useRef, useState } from "react";
import IconPlus from "@public/images/modal/plus.svg";
import IconMinus from "@public/images/modal/minus.svg";
import ActionModal from "../Action";
import { formatDisplayCurrency, formatDisplayNumber } from "@/utils/formatMoney";
import { TokenInfo } from "../hooks/useBend";
import NetBase from "../NetBase";
import Big from "big.js";
import useIsMobile from '@/hooks/use-isMobile';

interface IProps {
  markets: TokenInfo[];
}

const DepositPanel: React.FC<IProps> = ({
  markets,
}) => {
  const isMobile = useIsMobile();

  const [openModal, setOpenModal] = useState<any>(null);
  const actionRef = useRef<any>(null);

  const handleAction = (token: any, action: any) => {
    if (action === 'swap') {
      return;
    }
    setOpenModal({ token, action });
  };

  const closeModal = () => {
    setOpenModal(null);
  };

  const handleClickOutside = (e: any) => {
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

  const filterMarkets = useMemo(() => {
    return markets.filter((item) => item.symbol !== 'HONEY');
  }, [markets]);

  return (
    <div className='h-[490px] md:h-[unset] md:max-h-[calc(100vh_-_200px)] md:pb-[80px] md:overflow-y-auto'>
      <NetBase />
      <div className='flex justify-center items-center my-5 mt-[20px] mb-[24px]'>
        <p className='font-Montserrat text-sm font-medium leading-[17.07px] text-center text-[#3D405A]'>
          You can deposit the following assets to borrow HONEY
        </p>
      </div>
      <div>
        <div className='flex items-center px-[26px] py-2 font-Montserrat text-sm font-medium leading-[17.07px] text-[#3D405A] w-[910px] md:hidden'>
          <div className='w-[340px]'>Token</div>
          <div className='w-[219px]'>Deposited</div>
          <div className='w-[219px]'>In Wallet</div>
          <div className='w-[80px]'>Action</div>
        </div>
        {(filterMarkets || []).map((token, index) => isMobile ? (
          <div key={index} className="bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[16px_14px_14px] mb-[16px]">
            <div className="flex justify-between items-center gap-[10px]">
              <Asset className="" token={token} />
              <div className="flex justify-end items-center gap-[10px]">
                <Actions handleAction={handleAction} token={token} />
              </div>
            </div>
            <div className="flex justify-between items-center gap-[10px] mt-[15px]">
              <div className="text-black text-[16px] font-[600]">
                <div className="text-[#3D405A] font-[500]">
                  In Wallet
                </div>
                <div className="mt-[4px]" style={{ opacity: Big(token?.balance || 0).gt(0) ? 1 : 0.3 }}>
                  {formatDisplayNumber(token.balance)}
                </div>
                <div className="mt-[2px] text-[10px] font-[400]" style={{ opacity: Big(token?.balance || 0).gt(0) ? 1 : 0.3 }}>
                  {formatDisplayCurrency(token.balanceInUSD)}
                </div>
              </div>
              <div className="text-black text-[16px] font-[600]">
                <div className="text-[#3D405A] font-[500]">
                  Deposited
                </div>
                <div className="mt-[4px]" style={{ opacity: Big(token?.underlyingBalance || 0).gt(0) ? 1 : 0.3 }}>
                  {formatDisplayNumber(token.underlyingBalance)}
                </div>
                <div className="mt-[2px] text-[10px] font-[400]" style={{ opacity: Big(token?.underlyingBalance || 0).gt(0) ? 1 : 0.3 }}>
                  {formatDisplayNumber(token.underlyingBalanceUSD)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Row
            key={index}
            token={token}
            openModal={openModal}
            handleAction={handleAction}
            closeModal={closeModal}
            actionRef={actionRef}
          />
        ))}
      </div>
    </div>
  );
};

export default DepositPanel;

const Actions = (props: any) => {
  const { handleAction, token } = props;
  return (
    <>
      <button
        onClick={() => handleAction(token, "swap")}
        disabled={Big(token.balance || 0).eq(0)}
        className={`px-[15px] h-8 rounded-[10px] text-[16px] items-center justify-center hidden md:flex ${
          Big(token.balance || 0).eq(0)
            ? "border border-black border-opacity-30 text-black text-opacity-30"
            : "bg-white text-black border border-[#373A53] hover:bg-[#FFDC50]"
        }`}
      >
        Get
      </button>
      <button
        onClick={() => handleAction(token, "deposit")}
        disabled={Big(token.balance || 0).eq(0)}
        className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${
          Big(token.balance || 0).eq(0)
            ? "border border-black border-opacity-30 text-black text-opacity-30"
            : "bg-white text-black border border-[#373A53] hover:bg-[#FFDC50]"
        }`}
      >
        <IconPlus />
      </button>
      <button
        onClick={() => handleAction(token, "withdraw")}
        disabled={Big(token.underlyingBalance || 0).eq(0)}
        className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${
          Big(token.underlyingBalance || 0).eq(0)
            ? "border border-black border-opacity-30 text-black text-opacity-30"
            : "bg-white text-black border border-[#373A53] hover:bg-[#FFDC50]"
        }`}
      >
        <IconMinus />
      </button>
    </>
  );
};

const Asset = (props: any) => {
  const { token, className, style } = props;

  return (
    <div className={`flex items-center ${className}`} style={style}>
      <div className="w-10 h-10 rounded-full mr-2 flex items-center justify-center">
        <img className="w-full" src={token.icon} alt="" />
      </div>
      <span className="font-Montserrat text-base font-medium leading-4 text-left">
        {token.symbol}
      </span>
    </div>
  );
};

const Row = (props: any) => {
  const { token, openModal, handleAction, closeModal, actionRef } = props;

  return (
    <div
      className="flex items-center px-[26px] py-3 w-[910px] bg-black bg-opacity-[0.06] rounded-[10px] mb-[10px] last:mb-0"
    >
      <Asset className="w-[340px]" token={token} />
      <div className="w-[219px]">
        <div
          className={`truncate font-Montserrat text-base font-semibold leading-4 text-left ${
            token.deposited === 0
              ? 'text-black text-opacity-30'
              : 'text-black'
          }`}
        >
          {formatDisplayNumber(token.underlyingBalance)}
        </div>
        <div className='mt-2 font-Montserrat text-[10px] font-normal leading-[9px] text-left text-gray-500'>
          {formatDisplayNumber(token.underlyingBalanceUSD)}
        </div>
      </div>
      <div className='w-[219px]'>
        <div className='truncate font-Montserrat text-base font-semibold leading-4 text-left'>
          {formatDisplayNumber(token.balance)}
        </div>
        <div className='mt-2 font-Montserrat text-[10px] font-normal leading-[9px] text-left text-gray-500'>
          {formatDisplayCurrency(token.balanceInUSD)}
        </div>
      </div>
      <div className='w-[80px] flex justify-end space-x-2 relative'>
        <Actions handleAction={handleAction} token={token} />
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
  );
};
