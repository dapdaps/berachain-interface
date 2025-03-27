import Card from "@/components/card";
import InputNumber from "@/components/input-number";
import Modal from "@/components/modal";
import SwitchTabs from "@/components/switch-tabs";
import { Dispatch, memo, SetStateAction, useState } from "react";
import RangeInput from "../range-input";
import Button from "../button";
import { Token } from "@/types";
import useIsMobile from "@/hooks/use-isMobile";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import { ethers } from "ethers";

export default memo(function StakeModal({
  token,
  currentTab,
  setCurrentTab,
  onClose
}: {
  token: Token
  currentTab: string
  setCurrentTab: Dispatch<SetStateAction<string>>
  onClose: VoidFunction
}) {
  const addMetaMask = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token?.address,
            symbol: token?.symbol,
            decimals: token?.decimals,
            image: token?.icon
          },
        },
      });
    } catch (error) {
      console.error(error)
    }
  };
  return (
    <Modal open={token} onClose={onClose} closeIconClassName="!-right-[10px] !-top-[10px]">
      <Card>
        <div className="md:w-full w-[456px]">
          {/* <SwitchTabs
            tabs={[
              { label: "Stake", value: "stake" },
              { label: "Unstake", value: "unstake" }
            ]}
            onChange={(val) => {
              setCurrentTab(val)
            }}
            current={currentTab}
            className="md:w-full w-[456px]"
          /> */}
          <div className="flex items-center w-full p-[5px] rounded-[12px] border border-[#373A53] bg-white">
            <div className="flex items-center justify-center flex-1 h-[46px] rounded-[10px] border border-black bg-[#FFDC50]">
              <span className="text-black text-[18px] font-semibold font-Montserrat leading-[90%]">Stake</span>
            </div>
            <div className="flex items-center justify-center flex-1 h-[46px]">
              <div className="relative">
                <span className="text-black text-[18px] font-semibold font-Montserrat leading-[90%]">
                  Unstake
                </span>
                <div className="absolute -right-[36px] top-0 flex items-center justify-center w-[42px] h-[13px] rounded-[8px] border-black border bg-[#FFF5A9]">
                  <span className="text-black text-[16px] font-bold scale-50">Thoon...</span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:m-[24px_0_26px] m-[24px_0_40px] flex md:flex-col md:gap-[16px] flex-row items-start justify-between">
            <div className="md:w-full md:justify-between flex md:flex-row flex-col gap-[9px]">
              <div className="flex items-center gap-[5px]">
                <span className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">Staked Amount</span>
                <Popover
                  trigger={PopoverTrigger.Hover}
                  placement={PopoverPlacement.Right}
                  content={(
                    <div className="p-[10px_11px] rounded-[10px] border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] text-black font-Montserrat text-[14px] font-medium">
                      Add tokens to MetaMask
                    </div>
                  )}
                >
                  <div className="w-[16px] cursor-pointer">
                    <img src="/images/lst/plus.svg" alt="plus" />
                  </div>
                </Popover>

              </div>
              <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">4.29K</div>
            </div>

            <div className="md:w-full md:justify-between flex md:flex-row flex-col gap-[9px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">APR</div>
              <div className="text-[#72A807] font-Montserrat text-[16px] font-semibold leading-[100%]">4.2%</div>
            </div>

            <div className="md:w-full md:justify-between flex md:flex-row flex-col gap-[9px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">Available to unstake</div>
              <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">0 WBTC</div>
            </div>
          </div>

          <div className="md:block hidden mb-[23px] h-[1px] bg-black opacity-20" />

          <div className="mb-[12px] flex items-center justify-between">
            <div className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">Stake for UniBTC</div>
            <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">1 BTC = 1 UniBTC</div>
          </div>
          <RangeInput onChange={(value: string) => {
          }} />
          <div className="my-[20px] flex items-center justify-between">
            <span className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">Min. Receive</span>
            <span className="text-black font-Montserrat text-[14px] font-medium leading-[100%]">~0.1023 UniBTC</span>
          </div>
          <Button>Stake</Button>
        </div>
      </Card>
    </Modal>
  )
})
