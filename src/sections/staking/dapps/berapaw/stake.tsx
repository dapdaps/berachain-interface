import clsx from 'clsx';
import {
  ABI,
  ABI as BERAPAW_ABI,
  LPStakingWBERALBGTPoolAddress,
  LPStakingWBERALBGTVaultAddress,
  useBerapaw
} from '@/sections/staking/hooks/use-berapaw';
import { DEFAULT_CHAIN_ID } from '@/configs';
import SwitchTabs from '@/components/switch-tabs';
import LazyImage from '@/components/layz-image';
import { numberFormatter } from '@/utils/number-formatter';
import React, { useMemo, useState } from 'react';
import { bera } from '@/configs/tokens/bera';
import { Contract, ethers } from 'ethers';
import { ERC20_ABI, ICHI_ABI } from '@/sections/staking/Datas/AquaBera';
import Big from 'big.js';
import { useRequest } from 'ahooks';
import useCustomAccount from '@/hooks/use-account';
import Loading from '@/components/loading';
import InputNumber from '@/components/input-number';
import Button from '@/sections/staking/Bridge/Button';
import onAction from '@/sections/vaults/dapps/berapaw/action';
import useToast from '@/hooks/use-toast';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import NormalCard from '@/components/card';
import onClaim from '@/sections/vaults/dapps/berapaw/claim';
import Skeleton from 'react-loading-skeleton';
import BerapawModal from '../../Bridge/Modal/berapaw/modal';

