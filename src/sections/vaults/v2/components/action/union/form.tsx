import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import ActionInput from "@/sections/vaults/v2/components/action/input";
import { useVaultsV2ActionContext } from "@/sections/vaults/v2/components/action/context";
import clsx from "clsx";
import { ACTION_TYPE } from "@/sections/vaults/v2/config";
import ActionRangeDays from "@/sections/vaults/v2/components/action/range-days";
import ButtonWithApprove from "@/components/button/button-with-approve";
import { useMemo, useState } from "react";
import LazyImage from '@/components/layz-image';
import SwitchTabs from "@/components/switch-tabs";
import BerapawZap from "@/sections/staking/Bridge/Modal/berapaw/zap";
import { SLIPPAGE_MAP, useZap } from "@/sections/staking/hooks/use-zap";
import TokenSelector from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { numberFormatter } from "@/utils/number-formatter";
import berapawConfig from "@/configs/staking/dapps/berapaw";

const ActionUnionForm = (props: any) => {
  const { ...restProps } = props;

  const {
    actionType,
    currentProtocol,
    setCurrentProtocol,
    isBeraPaw,
  } = useVaultsV2Context();

  const [currentTab, setCurrentTab] = useState<any>("deposit");
  const LPToken = useMemo(() => {
    return {
      ...currentProtocol?.token,
      symbol: currentProtocol?.tokens?.map((token: any) => token.symbol).join("-"),
    };
  }, [currentProtocol?.token, currentProtocol?.tokens]);
  const {
    account,
    provider,
    prices,
    inputCurrencyAmount,
    setInputCurrencyAmount,
    outputCurrencyAmount,
    inputCurrency,
    tokenSelectorVisible,
    setTokenSelectorVisible,
    slippage,
    setSlippage,
    tokenData,
    tokenDataLoading,
    tokenList,
    tokenListLoading,
    zapData,
    zapDataLoading,
    getZapData,
    swapLoading,
    handleSwap,
    onTokenSelect,
  } = useZap({
    queryTokenUrl: (berapawConfig as any).chains[DEFAULT_CHAIN_ID]?.vaults?.queryTokenUrl,
    token: LPToken,
    onAfterSwap: async (params: any) => {
      const { signer, route } = params;
      let { currentStep, toastId } = params;
      return {
        currentStep,
        toastId,
      };
    },
    onSwapSuccess: () => { }
  });

  let _currentProtocol = currentProtocol;
  if (isBeraPaw) {
    _currentProtocol = currentProtocol.linkVault;
  }

  if (actionType.value === ACTION_TYPE.DEPOSIT) {
    return (
      <div className="mt-[10px]">
        <SwitchTabs
          tabs={[{
            value: 'deposit',
            label: "Deposit"
          }, {
            value: 'zap',
            label: "Zap"
          }]}
          current={currentTab}
          onChange={(value: any) => {
            setCurrentTab(value);
          }}
        />
        {
          currentTab === "deposit" && (
            <ActionUnionFormWithoutVaultsV2Context
              {...restProps}
              isBeraPaw={isBeraPaw}
              actionType={actionType}
              currentProtocol={_currentProtocol}
              setCurrentProtocol={setCurrentProtocol}
            />
          )
        }
        {
          currentTab === "zap" && (
            <BerapawZap
              data={{
                stakingToken: LPToken,
              }}
              prices={prices}
              inputCurrencyAmount={inputCurrencyAmount}
              setInputCurrencyAmount={setInputCurrencyAmount}
              outputCurrencyAmount={outputCurrencyAmount}
              inputCurrency={inputCurrency}
              loading={tokenListLoading || zapDataLoading || swapLoading}
              onOpenTokenSelector={() => {
                setTokenSelectorVisible(true);
              }}
              slippage={slippage}
              setSlippage={setSlippage}
              slippageList={Array.from(SLIPPAGE_MAP.values())}
              onSwap={handleSwap}
              onRefresh={getZapData}
              zapData={zapData}
              tokenData={tokenData}
            />
          )
        }
        <TokenSelector
          display={tokenSelectorVisible}
          tokens={tokenList ?? []}
          selectedTokenAddress={inputCurrency?.address}
          chainId={DEFAULT_CHAIN_ID}
          account={account}
          onSelect={onTokenSelect}
          onClose={() => {
            setTokenSelectorVisible(false);
          }}
          showSearch={false}
          isSortByBalance={false}
          customBalanceFormatter={(currency: any, balance: string) => {
            return numberFormatter(currency.value, 2, true, { prefix: "$", isShort: true, isShortUppercase: true, isZeroPrecision: true });
          }}
        />
      </div>
    );
  }

  return (
    <ActionUnionFormWithoutVaultsV2Context
      {...restProps}
      isBeraPaw={isBeraPaw}
      actionType={actionType}
      currentProtocol={_currentProtocol}
      setCurrentProtocol={setCurrentProtocol}
    />
  );
};

