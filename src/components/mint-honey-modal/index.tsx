import Modal from "../modal";
import SwitchTabs from "../switch-tabs";
import { useState, FC, useEffect } from "react";
import { bera } from "@/configs/tokens/bera";
import TokenAmount from "./token-amount";
import { capitalize } from "@/utils/utils";
import TokenSelector from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";
import chains from "@/configs/chains";
import ABI from './abis/honeyFactory.json'
import Button from "./Button";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { ethers, Contract } from "ethers";
import useAddAction from "@/hooks/use-add-action";

const REDEEM_FEE = 0.0005; 
const HoneyFactoryAddress = '0xA4aFef880F5cE1f63c9fb48F661E27F8B4216401'

interface MintHoneyModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const tokens = [
  bera["usdc.e"],
  bera["byusd"],
];

const MintHoneyModal: FC<MintHoneyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [tab, setTab] = useState("mint");
  const [selectableToken, setSelectableToken] = useState(bera["usdc.e"]);
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState("");
  const [outputCurrencyAmount, setOutputCurrencyAmount] = useState("");
  const [displayCurrencySelect, setDisplayCurrencySelect] = useState(false);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [updater, setUpdater] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const { chainId, account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction('Honey')

  const inputCurrency = tab === 'mint' ? selectableToken : bera["honey"];
  const outputCurrency = tab === 'mint' ? bera["honey"] : selectableToken;

  const handleAmountChange = (val: string, type: 'in' | 'out') => {
    const isMint = tab === 'mint';
    const parsedVal = Number(val); 
  
    if (type === 'in') {
      setInputCurrencyAmount(val);
      setOutputCurrencyAmount(isMint ? val : isNaN(parsedVal) ? '' : String(parsedVal * (1 - REDEEM_FEE)));
    } else {
      setOutputCurrencyAmount(val);
      setInputCurrencyAmount(isMint ? val : isNaN(parsedVal) ? '' : String(parsedVal / (1 - REDEEM_FEE)));
    }
  };

  const handleCurrencySelect = (type: 'in' | 'out') => {
    const canSelect = (tab === 'mint' && type === 'in') || (tab === 'redeem' && type === 'out');
    
    if (!canSelect) return;
    
    setDisplayCurrencySelect(true);
    setSelectedTokenAddress(selectableToken?.address);
  };

  const onSelectToken = (token: any) => {
    setSelectableToken(token);
    
    setInputCurrencyAmount("");
    setOutputCurrencyAmount("");
    setDisplayCurrencySelect(false);
    setUpdater(Date.now());
  };

  useEffect(() => {
    setInputCurrencyAmount('');
    setOutputCurrencyAmount('');
  }, [tab]);

  useEffect(() => {
    if (isOpen) {
      setInputCurrencyAmount("");
      setOutputCurrencyAmount("");
    }
  }, [isOpen]);

  const handleHoney = async () => {
    if (!account || !chainId || !provider || !inputCurrencyAmount || Number(inputCurrencyAmount) <= 0) {
      return;
    }
    
    setLoading(true);
    let toastId = toast.loading({ title: "Confirming..." });
    
    try {
      const contract = new Contract(HoneyFactoryAddress, ABI, provider.getSigner());
      const tokenDecimals = inputCurrency.decimals;
      const amountInWei = ethers.utils.parseUnits(inputCurrencyAmount, tokenDecimals);
      let tx;
      if (tab === "mint") {
        tx = await contract.mint(
          selectableToken.address,  
          amountInWei,              
          account,                  
          false                     
        );
      } else {
        tx = await contract.redeem(
          selectableToken.address,  
          amountInWei,              
          account,                  
          false                     
        );
      }
      
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      
      const receipt = await tx.wait();
      
      toast.dismiss(toastId);
      toast.success({
        title: `${capitalize(tab)} successful!`,
        tx: receipt.transactionHash,
        chainId: chainId
      });
      
      const { status, transactionHash } = receipt;
      addAction?.({
        type: "Mint",
        action: capitalize(tab),
        tokens: [{ symbol: inputCurrency.symbol }],
        amount: inputCurrencyAmount,
        template: 'Honey',
        status: status,
        add: 1,
        transactionHash,
        chain_id: chainId,
        sub_type: capitalize(tab)
      })

      setInputCurrencyAmount('');
      setOutputCurrencyAmount('');
      setUpdater(Date.now());
    } catch (error: any) {
      toast.dismiss(toastId);
      console.error("Transaction error:", error);
      toast.fail({
        title: `${capitalize(tab)} failed`,
        description: error.reason || error.message || "Transaction failed"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} className="mint-honey-modal" closeIconClassName="top-[-10px] right-[-10px]">
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
            tab={tab}
            type="in"
            currency={inputCurrency}
            amount={inputCurrencyAmount}
            onCurrencySelectOpen={() => handleCurrencySelect('in')}
            onAmountChange={(val: any) => handleAmountChange(val, 'in')}
            updater={`in-${updater}`}
          />
          <TokenAmount
            tab={tab}
            type="out"
            currency={outputCurrency}
            amount={outputCurrencyAmount}
            onCurrencySelectOpen={() => handleCurrencySelect('out')}
            onAmountChange={(val: any) => handleAmountChange(val, 'out')}
            updater={`out-${updater}`}
          />
          <div className="text-left w-full font-Montserrat text-[#3D405A] text-[12px] font-[500]">
            Static fee of {tab === 'mint' ? '0%' : '0.05%'}
          </div>
          <Button 
            onClick={handleHoney}
            currency={inputCurrency}
            amount={inputCurrencyAmount}
            token={inputCurrency}
            spender={HoneyFactoryAddress}
            loading={loading}
            onRefresh={() => setUpdater(Date.now())}
            updater={`button-${updater}`}
          >{capitalize(tab)}</Button>
          <TokenSelector
            display={displayCurrencySelect}
            chainIdNotSupport={chainId !== DEFAULT_CHAIN_ID}
            selectedTokenAddress={selectedTokenAddress}
            chainId={DEFAULT_CHAIN_ID}
            tokens={tokens}
            account={account}
            explor={chains[DEFAULT_CHAIN_ID].blockExplorers.default.url}
            onClose={() => {
              setDisplayCurrencySelect(false);
            }}
            onSelect={onSelectToken}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MintHoneyModal;
