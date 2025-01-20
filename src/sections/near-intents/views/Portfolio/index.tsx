import { useEffect, useState } from "react";
import { Text } from "@radix-ui/themes";
import IconHistory from "@public/images/near-intents/icons/history.svg";
import { SelectItemToken } from "../../components/Modal/ModalSelectAssets";
import { useTokensStore } from "../../providers/TokensStoreProvider";
import { computeTotalBalance } from "../../utils/tokenUtils";
import { formatTokenValue } from "../../utils/format";
import { BaseTokenInfo, UnifiedTokenInfo } from "../../types/base";
import History from "./History";
import { useModalStore } from "../../providers/ModalStoreProvider";
import { ModalType } from "../../stores/modalStore";
import { ChainType, useConnectWallet } from "../../hooks/useConnectWallet";
import { useAccount } from "wagmi";
import { useWalletSelector } from "../../providers/WalletSelectorProvider"; 
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useWalletConnectStore } from "../../providers/WalletConnectStoreProvider";
import { useSelector } from "@xstate/react";
import { SwapUIMachineContext } from "../../features/swap/components/SwapUIMachineProvider";
import { useNearConnectStore } from "@/stores/useNearConnectStore";

const Portfolio = () => {
  const [assetList, setAssetList] = useState<SelectItemToken[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { data, isLoading } = useTokensStore((state) => state);
  
  const { setModalType } = useModalStore(
    (state) => state
  )
  const { state, signIn, signOut } = useConnectWallet();
  
  const { isConnected: isEvmConnected, address } = useAccount();
  const nearWallet = useWalletSelector();
  const solanaWallet = useSolanaWallet();
  const isSolConnected = solanaWallet.connected;
  const swapUIActorRef = SwapUIMachineContext.useActorRef()

  const { 
    pendingChainType,
    previousChainType, 
    isNearRedirecting,
    setPendingChainType,
    setPreviousChainType,
    setIsNearRedirecting 
  } = useWalletConnectStore(state => state);

  useEffect(() => {
    console.log(nearWallet.accountId, 'accountId')
    console.log(previousChainType, 'previousChainTypepreviousChainTypepreviousChainType')

    const checkNearRedirectStatus = async () => {
      // 只在 NEAR 重定向回来且成功连接时处理
      if (isNearRedirecting && nearWallet.accountId) {
        // 成功连接 NEAR 后，再断开之前的连接
        if (previousChainType && previousChainType !== ChainType.Near) {
          await signOut({ id: previousChainType });
        }
        setIsNearRedirecting(false);
        setPendingChainType(null);
      }
    };

    checkNearRedirectStatus();
  }, [isNearRedirecting, nearWallet.accountId]);

  useEffect(() => {
    const checkNonNearWalletStatus = async () => {
      if (!pendingChainType || pendingChainType === ChainType.Near || isNearRedirecting) return;

      let isNewWalletConnected = false;
      switch (pendingChainType) {
        case ChainType.EVM:
          isNewWalletConnected = isEvmConnected;
          break;
        case ChainType.Solana:
          isNewWalletConnected = isSolConnected;
          break;
      }

      if (isNewWalletConnected) {
        if (previousChainType && previousChainType !== pendingChainType) {
          await signOut({ id: previousChainType });
        }
        setPendingChainType(null);
      }
    };

    checkNonNearWalletStatus();
  }, [isEvmConnected, isSolConnected, pendingChainType]);

  const handleWalletClick = async (chainType: ChainType) => {
    if (state.chainType === chainType) return;
    
    try {
      // 在切换开始前记录当前状态
      if (state.chainType) {
        setPreviousChainType(state.chainType);
      }
      setPendingChainType(chainType);
         
      await signIn({ id: chainType });

      if (chainType === ChainType.Near) {
        setIsNearRedirecting(true);
      }

    } catch (error) {
      console.error('Failed to switch wallet:', error);
      setPendingChainType(null);
      setIsNearRedirecting(false);
    }
  };

  const renderWalletStatus = () => {
    const getOpacityClass = (walletType: ChainType) => {
      if (!state.chainType) return 'opacity-30';
      return state.chainType === walletType ? '' : 'opacity-30';
    };

    return (
      <div className="flex items-center bg-[#FFDC50] justify-between border-b border-[#373A53] pt-[20px] pb-[12px] pl-[26px] pr-[20px]">
        <span className="font-Montserrat font-[600]">Connected</span>
        {/* {!state.chainType ? (
          <span className="font-Montserrat font-[600]">-</span>
        ) : ( */}
          <div className="flex items-center gap-2.5">
            <img 
              src="/images/near-intents/icons/wallets/evm.png" 
              className={`w-[32px] h-[32px] cursor-pointer ${getOpacityClass(ChainType.EVM)}`} 
              onClick={() => handleWalletClick(ChainType.EVM)}
              alt="" 
            />
            <img 
              src="/images/near-intents/icons/wallets/sol.png" 
              className={`w-[32px] h-[32px] cursor-pointer ${getOpacityClass(ChainType.Solana)}`}
              onClick={() => handleWalletClick(ChainType.Solana)} 
              alt="" 
            />
            <img 
              src="/images/near-intents/icons/wallets/near.png" 
              className={`w-[32px] h-[32px] cursor-pointer ${getOpacityClass(ChainType.Near)}`}
              onClick={() => handleWalletClick(ChainType.Near)} 
              alt="" 
            />
          </div>
        {/* )} */}
      </div>
    );
  };

  const depositedBalanceRef = useSelector(
    swapUIActorRef,
    (state) => state.children.depositedBalanceRef
  )

  useEffect(() => {
    if (!data.size && !isLoading) {
      return;
    }
    const balancesContext = depositedBalanceRef?.getSnapshot().context.balances

    const getAssetList: SelectItemToken[] = [];

    for (const [tokenId, token] of data) {
      const totalBalance = computeTotalBalance(token, balancesContext ?? {});

      getAssetList.push({
        itemId: tokenId,
        token,
        disabled: false,
        balance:
          totalBalance == null
            ? undefined
            : {
                balance: totalBalance.toString(),
                balanceUsd: undefined,
                convertedLast: undefined,
              },
      });
    }
    
    getAssetList.sort((a, b) => {
      if (a.balance?.balance === "0") return 1;
      if (b.balance?.balance === "0") return -1;
      return 0;
    });

    setAssetList(getAssetList);
    useNearConnectStore.getState().setState(state)

  }, [data, isLoading, depositedBalanceRef, state.address]);

  const renderMainContent = () => (
    <div className="px-[20px] py-[16px] pb-[30px]">
      <div className="flex items-center justify-between">
        <div className="font-CherryBomb text-[26px]">Assets</div>
        {/* <IconHistory 
          className="opacity-30 cursor-pointer hover:opacity-60" 
          onClick={() => setShowHistory(true)}
        /> */}
      </div>
      <div className="flex items-center justify-between gap-2 my-5">
        <button disabled={!state.address} className="w-1/2 h-[50px] bg-[#FFDC50] border border-black text-[14px] rounded-[10px] font-Montserrat font-[600] disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => setModalType(ModalType.MODAL_REVIEW_DEPOSIT)}>
          Deposit
        </button>
        <button disabled={!state.address} className="w-1/2 h-[50px] bg-[#FFDC50] border border-black text-[14px] rounded-[10px] font-Montserrat font-[600] disabled:opacity-30 disabled:cursor-not-allowed" onClick={() => setModalType(ModalType.MODAL_REVIEW_WITHDRAW)}>
          Withdraw
        </button>
      </div>
      <div className="max-h-[500px] overflow-y-auto pb-6">
        {assetList.map(({ token, balance }, index) => (
          <div key={index} className={`flex items-center justify-between ${index === 0 ? '' : 'mt-5'} mb-5`}>
            <div className="flex items-center gap-2">
              <img src={token.icon} className="w-[30px] h-[30px] rounded-full" alt="" />
              <div className="font-Montserrat font-[600]">{token.symbol}</div>
            </div>
            <div className="font-Montserrat font-[600] opacity-30">
              {renderBalance(balance?.balance, token) || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-[340px] mr-5 bg-[#FFFDEB] h-[680px] border border-[#373A53] rounded-[30px] shadow-shadow1 overflow-hidden">
      {renderWalletStatus()}
      {showHistory ? (
        <History onBack={() => setShowHistory(false)} />
      ) : (
        renderMainContent()
      )}
    </div>
  );
};

function renderBalance(
  balance: string | undefined,
  token: BaseTokenInfo | UnifiedTokenInfo
) {
  return (
    <Text as="span" size="2" weight="medium">
      {balance != null
        ? formatTokenValue(balance, token.decimals, {
            min: 0.0001,
            fractionDigits: 4,
          })
        : null}
    </Text>
  );
}

export default Portfolio;