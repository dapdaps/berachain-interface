import { useMultiState } from '@/hooks/use-multi-state';
import config from '@/configs/staking/dapps/infrared';
import { DEFAULT_CHAIN_ID } from '@/configs';
import Big from 'big.js';
import { ethers } from 'ethers';
import { useEffect, useMemo, useRef, useState } from 'react';
import { stakeAbi, withdrawAbi } from '@/sections/staking/Bridge/Detail';
import { useProvider } from '@/hooks/use-provider';
import useAccount from '@/hooks/use-account';
import useToast from '@/hooks/use-toast';
import useLpToAmount from '@/hooks/use-lp-to-amount';
import useAddAction from '@/hooks/use-add-action';

export function useDetail(props: any) {
  const { id, name, data, defaultIndex } = props;

  const { provider } = useProvider();
  const { account: sender, chainId } = useAccount();
  const toast = useToast();
  const { handleGetAmount } = useLpToAmount(data?.LP_ADDRESS);
  const { addAction } = useAddAction('dapp');

  const detailBerpsRef = useRef<any>();
  const [claiming, setClaiming] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isBerpsDepositVisible, setIsBerpsDepositVisible] = useState(false);

  const { addresses } = config.chains[DEFAULT_CHAIN_ID];

  const isBERPS = name === 'Berps';
  const isInfraredBerps = name === 'Infrared' && data?.initialData?.pool?.protocol === 'BERPS' && data?.initialData?.pool?.name === 'BHONEY';

  const symbol = isBERPS ? data?.depositToken?.symbol : id;
  const { decimals, tokens, LP_ADDRESS } = data || {};

  const [state, updateState] = useMultiState<any>({
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

  const sourceBalances: any = {};
  const contractAddr = isBERPS ? data?.depositToken?.address : LP_ADDRESS;
  const vaultAddress = (addresses as any)[symbol];
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
    contract.balanceOf(sender).then((balanceBig: any) => {
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
      .then((balanceBig: any) => {
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
          updateBalance();
        }, 1500);
      });
  };
  const checkApproval = (amount: any) => {
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

  const handleTokenChange = (amount: any) => {
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
    const params: any = [wei];
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
            template: name || 'Infrared',
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
            template: name || 'Infrared',
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
          template: name || 'Infrared',
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

  const handleMintLP = (visible: boolean) => {
    if (isInfraredBerps) {
      setIsBerpsDepositVisible(visible);
      return;
    }
    setShowAddModal(visible);
  };

  const mintData = useMemo<any>(() => {
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

  useEffect(() => {
    if (!sender || !vaultAddress || !provider) return;
    updateBalance();
    updateLPBalance();
  }, [sender, vaultAddress, updater, provider]);

  return {
    state,
    updateState,
    isBERPS,
    isInfraredBerps,
    symbol,
    contractAddr,
    vaultAddress,
    approveSpender,
    stakeMethod,
    unStakeMethod,
    isInSufficient,
    isWithdrawInsufficient,
    balanceLp,
    updateLPBalance,
    updateBalance,
    checkApproval,
    handleMax,
    handleTokenChange,
    handleLPChange,
    handleApprove,
    handleDeposit,
    handleWithdraw,
    handleClaim,
    onUpdateLpPercent,
    onSuccess,
    handleMintLP,
    mintData,
    withdrawable,
    showAddModal,
    setShowAddModal,
    detailBerpsRef,
    claiming,
    isBerpsDepositVisible,
    setIsBerpsDepositVisible,
  };
}