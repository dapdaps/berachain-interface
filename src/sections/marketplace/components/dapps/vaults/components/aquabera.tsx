import Modal from '@/components/modal';
import SwitchTabs from '@/components/switch-tabs';
import useCustomAccount from '@/hooks/use-account';
import useAddAction from '@/hooks/use-add-action';
import useExecutionContract from '@/hooks/use-execution-contract';
import useToast from '@/hooks/use-toast';
import Capsule from '@/sections/marketplace/components/dapps/capsule';
import Button from '@/sections/staking/Bridge/Button';
import { ERC20_ABI, ICHI_ABI } from '@/sections/staking/Datas/AquaBera';
import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import { ethers } from 'ethers';
import _ from 'lodash';
import { memo, useEffect, useState } from "react";
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

const template = "AquaBera"
export default memo(function aquabera(props: any) {
  const {
    data,
    type,
    config,
    visible,
    setVisible
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

  const handleMax = () => {
    handleAmountChange(balance)
  }
  const getPercentage = (_amount: string) => {
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
    console.log('=getPercentage(amount)', getPercentage(amount))
    setInAmount(amount)
    setPercentage(getPercentage(amount))
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
          onSuccess?.()
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
    console.log('===token', token)
    setToken1(token)
  }

  const handleClose = () => {
    setVisible(false)
  };

  useEffect(() => {
    if (visible && account && token0 && ichiAddress) {
      getBalance()
    }
  }, [account, token0, visible, updater, isBera, ichiAddress])

  useEffect(() => {
    if (visible && ichiAddress) {
      getOwner()
    }
  }, [visible, ichiAddress])

  useEffect(() => {
    if (config) {
      setVaultAddress(isBera ? config?.ETHVaultWithSlippage : config?.ICHIVaultDepositGuard)
    }
  }, [isBera, config])

  useEffect(() => {
    setApr(token1?.apr)
    setIchiAddress(token1?.ichiAddress)
  }, [token1])

  useEffect(() => {
    // console.log('====data', data)
    if (visible) {
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
  }, [visible, type, data])
  return (
    <Modal open={visible} onClose={handleClose}>
      <div className='px-[20px] pt-[24px] pb-[20px] lg:w-[520px] rounded-[20px] bg-[#FFFDEB] border border-[#000] shadow-shadow1 z-[51]'>
        <div className='flex items-center gap-[9px] text-black text-[20px] font-[700] leading-[90%]'>
          <span>{`Invest ${token0?.symbol}`}</span>
          <Capsule>Valuts</Capsule>
        </div>
        <div className='mt-[40px]'>
          <SwitchTabs
            tabs={TABS}
            current={isDeposit ? TABS[0]?.value : TABS[1]?.value}
            onChange={(current) => {
              setIsDeposit(current === TABS[0]?.value)
            }}
          />

          <div className='flex items-center mt-[34px] mb-[33px]'>
            <div className='flex-1 flex flex-col gap-[14px]'>
              <div className='text-black font-Montserrat text-[14px] font-medium'>
                APY
              </div>
              <div className='text-black font-Montserrat text-[20px] font-bold'>
                {formatValueDecimal(apr, '', 2)}%
              </div>
            </div>
            <div className='flex-1 flex flex-col gap-[14px]'>
              <div className='text-black font-Montserrat text-[14px] font-medium'>
                My Vault Deposits
              </div>
              <div className='flex items-center gap-[6px]'>
                <div className='flex items-center'>
                  <div className='w-[26px] h-[26px] rounded-full'>
                    <img src={token0?.icon} />
                  </div>

                </div>
                <div className='text-black font-Montserrat text-[20px] font-bold'>
                  {formatValueDecimal(token1?.yourValue, '', 2, true, false)}
                </div>
                <div className='text-black font-Montserrat text-[14px] font-medium'>
                  {token0?.symbol}
                </div>
              </div>
            </div>


          </div>

          <div className='flex items-center justify-between'>
            <div className='text-black font-Montserrat text-[14px] font-medium'>
              {isDeposit ? "Deposit" : "Withdraw"}
            </div>
            <div
              className='text-black font-Montserrat text-[14px] font-medium'
              onClick={handleMax}
            >
              Balance:{' '}
              <span className='underline'>
                {formatValueDecimal(balance, '', 2)}
              </span>
            </div>
          </div>

          <div className='relative mt-[9px] mb-[19px]'>
            <input
              value={inAmount}
              type='number'
              onChange={(e) => handleAmountChange(e.target.value)}
              className='w-full h-[72px] pl-[20px] pr-[110px] bg-white border border-[#373A53] rounded-[12px] text-[26px] font-[700]'
              placeholder='0'
            />
            <div className='absolute right-[16px] top-1/2 translate-y-[-50%] flex items-center gap-[8px]'>
              <div className='flex items-center'>
                <div className='w-[30px] h-[30px] rounded-full'>
                  <img src={token0?.icon} alt={token0?.symbol} />
                </div>
              </div>
              <div className='text-black font-Montserrat text-[16px] font-semibold leading-[100%]'>
                {token0?.symbol}
              </div>
            </div>
          </div>
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
          <div className='mt-[16px] text-[#979ABE] font-Montserrat text-[14px] text-center'>
            Manage exist assets on{' '}
            <span
              className='text-black font-Montserrat underline'
              onClick={() => {
                router.push('/staking/aquabera');
              }}
            >
              AquaBera
            </span>
          </div>
        </div>
      </div>
    </Modal>
  )
})
