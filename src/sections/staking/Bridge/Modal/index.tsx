
import Modal from '@/components/modal';
import Range from "@/components/range";
import useCustomAccount from '@/hooks/use-account';
import useAddAction from '@/hooks/use-add-action';
import useExecutionContract from '@/hooks/use-execution-contract';
import useToast from '@/hooks/use-toast';
import TokenSelector from '@/sections/bridge/TokenSelector';
import { ERC20_ABI, ICHI_ABI } from '@/sections/staking/Datas/AquaBera';
import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import clsx from 'clsx';
import { ethers } from 'ethers';
import _ from 'lodash';
import { memo, useEffect, useState } from 'react';
import Button from '../Button';

const ETHVaultWithSlippage_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "minimumProceeds",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "depositETH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  }
]
const ICHIVaultDepositGuard_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "vault",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "vaultDeployer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minimumProceeds",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "forwardDepositToICHIVault",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "vaultTokens",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const template = "AquaBera"
export default memo(function index(props) {

  const {
    show,
    data,
    type,
    config,
    onClose,
    onSuccess
  } = props
  const { account, provider, chainId } = useCustomAccount()
  const toast = useToast()
  const { addAction } = useAddAction("dapp")
  const { executionContract } = useExecutionContract()
  const RangeList = [0.25, 0.5, 0.75, 1];
  const [isDeposit, setIsDeposit] = useState<boolean>(false)
  const [isBera, setIsBera] = useState<boolean>(false)
  const [apr, setApr] = useState("")
  const [token0, setToken0] = useState<any>(null)
  const [token1, setToken1] = useState<any>(null)
  const [ichiAddress, setIchiAddress] = useState("")
  const [vaultAddress, setVaultAddress] = useState("")

  const [rangeIndex, setRangeIndex] = useState(-1)
  const [percentage, setPercentage] = useState(0)

  const [inAmount, setInAmount] = useState("")
  const [balance, setBalance] = useState("")
  const [shares, setShares] = useState("")
  const [updater, setUpdater] = useState(0)
  const [owner, setOwner] = useState("")
  const [pairedTokens, setPairedTokens] = useState(null)
  const [tokenSelectorShow, setTokenSelectorShow] = useState(false);
  const [values, setValues] = useState(null)

  const handleMax = () => {
    handleAmountChange(balance)
  }
  const getPercentage = (_amount: string) => {
    _amount = Big(_amount).gt(balance) ? balance : _amount
    return Big(balance).eq(0)
      ? 0
      : Big(_amount)
        .div(balance ?? 1)
        .times(100)
        .toFixed();
  };
  const handleAmountChange = (_amount: string) => {
    const amount = _amount.replace(/\s+/g, "");
    if (isNaN(Number(amount))) return;
    if (!amount) {
      setInAmount(amount)
      setPercentage(0)
      setRangeIndex(-1)
      return;
    }
    const _percentage = getPercentage(amount)
    setInAmount(amount)
    setPercentage(_percentage)
    setRangeIndex(RangeList.findIndex((range) =>
      Big(range).eq(Big(_percentage).div(100))
    ))
  }
  const getBalance = async () => {
    if (isDeposit) {

      if (isBera) {
        const response = await provider.getBalance(account);
        setBalance(ethers.utils.formatUnits(response))
      } else {
        const contract = new ethers.Contract(token0?.address, ERC20_ABI, provider)
        const response = await contract.balanceOf(account)
        setBalance(ethers.utils.formatUnits(response))
      }
    } else {
      const contract = new ethers.Contract(ichiAddress, ICHI_ABI, provider)
      const balanceOfResult = await contract.balanceOf(account)
      const getTotalAmountsResult = await contract.getTotalAmounts()
      const totalSupplyResult = await contract.totalSupply()

      const shares = ethers.utils.formatUnits(balanceOfResult)
      const totalSupply = ethers.utils.formatUnits(totalSupplyResult)
      const amt0 = ethers.utils.formatUnits(getTotalAmountsResult?.[0])
      const amt1 = ethers.utils.formatUnits(getTotalAmountsResult?.[1])
      console.log('=balanceOfResult', balanceOfResult.toString())
      setShares(shares)
      setBalance(Big(Big(amt0).plus(amt1)).times(shares).div(totalSupply).toFixed())
    }
  }

  const getOwner = async () => {
    const contract = new ethers.Contract(ichiAddress, ICHI_ABI, provider)
    const response = await contract.owner()
    setOwner(response)
  }
  const handleSuccess = () => {
    onSuccess?.()
    setUpdater(Date.now())
  }

  const handleDepositOrWithdraw = (updateState: any) => {

    const abi = isDeposit ? (isBera ? ETHVaultWithSlippage_ABI : ICHIVaultDepositGuard_ABI) : ICHI_ABI
    const method = isDeposit ? (isBera ? "depositETH" : "forwardDepositToICHIVault") : "withdraw"

    const toastId = toast?.loading({
      title: isDeposit ? "Depositing..." : "Withdrawing..."
    });
    updateState({
      isLoading: true,
    });


    const contract = new ethers.Contract(
      isDeposit ? vaultAddress : ichiAddress,
      abi,
      provider?.getSigner()
    );
    if (isDeposit) {
      const wei = ethers.utils.parseUnits(
        Big(inAmount).toFixed(token0?.decimals),
        token0?.decimals
      );
      executionContract({
        contract,
        method,
        params: isBera ? [0, account] : [ichiAddress, owner, token0?.address, wei, 0, account]
      }).then((receipt: any) => {
        const { status, transactionHash } = receipt;
        const addParams = {
          type: 'Staking',
          action: 'Staking',
          token: {
            symbol: token0?.symbol
          },
          amount: inAmount,
          template,
          status: status,
          add: 1,
          transactionHash,
          chain_id: chainId,
          sub_type: 'Stake',
        }
        addAction?.(addParams);
        updateState({
          isLoading: false
        });
        setTimeout(() => {
          handleSuccess?.();
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
      const wei = ethers.utils.parseUnits(
        Big(shares).times(percentage).div(100).toFixed(18),
        18
      );
      executionContract({
        contract,
        method,
        params: [wei, account]
      }).then((receipt: any) => {
        updateState({
          isLoading: false,
        });
        const { status, transactionHash } = receipt;
        const addParams = {
          type: 'Staking',
          action: 'UnStake',
          token: {
            symbol: token0?.symbol
          },
          amount: inAmount,
          template,
          status: status,
          add: 0,
          transactionHash,
          chain_id: chainId,
          sub_type: 'Unstake',
        }
        addAction?.(addParams);
        setTimeout(() => {
          handleSuccess?.();
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

  const onTokenChange = (token: any) => {
    setToken1(token)
  }


  useEffect(() => {
    if (show && account && token0 && ichiAddress) {
      getBalance()
    }
  }, [account, token0, show, updater, isBera, ichiAddress])

  useEffect(() => {
    if (show && ichiAddress) {
      getOwner()
    }
  }, [show, ichiAddress])

  useEffect(() => {
    if (config) {
      setVaultAddress(isBera ? config?.ETHVaultWithSlippage : config?.ICHIVaultDepositGuard)
    }
  }, [isBera, config])

  useEffect(() => {
    // console.log('====token1', token1)
    setApr(token1?.apr)
    setIchiAddress(token1?.ichiAddress)
    setValues(token1?.values)
  }, [token1])

  useEffect(() => {
    // console.log('====data', data)
    if (show) {
      if (data?.pairedTokens) {
        const _pairedTokens = data?.pairedTokens
        const _token1 = _pairedTokens?.[0]
        const token = _.cloneDeep(data)
        delete token.pairedTokens

        setToken0(token)
        setToken1(_token1)
        setPairedTokens(_pairedTokens)
      } else {
        setToken0(data?.token0)
        setToken1(data?.token1)
      }
      setIsDeposit(type === 0 ? true : false)
    } else {
      setBalance("")
      setInAmount("")
      setToken0(null)
      setToken1(null)
      setIsDeposit(true)
      setRangeIndex(-1)
      setPercentage(0)
    }
  }, [show, type, data])
  return (
    <>

      <Modal open={show} onClose={onClose}>
        <div className='w-[496px] md:w-full pt-[23px] px-[20px] pb-[20px] border border-[#000000] rounded-[20px] md:rounded-b-none bg-[#FFFDEB] shadow-[10px_10px_0px_0px_#00000040]'>
          <div className='text-black font-Montserrat text-[16px] font-semibold leading-[100%] mb-[25px]'>{isDeposit ? "Deposit" : "Withdraw"}</div>

          <div className='flex items-center gap-[16px]'>
            <div className='flex-1 h-[60px] flex items-center pl-[14px] rounded-[8px] border border-[#373A53]'>
              <div className='flex items-center gap-[10px]'>
                <div className='w-[36px] h-[36px] rounded-full overflow-hidden'>
                  <img className='w-full' src={token0?.icon} alt={token0?.symbol} />
                </div>
                <div className='text-black font-Montserrat text-[16px] font-semibold leading-[90%]'>{token0?.symbol}</div>
              </div>
            </div>

            <div
              className='flex-1 h-[60px] gap-[8px] flex items-center pl-[14px] rounded-[8px] border border-[#373A53]'
              onClick={() => {
                pairedTokens?.length > 0 && setTokenSelectorShow(true)
              }}
            >
              <div className='flex items-center gap-[10px]'>
                <div className='w-[36px] h-[36px] rounded-full overflow-hidden'>
                  <img className='w-full' src={token1?.icon} alt={token1?.symbol} />
                </div>
                <div className='text-black font-Montserrat text-[16px] font-semibold leading-[90%]'>{token1?.symbol}</div>
              </div>
              {
                pairedTokens?.length > 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                    <path d="M1 1L6 5L11 1" stroke="black" stroke-width="2" stroke-linecap="round" />
                  </svg>
                )
              }
            </div>
          </div>

          <div className='flex items-center justify-between my-[24px]'>
            <div className='text-black font-Montserrat text-[16px] font-semibold leading-[90%]'>7-day Fee APR</div>
            <div className='text-[#7EA82B] font-Montserrat text-[16px] font-semibold leading-[90%]'>{formatValueDecimal(apr, '', 2, false, false)}%</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-black font-Montserrat text-[16px] font-semibold leading-[90%]'>{isDeposit ? "Deposit Amounts" : "Withdrawing"}</div>

            {
              isDeposit ? (
                <>
                  {
                    token0?.symbol === "WBERA" && (
                      <div className='flex items-center gap-[10px]'>
                        <div
                          className={clsx('py-[6px] px-[10px] rounded-[13px] border border-black text-black font-Montserrat text-[16px] font-semibold leading-[90%] cursor-pointer', isBera ? 'bg-[#FFDC50]' : '')}
                          onClick={() => setIsBera(true)}
                        >
                          BERA
                        </div>
                        <div
                          className={clsx('py-[6px] px-[10px] rounded-[13px] border border-black text-black font-Montserrat text-[16px] font-semibold leading-[90%] cursor-pointer', !isBera ? 'bg-[#FFDC50]' : '')}
                          onClick={() => setIsBera(false)}
                        >
                          WBERA
                        </div>
                      </div>
                    )
                  }
                </>
              ) : (
                <div className='flex items-center gap-[9px]'>
                  <div className='w-[36px] h-[36px] rounded-full overflow-hidden'>
                    <img src={token0?.icon} alt={token0?.symbol} />
                  </div>
                  <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{isBera ? "BERA" : token0?.symbol}</span>
                </div>
              )
            }

          </div>

          {
            isDeposit && (
              <div className="mt-[12px] mb-[20px] flex flex-col gap-[9px] h-[90px] rounded-[12px] border border-[#373A53] bg-white">
                <div className="pt-[18px] pl-[13px] pr-[20px] flex items-center justify-between">
                  <div className='flex-1'>
                    <input
                      type='number'
                      className='w-full text-[26px] text-black font-bold leading-[90%] bg-transparent' placeholder='0'
                      value={inAmount}
                      onChange={(event) => handleAmountChange(event?.target?.value)}
                    />
                  </div>
                  <div className='flex items-center gap-[9px]'>
                    <div className='w-[36px] h-[36px] rounded-full overflow-hidden'>
                      <img src={token0?.icon} alt={token0?.symbol} />
                    </div>
                    <span className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{isBera ? "BERA" : token0?.symbol}</span>
                  </div>
                </div>
                <div className="flex justify-end pr-[20px]">
                  <div className="text-[#3D405A] font-Montserrat text-[12px] font-medium">balance: <span className='underline cursor-pointer' onClick={handleMax}>{formatValueDecimal(balance, '', 2)}</span></div>
                </div>
              </div>
            )
          }

          <div className="mt-[12px] mb-[24px] flex md:flex-col items-center md:items-stretch gap-[24px]">
            <div className="flex items-center gap-[8px]">
              {RangeList.map((range: number, index: number) => (
                <div
                  key={index}
                  className={clsx([
                    "cursor-pointer w-[48px] h-[22px] flex items-center justify-center rounded-[6px] border border-[#373A53] text-black font-Montserrat text-[14px]",
                    index === rangeIndex ? "bg-[#FFDC50]" : ""
                  ])}
                  onClick={() => {
                    const amount = Big(balance ?? 0)
                      .times(range)
                      .toFixed();
                    setRangeIndex(index)
                    setInAmount(amount)
                    setPercentage(getPercentage(amount))

                  }}
                >
                  {range === 1 ? "Max" : range * 100 + "%"}
                </div>
              ))}
            </div>
            <Range
              value={percentage}
              onChange={(e) => {
                const percentage = e.target.value;
                setRangeIndex(RangeList.findIndex((range) =>
                  Big(range).eq(Big(percentage).div(100))
                ))
                setInAmount(Big(balance ? balance : 0)
                  .times(Big(percentage).div(100))
                  .toFixed())
                setPercentage(percentage)
              }}
              style={{
                marginTop: 0,
                flex: 1
              }}
            />
          </div>

          {
            !isDeposit && (
              <div className='mt-[-16px] mb-[8px] flex justify-end'>
                <div className='flex flex-col gap-[2px]'>
                  <div className='text-[#3D405A] font-Montserrat text-[12px] font-medium'>{formatValueDecimal(Big(values?.[0] ?? 0).times(percentage).div(100).toFixed(), '', 2)} {token0?.symbol}</div>
                  <div className='text-[#3D405A] font-Montserrat text-[12px] font-medium'>{formatValueDecimal(Big(values?.[1] ?? 0).times(percentage).div(100).toFixed(), '', 2)} {token1?.symbol}</div>
                </div>
              </div>
            )
          }
          {
            isDeposit ? (
              <Button
                {...{
                  type: "deposit",
                  symbol: token0?.symbol,
                  amount: inAmount,
                  template,
                  decimals: token0?.decimals,
                  balance,
                  address: token0?.address,
                  vaultAddress,
                  onDepositOrWithdraw: handleDepositOrWithdraw
                }}
              >
                Deposit
              </Button>
            ) : (
              <Button
                {...{
                  type: "widthdraw",
                  symbol: token0?.symbol,
                  amount: inAmount,
                  template,
                  decimals: token0?.decimals,
                  balance,
                  address: token0?.address,
                  vaultAddress,
                  onDepositOrWithdraw: handleDepositOrWithdraw
                }}
              >
                Widthdraw
              </Button>
            )
          }
        </div>
      </Modal>
      <TokenSelector
        show={tokenSelectorShow}
        tokenList={pairedTokens}
        token={token1}
        onTokenSelect={onTokenChange}
        onClose={() => {
          setTokenSelectorShow(false);
        }}
      />
    </>


  )
})