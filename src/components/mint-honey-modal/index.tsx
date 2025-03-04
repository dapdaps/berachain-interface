import Modal from "../modal";
import SwitchTabs from "../switch-tabs";
import { useState, FC, useEffect } from "react";
import { bera } from "@/configs/tokens/bera";
import TokenAmount from "./token-amount";

interface MintHoneyModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const MintHoneyModal: FC<MintHoneyModalProps> = ({
  isOpen = true,
  onClose,
}) => {
  const [tab, setTab] = useState("mint");
  const [inputCurrency, setInputCurrency] = useState(bera["usdc.e"]);
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState("");
  const [maxInputBalance, setMaxInputBalance] = useState("0");
  const [displayCurrencySelect, setDisplayCurrencySelect] = useState(false);
  const [selectType, setSelectType] = useState("");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [updater, setUpdater] = useState(Date.now());
  
  return (
    <Modal open={isOpen} onClose={onClose} className="mint-honey-modal">
      <div className="flex flex-col items-center w-[460px] px-[30px] py-[28px] bg-[#FFFDEB] rounded-[20px] border border-black shadow-[10px_10px_0_0_rgba(0, 0, 0, 0.25)]">
        <SwitchTabs
          tabs={[
            { label: "Mint", value: "mint" },
            { label: "Redeem", value: "redeem" },
          ]}
          onChange={(val) => {
            setTab(val);
          }}
          current={tab}
          className="w-full"
          style={{ height: 50, borderRadius: 12 }}
          cursorStyle={{ borderRadius: 10 }}
        />
        <div className="mt-3 flex flex-col items-center w-full gap-y-3">
          <TokenAmount
            type="in"
            currency={inputCurrency}
            amount={inputCurrencyAmount}
            account
            onCurrencySelectOpen={() => {
              setDisplayCurrencySelect(true);
              setSelectType("in");
              setSelectedTokenAddress(inputCurrency?.address);
            }}
            onUpdateCurrencyBalance={(balance: any) => {
              setMaxInputBalance(balance);
            }}
            onAmountChange={(val: any) => {
              setInputCurrencyAmount(val);
            }}
            updater={`in-${updater}`}
          />
          <TokenAmount
            type="in"
            currency={inputCurrency}
            amount={inputCurrencyAmount}
            account
            onCurrencySelectOpen={() => {
              setDisplayCurrencySelect(true);
              setSelectType("in");
              setSelectedTokenAddress(inputCurrency?.address);
            }}
            onUpdateCurrencyBalance={(balance: any) => {
              setMaxInputBalance(balance);
            }}
            onAmountChange={(val: any) => {
              setInputCurrencyAmount(val);
            }}
            updater={`in-${updater}`}
          />
          <div className="text-left w-full font-Montserrat text-[#3D405A] text-[12px] font-[500]">Static fee of 0%</div>
          <div className="w-full font-Montserrat text-[#3D405A] text-[18px] font-[500] bg-[#FFDC50] rounded-[10px] border border-black flex items-center justify-center h-[46px]">{tab.toUpperCase()}</div>
        </div>
      </div>
    </Modal>
  );
};

export default MintHoneyModal;