const Stake = (props: any) => {
  const { className, dapp } = props;

  const dexConfig = {
    ...dapp?.chains[DEFAULT_CHAIN_ID],
    ...dapp,
  };

  const {
    dataList,
    loading,
    getDataList,
    handleAction: berapawHandleAction,
    approving: berapawApproving,
    stakeModalVisible,
    stakeModalData,
    onStakeModalClose,
    handleApprove: onBerapawApprove,
    handleStake: onBerapawStake,
    staking: berapawStaking,
  } = useBerapaw({ ...dapp, ...dexConfig });
  const { account, provider } = useCustomAccount();
  const toast = useToast();

  const signer = useMemo(() => {
    return provider?.getSigner(account);
  }, [provider, account]);

  const [currentTab, setCurrentTab] = useState<any>(["deposit", "deposit"]);
  const [amount, setAmount] = useState<any>(["", ""]);

  const { runAsync: handleClaim, loading: claiming } = useRequest(async (data: any, token?: any) => {
    let toastId = toast?.loading({
      title: `Claiming...`,
    });
    try {
      const tx = await onClaim({
        signer: signer,
        account,
        currentRecord: {
          vaultAddress: data.vault_address,
        },
        token,
      });
      toast?.dismiss(toastId);
      if (!tx) {
        const msg = "Claim failed!";
        toast.fail({ title: msg });
        return { success: false, msg };
      }
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Claim successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        getDataList?.();
        return { success: true };
      }
      toast.fail({ title: "Claim failed!" });
    } catch (err: any) {
      toast?.dismiss(toastId);
      const msg = err?.message?.includes("user rejected transaction")
        ? "User rejected transaction"
        : err?.message ?? "";
      toast?.fail({
        title: "Claim failed!",
        text: msg,
      });
      return { success: true, msg };
    }
  }, { manual: true });

  return (
    <div className={clsx("w-full flex justify-between items-stretch gap-[26px] min-h-[500px] md:flex-col md:min-h-[unset]", className)}>
      {
        (loading && !dataList?.length) ? [0, 1].map((idx) => (
          <Card key={idx}>
            <div className="flex justify-between items-center">
              <Skeleton width={165} height={30} borderRadius={8} />
              <Skeleton width={50} height={20} borderRadius={8} />
            </div>
            <Skeleton width="100%" height={48} borderRadius={8} className="mt-[10px]" />
            <div className="mt-[20px] grid grid-cols-3 gap-[10px]">
              <Skeleton width="100%" height={45} borderRadius={8} />
              <Skeleton width="100%" height={45} borderRadius={8} />
              <Skeleton width="100%" height={45} borderRadius={8} />
            </div>
            <div className="mt-[20px]">
              <Skeleton width={110} height={15} borderRadius={8} />
              <Skeleton width="100%" height={54} borderRadius={8} className="mt-[10px]" />
            </div>
            <Skeleton width="100%" height={60} borderRadius={8} className="mt-[20px]" />
          </Card>
        )) : dataList?.map((data: any, index: number) => {
          const isLBGTVault = data.pool_address === bera["lbgt"].address;
          const isWBERALBGTVault = data.pool_address === LPStakingWBERALBGTPoolAddress;

          return (
            <Card
              key={index}
              data={data}
              currentTab={currentTab[index]}
              onTab={(_currentTab: any) => {
                setCurrentTab((prev: any) => {
                  prev[index] = _currentTab;
                  return [...prev];
                });
                setAmount((prev: any) => {
                  prev[index] = "";
                  return [...prev];
                });
              }}
            >
              <div className="flex justify-between items-center gap-[10px] text-black font-Montserrat text-[16px] font-[400] leading-[120%]">
                <div className="flex items-center gap-[8px]">
                  <div className="flex items-center">
                    {
                      data.underlying_tokens.map((token: any, idx: number) => (
                        <LazyImage
                          key={idx}
                          src={token.icon}
                          width={30}
                          height={30}
                          containerClassName={clsx("shrink-0 rounded-full overflow-hidden", idx > 0 && "ml-[-15px]")}
                          fallbackSrc="/assets/tokens/default_icon.png"
                        />
                      ))
                    }
                  </div>
                  <div className="">
                    {data.underlying_tokens.map((token: any, index: number) => token.symbol).join("-")}
                  </div>
                </div>
                <div className="">
                  {numberFormatter(data.user_stake?.usd, 2, true, { prefix: "$", isShort: true, isShortUppercase: true, round: 0 })}
                </div>
              </div>
              <div className="mt-[10px]">
                {data.description}
              </div>
              <div className="mt-[20px] grid grid-cols-3 gap-[10px]">
                <LabelAndValue label="TVL">
                  {numberFormatter(data.tvl, 2, true, { prefix: "$", isShort: true, isShortUppercase: true })}
                </LabelAndValue>
                {
                  isLBGTVault && (
                    <LabelAndValue label="APY">
                      {numberFormatter(data.apy, 2, true, { isShort: true, isShortUppercase: true })}%
                    </LabelAndValue>
                  )
                }
                <LabelAndValue label="APR">
                  {numberFormatter(data.apr, 2, true, { isShort: true, isShortUppercase: true })}%
                </LabelAndValue>
              </div>
              <div className="mt-[20px]">
                <Form
                  data={data}
                  isLBGTVault={isLBGTVault}
                  isWBERALBGTVault={isWBERALBGTVault}
                  account={account}
                  provider={provider}
                  signer={signer}
                  currentTab={currentTab[index]}
                  amount={amount[index]}
                  onAmountChange={(value: any) => {
                    setAmount((prev: any) => {
                      prev[index] = value;
                      return [...prev];
                    });
                  }}
                  onSuccess={() => {
                    setAmount((prev: any) => {
                      prev[index] = "";
                      return [...prev];
                    });
                    getDataList();
                  }}
                  berapawHandleAction={berapawHandleAction}
                >
                  {
                    isLBGTVault && (
                      <div className="flex flex-col items-stretch gap-[5px] mt-[20px]">
                        <LabelAndValue
                          label={(
                            <div className="flex items-center gap-[4px]">
                              <div className="">Performance Fee</div>
                              <Popover
                                content={(
                                  <NormalCard className="w-[250px] !p-[5px_10px] !rounded-[8px] !text-[14px]">
                                    Performance fees are sent to BeraPaw treasury to be used as revenue share to PAW stakers and protocol growth.
                                  </NormalCard>
                                )}
                                trigger={PopoverTrigger.Hover}
                                placement={PopoverPlacement.TopLeft}
                                closeDelayDuration={0}
                                contentClassName="shrink-0"
                              >
                                <img src="/images/activity/christmas/icon-prompt.svg" className="w-[14px] h-[14px] object-contain object-center" />
                              </Popover>
                            </div>
                          )}
                          className="flex items-center justify-between"
                        >
                          {numberFormatter(6.9, 2, true, { isShort: true, isShortUppercase: true })}%
                        </LabelAndValue>
                        <LabelAndValue
                          label={(
                            <div className="flex items-center gap-[4px]">
                              <div className="">Withdrawal Fee</div>
                              <Popover
                                content={(
                                  <NormalCard className="w-[250px] !p-[5px_10px] !rounded-[8px] !text-[14px]">
                                    Withdrawal fee stays on the vault and is compounded into stakers position.
                                  </NormalCard>
                                )}
                                trigger={PopoverTrigger.Hover}
                                placement={PopoverPlacement.TopLeft}
                                closeDelayDuration={0}
                                contentClassName="shrink-0"
                              >
                                <img src="/images/activity/christmas/icon-prompt.svg" className="w-[14px] h-[14px] object-contain object-center" />
                              </Popover>
                            </div>
                          )}
                          className="flex items-center justify-between"
                        >
                          {numberFormatter(0.5, 2, true, { isShort: true, isShortUppercase: true })}%
                        </LabelAndValue>
                      </div>
                    )
                  }
                  {
                    isWBERALBGTVault && (
                      <div className="mt-[20px]">
                        <div className="font-[500] text-start flex items-center justify-between">
                          <div className="text-[#3D405A]">Earned</div>
                          <button
                            type="button"
                            className="underline underline-offset-2 disabled:!cursor-not-allowed disabled:opacity-30"
                            disabled={claiming}
                            onClick={() => {
                              handleClaim(data, "all");
                            }}
                          >
                            Claim All
                          </button>
                        </div>
                        <div className="flex flex-col items-stretch gap-[8px] mt-[20px] border border-[rgba(55,58,83,0.3)] rounded-[8px] p-[10px] text-[14px]">
                          {
                            data.user_reward?.map((token: any, idx: number) => (
                              <LabelAndValue
                                key={idx}
                                label={(
                                  <div className="flex items-center gap-[4px]">
                                    <LazyImage
                                      key={idx}
                                      src={token.icon}
                                      width={22}
                                      height={22}
                                      containerClassName={clsx("shrink-0 rounded-full overflow-hidden")}
                                      fallbackSrc="/assets/tokens/default_icon.png"
                                    />
                                    <div className="">{token.symbol}</div>
                                  </div>
                                )}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center justify-end gap-[10px]">
                                  <div className="flex items-center justify-end gap-[4px]">
                                    <div className="">
                                      {numberFormatter(token.amount, 2, true, { isShort: true, isShortUppercase: true })}
                                    </div>
                                    <div className="font-[400]">
                                      ({numberFormatter(token.usd, 2, true, { prefix: "$", isShort: true, isShortUppercase: true })})
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="disabled:!cursor-not-allowed disabled:opacity-30 h-[30px] shrink-0 rounded-[8px] border border-black bg-[#FFDC50] text-black text-center font-Montserrat text-[14px] font-[500] px-[15px]"
                                    onClick={() => {
                                      handleClaim(data, token.symbol);
                                    }}
                                    disabled={claiming}
                                  >
                                    Claim
                                  </button>
                                </div>
                              </LabelAndValue>
                            ))
                          }
                        </div>
                      </div>
                    )
                  }
                </Form>
              </div>
            </Card>
          );
        })
      }
      <BerapawModal
        defaultTab="zap"
        show={stakeModalVisible}
        data={stakeModalData}
        onClose={onStakeModalClose}
        onSuccess={() => {
          onStakeModalClose();
          getDataList();
        }}
        onApprove={onBerapawApprove}
        approving={berapawApproving}
        onStake={onBerapawStake}
        staking={berapawStaking}
        dexConfig={dexConfig}
      />
    </div>
  );
};

