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
import BerapawZap, { ZapSlippage } from "@/sections/staking/Bridge/Modal/berapaw/zap";
import { SLIPPAGE_MAP, useZap } from "@/sections/staking/hooks/use-zap";
import TokenSelector from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { numberFormatter } from "@/utils/number-formatter";
import { ethers } from "ethers";
import Big from "big.js";

const ActionUnionForm = (props: any) => {
  const { ...restProps } = props;

  const {
    actionType,
    currentProtocol,
    setCurrentProtocol,
    isBeraPaw,
    currentDepositTab,
    setCurrentDepositTab,
  } = useVaultsV2Context();

  const {
    onAction
  } = useVaultsV2ActionContext();

  const _currentProtocol = useMemo(() => {
    if (isBeraPaw) {
      return currentProtocol.linkVault;
    }
    return currentProtocol;
  }, [isBeraPaw, currentProtocol]);

  const [spenderAddress, spenderToken] = useMemo(() => {
    return [
      // 👇for WeBera
      _currentProtocol.extra_data?.vault_router
        ? _currentProtocol.extra_data?.vault_router
        : actionType.value === ACTION_TYPE.DEPOSIT
          ? _currentProtocol.vaultAddress
          : "",
      actionType.value === ACTION_TYPE.DEPOSIT
        ? _currentProtocol.token
        : // 👇for WeBera
        _currentProtocol.extra_data?.vault_router
          ? {
            address: _currentProtocol.vaultAddress,
            decimals: _currentProtocol.token.decimals
          }
          : _currentProtocol.token
    ];
  }, [_currentProtocol, actionType]);

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
    currentZapStepText,
  } = useZap({
    token: LPToken,
    stakeToken: {
      ...LPToken,
      address: _currentProtocol.vaultAddress,
    },
    totalStep: 3,
    onAfterSwap: async (params: any) => {
      const {
        signer,
        route,
        toast,
        setCurrentZapStep,
        setCurrentZapStepNo
      } = params;
      let { currentStep, toastId } = params;

      //#region get balance of staking token
      const contract = new ethers.Contract(
        LPToken?.address,
        [
          {
            inputs: [
              { internalType: 'address', name: 'account', type: 'address' }
            ],
            name: 'balanceOf',
            outputs: [
              { internalType: 'uint256', name: '', type: 'uint256' }
            ],
            stateMutability: 'view',
            type: 'function'
          }
        ],
        provider
      );
      const balance = await contract.balanceOf(account);
      const realBalance = ethers.utils.formatUnits(balance, LPToken?.decimals);
      const estimatedAmountOut = ethers.utils.formatUnits(route.amountOut, LPToken?.decimals);
      let realAmountOut = estimatedAmountOut;
      if (Big(realBalance).lt(estimatedAmountOut)) {
        realAmountOut = realBalance;
      }
      //#endregion

      //#region check stake amount approved
      currentStep = "Approve";
      setCurrentZapStep("Approve");
      setCurrentZapStepNo(2);
      const tokenContract = new ethers.Contract(
        LPToken?.address,
        [
          {
            inputs: [
              { internalType: "address", name: "", type: "address" },
              { internalType: "address", name: "", type: "address" }
            ],
            name: "allowance",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function"
          },
          {
            inputs: [
              { internalType: "address", name: "spender", type: "address" },
              { internalType: "uint256", name: "value", type: "uint256" }
            ],
            name: "approve",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
        signer
      );
      const allowanceRes = await tokenContract.allowance(account, spenderAddress);
      const allowanceAmount = ethers.utils.formatUnits(
        allowanceRes.toString(),
        LPToken?.decimals
      );
      //#endregion

      //#region approve stake amount
      if (Big(allowanceAmount).lt(realAmountOut)) {
        const encodedRealAmount = ethers.utils.parseUnits(realAmountOut, LPToken?.decimals);
        let estimateGas = "5000000";
        try {
          const estimateGasRes = await tokenContract.estimateGas.approve(spenderAddress, encodedRealAmount);
          estimateGas = Big(estimateGasRes.toString()).times(1.2).toFixed(0);
        } catch (err) {
          console.log("get estimate gas err: %o", err);
        }
        const approveTx = await tokenContract.approve(spenderAddress, encodedRealAmount, { gasLimit: estimateGas });
        toastId = toast.loading({ title: "Pending...", tx: approveTx.hash, chainId: DEFAULT_CHAIN_ID });
        const approveTxReceipt = await approveTx.wait();
        if (approveTxReceipt.status === 1) {
          toast.dismiss(toastId);
          toastId = toast.success({
            title: "Approve Successful!"
          });
          currentStep = "Stake";
          setCurrentZapStep("Stake");
          setCurrentZapStepNo(3);
          const stakeSuccess = await onAction({ amount: realAmountOut });
          if (!stakeSuccess) {
            return {
              currentStep,
              toastId,
            };
          }
        }
      }
      else {
        currentStep = "Stake";
        setCurrentZapStep("Stake");
        setCurrentZapStepNo(3);
        const stakeSuccess = await onAction({ amount: realAmountOut });
        if (!stakeSuccess) {
          return {
            currentStep,
            toastId,
          };
        }
      }
      //#endregion
      return {
        currentStep,
        toastId,
      };
    },
    onSwapSuccess: () => { }
  });

  if (actionType.value === ACTION_TYPE.DEPOSIT) {
    return (
      <div className="mt-[10px]">
        <SwitchTabs
          className="!h-[38px] md:!h-[30px] !rounded-[10px] md:!rounded-[8px]"
          cursorClassName="!rounded-[8px] md:!rounded-[6px]"
          tabs={[{
            value: 'deposit',
            label: "Deposit"
          }, {
            value: 'zap',
            label: "Zap"
          }]}
          current={currentDepositTab}
          onChange={(value: any) => {
            setCurrentDepositTab(value);
          }}
        />
        {
          currentDepositTab === "deposit" && (
            <ActionUnionFormWithoutVaultsV2Context
              {...restProps}
              isBeraPaw={isBeraPaw}
              actionType={actionType}
              currentProtocol={_currentProtocol}
              setCurrentProtocol={setCurrentProtocol}
              spenderAddress={spenderAddress}
              spenderToken={spenderToken}
            />
          )
        }
        {
          currentDepositTab === "zap" && (
            <div>
              <div className="flex justify-between items-center mt-[10px]">
                <div className="text-black font-Montserrat text-[18px] font-[600] leading-[90%]">
                  Zap into {LPToken.symbol}
                </div>
                <ZapSlippage
                  className=""
                  slippage={slippage}
                  setSlippage={setSlippage}
                  slippageList={Array.from(SLIPPAGE_MAP.values())}
                />
              </div>
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
                onSwap={handleSwap}
                onRefresh={getZapData}
                zapData={zapData}
                tokenData={tokenData}
                currentZapStepText={currentZapStepText}
              />
            </div>
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
      spenderAddress={spenderAddress}
      spenderToken={spenderToken}
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
    spenderAddress,
    spenderToken,
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
          spender={spenderAddress}
          token={spenderToken}
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
