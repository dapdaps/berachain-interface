import clsx from "clsx";
import { useBelongContext } from "../context";
import TokenAmount from "@/sections/swap/TokenAmount";
import { useMemo, useState } from "react";
import BelongTips from "./tips";
import LazyImage from "@/components/layz-image";
import { numberFormatter } from "@/utils/number-formatter";
import { bera } from "@/configs/tokens/bera";
import { useRequest } from "ahooks";
import BelongButton from "./button";
import { Contract, utils } from "ethers";
import { COLL_VAULAT_ABI } from "@/sections/Lending/hooks/use-beraborrow";
import useAddAction from "@/hooks/use-add-action";
import useCustomAccount from "@/hooks/use-account";
import Big from "big.js";
import Skeleton from "react-loading-skeleton";
import useToast from "@/hooks/use-toast";
import { multicall, multicallAddresses } from '@/utils/multicall';

const Withdraw = (props: any) => {
  const { className } = props;

  const {
    currentMarket,
    prices,
    currentMarketData,
    dataLoading,
  } = useBelongContext();
  const { addAction } = useAddAction("belong");
  const { account, provider, chainId } = useCustomAccount();
  const toast = useToast();

  const [inputAmount, setInputAmount] = useState<any>("");
  const [inputCurrencyUpdater, setInputCurrencyUpdater] = useState(1);
  const [inputCurrencyBalance, setInputCurrencyBalance] = useState("0");

  const { data: redeemData, loading: redeemDataLoading } = useRequest(async () => {
    if (!provider || !inputAmount || Big(inputAmount).lte(0)) {
      return {
        redeemAmount: "0",
        withdrawFee: "0"
      };
    }
    const _inputAmount = utils.parseUnits(inputAmount, currentMarket.collVaultToken.decimals);
    const calls: any = [
      {
        address: currentMarket.collVault,
        name: "previewRedeem",
        params: [_inputAmount]
      },
      {
        address: currentMarket.collVault,
        name: "getWithdrawFee",
        params: []
      }
    ];
    const multicallAddress = multicallAddresses[chainId];
    try {
      const res = await multicall({
        abi: COLL_VAULAT_ABI,
        calls,
        options: {},
        multicallAddress,
        provider
      });
      const [_redeemAmount, _withdrawFee] = res || [];
      const [_redeemAmountValue] = _redeemAmount || [];
      const [_withdrawFeeValue] = _withdrawFee || [];
      return {
        redeemAmount: _redeemAmountValue ? utils.formatUnits(_redeemAmountValue, currentMarket.collVaultToken.decimals) : "0",
        withdrawFee: _withdrawFeeValue ? utils.formatUnits(_withdrawFeeValue, currentMarket.collVaultToken.decimals) : "0",
      };
    } catch (err: any) {
      console.log("get redeem data error: %o", err);
    }
    return {
      redeemAmount: "0",
      withdrawFee: "0"
    };
  }, {
    refreshDeps: [inputAmount, provider],
    debounceWait: 300,
  });

  const afterSuccess = () => {
    setInputCurrencyUpdater((prev: any) => prev + 1);
    setInputAmount("");
  };

  const { runAsync: handleWithdraw, loading: withdrawing } = useRequest(async () => {
    const signer = provider?.getSigner();
    let toastId: any;
    const contract = new Contract(currentMarket.collVault, COLL_VAULAT_ABI, signer);
    const params = [
      utils.parseUnits(inputAmount, currentMarket.collVaultToken.decimals),
      account,
      account
    ];
    const options: any = {};
    toastId = toast.loading({ title: "Withdrawing..." });
    try {
      options.gasLimit = await contract.estimateGas.redeem(...params);
    } catch (err: any) {
      console.log("estimateGas error: %o", err);
    }
    try {
      const tx = await contract.redeem(...params, options);
      toast.dismiss(toastId);
      toastId = toast.loading({
        title: "Confirming...",
        tx: tx.hash,
        chainId,
      });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      const _redeemAmount = redeemData?.redeemAmount;
      if (status === 1) {
        toast.success({
          title: "Withdraw success",
          chainId,
          tx: transactionHash
        });
        afterSuccess();
      } else {
        toast.fail({
          title: "Withdraw failed",
          text: "Please try again later.",
          chainId,
          tx: transactionHash
        });
      }
      addAction({
        type: 'Staking',
        template: "Beraborrow",
        action: 'UnStake',
        token: currentMarket,
        amount: _redeemAmount,
        add: false,
        status,
        transactionHash,
        tokens: [currentMarket],
        amounts: [_redeemAmount],
        extra_data: {
          token0Symbol: currentMarket.symbol,
          amount0: _redeemAmount,
          price0: currentMarketData.collPrice
        }
      });
    } catch (err: any) {
      console.log(`Withdraw error: %o`, err);
      toast.dismiss(toastId);
      toast.fail({
        title: "Withdraw Failed!",
        text: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : ""
      });
    }
  }, { manual: true });

  const buttonValid = useMemo(() => {
    const result: any = { valid: true, text: "Withdraw", loading: false };
    if (dataLoading || withdrawing) {
      result.loading = true;
    }
    if (!inputAmount || Big(inputAmount).lte(0)) {
      result.valid = false;
      result.text = "Enter an amount";
      return result;
    }
    if (Big(inputAmount).gt(inputCurrencyBalance)) {
      result.valid = false;
      result.text = "Exceed max withdrawal amount";
      return result;
    }
    return result;
  }, [
    inputAmount,
    withdrawing,
    dataLoading,
    inputCurrencyBalance,
  ]);

  return (
    <>
      <div className={clsx("w-full text-[#000] text-[12px] font-Montserrat font-[500]", className)}>
        {/*#region Widthdraw collateral*/}
        <div className="w-full">
          <div className="w-ful flex justify-between items-center gap-[10px] text-[12px] text-[#A1A0A1]">
            <div className="">Burn {currentMarket?.collVaultToken?.symbol}</div>
          </div>
          <TokenAmount
            className="!p-[14px_12px_10px] mt-[10px] w-full"
            currencyClassName="md:w-[120px] border bg-[#FFFDEB]"
            type="in"
            outputCurrencyReadonly
            currency={currentMarket?.collVaultToken}
            amount={inputAmount}
            prices={{
              ...prices,
              [currentMarket?.collVaultToken?.symbol]: currentMarketData?.price,
            }}
            isPrice={false}
            account
            onAmountChange={(_amount: string) => {
              setInputAmount(_amount);
            }}
            updater={inputCurrencyUpdater}
            balanceLabel="Deposited"
            onUpdateCurrencyBalance={(_balance: string) => {
              setInputCurrencyBalance(_balance);
            }}
            balancePercentClassName={({ selected }: any) => {
              if (selected) {
                return "!border-[#000] text-[#000]";
              }
              return "!border-[#D9D9D9] !text-[#808290]";
            }}
            isRange={false}
            balanceContainerClassName="!text-[#A1A0A1]"
          />
        </div>
        {/*#endregion*/}
        {/*#region Composition Withdrawn*/}
        <div className="w-ful flex justify-between items-center gap-[10px] text-[12px] text-[#A1A0A1] mt-[10px]">
          <div className="">Composition Withdrawn</div>
          {/* <div className="flex items-center justify-end gap-[2px]">
            <BelongTips className="">
              Fee charged on withdrawal from Vault
            </BelongTips>
            <div>Fee:</div>
            <div className="text-black">$0 (0%)</div>
          </div> */}
        </div>
        <div className="border border-[#000] rounded-[12px] bg-white leading-[100%] p-[14px_12px_10px] mt-[10px] w-full">
          <div className="flex justify-between items-center gap-[10px]">
            <div className="flex items-center gap-[5px] flex-1 w-0">
              <div className="flex items-center shrink-0">
                {
                  currentMarket.underlyingTokens?.map((token: any, index: number) => (
                    <LazyImage
                      src={token.icon}
                      width={26}
                      height={26}
                      containerClassName={clsx("!w-[26px] !h-[26px] rounded-full overflow-hidden shrink-0", index > 0 && "ml-[-10px]")}
                    />
                  ))
                }
              </div>
              <div className="flex items-center gap-[4px] h-[26px] text-[16px] text-black flex-1 w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                <div>
                  {
                    redeemDataLoading ? (
                      <Skeleton
                        width={50}
                        height={12}
                        borderRadius={2}
                      />
                    ) : numberFormatter(redeemData?.redeemAmount, 2, true)
                  }
                </div>
                <div>{currentMarket.underlyingTokens?.map((token: any, index: number) => token.symbol).join("-")}</div>
              </div>
            </div>
            <div className="text-black font-[600] text-[16px]">
              {
                redeemDataLoading ? (
                  <Skeleton
                    width={50}
                    height={12}
                    borderRadius={2}
                  />
                ) : numberFormatter(Big(redeemData?.redeemAmount || 0).times(currentMarketData?.collPrice || 0), 2, true, { prefix: "$" })
              }
            </div>
          </div>
          <div className="flex flex-col gap-[5px] mt-[10px]">
            <div className="flex items-center gap-[4px]">
              <LazyImage
                src={bera["ibgt"].icon}
                width={26}
                height={26}
                containerClassName={clsx("!w-[26px] !h-[26px] rounded-full overflow-hidden shrink-0")}
              />
              <div className="text-black text-[14px] font-[600]">
                0
              </div>
              <div className="text-black text-[14px]">
                {bera["ibgt"].symbol}
              </div>
            </div>
            <div className="flex items-center gap-[4px]">
              <LazyImage
                src={bera["wbera"].icon}
                width={26}
                height={26}
                containerClassName={clsx("!w-[26px] !h-[26px] rounded-full overflow-hidden shrink-0")}
              />
              <div className="text-black text-[14px] font-[600]">
                0
              </div>
              <div className="text-black text-[14px]">
                {bera["wbera"].symbol}
              </div>
            </div>
          </div>
        </div>
        {/*#endregion*/}
        <div className="w-full mt-[13px]">
          <BelongButton
            className=""
            disabled={buttonValid.loading || !buttonValid.valid}
            loading={buttonValid.loading}
            onClick={handleWithdraw}
          >
            {buttonValid.text}
          </BelongButton>
        </div>
      </div>
    </>
  );
};

export default Withdraw;