export default Stake;

const TABS = [
  {
    value: "deposit",
    label: "Stake",
    disabled: false,
  },
  {
    value: "withdraw",
    label: "Unstake",
    disabled: false,
  },
];

const Card = (props: any) => {
  const {
    className,
    children,
    currentTab,
    onTab,
  } = props;

  return (
    <div className={clsx("flex-1 bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[10px_20px]", className)}>
      <SwitchTabs
        tabs={TABS}
        current={currentTab}
        onChange={onTab}
      />
      <div className="w-full mt-[20px]">
        {children}
      </div>
    </div>
  );
};

const LabelAndValue = (props: any) => {
  const { className, label, children, labelClassName, valueClassName } = props;

  return (
    <div className={clsx("text-[#3D405A] font-Montserrat text-[14px] md:text-[12px] font-medium leading-normal", className)}>
      <div className={clsx('', labelClassName)}>
        {label}
      </div>
      <div className={clsx("text-black text-[16px] font-[600] md:text-[12px] flex items-center gap-[4px]", valueClassName)}>
        {children}
      </div>
    </div>
  );
};

const Form = (props: any) => {
  const {
    className,
    data,
    isLBGTVault,
    isWBERALBGTVault,
    currentTab,
    account,
    amount,
    signer,
    provider,
    onAmountChange,
    children,
    onSuccess,
    berapawHandleAction,
  } = props;

  const toast = useToast();

  const currentTabItem = TABS.find((tab: any) => tab.value === currentTab);

  const { data: balance, loading: balanceLoading, runAsync: getBalance } = useRequest(async () => {
    if (currentTab === "deposit") {
      const contract = new ethers.Contract(
        data.pool_address,
        ERC20_ABI,
        provider
      );
      const response = await contract.balanceOf(account);
      return ethers.utils.formatUnits(response);
    }

    if (isLBGTVault) {
      try {
        const stLBGTContract = new ethers.Contract(bera["stlbgt"].address, BERAPAW_ABI, provider);
        const stLBGTBalance = await stLBGTContract.balanceOf(account);
        const stLBGTPreviewRedeem = await stLBGTContract.previewRedeem(stLBGTBalance);
        return ethers.utils.formatUnits(stLBGTPreviewRedeem || "0", bera["stlbgt"].decimals);
      } catch (err: any) {
        console.log("get %s balance failed: %o", data.pool_address, err);
      }
      return "0";
    }
    if (isWBERALBGTVault) {
      try {
        const lpContract = new ethers.Contract(LPStakingWBERALBGTVaultAddress, BERAPAW_ABI, provider);
        const lpBalance = await lpContract.balanceOf(account);
        const LPStakingPoolContract = new Contract(LPStakingWBERALBGTPoolAddress, ABI, provider);
        const LPDecimals = await LPStakingPoolContract.callStatic.decimals();
        return ethers.utils.formatUnits(lpBalance || "0", LPDecimals);
      } catch (err: any) {
        console.log("get %s balance failed: %o", data.pool_address, err);
      }
      return "0";
    }
    return "0";
  }, {
    refreshDeps: [account, provider, data.pool_address, isLBGTVault, isWBERALBGTVault, currentTab],
  });

  const { runAsync: handleAction, loading: pending } = useRequest(async () => {
    const actionType = currentTab === "deposit" ? "Deposit" : "Withdraw";
    let toastId = toast?.loading({
      title: `${actionType}ing...`,
    });
    try {
      const beraPawTx = await onAction({
        actionType: actionType,
        signer: signer,
        account,
        amount: Big(amount || 0)
          .mul(10 ** data.decimals)
          .toFixed(0),
        currentRecord: {
          vaultAddress: data.vault_address,
        },
        dappParams: {},
      });
      toast?.dismiss(toastId);
      if (!beraPawTx) {
        const msg = actionType + " failed!";
        toast.fail({ title: msg });
        return { success: false, msg };
      }
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await beraPawTx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: actionType + " successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess?.();
        getBalance();
        return { success: true };
      }
      toast.fail({ title: actionType + " failed!" });
    } catch (err: any) {
      toast?.dismiss(toastId);
      const msg = err?.message?.includes("user rejected transaction")
        ? "User rejected transaction"
        : err?.message ?? "";
      toast?.fail({
        title: actionType + " failed!",
        text: msg,
      });
      return { success: true, msg };
    }
  }, { manual: true });

  return (
    <div className={clsx("text-black text-right font-Montserrat text-[16px] font-semibold leading-[90%]", className)}>
      <div className="flex items-center gap-[4px] text-[14px]">
        <div className="font-[400]">Available:</div>
        <div
          className="font-[500] underline underline-offset-2 cursor-pointer"
          onClick={() => onAmountChange(balance)}
        >
          {
            balanceLoading ? (
              <Loading size={14} />
            ) : numberFormatter(balance, 2, true, { isShort: true, isShortUppercase: true })
          }
        </div>
      </div>
      <div className="w-full rounded-[12px] border border-[#373A53] bg-white mt-[10px] flex items-center justify-between gap-[10px] p-[15px_15px_11px_17px]">
        <InputNumber
          className="flex-1 w-0 text-[20px]"
          value={amount}
          onNumberChange={onAmountChange}
          placeholder="0"
        />
        <div className="flex items-center gap-[4px] justify-end shrink-0">
          <div className="flex items-center">
            {
              data.underlying_tokens.map((token: any, idx: number) => (
                <LazyImage
                  key={idx}
                  src={token.icon}
                  width={26}
                  height={26}
                  containerClassName={clsx("shrink-0 rounded-full overflow-hidden", idx > 0 && "ml-[-10px]")}
                  fallbackSrc="/assets/tokens/default_icon.png"
                />
              ))
            }
          </div>
          <div className="">
            {data.underlying_tokens.map((token: any, index: number) => token.symbol).join("-")}
          </div>
        </div>
      </div>
      <div className={clsx("mt-[20px] w-full flex items-center gap-[10px] justify-between", pending && "opacity-[0.5] !cursor-not-allowed")}>
        {/*@ts-ignore*/}
        <Button
          className="flex-1"
          type={currentTab}
          symbol={data.symbol}
          amount={amount}
          decimals={data.decimals || 18}
          balance={balance ?? ""}
          address={data.pool_address}
          vaultAddress={data.vault_address}
          onDepositOrWithdraw={handleAction}
        >
          {pending ? (<Loading size={16} />) : currentTabItem?.label ?? ""}
        </Button>
        <button
          type="button"
          className="shrink-0 px-[25px] flex items-center justify-center h-[60px] rounded-[10px] border border-black bg-[#FFDC50]  text-black font-Montserrat text-[18px] font-semibold leading-[90%]"
          onClick={() => {
            berapawHandleAction(data, "approve");
          }}
        >
          Zap
        </button>
      </div>
      <div className="mt-[10px]">
        {children}
      </div>
    </div>
  );
};
