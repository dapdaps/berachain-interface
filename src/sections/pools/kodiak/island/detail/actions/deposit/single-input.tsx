"use client";
import { useEffect, useMemo, useState } from "react";
import { balanceFormated, valueFormated } from "@/utils/balance";
import Range from "@/components/range";
import TokenSelector from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { motion } from "framer-motion";
import Big from "big.js";
import Loading from "@/components/circle-loading";
import useAccount from "@/hooks/use-account";
import useTokenBalance from "@/hooks/use-token-balance";
import { usePriceStore } from "@/stores/usePriceStore";
import chains from "@/configs/chains";
import { bera } from "@/configs/tokens/bera";

export default function SingleInput({ data, setErrorTips, singleQuoter }: any) {
  const [percent, setPercent] = useState<any>(0);
  const [selectedToken, setSelectedToken] = useState<any>(data?.token0);
  const [showTokensModal, setShowTokensModal] = useState(false);
  const [amount, setAmount] = useState("");
  const { account, chainId } = useAccount();
  const { tokenBalance, isLoading } = useTokenBalance(
    selectedToken?.address,
    selectedToken?.decimals
  );
  const prices = usePriceStore((store: any) => store.price);

  const tokens = useMemo(() => {
    if (!data) return [];
    const _t: any = [data.token0, data.token1];
    if (data.token0.isNative || data.token1.isNative) {
      _t.push(bera.wbera);
    }
    return _t;
  }, [data]);

  const handleRangeChange = (e: any, isAmountChange = true) => {
    const formatedBalance = balanceFormated(tokenBalance);
    if (["-", "Loading", "0"].includes(formatedBalance)) return;
    const _percent = e.target.value || 0;
    setPercent(_percent);
    isAmountChange &&
      setAmount?.(
        Big(tokenBalance)
          .times(Big(_percent).div(100))
          .toFixed(selectedToken?.decimals)
          .replace(/[.]?0+$/, "")
      );
  };
  const setRange = (val: string) => {
    const formatedBalance = balanceFormated(tokenBalance);
    if (["-", "Loading", "0"].includes(formatedBalance)) return;
    let percent: any = Big(val || 0)
      .div(formatedBalance)
      .times(100)
      .toFixed(2);
    percent = Math.min(Math.max(+percent, 0), 100);
    handleRangeChange?.({ target: { value: percent } }, false);
  };

  useEffect(() => {
    if (!amount) {
      setErrorTips("Enter an amount");
      return;
    }
    if (Big(tokenBalance).lt(amount)) {
      setErrorTips("Insufficient Balance");
      return;
    }
    setErrorTips("");
  }, [amount, tokenBalance]);

  return (
    <>
      <div className="border border-[#000] rounded-[12px] p-[14px] bg-white mt-[10px]">
        <div className="flex items-center justify-between gap-[10px]">
          <div
            className={`border bg-[#FFFDEB] flex items-center justify-between border-[#000] rounded-[8px]  w-[176px] h-[46px] px-[7px] cursor-pointer`}
            onClick={() => {
              setShowTokensModal(true);
            }}
          >
            {selectedToken ? (
              <div className="flex items-center gap-[10px]">
                <div className="relative">
                  <img
                    className="w-[26px] h-[26px]"
                    src={
                      selectedToken.icon || "/assets/tokens/default_icon.png"
                    }
                  />
                </div>
                <div>
                  <div className="text-[16px] font-[600]">
                    {selectedToken?.symbol}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[16px] font-[600]">Select a token</div>
            )}
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 5L11 1"
                stroke="black"
                stroke-width="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <input
              className="w-[100%] h-[100%] text-[26px] text-right"
              value={amount}
              onChange={(ev) => {
                if (isNaN(Number(ev.target.value))) return;
                const val = ev.target.value.replace(/\s+/g, "");
                setAmount?.(val);
                setRange(val);
                singleQuoter(val, selectedToken.index || 0);
              }}
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex justify-between md:flex-col md:items-stretch md:justify-start items-center gap-[22px] mt-[12px]">
          <div className="flex items-center gap-[8px]">
            {BalancePercentList.map((p) => (
              <motion.div
                key={p.value}
                className="cursor-pointer h-[22px] rounded-[6px] border border-[#373A53] text-black text-[14px] font-[400] px-[8px]"
                animate={percent == p.value ? { background: "#FFDC50" } : {}}
                onClick={() => handleRangeChange({ target: p })}
              >
                {p.label}
              </motion.div>
            ))}
          </div>
          <Range
            style={{ marginTop: 0, flex: 1 }}
            value={percent}
            onChange={handleRangeChange}
          />
        </div>
        <div className="flex items-center justify-between mt-[10px] color-[#979abe] text-[12px]">
          <div className="flex items-center gap-[4px]">
            <div>Balance: </div>
            {isLoading ? (
              <Loading size={16} />
            ) : (
              <div
                onClick={() => {
                  if (isNaN(Number(tokenBalance))) return;
                  setAmount(
                    balanceFormated(new Big(tokenBalance).toFixed(18), 18)
                  );
                }}
                className="cursor-pointer underline"
              >
                {!tokenBalance ? "-" : balanceFormated(tokenBalance, 4)}
              </div>
            )}
          </div>
          <div>
            $
            {!isNaN(Number(amount)) && prices
              ? valueFormated(
                  amount,
                  prices[selectedToken?.priceKey || selectedToken?.symbol]
                )
              : "-"}
          </div>
        </div>
      </div>
      <TokenSelector
        display={showTokensModal}
        chainIdNotSupport={chainId !== DEFAULT_CHAIN_ID}
        selectedTokenAddress={selectedToken?.address}
        chainId={DEFAULT_CHAIN_ID}
        tokens={tokens}
        account={account}
        explor={chains[DEFAULT_CHAIN_ID].blockExplorers.default.url}
        onClose={() => {
          setShowTokensModal(false);
        }}
        onSelect={(token: any) => {
          const index =
            token.address === data.token0.address ||
            (data.token0.isNative && token.address === bera.wbera.address)
              ? 0
              : 1;

          setSelectedToken({ ...token, index });
          if (amount) singleQuoter(amount, index);
        }}
        showSearch={false}
      />
    </>
  );
}

const BalancePercentList = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "Max" }
];
