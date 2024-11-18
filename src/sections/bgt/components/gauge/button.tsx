import CircleLoading from '@/components/circle-loading';
import { useMultiState } from "@/hooks/use-multi-state";
import clsx from "clsx";
import { ethers } from "ethers";
import { memo, useEffect } from "react";
import Big from 'big.js';
import useToast from '@/hooks/use-toast';
import useCustomAccount from '@/hooks/use-account';
import useExecutionContract from '@/hooks/use-execution-contract';
import useLpToAmount from '@/hooks/use-lp-to-amount';
export default memo(function Button(props: IProps) {
  const {
    abi,
    type,
    product,
    method,
    symbol,
    amount,
    template,
    decimals,
    balance,
    address,
    vaultAddress,

    onSuccess,
    addAction
  } = props

  const { account, provider, chainId } = useCustomAccount()
  const toast = useToast()
  const { executionContract } = useExecutionContract()
  const { handleGetAmount } = useLpToAmount(address, product)



  const [state, updateState] = useMultiState({
    isLoading: false,
    isApproved: true,
    isApproving: false,
  })
  const BTN_CLASS = "cursor-pointer flex items-center justify-center h-[60px] rounded-[10px] border border-black bg-[#FFDC50]  text-black font-Montserrat text-[18px] font-semibold leading-[90%]"

  const isInSufficient = Number(amount) > Number(balance);



  const checkApproval = (_amount) => {

    console.log('===_amount', _amount)
    const wei: any = ethers.utils.parseUnits(
      Big(_amount).toFixed(decimals),
      decimals
    );
    const _abi = [
      'function allowance(address, address) external view returns (uint256)'
    ];
    const contract = new ethers.Contract(
      address,
      _abi,
      provider?.getSigner()
    );
    updateState({
      isApproved: false
    });
    contract
      .allowance(account, vaultAddress)
      .then((allowance: any) => {
        const approved = !new Big(allowance.toString()).lt(wei);
        updateState({
          isApproved: approved
        });
      })
      .catch((e: Error) => console.log(e));
  };
  const handleApprove = () => {
    const payload = { isApproving: true };
    const _amount = Big(amount).toFixed(decimals);
    const toastId = toast?.loading({
      title: `Approve ${symbol}`
    });
    updateState({
      ...payload,
      isLoading: true,
    });
    const wei = ethers.utils.parseUnits(_amount, decimals);
    const _abi = ['function approve(address, uint) public'];
    const contract = new ethers.Contract(
      address,
      _abi,
      provider?.getSigner()
    );

    contract
      .approve(vaultAddress, wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const payload = { isApproved: true, isApproving: false };
        updateState({ ...payload, isLoading: false });
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
          isApproving: false
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


  const handleDepositOrWithdraw = async function () {
    const toastId = toast?.loading({
      title: type === "deposit" ? "Depositing..." : "Withdrawing..."
    });
    updateState({
      isLoading: true,
    });
    const wei = ethers.utils.parseUnits(
      Big(amount).toFixed(decimals),
      decimals
    );

    const contract = new ethers.Contract(
      vaultAddress,
      abi,
      provider?.getSigner()
    );
    const [amount0, amount1] = handleGetAmount(amount);

    console.log('====amount0', amount0)
    console.log('====amount1', amount1)
    if (type === "deposit") {
      executionContract({
        contract,
        method,
        params: [wei]
      }).then((receipt: any) => {
        const { status, transactionHash } = receipt;
        const tokens = symbol?.split("-")
        const addParams = {
          type: 'Staking',
          action: 'Staking',
          token: {
            symbol
          },
          amount,
          template,
          status: status,
          add: 1,
          transactionHash,
          chain_id: chainId,
          sub_type: 'Stake',
        }
        if (tokens?.length > 1 && ["BEX", "Kodiak"].includes(product)) {
          const [amount0, amount1] = handleGetAmount(amount);
          addParams["extra_data"] = JSON.stringify({
            token0Symbol: tokens[0],
            token1Symbol: tokens[1],
            amount0,
            amount1
          })
        }
        addAction?.(addParams);
        updateState({
          isLoading: false
        });
        setTimeout(() => {
          onSuccess?.();
        }, 3000);

        toast?.dismiss(toastId);
        toast?.success({
          title: 'Deposit Successfully!',
          tx: transactionHash,
          chainId
        });
      })
        .catch((error: Error) => {
          updateState({
            isLoading: false,
          });
          toast?.dismiss(toastId);
          toast?.fail({
            title: 'Deposit Failed!',
            text: error?.message?.includes('user rejected transaction')
              ? 'User rejected transaction'
              : error?.message ?? ''
          });
        });

    } else {
      executionContract({
        contract,
        method,
        params: [wei]
      }).then((receipt: any) => {
        updateState({
          isLoading: false,
        });
        const { status, transactionHash } = receipt;
        const [amount0, amount1] = handleGetAmount(amount);
        addAction?.({
          type: 'Staking',
          action: 'UnStake',
          token: {
            symbol
          },
          amount,
          template,
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
          title: 'Withdraw Successfully!',
          tx: transactionHash,
          chainId
        });
      })
        .catch((error: Error) => {
          updateState({
            isError: true,
            isLoading: false,
          });
          toast?.dismiss(toastId);
          toast?.fail({
            title: 'Withdraw Failed!',
            text: error?.message?.includes('user rejected transaction')
              ? 'User rejected transaction'
              : error?.message ?? ''
          });
        });
    }
  }
  useEffect(() => {
    if (type === "deposit") {
      if (amount === '') {
        updateState({
          isApproved: true
        })
      } else {
        checkApproval(amount)
      }
    }
  }, [amount])
  if (isInSufficient) {
    return (
      <div className={clsx(BTN_CLASS, 'opacity-60 !cursor-not-allowed')}>InSufficient Balance</div>
    )
  }

  if (Number(amount) <= 0) {
    return (
      <div className={clsx(BTN_CLASS, 'opacity-60 !cursor-not-allowed')}>{props?.children}</div>
    )
  }

  if (state?.isLoading) {
    return (
      <div className={clsx(BTN_CLASS, '!opacity-50 !cursor-not-allowed')}>
        <CircleLoading size={14} />
      </div>
    )
  }

  if (state?.isApproved && !state?.isApproving || type === "withdraw") {
    return (
      <div className={BTN_CLASS} onClick={handleDepositOrWithdraw}>{props?.children}</div>
    )
  } else {
    return (
      <div
        disabled={state?.isApproved || state?.isApproving}
        className={clsx(
          BTN_CLASS,
          {
            'opacity-50': state?.isApproved || state?.isApproving
          }
        )}
        onClick={() => handleApprove()}
      >
        {state?.isApproving ? (
          <CircleLoading size={14} />
        ) : (
          <>
            {state?.isApproved ? 'Approved' : 'Approve'} {symbol}
          </>
        )}
      </div>
    )
  }

})
interface IProps {
  abi: any;
  type: "deposit" | "withdraw";
  product: string;
  method: string;
  symbol: string;
  amount: string;
  template: string;
  decimals: number;
  balance: string;
  address: string;
  vaultAddress?: string;
  onSuccess?: VoidFunction;
  addAction?: any
}