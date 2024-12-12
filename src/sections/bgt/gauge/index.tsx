import multicallAddresses from '@/configs/contract/multicall';
import useCustomAccount from '@/hooks/use-account';
import useAddAction from '@/hooks/use-add-action';
import { ABI, useBGT, VAULT_ADDRESS_ABI } from '@/hooks/use-bgt';
import useGauge from '@/hooks/use-gauge';
import useIsMobile from '@/hooks/use-isMobile';
import { useMultiState } from '@/hooks/use-multi-state';
import useToast from '@/hooks/use-toast';
import BgtGaugeLaptop from '@/sections/bgt/gauge/laptop';
import BgtGaugeMobile from '@/sections/bgt/gauge/mobile';
import { usePriceStore } from '@/stores/usePriceStore';
import Big from 'big.js';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';


const TABS = [
  {
    value: 'deposit',
    label: 'Deposit',
    disabled: false
  },
  {
    value: 'withdraw',
    label: 'Withdraw',
    disabled: false
  }
];
const RangeList = [0.25, 0.5, 0.75, 1]
const rewardSymbol = "BGT"
const template = "BGTStation"
const decimals = 18

const BgtGauge = (props: any) => {
  const { id } = props;
  const isMobile = useIsMobile();
  const { data: bgtData } = useBGT();
  const { data: gaugeData } = useGauge(id)

  const toast = useToast()
  const { addAction } = useAddAction("gauge");
  const [currentTab, setCurrentTab] = useState<"deposit" | "withdraw">(TABS[0].value);
  const { account, provider, chainId } = useCustomAccount()

  const multicallAddress = multicallAddresses[chainId];
  const [state, updateState] = useMultiState({
    stakeAddress: "",
    vaultAddress: "",
    balance: "",
    depositAmount: "",
    earned: "",
    totalSupply: "",
    inAmount: "",
    isApproved: true,
    isApproving: false,
    updater: 0,
    rangeIndex: -1,
    percentage: 0,
    claimLoading: false,
  })
  const prices: any = usePriceStore(store => store.price);
  const getBalance = async (stakingTokenAddress, vaultAddress) => {
    const contract = new ethers.Contract(currentTab === "deposit" ? stakingTokenAddress : vaultAddress, ABI, provider)
    const response = await contract.balanceOf(account)
    updateState({
      balance: ethers.utils.formatUnits(response),
    })
  }
  const getDepositAmount = async (vaultAddress) => {
    const contract = new ethers.Contract(vaultAddress, ABI, provider)
    const response = await contract.balanceOf(account)
    updateState({
      depositAmount: ethers.utils.formatUnits(response)
    })
  }
  const getEarned = async (vaultAddress) => {
    const contract = new ethers.Contract(vaultAddress, VAULT_ADDRESS_ABI, provider)
    const response = await contract.earned(account)
    updateState({
      earned: ethers.utils.formatUnits(response)
    })
  }
  const getTotalsupply = async (vaultAddress) => {
    const contract = new ethers.Contract(vaultAddress, ABI, provider)
    const response = await contract.totalSupply()

    console.log('===totalSupply111', ethers.utils.formatUnits(response))
    updateState({
      totalSupply: ethers.utils.formatUnits(response)
    })
  }
  const getContractData = () => {
    const {
      stakingTokenAddress,
      vaultAddress
    } = gaugeData
    updateState({
      stakeAddress: stakingTokenAddress,
      vaultAddress
    })

    try {
      getBalance(stakingTokenAddress, vaultAddress)
      getEarned(vaultAddress)
      getDepositAmount(vaultAddress)
      getTotalsupply(vaultAddress)
    } catch (error) {
      console.error(error)
    }
  }

  const ellipsAddress = (address?: string) => {
    if (!address || !ethers.utils.isAddress(address)) return '-';
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  const handleClaim = () => {
    const toastId = toast?.loading({
      title: `Claim...`
    });
    updateState({
      claimLoading: true
    })
    const contract = new ethers.Contract(state?.vaultAddress, VAULT_ADDRESS_ABI, provider?.getSigner())
    contract
      .getReward(account)
      .then(tx => tx.wait())
      .then((receipt: any) => {
        const { status, transactionHash } = receipt;

        addAction?.({
          type: 'Staking',
          action: 'Claim',
          token: {
            symbol: rewardSymbol
          },
          amount: state?.earned,
          template,
          status: status,
          transactionHash,
          chain_id: chainId,
          sub_type: "Claim"
        });
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Claim Successful!'
        });
        updateState({
          claimLoading: false
        })
        setTimeout(() => {
          onSuccess?.()
        }, 3000)
      }).catch((error: Error) => {
        console.log('error: ', error);
        updateState({
          claimLoading: false
        })
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Claim Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  }

  const getPercentage = (_amount: string) => {
    _amount = Big(_amount).gt(state?.balance) ? state?.balance : _amount
    return Big(state?.balance).eq(0) ? 0 : Big(_amount).div(state?.balance ?? 1).times(100).toFixed()
  }

  const handleAmountChange = (_amount: string) => {
    const amount = _amount.replace(/\s+/g, '');
    if (isNaN(Number(amount))) return;
    if (!amount) {
      updateState({
        inAmount: amount,
        percentage: 0,
        rangeIndex: -1
      });
      return;
    }
    const percentage = getPercentage(amount)
    const rangeIndex = RangeList.findIndex((range) =>
      Big(range).eq(Big(percentage).div(100))
    )
    updateState({
      inAmount: amount,
      percentage,
      rangeIndex
    })
  };
  const handleMax = () => {
    handleAmountChange(state?.balance)
  }


  const onSuccess = () => {
    updateState({
      inAmount: "",
      updater: Date.now(),
    })
  }
  useEffect(() => {
    console.log('====gaugeData', gaugeData)
    if (account && provider && gaugeData && currentTab) {
      getContractData()
    }
  }, [account, provider, gaugeData, currentTab, state?.updater])

  useEffect(() => {
    updateState({
      inAmount: "",
      rangeIndex: -1,
      percentage: 0
    })
  }, [currentTab])
  return (
    <>
      {isMobile ? (
        <BgtGaugeMobile
          {...{
            ...props,
            ABI,
            VAULT_ADDRESS_ABI,
            TABS,
            RangeList,
            rewardSymbol,
            getPercentage,
            template,
            decimals,
            state,
            prices,
            updateState,
            bgtData,
            gaugeData,
            currentTab,
            setCurrentTab,
            ellipsAddress,
            handleClaim,
            handleAmountChange,
            handleMax,
            onSuccess,
            addAction,

          }}
        />
      ) : (
        <BgtGaugeLaptop
          {...{
            ...props,
            ABI,
            VAULT_ADDRESS_ABI,
            TABS,
            RangeList,
            rewardSymbol,
            getPercentage,
            template,
            decimals,
            state,
            prices,
            updateState,
            bgtData,
            gaugeData,
            currentTab,
            setCurrentTab,
            ellipsAddress,
            handleClaim,
            handleAmountChange,
            handleMax,
            onSuccess,
            addAction
          }}
        />
      )}
    </>
  );
};

export default BgtGauge;
