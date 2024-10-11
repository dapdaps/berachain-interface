import React, { useRef, useState } from "react";

import NetBase from "../NetBase";
import { TokenInfo } from "../hooks/useBend";
import useMarketStore from "@/stores/useMarketStore";
import ActionModal from './actionModal'
import DepositAction from '../Action'
import Big from "big.js";

import { ethers } from "ethers";
import { rewardToken } from "@/configs/lending/bend";


const SupplyBorrowPanel: React.FC = () => {
  const [openModal, setOpenModal] = useState<any>(null);
  const actionRef = useRef<any>(null);

  const { userAccountData, initData: { markets, config, provider, account } } = useMarketStore()

  const handleAction = (action: any) => {
    setOpenModal({ action });
  };

  const closeModal = () => {
    setOpenModal(null);
  };

  const handleOutsideClick = (e: any) => {
    if (actionRef.current && !actionRef.current.contains(e.target)) {
      closeModal();
    }
  };

  const honeyInfo = markets.find((market) => market.symbol === "HONEY");


   function formatPercent(apy?: string): string {
    if (!apy) return "0%";
    let formatted = (parseFloat(apy) * 100).toFixed(2);
    formatted = parseFloat(formatted).toString();
    return `${formatted}%`;
  }

  // prepare for BGT rewards
  function getAllUserRewards() {
    const arr = markets
      ?.filter((item: any) => item.variableDebtTokenAddress)
      .map((item: any) => [
        item.aTokenAddress,
        item.variableDebtTokenAddress
      ]).flat();
      
    const addrs = [...arr];
    
    const rewardsProvider = new ethers.Contract(
      config.incentivesProxy,
      [
        {
          inputs: [
            { internalType: 'address[]', name: 'assets', type: 'address[]' },
            { internalType: 'address', name: 'user', type: 'address' }
          ],
          name: 'getAllUserRewards',
          outputs: [
            {
              internalType: 'address[]',
              name: 'rewardsList',
              type: 'address[]'
            },
            {
              internalType: 'uint256[]',
              name: 'unclaimedAmounts',
              type: 'uint256[]'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        }
      ],
      provider.getSigner()
    );
    rewardsProvider
      .getAllUserRewards(addrs, account)
      .then((res: any) => {
        try {
          const _rewardToken = [...rewardToken];
          const _amount = res[1].reduce((total: any, cur: any) => {
            return Big(total).plus(ethers.utils.formatUnits(cur)).toFixed();
          }, 0);
          _rewardToken[0].unclaimed = _amount;
          console.log(_rewardToken, '_rewardToken');
        } catch (error) {
          console.log('catch_getAllUserRewards_error', error);
        }
      })
      .catch((err: any) => {
        console.log('getAllUserRewards_error:', err);
      });
  }

  return (
    <div className="mb-5" onClick={handleOutsideClick}>
      <NetBase />
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
                { Number(honeyInfo?.underlyingBalance || 0).toFixed(2) }
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-montserrat text-base font-medium leading-4 text-black">
                Earn APY
              </span>
              <span className="font-montserrat text-xl font-semibold leading-5 text-[#7EA82B] mt-1">
                {formatPercent(honeyInfo?.supplyAPY)}
              </span>
            </div>
          </div>
          <div className="flex space-x-[14px] mt-[35px] relative">
            <button disabled={!provider} onClick={() => handleAction('supply')} className="w-[192px] h-[50px] rounded-[10px] border border-black bg-[#FFDC50] font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30">
              Supply
            </button>
            <button disabled={!provider} onClick={() => handleAction('withdraw')} className="w-[192px] h-[50px] rounded-[10px] border border-black bg-white font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30">
              Withdraw
            </button>
            {
              openModal && honeyInfo && ['supply', 'withdraw'].includes(openModal.action) &&  <DepositAction 
              isOpen={true}
              onClose={closeModal}
              action={openModal.action}
              token={honeyInfo}
              ref={actionRef}
              className="left-[50%] transform -translate-x-1/2"
            />
            }
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
            {Number(userAccountData?.totalDebtBaseUSD || 0).toFixed(2)}/{Number(userAccountData?.availableBorrowsBaseUSD || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <span className="font-montserrat text-base font-medium leading-4 text-black mb-3">
                BGT APY
              </span>
              <span className="font-montserrat text-xl font-semibold leading-5 text-[#7EA82B] mt-1">
                0%
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-montserrat text-base font-medium leading-4 text-black mb-3">
                Borrow APY
              </span>
              <span className="font-montserrat text-xl font-semibold leading-5 text-[#FF6B6B] mt-1">
              {formatPercent(honeyInfo?.borrowAPY)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-5">
            <span className="font-montserrat text-base font-medium leading-4 text-black">
              Your BGT rewards
            </span>

            <div className="flex items-center">
              <div className="w-5 h-5 bg-yellow-400 rounded-full mr-2">
                <img src="/images/icon-coin.svg" alt="bgt" className="w-full h-full"/>
              </div>
              <span className="font-montserrat text-base font-medium leading-4 text-black mr-2">
                0 BGT
              </span>
              <button className="font-montserrat text-base font-semibold leading-4 text-[#7EA82B] underline">
                Claim
              </button>
            </div>
          </div>
          <div className="flex space-x-[14px] mt-5 relative">
            <button disabled={!provider} onClick={() => handleAction("borrow")}  className="w-[192px] h-[50px] rounded-[10px] border border-black bg-[#FFDC50] font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30">
              Borrow
            </button>
            <button disabled={!provider} onClick={() => handleAction("repay")} className="w-[192px] h-[50px] rounded-[10px] border border-black bg-white font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30" disabled={Big(userAccountData.totalDebtBaseUSD || 0).eq(0)}>
              Repay
            </button>
            {
              openModal && honeyInfo && ['borrow', 'repay'].includes(openModal.action) && (
                <ActionModal
                  isOpen={true}
                  onClose={closeModal}
                  action={openModal.action}
                  token={honeyInfo}
                  ref={actionRef}
                  className="left-[50%] transform -translate-x-1/2"
                />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyBorrowPanel;
