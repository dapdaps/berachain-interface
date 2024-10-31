"use client"
import { useMultiState } from '@/hooks/use-multi-state';
import useToast from '@/hooks/use-toast';
import { formatThousandsSeparator, formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import clsx from "clsx";
import { ethers } from 'ethers';
import { memo, useEffect, useMemo, useState } from "react";
import CircleLoading from '@/components/circle-loading';
import useInfraredData from '@/sections/liquidity/Datas/Infrared';
import useInfraredList from '@/sections/liquidity/hooks/use-infrared-list';
import useCustomAccount from '@/hooks/use-account';
import { useIBGT } from '@/hooks/use-ibgt';
import Popover, { PopoverPlacement } from '@/components/popover';
import { useRouter } from 'next/navigation';
export default memo(function IBGTPageView(props: any) {
  const router = useRouter()
  const { loading, dataList } = useInfraredList()
  const data = useMemo(() => dataList?.find((d: any) => d.id === "iBGT-HONEY"), [dataList])
  const { data: ibgtData } = useIBGT()
  const { account: sender, provider, } = useCustomAccount()
  const toast = useToast();
  const tabs = ["Stake", "Unstake"]
  const [tIndex, setTIndex] = useState(0)
  const [state, updateState] = useMultiState({
    balances: [],
    lpBalance: '',
    inAmount: '',
    lpAmount: '',
    isLoading: false,
    isError: false,
    loadingMsg: "",
    isTokenApproved: true,
    isTokenApproving: false,
    updater: 0
  });
  const sourceBalances: any = {};

  const {
    balances,
    inAmount,
    isLoading,
    isTokenApproved,
    isTokenApproving,
    lpBalance,
    lpAmount,
    updater
  } = state;
  const { token0, token1, decimals, id, LP_ADDRESS } = data ?? {

  };
  const symbol = id;
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
    const contract = new ethers.Contract(data?.vaultAddress, abi, provider?.getSigner());
    contract.balanceOf(sender).then((balanceBig: any) => {
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
      .then((balanceBig: any) => {
        const adjustedBalance = Big(ethers.utils.formatUnits(balanceBig)).toFixed();
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
  const checkApproval = (amount: string) => {
    const wei: any = ethers.utils.parseUnits(Big(amount).toFixed(decimals), decimals);
    const abi = ['function allowance(address, address) external view returns (uint256)'];
    const contract = new ethers.Contract(LP_ADDRESS, abi, provider.getSigner());
    updateState({
      isTokenApproved: false
    });
    contract
      .allowance(sender, data?.vaultAddress)
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

  const handleTokenChange = (amount: string) => {
    updateState({ inAmount: amount });
    if (amount === "") {
      updateState({
        inAmount: "",
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
      .approve(data?.vaultAddress, wei)
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
          text: error?.message?.includes('user rejected transaction') ? 'User rejected transaction' : null
        });
      });
  };

  const handleDeposit = () => {
    const toastId = toast?.loading({
      title: `Depositing...`
    });
    updateState({
      isLoading: true,
      isError: false,
      loadingMsg: 'Depositing...'
    });
    const wei = ethers.utils.parseUnits(Big(inAmount).toFixed(decimals), decimals);
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
    const contract = new ethers.Contract(data?.vaultAddress, abi, provider.getSigner());
    contract
      .stake(wei)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;
        updateState({
          isLoading: false,
          // isPostTx: true
        });
        setTimeout(() => {
          onSuccess?.()
        }, 3000)

        toast?.dismiss(toastId);
        toast?.success({
          title: 'Deposit Successfully!'
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
          title: 'Deposit Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  };
  const handleWithdraw = () => {
    const toastId = toast?.loading({
      title: `Withdrawing...`
    });
    updateState({
      isLoading: true,
      isError: false,
      loadingMsg: 'Withdrawing...'
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

    const contract = new ethers.Contract(data?.vaultAddress, abi, provider.getSigner());
    contract
      .withdraw(lpWeiAmount)
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        updateState({
          isLoading: false,
        });
        const { status, transactionHash } = receipt;
        console.log('=receipt', receipt);

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
          title: 'Withdraw Successfully!'
        });
      })
      .catch((error: Error) => {
        console.log('===error', error)
        updateState({
          isError: true,
          isLoading: false,
          loadingMsg: error?.message
        });
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Withdraw Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
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
  const onSuccess = function () {
    updateState({
      updater: Date.now(),
      isTokenApproved: true,
      isTokenApproving: false
    })
    tIndex === 0 ? handleTokenChange("") : handleLPChange("")
  }

  useEffect(() => {
    if (!sender || !data?.vaultAddress) return;
    updateBalance();
    updateLPBalance();
  }, [sender, data?.vaultAddress, updater]);
  return (
    <div className='flex flex-col items-center pt-[78px] pb-[30px]'>
      <div className="relative z-20 mb-[25px]">
        <div className="absolute left-[-13px] top-[-3px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="105" height="97" viewBox="0 0 105 97" fill="none">
            <path d="M103.686 48.5C103.686 75.0445 83.6842 96.5 59.086 96.5H43.6118V0.5H59.086C83.6842 0.5 103.686 21.9555 103.686 48.5Z" fill="black" stroke="#F39C36" />
            <path d="M89.3148 48.5C89.3148 75.0466 69.3974 96.5 44.9074 96.5C20.4174 96.5 0.5 75.0466 0.5 48.5C0.5 21.9534 20.4174 0.5 44.9074 0.5C69.3974 0.5 89.3148 21.9534 89.3148 48.5Z" fill="url(#paint0_linear_22357_9614)" stroke="black" />
            <path d="M78.075 48.2835C78.075 69.7672 62.7619 87.0709 44.0021 87.0709C25.2423 87.0709 9.9292 69.7672 9.9292 48.2835C9.9292 26.7998 25.2423 9.49609 44.0021 9.49609C62.7619 9.49609 78.075 26.7998 78.075 48.2835Z" fill="black" stroke="#F39C36" />
            <path d="M44.8236 67.9177C44.261 67.3368 43.7686 66.6952 43.3561 66.0055C42.3076 64.4025 40.551 60.6389 40.5466 56.5008C36.8386 58.6047 32.5615 59.0142 30.5944 58.9314C29.8519 58.9302 29.1116 58.8543 28.3853 58.7049C29.2098 62.6078 31.2762 65.4566 34.5847 67.2513C37.796 68.9936 41.209 69.2158 44.8236 67.9177ZM58.1321 50.7771C59.192 49.4696 59.9425 47.9511 60.33 46.3297C60.79 44.461 60.799 42.5843 60.3568 40.6996L64.2777 39.6193C64.5799 39.5455 64.8634 39.4123 65.1108 39.2281C65.3582 39.0438 65.5641 38.8123 65.7161 38.5478C65.867 38.2831 65.9608 37.9913 65.9916 37.6902C66.0225 37.3891 65.9897 37.085 65.8953 36.7967C65.8201 36.5028 65.684 36.227 65.4952 35.9862C65.3064 35.7454 65.069 35.5446 64.7975 35.3962C64.525 35.2492 64.2244 35.1578 63.9142 35.1279C63.604 35.0979 63.2908 35.1299 62.9939 35.222L58.6205 36.4286C57.1672 34.6122 55.6698 33.2959 54.1283 32.4799C52.5869 31.6654 50.8079 31.2457 48.7915 31.2211L47.5077 26.8216C47.432 26.5279 47.2954 26.2524 47.1062 26.012C46.9171 25.7715 46.6793 25.5712 46.4077 25.4233C46.1351 25.2762 45.8346 25.1849 45.5244 25.1549C45.2142 25.125 44.901 25.157 44.6041 25.2491C44.3022 25.3224 44.0189 25.4549 43.7716 25.6384C43.5243 25.8219 43.3181 26.0526 43.1657 26.3163C43.014 26.581 42.9197 26.8731 42.8885 27.1747C42.8573 27.4762 42.8898 27.7807 42.9842 28.0695L44.0955 31.881C42.2341 32.4973 40.5554 33.5454 39.2045 34.9345C38.1092 36.0438 37.2396 37.3444 36.6414 38.7677L49.7258 40.3359L58.1321 50.7771ZM30.5563 40.1442C28.2787 40.1526 26.0978 41.0402 24.4934 42.6117C22.8889 44.1832 21.9924 46.3099 22.001 48.524C22.0097 50.738 22.9227 52.8581 24.5393 54.4178C26.1559 55.9774 28.3437 56.8489 30.6213 56.8406H30.6706C32.6691 56.932 37.5286 56.3962 40.9879 53.676L47.8572 42.2176L30.5563 40.1442ZM42.8251 54.7649L49.5757 43.5048L60.1216 56.6533C61.2521 58.5756 61.5507 60.8558 60.9517 62.9922C60.3528 65.1286 58.9053 66.9462 56.9278 68.0451C54.9503 69.1441 52.6046 69.4344 50.4069 68.8521C48.2092 68.2699 46.3395 66.8628 45.209 64.9404L45.1843 64.8969C44.1156 63.2786 42.1956 58.9946 42.8251 54.7649Z" fill="url(#paint1_linear_22357_9614)" />
            <defs>
              <linearGradient id="paint0_linear_22357_9614" x1="143.751" y1="49.1897" x2="-48.9978" y2="51.6944" gradientUnits="userSpaceOnUse">
                <stop stop-color="#F8F29C" />
                <stop offset="0.165" stop-color="#F6DB2A" />
                <stop offset="0.333" stop-color="#F4A435" />
                <stop offset="0.55" stop-color="#E85A46" />
                <stop offset="0.699" stop-color="#B93483" />
                <stop offset="0.867" stop-color="#502B6E" />
                <stop offset="1" stop-color="#2A2136" />
              </linearGradient>
              <linearGradient id="paint1_linear_22357_9614" x1="92.427" y1="47.4578" x2="-2.00127" y2="48.7831" gradientUnits="userSpaceOnUse">
                <stop stop-color="#F8F29C" />
                <stop offset="0.165" stop-color="#F6DB2A" />
                <stop offset="0.333" stop-color="#F4A435" />
                <stop offset="0.55" stop-color="#E85A46" />
                <stop offset="0.699" stop-color="#B93483" />
                <stop offset="0.867" stop-color="#502B6E" />
                <stop offset="1" stop-color="#2A2136" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute left-[-48px] top-[-33px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="60" viewBox="0 0 140 60" fill="none">
            <path d="M13.2599 35.909C13.7431 34.6031 15.5902 34.6031 16.0734 35.909L17.8399 40.6829C18.0931 41.3672 18.6327 41.9067 19.317 42.1599L24.0908 43.9264C25.3967 44.4096 25.3967 46.2567 24.0908 46.7399L19.317 48.5064C18.6327 48.7596 18.0931 49.2992 17.8399 49.9835L16.0734 54.7573C15.5902 56.0632 13.7431 56.0632 13.2599 54.7573L11.4934 49.9835C11.2402 49.2992 10.7007 48.7596 10.0164 48.5064L5.24253 46.74C3.9366 46.2567 3.9366 44.4096 5.24253 43.9264L10.0164 42.1599C10.7007 41.9067 11.2402 41.3672 11.4934 40.6829L13.2599 35.909Z" fill="#FFEC8E" stroke="#924E00" />
            <path d="M125.593 15.2425C126.076 13.9366 127.924 13.9366 128.407 15.2425L129.723 18.7999C129.976 19.4842 130.516 20.0237 131.2 20.2769L134.757 21.5932C136.063 22.0765 136.063 23.9235 134.757 24.4068L131.2 25.7231C130.516 25.9763 129.976 26.5158 129.723 27.2001L128.407 30.7575C127.924 32.0634 126.076 32.0634 125.593 30.7575L124.277 27.2001C124.024 26.5158 123.484 25.9763 122.8 25.7231L119.243 24.4068C117.937 23.9235 117.937 22.0765 119.243 21.5932L122.8 20.2769C123.484 20.0237 124.024 19.4842 124.277 18.7999L125.593 15.2425Z" fill="#FFEC8E" stroke="#924E00" />
            <path d="M30.393 5.24253C30.8763 3.9366 32.7233 3.9366 33.2066 5.24253L36.1435 13.1793C36.3967 13.8636 36.9362 14.4031 37.6205 14.6563L45.5573 17.5932C46.8632 18.0765 46.8632 19.9235 45.5573 20.4068L37.6205 23.3437C36.9362 23.5969 36.3967 24.1364 36.1435 24.8207L33.2066 32.7575C32.7233 34.0634 30.8763 34.0634 30.393 32.7575L27.4562 24.8207C27.2029 24.1364 26.6634 23.5969 25.9791 23.3437L18.0423 20.4068C16.7364 19.9235 16.7364 18.0765 18.0423 17.5932L25.9791 14.6563C26.6634 14.4031 27.2029 13.8636 27.4562 13.1793L30.393 5.24253Z" fill="#FFEC8E" stroke="#924E00" />
          </svg>
        </div>

        <div className="min-w-[278px] h-[88px] p-[10px] rounded-[30px] bg-[#F4A634] shadow-[1px_1px_0px_0px_#77481E]">
          <div className="flex justify-end pl-[95px] pr-[25px] items-center w-full h-full bg-black border border-[#924E00] rounded-[26px] font-CherryBomb text-[32px] text-white leading-[90%]">
            {ibgtData.count} iBGT
          </div>
        </div>
      </div>
      <div className='relative z-10 w-[1200px]'>
        <div className='absolute left-[50%] top-[-96px] -translate-x-1/2 w-[1139px] h-[293px]  rounded-[1139px] bg-[radial-gradient(50%_50%_at_50%_50%,#FFDC50_0%,rgba(255,220,80,0.00)_100%)]' />
        <div className='relative h-[642px] p-[30px] bg-[#FFFDEB] rounded-[20px] border border-black shadow-[10px_10px_0_0_rgba(0,0,0,0.25)]'>
          <div className="relative mb-[24px] flex items-center h-[120px] rounded-[20px] bg-[#FFDC50]">
            <div className="relative h-full flex-1 flex flex-col gap-[12px] pt-[34px] pl-[30px]">
              <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">APY</div>
              <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{Big(data?.apy ?? 0).toFixed(2)}%</div>
              <div className='absolute right-0 top-[37px] bottom-[34px] w-[1px] bg-black/[0.15]' />
            </div>
            <div className="relative h-full flex-1 flex flex-col gap-[12px] pt-[34px] pl-[30px]">
              <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">% of iBGT staked</div>
              <Popover
                placement={PopoverPlacement.BottomLeft}
                content={(
                  <div className='relative pt-[19px] px-[19px] pb-[23px] w-[240px] h-[165px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.25)]'>
                    <div className='flex flex-col gap-[13px]'>
                      <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>Staked</div>
                      <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>{formatThousandsSeparator(formatValueDecimal(ibgtData?.staked, '', 2, false, true))} iBGT</div>
                    </div>
                    <div className='absolute top-[82px] left-[12px] right-[9px] h-[1px] bg-[rgba(0, 0, 0, 0.15)]' />
                    <div className='pt-[12px] flex flex-col gap-[13px]'>
                      <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>Total iBGT</div>
                      <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>{formatThousandsSeparator(formatValueDecimal(ibgtData?.total, '', 2, false, true))} iBGT</div>
                    </div>
                  </div>
                )}
              >
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%] underline">{ibgtData?.total ? Big(ibgtData?.staked).div(ibgtData?.total).times(100).toFixed(2) : '-'}%</div>
              </Popover>
              <div className='absolute right-0 top-[37px] bottom-[34px] w-[1px] bg-black/[0.15]' />
            </div>
            <div className="relative h-full flex-1 flex flex-col gap-[12px] pt-[34px] pl-[30px]">
              <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Tvl</div>
              <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{formatValueDecimal(data?.tvl, '$', 2, true)}</div>
              <div className='absolute right-0 top-[37px] bottom-[34px] w-[1px] bg-black/[0.15]' />
            </div>
          </div>

          <div className="flex items-center gap-[30px]">
            <div className="flex-1 pr-[24px] pl-[13px] h-[300px] bg-black/[0.06]">
              <div className="pt-[21px] pr-[2px] pb-[46px] pl-[17px]">
                <div className="mb-[21px] text-black font-Montserrat text-[18px] font-bold leading-[90%]">Your Position</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <div className="flex items-center">
                      <div className="w-[30px] h-[30px] rounded-full">
                        <img src={`/images/dapps/infrared/ibgt.svg`} />
                      </div>
                    </div>
                    <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">0 iBGT</div>
                  </div>

                  <div
                    className="cursor-pointer flex items-center justify-center w-[148px] h-[46px] rounded-[10px] border border-black bg-[#FFDC50]"
                    onClick={() => {
                      router.push("/dex/bex?lp=")
                    }}
                    data-bp="1010-005-001"
                  >
                    <span className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">Mint iBGT</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-black/[0.15]" />
              <div className="pt-[19px] pl-[17px]">
                <div className="mb-[27px] text-black font-Montserrat text-[18px] font-bold leading-[90%]">Rewards</div>

                <div className='flex items-center justify-between'>

                  <div className="flex items-center gap-[14px]">
                    <div className="w-[32px] h-[32px] rounded-full">
                      <img src={`/images/dapps/infrared/${data?.rewardSymbol?.toLocaleLowerCase() ?? "honey"}.svg`} />
                    </div>
                    <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">0 {data?.rewardSymbol}</div>
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

            <div className="flex-1 pt-[24px] pb-[20px] px-[20px] h-[300px]">
              <div className="mb-[17px] flex items-center h-[56px] rounded-[12px] border border-[#373A53] bg-white p-[5px]">
                {
                  tabs.map((tab, index) => (
                    <div
                      key={index}
                      className={clsx(["flex items-center justify-center border border-transparent rounded-[10px] flex-1", tIndex === index ? "h-full  !border-black bg-[#FFDC50]" : ""])}
                      onClick={() => {
                        setTIndex(index)
                      }}
                    >
                      <span className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">{tab}</span>
                    </div>
                  ))
                }
              </div>

              {
                tIndex === 0 ? (
                  <div>
                    <input value={inAmount} type="number" onChange={(e) => handleTokenChange(e.target.value)} className="w-full h-[72px] pl-[20px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]" placeholder="0" />
                    <div className="flex justify-between px-[10px] pt-[12px] pb-[24px]">
                      <span className="text-[#3D405A] font-Montserrat text-[12px] font-medium">
                        {inAmount ? '$' + Big(inAmount)
                          .times(data?.initialData?.stake_token?.price ?? 0)
                          .toFixed(2) : '-'}
                      </span>
                      <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium" onClick={handleMax}>balance: <span>{Big(balances[symbol] ?? 0).toFixed(6)}</span></div>
                    </div>
                    {
                      isInSufficient && (
                        <button className="w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black opacity-50">
                          <span className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">InSufficient Balance</span>
                        </button>
                      )
                    }
                    {
                      !isInSufficient &&
                      (isTokenApproved && !isTokenApproving ? (
                        <button disabled={isLoading || Number(inAmount) <= 0}
                                className={
                                  clsx(
                                    "w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black",
                                    {
                                      "opacity-50": isLoading || Number(inAmount) <= 0
                                    })
                                }
                                onClick={handleDeposit}
                        >
                          <span className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">{isLoading ? <CircleLoading size={14} /> : 'Stake'}</span>
                        </button>
                      ) : (
                        <button disabled={isTokenApproved || isTokenApproving} className={
                          clsx(
                            "w-full h-[60px] flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black",
                            {
                              "opacity-50": isTokenApproved || isTokenApproving
                            })
                        } onClick={() => handleApprove()}>
                          {isTokenApproving ? (
                            <CircleLoading size={14} />
                          ) : (
                            <>
                              {isTokenApproved ? 'Approved' : 'Approve'} {symbol}
                            </>
                          )}
                        </button>
                      ))
                    }
                  </div>
                ) : (
                  <div>
                    <input value={lpAmount} type="number"
                           onChange={(e) => {
                             handleLPChange(e.target.value);
                           }}
                           className="w-full h-[72px] pl-[20px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]" placeholder="0" />
                    <div className="flex justify-between px-[10px] pt-[12px] pb-[24px]">
                      <span className="text-[#3D405A] font-Montserrat text-[12px] font-medium">
                        {lpAmount ? '$' + Big(lpAmount)
                          .times(data?.initialData?.stake_token?.price ?? 0)
                          .toFixed(2) : '-'}
                      </span>
                      <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium" onClick={() => {
                        handleLPChange(lpBalance);
                      }}>balance: <span>{lpBalance}</span></div>
                    </div>
                    <button
                      disabled={isWithdrawInsufficient || isLoading || Number(lpAmount) <= 0}
                      className={
                        clsx(
                          "w-full h-[60px]  font-semibold font-Montserrat flex items-center justify-center rounded-[10px] bg-[#FFDC50] border border-black",
                          {
                            "opacity-50": isWithdrawInsufficient || isLoading || Number(lpAmount) <= 0
                          })
                      }
                      onClick={handleWithdraw}
                    >
                      {isLoading ? <CircleLoading size={14} /> : <>{isWithdrawInsufficient ? 'InSufficient Balance' : 'Withdraw'}</>}
                    </button>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  )
})

