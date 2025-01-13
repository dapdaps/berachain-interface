// @ts-nocheck
import CircleLoading from '@/components/circle-loading';
import Modal from '@/components/modal';
import SwitchTabs from '@/components/switch-tabs';
import { DEFAULT_CHAIN_ID } from '@/configs';
import useCustomAccount from '@/hooks/use-account';
import useAddAction from '@/hooks/use-add-action';
import useLpToAmount from '@/hooks/use-lp-to-amount';
import { useMultiState } from '@/hooks/use-multi-state';
import useToast from '@/hooks/use-toast';
import Capsule from '@/sections/marketplace/components/dapps/capsule';
import { MarketplaceContext } from '@/sections/marketplace/context';
import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import clsx from 'clsx';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { memo, useContext, useEffect, useState } from 'react';

const TABS = [
  {
    value: 'Deposit',
    label: 'Deposit',
    disabled: false
  },
  {
    value: 'Withdraw',
    label: 'Withdraw',
    disabled: false
  }
];
export default memo(function Bex(props) {
  const {
    data,
    type,
    config,
    visible,
    setVisible
  } = props
  const router = useRouter();
  // const {
  //   vaultsVisible,
  //   setVaultsVisible,
  //   vaultsData = {}
  // } = useContext(MarketplaceContext);

  const toast = useToast();
  const { addAction } = useAddAction('invest');
  const { account: sender, provider } = useCustomAccount();
  // const { data, config } = vaultsData;

  const dexConfig = config?.chains[DEFAULT_CHAIN_ID];
  const { tokens, decimals, id, LP_ADDRESS } = data ?? {};
  const { addresses } = dexConfig ?? {};

  const symbol = id;

  const vaultAddress = addresses ? addresses[symbol] : '';

  const [currentTab, setCurrentTab] = useState(type === 0 ? "Deposit" : "Withdraw");
  const [state, updateState] = useMultiState({
    balances: [],
    lpBalance: '',
    inAmount: '',
    outAmount: '',
    lpAmount: '',
    isLoading: false,
    isTokenApproved: true,
    isTokenApproving: false,
    updater: 0
  });

  const sourceBalances: any = {};
  const {
    balances,
    inAmount,
    outAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
    lpBalance,
    lpAmount,
    updater
  } = state;

  const isInSufficient = Number(inAmount) > Number(balances[symbol]);
  const isWithdrawInsufficient = Number(lpAmount) > Number(lpBalance);

  const {
    handleGetAmount
  } = useLpToAmount(data?.LP_ADDRESS)
  const handleClose = () => {
    setVisible(false)
  };

  const updateLPBalance = () => {
    const abi = ['function balanceOf(address) view returns (uint256)'];
    const contract = new ethers.Contract(
      vaultAddress,
      abi,
      provider.getSigner()
    );
    contract.balanceOf(sender).then((balanceBig) => {
      const adjustedBalance = ethers.utils.formatUnits(balanceBig, 18);
      updateState({
        lpBalance: adjustedBalance
      });
    });
  };
  const updateBalance = () => {
    const abi = ['function balanceOf(address) view returns (uint256)'];
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider.getSigner());
    contract
      .balanceOf(sender)
      .then((balanceBig) => {
        const adjustedBalance = Big(
          ethers.utils.formatUnits(balanceBig)
        ).toFixed();
        sourceBalances[symbol] = adjustedBalance;
        updateState({
          balances: sourceBalances
        });
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        setTimeout(() => {
          updateBalance(token);
        }, 1500);
      });
  };

  const checkApproval = (amount) => {
    const wei: any = ethers.utils.parseUnits(
      Big(amount).toFixed(decimals),
      decimals
    );
    const abi = [
      'function allowance(address, address) external view returns (uint256)'
    ];
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider.getSigner());
    updateState({
      isTokenApproved: false
    });
    contract
      .allowance(sender, vaultAddress)
      .then((allowance: any) => {
        const approved = !new Big(allowance.toString()).lt(wei);
        updateState({
          isTokenApproved: approved
        });
      })
      .catch((e: Error) => console.log(e));
  };

  const handleMax = () => {
    handleTokenChange(balances[symbol]);
  };
  const handleTokenChange = (amount) => {
    updateState({ inAmount: amount });
    if (amount === '') {
      updateState({
        inAmount: '',
        isTokenApproved: true
      });
      return;
    }
    checkApproval(amount);
  };
  const handleLPChange = (amount: string) => {
    updateState({
      lpAmount: amount
    });
  };

  const handleApprove = () => {
    const payload = { isTokenApproving: true };
    const amount = Big(inAmount).toFixed(decimals);
    const toastId = toast?.loading({
      title: `Approve ${symbol}`
    });
    updateState({
      ...payload,
      isLoading: true,
      loadingMsg: `Approving ${symbol}...`
    });
    const wei = ethers.utils.parseUnits(amount, decimals);
    const abi = ['function approve(address, uint) public'];
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider.getSigner());

    contract
      .approve(vaultAddress, wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const payload = { isTokenApproved: true, isTokenApproving: false };
        updateState({ ...payload, isLoading: false, loadingMsg: '' });
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Approve Successful!',
          tx: receipt.transactionHash,
          chainId: props.chainId
        });
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        updateState({
          isError: true,
          isLoading: false,
          loadingMsg: error?.message,
          isTokenApproving: false
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Approve Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : null
        });
      });
  };

  const handleDeposit = () => {
    const toastId = toast?.loading({
      title: `Staking...`
    });
    updateState({
      toastId,
      isLoading: true,
      isError: false,
      loadingMsg: 'Staking...'
    });
    const wei = ethers.utils.parseUnits(
      Big(inAmount).toFixed(decimals),
      decimals
    );
    const abi = [
      {
        constant: false,
        inputs: [
          {
            name: 'amount',
            type: 'uint256'
          }
        ],
        name: 'stake',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];
    const contract = new ethers.Contract(
      vaultAddress,
      abi,
      provider.getSigner()
    );
    contract
      .stake(wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;
        const [amount0, amount1] = handleGetAmount(inAmount)
        addAction?.({
          type: 'Staking',
          action: 'Staking',
          token: {
            symbol: tokens.join('-')
          },
          amount: inAmount,
          template: "Infrared",
          status: status,
          add: 1,
          transactionHash,
          chain_id: props.chainId,
          sub_type: "Stake",
          extra_data: JSON.stringify({
            token0Symbol: tokens[0],
            token1Symbol: tokens[1],
            amount0,
            amount1
          })
        });
        updateState({
          isLoading: false,
          isPostTx: true
        });

        setTimeout(() => {
          onSuccess?.();
        }, 3000);

        toast?.dismiss(toastId);
        toast?.success({
          title: 'Stake Successful!'
        });
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        updateState({
          isError: true,
          isLoading: false,
          loadingMsg: error?.message
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Stake Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : error?.message ?? ''
        });
      });
  };
  const handleWithdraw = () => {
    const toastId = toast?.loading({
      title: `Unstaking...`
    });
    updateState({
      isLoading: true,
      isError: false,
      loadingMsg: 'Unstaking...'
    });

    const lpWeiAmount = ethers.utils.parseUnits(Big(lpAmount).toFixed(18), 18);
    const abi = [
      {
        constant: false,
        inputs: [
          {
            name: '_shareAmt',
            type: 'uint256'
          }
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];

    const contract = new ethers.Contract(
      vaultAddress,
      abi,
      provider.getSigner()
    );
    contract
      .withdraw(lpWeiAmount)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        updateState({
          isLoading: false,
          isPostTx: true
        });
        const { status, transactionHash } = receipt;
        const [amount0, amount1] = handleGetAmount(lpAmount)
        addAction?.({
          type: 'Staking',
          action: 'UnStake',
          token: {
            symbol: tokens.join('-')
          },
          symbol: tokens.join("-"),
          amount: lpAmount,
          template: "Infrared",
          status: status,
          add: 0,
          transactionHash,
          chain_id: props.chainId,
          sub_type: "Unstake",
          extra_data: JSON.stringify({
            token0Symbol: tokens[0],
            token1Symbol: tokens[1],
            amount0,
            amount1
          })
        });

        setTimeout(() => {
          onSuccess?.();
        }, 3000);

        toast?.dismiss(toastId);
        toast?.success({
          title: 'Unstake Successful!'
        });
      })
      .catch((error: Error) => {
        updateState({
          isError: true,
          isLoading: false,
          loadingMsg: error?.message
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Unstake Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : error?.message ?? ''
        });
      });
  };
  const onUpdateLpPercent = (percent: number) => {
    updateState({
      lpPercent: percent
    });
  };
  const onSuccess = function () {
    updateState({
      updater: Date.now(),
      isTokenApproved: true,
      isTokenApproving: false
    });
    currentTab === 'Deposit' ? handleTokenChange('') : handleLPChange('');
  };
  useEffect(() => {
    if (!sender || !vaultAddress) return;
    updateBalance();
    updateLPBalance();
  }, [sender, vaultAddress, updater]);
  return (
    <Modal open={visible} onClose={handleClose}>
      <div className='px-[20px] pt-[24px] pb-[20px] lg:w-[520px] rounded-[20px] bg-[#FFFDEB] border border-[#000] shadow-shadow1 z-[51]'>
        <div className='flex items-center gap-[9px] text-black text-[20px] font-[700] leading-[90%]'>
          <span>{`Invest ${data?.tokens.join('-')}`}</span>
          <Capsule>Vaults</Capsule>
        </div>
        <div className='mt-[40px]'>
          <SwitchTabs
            tabs={TABS}
            current={currentTab}
            onChange={(current) => {
              setCurrentTab(current);
            }}
          />

          <div className='flex items-center mt-[34px] mb-[33px]'>
            <div className='flex-1 flex flex-col gap-[14px]'>
              <div className='text-black font-Montserrat text-[14px] font-medium'>
                APY
              </div>
              <div className='text-black font-Montserrat text-[20px] font-bold'>
                {Big(data?.apy ?? 0).toFixed(2)}%
              </div>
            </div>
            <div className='flex-1 flex flex-col gap-[14px]'>
              <div className='text-black font-Montserrat text-[14px] font-medium'>
                My Vault Deposits
              </div>
              <div className='flex items-center gap-[6px]'>
                <div className='flex items-center'>
                  <div className='w-[26px] h-[26px] rounded-full'>
                    <img src={data?.images[0]} />
                  </div>
                  {data?.images[1] && (
                    <div className='ml-[-10px] w-[26px] h-[26px] rounded-full'>
                      <img src={data?.images[1]} />
                    </div>
                  )}
                </div>
                <div className='text-black font-Montserrat text-[20px] font-bold'>
                  {formatValueDecimal(data?.depositAmount, '', 2, true, false)}
                </div>
                {/* <div className='text-black font-Montserrat text-[14px] font-medium'>
                  {data?.tokens?.join('-')}
                </div> */}
              </div>
            </div>

            <div className='flex-1 flex flex-col gap-[14px]'>
              <div className='text-black font-Montserrat text-[14px] font-medium'>
                Unclaimed Rewards
              </div>
              <div className='flex items-center gap-[6px]'>
                <div className='w-[26px] h-[26px] rounded-full'>
                  <img
                    src={`/images/dapps/infrared/${data?.rewardSymbol.toLocaleLowerCase()}.svg`}
                  />
                </div>
                <div className='text-black font-Montserrat text-[20px] font-bold'>
                  0
                </div>
              </div>
            </div>
          </div>

          {currentTab === 'Deposit' ? (
            <div>
              <div className='flex items-center justify-between'>
                <div className='text-black font-Montserrat text-[14px] font-medium'>
                  Deposit
                </div>
                <div
                  className='text-black font-Montserrat text-[14px] font-medium'
                  onClick={handleMax}
                >
                  Balance:{' '}
                  <span className='underline'>
                    {Big(balances[symbol] ?? 0).toFixed(6)}
                  </span>
                </div>
              </div>
              <div className='relative mt-[9px] mb-[19px]'>
                <input
                  value={inAmount}
                  type='number'
                  onChange={(e) => handleTokenChange(e.target.value, id)}
                  className='w-full h-[72px] pl-[20px] pr-[110px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]'
                  placeholder='0'
                />
                <div className='absolute right-[16px] top-1/2 translate-y-[-50%] flex items-center gap-[8px]'>
                  <div className='flex items-center'>
                    <div className='w-[30px] h-[30px] rounded-full'>
                      <img src={data?.images[0]} alt={data?.tokens[0]} />
                    </div>
                    {data?.images[1] && (
                      <div className='ml-[-10px] w-[30px] h-[30px] rounded-full'>
                        <img src={data?.images[1]} alt={data?.tokens[1]} />
                      </div>
                    )}
                  </div>
                  <div className='text-black font-Montserrat text-[16px] font-semibold leading-[100%]'>
                    {data?.tokens?.join('-')}
                  </div>
                </div>
              </div>
              {isInSufficient && (
                <button className='w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black opacity-50'>
                  <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                    InSufficient Balance
                  </span>
                </button>
              )}
              {!isInSufficient &&
                (isTokenApproved && !isTokenApproving ? (
                  <button
                    disabled={isLoading || Number(inAmount) <= 0}
                    className={clsx(
                      'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
                      {
                        'opacity-50': isLoading || Number(inAmount) <= 0
                      }
                    )}
                    onClick={handleDeposit}
                  >
                    <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                      {isLoading ? <CircleLoading size={14} /> : 'Stake'}
                    </span>
                  </button>
                ) : (
                  <button
                    disabled={isTokenApproved || isTokenApproving}
                    className={clsx(
                      'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
                      {
                        'opacity-50': isTokenApproved || isTokenApproving
                      }
                    )}
                    onClick={() => handleApprove(true)}
                  >
                    {isTokenApproving ? (
                      <CircleLoading size={14} />
                    ) : (
                      <>
                        {isTokenApproved ? 'Approved' : 'Approve'}{' '}
                        {data?.tokens.join('-')}
                      </>
                    )}
                  </button>
                ))}
            </div>
          ) : (
            <div>
              <div className='flex items-center justify-between'>
                <div className='text-black font-Montserrat text-[14px] font-medium'>
                  Withdraw
                </div>
                <div className='text-black font-Montserrat text-[14px] font-medium'>
                  Balance:{' '}
                  <span
                    className='underline'
                    onClick={() => {
                      const newSliderPercent = Big(lpBalance || 0)
                        .div(Big(lpBalance).gt(0) ? lpBalance : 1)
                        .times(100)
                        .toFixed(0);

                      onUpdateLpPercent(Number(newSliderPercent));

                      handleLPChange(lpBalance);
                    }}
                  >
                    {Big(lpBalance ? lpBalance : 0).toFixed(6)}
                  </span>
                </div>
              </div>
              <div className='relative mt-[9px] mb-[19px]'>
                <input
                  value={lpAmount}
                  type='number'
                  onChange={(e) => {
                    handleLPChange(e.target.value);

                    const value = e.target.value;

                    if (!value) {
                      onUpdateLpPercent(0);
                    }

                    if (value && Big(value).gt(0)) {
                      const newSliderPercent = Big(value || 0)
                        .div(Big(lpBalance).gt(0) ? lpBalance : 1)
                        .times(100)
                        .toFixed(0);
                      onUpdateLpPercent(Number(newSliderPercent));
                    }
                  }}
                  className='w-full h-[72px] pl-[20px] pr-[110px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]'
                  placeholder='0'
                />
                <div className='absolute right-[16px] top-1/2 translate-y-[-50%] flex items-center gap-[8px]'>
                  <div className='flex items-center'>
                    <div className='w-[30px] h-[30px] rounded-full'>
                      <img src={data?.images[0]} alt={data?.tokens[0]} />
                    </div>
                    {data?.images[1] && (
                      <div className='ml-[-10px] w-[30px] h-[30px] rounded-full'>
                        <img src={data?.images[1]} alt={data?.tokens[1]} />
                      </div>
                    )}
                  </div>
                  <div className='text-black font-Montserrat text-[16px] font-semibold leading-[100%]'>
                    {data?.tokens?.join('-')}
                  </div>
                </div>
              </div>
              <button
                disabled={
                  isWithdrawInsufficient || isLoading || Number(lpAmount) <= 0
                }
                className={clsx(
                  'w-full h-[60px] flex items-center font-semibold font-Montserrat justify-center rounded-[10px] bg-[#FFDC50] border border-black',
                  {
                    'opacity-50':
                      isWithdrawInsufficient ||
                      isLoading ||
                      Number(lpAmount) <= 0
                  }
                )}
                onClick={handleWithdraw}
              >
                {isLoading ? (
                  <CircleLoading size={14} />
                ) : (
                  <>
                    {isWithdrawInsufficient
                      ? 'InSufficient Balance'
                      : 'Withdraw'}
                  </>
                )}
              </button>
            </div>
          )}
          <div className='mt-[16px] text-[#979ABE] font-Montserrat text-[14px] text-center'>
            Manage exist assets on{' '}
            <span
              className='text-black font-Montserrat underline'
              onClick={() => {
                router.push('/staking/infrared');
              }}
            >
              Infrared
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
});
