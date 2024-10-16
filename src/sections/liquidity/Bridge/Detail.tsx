// @ts-nocheck
import { useMultiState } from '@/hooks/use-multi-state';
import useToast from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import clsx from 'clsx';
import { ethers } from 'ethers';
import { memo, useEffect, useState } from 'react';
import CircleLoading from '@/components/circle-loading';
export default memo(function Detail(props: any) {
  const { data, sender, provider, defaultIndex = 0, addresses, onBack } = props;
  const router = useRouter()
  const toast = useToast();
  const tabs = ['Stake', 'Unstake'];

  const [tIndex, setTIndex] = useState(defaultIndex);
  const [state, updateState] = useMultiState({
    // isDeposit: tab === "Stake" || !tab,
    balances: [],
    lpBalance: '',
    inAmount: '',
    // lpAmount: '',
    isLoading: false,
    isTokenApproved: true,
    isTokenApproving: false,
    updater: 0
  });
  const sourceBalances: any = {};

  const {
    // isDeposit,
    balances,
    inAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
    lpBalance,
    lpAmount,
    updater
  } = state;

  const { decimals, id, LP_ADDRESS } = data;
  const symbol = id;
  const vaultAddress = addresses[symbol];

  const isInSufficient = Number(inAmount) > Number(balances[symbol]);
  const isWithdrawInsufficient = Number(lpAmount) > Number(lpBalance);
  const balanceLp =
    !lpAmount || !lpBalance
      ? '-'
      : parseFloat(
        Big(lpAmount)
          .div(Big(lpBalance).gt(0) ? lpBalance : 1)
          .toFixed(4)
      );
  const updateLPBalance = () => {
    const abi = ['function balanceOf(address) view returns (uint256)'];
    const contract = new ethers.Contract(
      vaultAddress,
      abi,
      provider?.getSigner()
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
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider?.getSigner());
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
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider?.getSigner());
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
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider?.getSigner());

    contract
      .approve(vaultAddress, wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const payload = { isTokenApproved: true, isTokenApproving: false };
        updateState({ ...payload, isLoading: false, loadingMsg: '' });
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Approve Successfully!',
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
      provider?.getSigner()
    );
    contract
      .stake(wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;
        // addAction?.({
        //   type: 'Liquidity',
        //   action: 'Deposit',
        //   token0,
        //   token1,
        //   amount: inAmount,
        //   template: defaultDex,
        //   status: status,
        //   add: 1,
        //   transactionHash,
        //   chain_id: props.chainId
        // });
        updateState({
          isLoading: false,
          isPostTx: true
        });
        setTimeout(() => {
          onSuccess?.()
        }, 3000)

        toast?.dismiss(toastId);
        toast?.success({
          title: 'Stake Successfully!'
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
      provider?.getSigner()
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

        // addAction?.({
        //   type: 'Liquidity',
        //   action: 'Withdraw',
        //   token0,
        //   token1,
        //   amount: lpAmount,
        //   template: defaultDex,
        //   status: status,
        //   add: 0,
        //   transactionHash,
        //   chain_id: props.chainId
        // });
        setTimeout(() => {
          onSuccess?.()
        }, 3000)

        toast?.dismiss(toastId);
        toast?.success({
          title: 'Unstake Successfully!'
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
  const handleClaim = function () {

    const toastId = toast?.loading({
      title: `Claim...`
    });

    const abi = [{
      "constant": false,
      "inputs": [],
      "name": "getReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }]
    const contract = new ethers.Contract(data?.vaultAddress, abi, provider.getSigner())
    contract
      .getReward()
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Claim Successfully!'
        });
        setTimeout(() => {
          onSuccess?.()
        }, 3000)
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Claim Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  }
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
    })
    tIndex === 0 ? handleTokenChange("") : handleLPChange("")
  }

  useEffect(() => {
    if (!sender || !vaultAddress) return;
    updateBalance();
    updateLPBalance();
  }, [sender, vaultAddress, updater]);
  return (
    <div>
      <div className='relative mb-[24px] pt-[16px] pl-[73px] h-[146px] rounded-[10px] bg-[#FFDC50]'>
        <div className='absolute top-[24px] left-[19px]' onClick={onBack}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='34'
            height='34'
            viewBox='0 0 34 34'
            fill='none'
          >
            <rect
              x='0.5'
              y='0.5'
              width='33'
              height='33'
              rx='10.5'
              fill='white'
              stroke='#373A53'
            />
            <path
              d='M20 11L15.2 17L20 23'
              stroke='black'
              strokeWidth='3'
              strokeLinecap='round'
            />
          </svg>
        </div>
        <div className='mb-[17px] flex items-center gap-[14px]'>
          <div className='flex items-center'>
            <div className='w-[48px] h-[48px] rounded-full'>
              <img src={data?.images[0]} />
            </div>
            <div className='ml-[-16px] w-[48px] h-[48px] rounded-full'>
              <img src={data?.images[1]} style={{ objectPosition: 'left' }} />
            </div>
          </div>
          <div className='text-black font-Montserrat text-[26px] font-semibold leading-[100%]'>
            {data?.initialData?.pool?.name}
          </div>
        </div>
        <div className='flex items-center'>
          <div className='flex flex-col gap-[12px] w-[130px]'>
            <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
              TVL
            </div>
            <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
              {formatValueDecimal(data?.tvl, '$', 2, true)}
            </div>
          </div>
          <div className='flex flex-col gap-[12px] w-[130px]'>
            <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
              APY up to
            </div>
            <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
              {Big(data?.apy ?? 0).toFixed(2)}%
            </div>
          </div>
          <div className='flex flex-col gap-[12px] w-[130px]'>
            <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
              Protocol
            </div>
            <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
              {data?.initialData?.pool?.protocol}
            </div>
          </div>
          <div className='flex flex-col gap-[12px] w-[130px]'>
            <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
              Type
            </div>
            <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
              {data?.protocolType}
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-[30px]'>
        <div className='flex-1 pr-[24px] pl-[13px] h-[300px] bg-black/[0.06]'>
          <div className='pt-[21px] pr-[2px] pb-[46px] pl-[17px]'>
            <div className='mb-[21px] text-black font-Montserrat text-[18px] font-bold leading-[90%]'>
              Your Position
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-[10px]'>
                <div className='flex items-center'>
                  <div className='w-[30px] h-[30px] rounded-full'>
                    <img src={data?.images[0]} />
                  </div>
                  <div className='ml-[-10px] w-[30px] h-[30px] rounded-full'>
                    <img src={data?.images[1]} />
                  </div>
                </div>
                <div className='text-black font-Montserrat text-[16px] font-semibold leading-[100%]'>
                  {data?.initialData?.pool?.name}
                </div>
              </div>

              <div
                className='flex items-center justify-center w-[148px] h-[46px] rounded-[10px] border border-black bg-[#FFDC50]'
                onClick={() => {
                  router.push("/dex/bex?lp=" + LP_ADDRESS)
                }}
              >
                <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                  Mint LP
                </span>
              </div>
            </div>
          </div>
          <div className='w-full h-[1px] bg-black/[0.15]' />
          <div className='pt-[19px] pl-[17px]'>
            <div className='mb-[27px] text-black font-Montserrat text-[18px] font-bold leading-[90%]'>
              Rewards
            </div>
            <div className='flex items-center justify-between'>

              <div className='flex items-center gap-[14px]'>
                <div className='w-[32px] h-[32px] rounded-full'>
                  <img src={`/images/dapps/infrared/${data?.rewardSymbol.toLocaleLowerCase()}.svg`} />
                </div>
                <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
                  {
                    formatValueDecimal(
                      data?.earned,
                      '',
                      2
                    )
                  } {data?.rewardSymbol}
                </div>
              </div>
              {
                Big(data?.earned ?? 0).gt(0) && (
                  <div className='flex items-center justify-center w-[148px] h-[46px] rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[18px] font-semibold leading-[90%]' onClick={handleClaim}>
                    Claim
                  </div>
                )
              }
            </div>
          </div>
        </div>

        <div className='flex-1 pt-[24px] pb-[20px] px-[20px] h-[300px]'>
          <div className='mb-[17px] flex items-center h-[56px] rounded-[12px] border border-[#373A53] bg-white p-[5px]'>
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={clsx([
                  'flex items-center justify-center border border-transparent rounded-[10px] flex-1',
                  tIndex === index ? 'h-full  !border-black bg-[#FFDC50]' : ''
                ])}
                onClick={() => {
                  setTIndex(index);
                }}
              >
                <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                  {tab}
                </span>
              </div>
            ))}
          </div>

          {tIndex === 0 ? (
            <div>
              <input
                value={inAmount}
                type='number'
                onChange={(e) => handleTokenChange(e.target.value, id)}
                className='w-full h-[72px] pl-[20px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]'
                placeholder='0'
              />
              <div className='flex justify-between px-[10px] pt-[12px] pb-[24px]'>
                <span className='text-[#3D405A] font-Montserrat text-[12px] font-medium'>
                  {inAmount
                    ? '$' +
                    Big(inAmount)
                      .times(data?.initialData?.stake_token?.price ?? 0)
                      .toFixed(2)
                    : '-'}
                </span>
                <div
                  className='text-[#3D405A] font-Montserrat text-[12px] font-medium'
                  onClick={handleMax}
                >
                  balance: <span>{Big(balances[symbol] ?? 0).toFixed(6)}</span>
                </div>
              </div>
              {isInSufficient && (
                <button className='h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black opacity-50'>
                  <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                    InSufficient Balance
                  </span>
                </button>
              )}
              {!isInSufficient &&
                (isTokenApproved && !isTokenApproving ? (
                  <button
                    disabled={isLoading || !inAmount}
                    className={clsx(
                      'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
                      {
                        'opacity-50': isLoading || !inAmount
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
                        {isTokenApproved ? 'Approved' : 'Approve'} {symbol}
                      </>
                    )}
                  </button>
                ))}
            </div>
          ) : (
            <div>
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
                className='w-full h-[72px] pl-[20px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]'
                placeholder='0'
              />
              <div className='flex justify-between px-[10px] pt-[12px] pb-[24px]'>
                <span className='text-[#3D405A] font-Montserrat text-[12px] font-medium'>
                  {lpAmount
                    ? '$' +
                    Big(lpAmount)
                      .times(data?.initialData?.stake_token?.price ?? 0)
                      .toFixed(2)
                    : '-'}
                </span>
                <div
                  className='text-[#3D405A] font-Montserrat text-[12px] font-medium'
                  onClick={() => {
                    const newSliderPercent = Big(lpBalance || 0)
                      .div(Big(lpBalance).gt(0) ? lpBalance : 1)
                      .times(100)
                      .toFixed(0);

                    onUpdateLpPercent(Number(newSliderPercent));

                    handleLPChange(lpBalance);
                  }}
                >
                  balance: <span>{lpBalance}</span>
                </div>
              </div>
              <button
                disabled={
                  isWithdrawInsufficient || isLoading || Number(lpAmount) <= 0
                }
                className={clsx(
                  'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
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
        </div>
      </div>
    </div>
  );
});
