// @ts-nocheck
import CircleLoading from '@/components/circle-loading';
import useAddAction from '@/hooks/use-add-action';
import useLpToAmount from '@/hooks/use-lp-to-amount';
import { useMultiState } from '@/hooks/use-multi-state';
import useToast from '@/hooks/use-toast';
import { useProvider } from '@/hooks/use-provider';
import useAccount from '@/hooks/use-account';
import { formatValueDecimal, balanceFormated } from '@/utils/balance';
import Big from 'big.js';
import clsx from 'clsx';
import { ethers } from 'ethers';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import config from '@/configs/staking/dapps/infrared';
import AddLiquidityModal from '@/sections/pools/add-liquidity-modal';
import { DEFAULT_CHAIN_ID } from '@/configs';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useIbgtVaults } from '@/stores/ibgt-vaults';
import DetailSummary from '@/sections/staking/Bridge/Detail/Summary';
import DetailBex from '@/sections/staking/Bridge/Detail/Bex';
import DetailBerps from '@/sections/staking/Bridge/Detail/Berps';
import { StakePrompt } from '@/sections/staking/Bridge/Detail/StakePrompt';

export default memo(function Detail(props: any) {
  const { name, loading } = props;
  const { addresses } = config.chains[DEFAULT_CHAIN_ID];
  const { provider } = useProvider();
  const { account: sender, chainId } = useAccount();
  const params = useSearchParams();
  const ibgtVaults = useIbgtVaults();
  const id = params.get('id');
  const defaultIndex = params.get('tab');
  const pathname = usePathname();
  const router = useRouter();
  const data = useMemo(() => {
    if (name === 'Berps') {
      return ibgtVaults.berpsVaults.find((item) => item.id === id);
    }
    return ibgtVaults.vaults.find((item) => item.id === id);
  }, [id, name, ibgtVaults]);

  const toast = useToast();
  const tabs = ['Stake', 'Unstake'];
  const [showAddModal, setShowAddModal] = useState(false);
  const detailBerpsRef = useRef<any>();

  const { handleGetAmount } = useLpToAmount(data?.LP_ADDRESS);

  const [claiming, setClaiming] = useState(false);

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

  const { decimals, tokens, LP_ADDRESS } = data || {};
  const isBERPS = name === 'Berps';

  const symbol = isBERPS ? data?.depositToken.symbol : id;
  const contractAddr = isBERPS ? data?.depositToken?.address : LP_ADDRESS;
  const vaultAddress = addresses[symbol];
  const approveSpender = isBERPS ? data?.withdrawToken?.address : vaultAddress;
  const stakeMethod = isBERPS ? 'deposit' : 'stake';
  const unStakeMethod = isBERPS ? 'makeWithdrawRequest' : 'withdraw';

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
  const { addAction } = useAddAction('dapp');
  const updateLPBalance = () => {
    const abi = ['function balanceOf(address) view returns (uint256)'];
    let _contractAddr = vaultAddress;
    if (isBERPS) {
      _contractAddr = data?.withdrawToken?.address;
    }
    const contract = new ethers.Contract(
      _contractAddr,
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
    const contract = new ethers.Contract(
      contractAddr,
      abi,
      provider?.getSigner()
    );
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
    const contract = new ethers.Contract(
      contractAddr,
      abi,
      provider?.getSigner()
    );
    updateState({
      isTokenApproved: false
    });
    contract
      .allowance(sender, approveSpender)
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
    const contract = new ethers.Contract(
      contractAddr,
      abi,
      provider?.getSigner()
    );

    contract
      .approve(approveSpender, wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const payload = { isTokenApproved: true, isTokenApproving: false };
        updateState({ ...payload, isLoading: false, loadingMsg: '' });
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Approve Successfully!',
          tx: receipt.transactionHash,
          chainId
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
    const contract = new ethers.Contract(
      approveSpender,
      stakeAbi,
      provider?.getSigner()
    );
    const params = [wei];
    if (isBERPS) {
      params.push(sender);
    }
    const createTx = (gasLimit: any) => {
      contract[stakeMethod](...params, { gasLimit })
        .then((tx: any) => tx.wait())
        .then((receipt: any) => {
          const { status, transactionHash } = receipt;
          const [amount0, amount1] = handleGetAmount(inAmount);
          addAction?.({
            type: 'Staking',
            action: 'Staking',
            token: {
              symbol: tokens.join('-')
            },
            amount: inAmount,
            template: 'Infrared',
            status: status,
            add: 1,
            transactionHash,
            chain_id: chainId,
            sub_type: 'Stake',
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
            title: 'Stake Successfully!',
            tx: transactionHash,
            chainId
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
    contract.estimateGas[stakeMethod](...params).then((res: any) => {
      createTx(res);
    }).catch((err: any) => {
      console.log('estimateGas failed: %o', err);
      createTx(4000000);
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

    const contract = new ethers.Contract(
      approveSpender,
      withdrawAbi,
      provider?.getSigner()
    );
    const createTx = (gasLimit: any) => {
      contract[unStakeMethod](lpWeiAmount, { gasLimit })
        .then((tx: any) => tx.wait())
        .then((receipt: any) => {
          updateState({
            isLoading: false,
            isPostTx: true
          });
          const { status, transactionHash } = receipt;
          const [amount0, amount1] = handleGetAmount(lpAmount);
          addAction?.({
            type: 'Staking',
            action: 'UnStake',
            token: {
              symbol: tokens.join('-')
            },
            symbol: tokens.join('-'),
            amount: lpAmount,
            template: 'Infrared',
            status: status,
            add: 0,
            transactionHash,
            chain_id: chainId,
            sub_type: 'Unstake',
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
            title: 'Unstake Successfully!',
            tx: transactionHash,
            chainId
          });
          if (isBERPS) {
            detailBerpsRef.current?.getList?.();
          }
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
    contract.estimateGas[unStakeMethod](lpWeiAmount).then((res: any) => {
      createTx(res);
    }).catch((err: any) => {
      console.log('estimateGas failed: %o', err);
      createTx(4000000);
    });
  };
  const handleClaim = function () {
    const toastId = toast?.loading({
      title: `Claim...`
    });

    const abi = [
      {
        constant: false,
        inputs: [],
        name: 'getReward',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];
    const contract = new ethers.Contract(
      data?.vaultAddress,
      abi,
      provider.getSigner()
    );

    setClaiming(true)
    contract
      .getReward()
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;
        addAction?.({
          type: 'Staking',
          action: 'Claim',
          token: {
            symbol: tokens.join('-')
          },
          amount: data?.earned,
          template: 'Infrared',
          status: status,
          transactionHash,
          chain_id: chainId,
          sub_type: 'Claim'
        });
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Claim Successfully!'
        });
        setTimeout(() => {
          onSuccess?.();
        }, 3000);
        setClaiming(false)
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        setClaiming(false)
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Claim Failed!',
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
    Number(defaultIndex) === 0 ? handleTokenChange('') : handleLPChange('');
    props.onSuccess?.();
  };

  useEffect(() => {
    if (!sender || !vaultAddress || !provider) return;
    updateBalance();
    updateLPBalance();
  }, [sender, vaultAddress, updater, provider]);

  const mintData = useMemo(() => {
    const pool = data?.initialData?.pool;
    if (!pool) return;
    if (!['BEX', 'Kodiak Finance'].includes(pool.protocol)) return null;
    const protocol = pool.protocol.split(' ')[0];

    if (pool.underlying_tokens?.length !== 2) return;
    return {
      protocol,
      token0: { ...pool.underlying_tokens[0], icon: data.images[0] },
      token1: { ...pool.underlying_tokens[1], icon: data.images[1] },
      version: 'v2'
    };
  }, [data]);

  const withdrawable = useMemo(() => {
    return !(isWithdrawInsufficient || isLoading || Number(lpAmount || 0) <= 0);
  }, [isWithdrawInsufficient, isLoading, lpAmount]);

  return (
    <div>
      <DetailSummary data={data} loading={loading} />

      <div className='flex items-stretch gap-[30px]'>
        {
          isBERPS ? (
            <DetailBerps
              ref={detailBerpsRef}
              data={data}
              loading={loading}
            />
          ) : (
            <DetailBex
              data={data}
              mintData={mintData}
              setShowAddModal={setShowAddModal}
              claiming={claiming}
              handleClaim={handleClaim}
            />
          )
        }
        <div className='flex-1 pt-[24px] pb-[20px] px-[20px] min-h-[300px]'>
          <div className='mb-[17px] flex items-center h-[56px] rounded-[12px] border border-[#373A53] bg-white p-[5px]'>
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={clsx([
                  'cursor-pointer flex items-center justify-center border border-transparent rounded-[10px] flex-1',
                  Number(defaultIndex) === index
                    ? 'h-full  !border-black bg-[#FFDC50]'
                    : ''
                ])}
                onClick={() => {
                  router.replace(`${pathname}?id=${id}&tab=${index}`);
                }}
              >
                <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                  {tab}
                </span>
              </div>
            ))}
          </div>

          {Number(defaultIndex) === 0 ? (
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
                  className='text-[#3D405A] font-Montserrat text-[12px] font-medium cursor-pointer'
                  onClick={handleMax}
                >
                  balance:{' '}
                  <span className='underline'>
                    {balanceFormated(balances[symbol] ?? 0, 6)}
                  </span>
                </div>
              </div>
              {
                isBERPS && (
                  <StakePrompt />
                )
              }
              {isInSufficient && (
                <button className="w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black opacity-50">
                  <span className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">
                    InSufficient Balance
                  </span>
                </button>
              )}
              {!isInSufficient &&
                (isTokenApproved && !isTokenApproving ? (
                  <button
                    disabled={isLoading || Number(inAmount || 0) <= 0}
                    className={clsx(
                      'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
                      {
                        'opacity-50': isLoading || Number(inAmount || 0) <= 0
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
                      'w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black text-[18px] font-semibold',
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
                  className='cursor-pointer text-[#3D405A] font-Montserrat text-[12px] font-medium'
                  onClick={() => {
                    const newSliderPercent = Big(lpBalance || 0)
                      .div(Big(lpBalance).gt(0) ? lpBalance : 1)
                      .times(100)
                      .toFixed(0);

                    onUpdateLpPercent(Number(newSliderPercent));

                    handleLPChange(lpBalance);
                  }}
                >
                  balance:{' '}
                  <span className='underline'>
                    {balanceFormated(lpBalance ?? 0, 6)}
                  </span>
                </div>
              </div>
              <button
                disabled={!withdrawable}
                className={clsx(
                  'w-full h-[60px] text-[18px] font-semibold flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black',
                  {
                    'opacity-50': !withdrawable
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

      {mintData && (
        <AddLiquidityModal
          token0={mintData.token0}
          token1={mintData.token1}
          version={mintData.version}
          dex={mintData.protocol}
          fee={mintData.fee}
          open={showAddModal}
          onClose={() => {
            setShowAddModal(null);
            updateState({
              updater: Date.now()
            });
          }}
        />
      )}
    </div>
  );
});

export const stakeAbi = [
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
  },
  {
    constant: false,
    inputs: [
      {
        name: 'assets',
        type: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address'
      }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
export const withdrawAbi = [
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
  },
  {
    constant: false,
    inputs: [
      {
        name: 'shares',
        type: 'uint256'
      }
    ],
    name: 'makeWithdrawRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'shares',
        type: 'uint256'
      },
      {
        name: 'receiver',
        type: 'address'
      },
      {
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'redeem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'shares',
        type: 'uint256'
      },
      {
        name: 'unlockEpoch',
        type: 'uint256'
      },
    ],
    name: 'cancelWithdrawRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
