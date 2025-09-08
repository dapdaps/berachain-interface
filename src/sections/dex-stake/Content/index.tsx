import { useState, useMemo, useEffect } from "react";
import useTrade from "../useTrade";
import { useDebounceFn } from "ahooks";
import { usePriceStore } from "@/stores/usePriceStore";
import useAccount from "@/hooks/use-account";
import Card from "@/components/card";
import Header from "../Header";
import TokenAmount from "../TokenAmount";
import Fees from "../Fees";
import SubmitBtn from "../SubmitBtn";
import ExchangeIcon from "./ExchangeIcon";
import Result from "./Result";
import { uniqBy } from "lodash";
import Big from "big.js";
import TokenSelector from "../TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs/index";
import chains from "@/configs/chains";
import SwitchTabs from "@/components/switch-tabs";
import { balanceFormated } from "@/utils/balance";
import WithdrawList from "./Withdraw";
import useIsMobile from "@/hooks/use-isMobile";

export default function Stake({
  dapp,
  outputCurrencyReadonly = true,
  showSetting = false,
  from,
  onSuccess
}: any) {
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState("");
  const [outputCurrencyAmount, setOutputCurrencyAmount] = useState("");
  const [inputCurrency, setInputCurrency] = useState<any>(
    dapp?.defaultInputCurrency
  );
  const [outputCurrency, setOutputCurrency] = useState<any>(
    dapp?.defaultOutputCurrency
  );
  const [displayCurrencySelect, setDisplayCurrencySelect] = useState(false);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [maxInputBalance, setMaxInputBalance] = useState("");
  const [errorTips, setErrorTips] = useState("");
  const [updater, setUpdater] = useState(0);
  const { account, chainId } = useAccount();
  const [showDetail, setShowDetail] = useState(true);
  const prices = usePriceStore((store: any) => store.price);
  const [tab, setTab] = useState("stake");
  const isMobile = useIsMobile();

  const [selectType, setSelectType] = useState<"in" | "out">("in");
  const { loading, trade, onQuoter, onSwap, apr, quoteNumber, withdrawalRequests, onWithdraw } = useTrade({
    chainId: DEFAULT_CHAIN_ID,
    template: dapp.name,
    from,
    dapp,
    onSuccess: (trade: any) => {
      setUpdater(Date.now());
      runQuoter();
      onSuccess?.(trade);
    }
  });

  const { run: runQuoter } = useDebounceFn(
    (template?: string) => {
      onQuoter({
        inputCurrency,
        outputCurrency,
        inputCurrencyAmount,
        template
      });
      setOutputCurrencyAmount("");
    },
    {
      wait: 500
    }
  );

  const tokens = useMemo(() => {
    return uniqBy(
      [
        ...(dapp.inputTokens[DEFAULT_CHAIN_ID] || []),
      ].map((token: any) => ({
        ...token,
        address: token.address.toLowerCase()
      })),
      "address"
    );
  }, [dapp]);

  useEffect(() => {
    if (tab === "unstake") {
      setInputCurrency(dapp?.defaultOutputCurrency);
      setOutputCurrency(dapp?.defaultInputCurrency);
    } else {
      setInputCurrency(dapp?.defaultInputCurrency);
      setOutputCurrency(dapp?.defaultOutputCurrency);
    }
  }, [tab]);

  const onSelectToken = (token: any) => {
    let _inputCurrency: any = inputCurrency;
    let _outputCurrency: any = outputCurrency;

    if (selectType === "in") {
      _inputCurrency = token;
      if (token.address.toLowerCase() === outputCurrency?.address.toLowerCase())
        _outputCurrency = null;
    }
    if (selectType === "out") {
      _outputCurrency = token;
      if (token.address.toLowerCase() === inputCurrency?.address.toLowerCase())
        _inputCurrency = null;
    }
    if (!_inputCurrency || !_outputCurrency) setOutputCurrencyAmount("");
    setInputCurrency(_inputCurrency);
    setOutputCurrency(_outputCurrency);
    setDisplayCurrencySelect(false);
  };

  useEffect(() => {
    setInputCurrency(dapp?.defaultInputCurrency);
    setOutputCurrency(dapp?.defaultOutputCurrency);
    setInputCurrencyAmount("");
    setOutputCurrencyAmount("");
  }, [dapp]);

  useEffect(() => {
    if (!inputCurrency || !outputCurrency) {
      setErrorTips("Select a token");
      return;
    }
    if (Number(inputCurrencyAmount || 0) === 0) {
      setErrorTips("Enter an amount");
      setOutputCurrencyAmount("");
      return;
    }
    if (Big(inputCurrencyAmount).gt(maxInputBalance || 0)) {
      setErrorTips(`Insufficient ${inputCurrency?.symbol} Balance`);
    } else {
      setErrorTips("");
    }

    runQuoter();
  }, [inputCurrency, outputCurrency, inputCurrencyAmount, maxInputBalance]);

  useEffect(() => {
    setOutputCurrencyAmount(trade?.outputCurrencyAmount || "");
  }, [trade]);

  return (
    <div className="relative">
      <Card>
        {/* <Header
        showSetting={false}
        style={{ justifyContent: "space-between" }}
        title={`Stake`}
      /> */}

        <SwitchTabs
          tabs={[
            { label: "Stake", value: "stake" },
            { label: "Unstake", value: "unstake" },
          ]}
          onChange={setTab}
          current={tab}
          className="w-full mb-[16px]"
        />

        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-[#B3B3B3] font-medium mb-1">APR</div>
            <div className="text-[18px] text-[#7AC231] leading-none">{balanceFormated(apr, 2)}%</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#B3B3B3] font-medium mb-1">Available to {tab}</div>
            <div className="text-[18px] font-bold text-[#3D405A] leading-none">{balanceFormated(maxInputBalance)} {inputCurrency.symbol}</div>
          </div>
        </div>

        <div className="md:max-h-[calc(100dvh-210px)] md:overflow-y-auto">
          <TokenAmount
            type="in"
            currency={inputCurrency}
            amount={inputCurrencyAmount}
            prices={prices}
            account
            outputCurrencyReadonly={tab === "unstake"}
            onCurrencySelectOpen={() => {
              if (tab === "unstake") return;
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

          <div className="bg-[#FFFBEA] rounded-[12px]  my-4">
            <div className="flex justify-between items-center mb-2">
              {
                tab === "unstake" ? (
                  <div className="text-[#B3B3B3] text-[15px] font-medium">1 sWBERA = {Number(quoteNumber) > 0 ? balanceFormated(1 / Number(quoteNumber), 2) : "0"} BERA</div>
                ) : (
                  <div className="text-[#B3B3B3] text-[15px] font-medium">1 BERA = {balanceFormated(quoteNumber, 2)} sWBERA</div>
                )
              }
              <div className="flex items-center gap-2">
                <span className="text-[#B3B3B3] text-[15px] font-medium">Unstake cooldown</span>
                <span className="text-[#3D405A] text-[15px] font-bold">7 days</span>
              </div>
            </div>
            {
              tab === "stake" && (
                <div className="bg-[#EAF6FF] border border-[#B3E2FF] rounded-[10px] px-4 py-3 flex items-start gap-3">
                  <svg width="20" height="20" className="mt-0.5 shrink-0" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#B3E2FF" />
                    <path d="M10 6.5V11.5" stroke="#3D405A" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="10" cy="14" r="1" fill="#3D405A" />
                  </svg>
                  <div>
                    <div className="text-[#3D8AFF] text-[15px] font-medium mb-0.5">
                      <span className="">sWBERA is the liquid receipt token</span>
                    </div>
                    <div className="text-[#7A869A] text-[14px]">
                      It can always be redeemed for BERA.
                    </div>
                  </div>
                </div>
              )
            }
          </div>


          <SubmitBtn
            chain={{
              chainId: DEFAULT_CHAIN_ID
            }}
            amount={inputCurrencyAmount}
            needApprove={tab === "stake"}
            spender={trade?.routerAddress}
            errorTips={errorTips}
            token={inputCurrency}
            loading={loading}
            onClick={onSwap}
            // disabled={}
            onRefresh={() => {
              runQuoter(trade?.name);
            }}
            updater={`button-${updater}`}
          >
            {
              tab === "stake" ? "Stake" : "Unstake"
            }
          </SubmitBtn>

        </div>
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
      </Card>

      {
        tab === "unstake" && (
          <WithdrawList data={withdrawalRequests} onWithdraw={onWithdraw} />
        )
      }
    </div>
  );
}
