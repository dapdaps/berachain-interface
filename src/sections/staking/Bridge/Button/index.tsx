import CircleLoading from '@/components/circle-loading';
import useCustomAccount from '@/hooks/use-account';
import { useMultiState } from "@/hooks/use-multi-state";
import useToast from '@/hooks/use-toast';
import Big from 'big.js';
import clsx from "clsx";
import { ethers } from "ethers";
import { memo, useEffect } from "react";
export default memo(function Button(props: IProps) {
  const {
    abi,
    type,
    symbol,
    amount,
    template,
    decimals,
    balance,
    address,
    vaultAddress,
    onDepositOrWithdraw,
  } = props

  const { account, provider, chainId } = useCustomAccount()
  const toast = useToast()

  const [state, updateState] = useMultiState({
    isLoading: false,
    isApproved: true,
    isApproving: false,
  })
  const BTN_CLASS = "cursor-pointer flex items-center justify-center h-[60px] rounded-[10px] border border-black bg-[#FFDC50]  text-black font-Montserrat text-[18px] font-semibold leading-[90%]"

  const isInSufficient = Number(amount) > Number(balance);
  const checkApproval = (_amount) => {
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
        console.log('===allowance.toString()', allowance.toString())
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
          title: 'Approve Successful!',
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
      <div className={BTN_CLASS} onClick={() => onDepositOrWithdraw(updateState)}>{props?.children}</div>
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
  symbol: string;
  amount: string;
  template: string;
  decimals: number;
  balance: string;
  address: string;
  vaultAddress?: string;
  onDepositOrWithdraw: any;
}