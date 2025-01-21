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
import { useConnectedWalletsStore } from '@/stores/useConnectedWalletsStore';
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import IconCopy from "@public/images/near-intents/images/copy.svg";
import IconDisconnect from "@public/images/near-intents/images/disconnect.svg";
import useToast from "@/hooks/use-toast";

const Portfolio = () => {
  const [assetList, setAssetList] = useState<SelectItemToken[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { data, isLoading } = useTokensStore((state) => state);
  
  const { setModalType } = useModalStore(
    (state) => state
  )

  const toast = useToast();
  
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

  const { 
    connectedWallets,
    addWallet,
    isWalletConnected,
    removeWallet 
  } = useConnectedWalletsStore();

  useEffect(() => {
    const checkNearRedirectStatus = async () => {
      if (isNearRedirecting && nearWallet.accountId) {
        addWallet({
          ...state,
          chainType: ChainType.Near,
          address: nearWallet.accountId
        });
        setIsNearRedirecting(false);
        setPendingChainType(null);
      }
    };

    checkNearRedirectStatus();
  }, [isNearRedirecting, nearWallet.accountId, state]);

  useEffect(() => {
    const checkWalletConnections = async () => {
      if (isEvmConnected && address) {
        addWallet({
          ...state,
          chainType: ChainType.EVM,
          address
        });
      }

      if (isSolConnected && solanaWallet.publicKey) {
        addWallet({
          ...state,
          chainType: ChainType.Solana,
          address: solanaWallet.publicKey.toString()
        });
      }

      if (nearWallet.accountId) {
        addWallet({
          ...state,
          chainType: ChainType.Near,
          address: nearWallet.accountId
        });
      }
    };

    checkWalletConnections();
  }, [isEvmConnected, address, isSolConnected, solanaWallet.publicKey, nearWallet.accountId]);

  const handleWalletClick = async (chainType: ChainType) => {
    if (!isWalletConnected(chainType)) {
      try {
        await signIn({ id: chainType });
        setPendingChainType(chainType);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        setIsNearRedirecting(false);
      }
    }
  };

  const renderWalletStatus = () => {
    const getWalletStyle = (walletType: ChainType) => {
      return !isWalletConnected(walletType) ? 'opacity-30' : '';
    };

    const WalletList = () => {
      const getWalletIcon = (chainType: ChainType) => {
        switch (chainType) {
          case ChainType.EVM:
            return "/images/near-intents/icons/wallets/evm.png";
          case ChainType.Solana:
            return "/images/near-intents/icons/wallets/sol.png";
          case ChainType.Near:
            return "/images/near-intents/icons/wallets/near.png";
        }
      };

      const getProtocolName = (chainType: ChainType) => {
        switch (chainType) {
          case ChainType.EVM:
            return "EVM Protocol";
          case ChainType.Solana:
            return "Solana Protocol";
          case ChainType.Near:
            return "Near Protocol";
        }
      };

      const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        toast.success({
          title: 'Copied to clipboard',
        })
      };

      const handleDisconnect = async (chainType: ChainType) => {
        try {
          await signOut({ id: chainType });
          removeWallet(chainType);
        } catch (error) {
          console.error('Failed to disconnect:', error);
        }
      };

      return (
        <div className="bg-[#FFFDEB] rounded-[20px] shadow-shadow1 w-[320px] py-5 px-3 border border-black overflow-hidden">
          {connectedWallets.map((wallet) => (
            <div key={wallet.chainType} className={`flex p-2.5 bg-black bg-opacity-5 rounded-[10px] items-center gap-2 cursor-pointer ${
              wallet.chainType !== connectedWallets[0].chainType ? 'mt-2.5' : ''
            }`}>
              <div className="w-[39px] h-[39px] flex items-center justify-center">
                <img 
                  src={getWalletIcon(wallet.chainType)} 
                  alt={wallet.chainType} 
                  className="w-full h-full" 
                />
              </div>
              <div className="flex flex-col gap-1 font-Montserrat">
                <span className="font-semibold">
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </span>
                <span className="text-sm text-[#6F6F6F]">
                  {getProtocolName(wallet.chainType)}
                </span>
              </div>
              <div className="flex gap-5 items-center ml-auto">
                <IconCopy 
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => handleCopy(wallet.address || '')} 
                />
                <IconDisconnect 
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => handleDisconnect(wallet.chainType)} 
                />
              </div>
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="flex items-center bg-[#FFDC50] justify-between border-b border-[#373A53] pt-[20px] pb-[12px] pl-[26px] pr-[20px]">
        <span className="font-Montserrat font-[600]">Connected</span>
        <Popover
          trigger={PopoverTrigger.Hover}
          placement={PopoverPlacement.BottomLeft}
          offset={0}
          content={connectedWallets.length > 0 ? ( <WalletList />) : null}>
            <div className="flex items-center gap-2.5">
              <img 
                src="/images/near-intents/icons/wallets/evm.png" 
                className={`w-[32px] h-[32px] cursor-pointer ${getWalletStyle(ChainType.EVM)}`} 
                onClick={() => handleWalletClick(ChainType.EVM)}
                alt="EVM" 
              />
              <img 
                src="/images/near-intents/icons/wallets/sol.png" 
                className={`w-[32px] h-[32px] cursor-pointer ${getWalletStyle(ChainType.Solana)}`}
                onClick={() => handleWalletClick(ChainType.Solana)} 
                alt="Solana" 
              />
              <img 
                src="/images/near-intents/icons/wallets/near.png" 
                className={`w-[32px] h-[32px] cursor-pointer ${getWalletStyle(ChainType.Near)}`}
                onClick={() => handleWalletClick(ChainType.Near)} 
                alt="NEAR" 
              />
            </div>
         </Popover>
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