export default ActionUnionForm;

const ActionUnionFormWithoutVaultsV2Context = (props: any) => {
  const {
    className,
    actionType,
    currentProtocol,
    setCurrentProtocol,
    isBeraPaw,
  } = props;

  const {
    amount,
    balanceShown,
    balanceLoading,
    inputError,
    handleAmountChange,
    dappParams,
    setDappParams,
    inputErrorMessage,
    loading,
    queuedAmount,
    onAction
  } = useVaultsV2ActionContext();

  const buttonDisabled = useMemo(() => {
    if (inputError) return true;
    if (loading) return true;
    if (
      currentProtocol.protocol === "Smilee" &&
      actionType.value === ACTION_TYPE.WITHDRAW
    ) {
      return true;
    }

    if (currentProtocol.protocol === "D2 Finance") {
      if (
        actionType.value === ACTION_TYPE.DEPOSIT &&
        (currentProtocol.extra_data.fundingStart > Date.now() ||
          currentProtocol.extra_data.epochStart <= Date.now())
      ) {
        return true;
      }
      if (
        actionType.value === ACTION_TYPE.WITHDRAW &&
        (currentProtocol.extra_data.epochEnd > Date.now() ||
          currentProtocol.extra_data.epochStart <= Date.now()) &&
        currentProtocol.extra_data.custodied
      ) {
        return true;
      }
    }

    if (currentProtocol.depositDisabled && actionType.value === ACTION_TYPE.DEPOSIT) {
      return true;
    }

    return false;
  }, [inputError, loading, currentProtocol.protocol, currentProtocol.depositDisabled, actionType]);

  return (
    <div className={clsx("", className)}>
      {
        (isBeraPaw && actionType.value === ACTION_TYPE.DEPOSIT) && (
          <>
            <div className="flex items-center gap-[10px] text-[18px] font-Montserrat font-bold leading-[90%] text-black">
              <div className="">Step 1. Deposit Vaults</div>
              <LazyImage
                src={currentProtocol.protocolIcon}
                width={24}
                height={24}
                containerClassName="shrink-0 rounded-[4px] border border-[#FFFDEB] overflow-hidden"
                fallbackSrc="/assets/tokens/default_icon.png"
              />
            </div>
            <div className="text-black font-Montserrat text-[12px] font-[500] leading-[100%] mt-[5px]">
              Your assets will be deposited in the {currentProtocol.project} Vaults.
            </div>
          </>
        )
      }
      <ActionInput
        className="mt-[20px]"
        inputError={inputError}
        value={amount}
        onChange={handleAmountChange}
        record={currentProtocol}
        actionType={actionType}
        balanceLoading={balanceLoading}
        balance={balanceShown}
        setCurrentProtocol={setCurrentProtocol}
        queuedAmount={queuedAmount}
      />
      {currentProtocol.protocol === "Kodiak" &&
        actionType.value === ACTION_TYPE.DEPOSIT && (
          <ActionRangeDays
            className="mt-[16px]"
            dappParams={dappParams}
            setDappParams={setDappParams}
          />
        )}
      <div className="mt-[20px] flex justify-center">
        <ButtonWithApprove
          spender={
            // 👇for WeBera
            currentProtocol.extra_data?.vault_router
              ? currentProtocol.extra_data?.vault_router
              : actionType.value === ACTION_TYPE.DEPOSIT
                ? currentProtocol.vaultAddress
                : ""
          }
          token={
            actionType.value === ACTION_TYPE.DEPOSIT
              ? currentProtocol.token
              : // 👇for WeBera
              currentProtocol.extra_data?.vault_router
                ? {
                  address: currentProtocol.vaultAddress,
                  decimals: currentProtocol.token.decimals
                }
                : currentProtocol.token
          }
          amount={amount}
          loading={loading}
          errorTips={inputErrorMessage}
          disabled={buttonDisabled}
          onClick={onAction}
          buttonProps={{
            className: "w-full h-[50px] font-bold",
            type: "primary"
          }}
        >
          {actionType.button}
        </ButtonWithApprove>
      </div>
    </div>
  );
};
