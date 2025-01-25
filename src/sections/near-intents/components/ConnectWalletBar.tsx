import { ChainType, useConnectWallet } from "../hooks/useConnectWallet";
import { useConnectedWalletsStore } from '@/stores/useConnectedWalletsStore';
import { useWalletConnectStore } from "../providers/WalletConnectStoreProvider";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import IconCopy from "@public/images/near-intents/images/copy.svg";
import IconDisconnect from "@public/images/near-intents/images/disconnect.svg";
import useToast from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useWalletSelector } from "../providers/WalletSelectorProvider";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import useIsMobile from "@/hooks/use-isMobile";
import clsx from "clsx";
import useUser from "@/hooks/use-user";


const ConnectWalletBar = () => {
 const toast = useToast();
 const isMobile = useIsMobile();
  
  const { state, signIn, signOut } = useConnectWallet();
  
  const { isConnected: isEvmConnected, address } = useAccount();
  const nearWallet = useWalletSelector();
  const solanaWallet = useSolanaWallet();
  const isSolConnected = solanaWallet.connected;

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

  const [evmUpdated, setEvmUpdated] = useState(false);
  const [solUpdated, setSolUpdated] = useState(false);
  const [nearUpdated, setNearUpdated] = useState(false);
  const { getAccessToken } = useUser();

  useEffect(() => {
    getAccessToken();
  }, [connectedWallets]);

  useEffect(() => {
    if (isEvmConnected && address ) {
      addWallet({
        ...state,
        chainType: ChainType.EVM,
        address
      });
    }
  }, [isEvmConnected, address]);

  useEffect(() => {
    if (!isEvmConnected && evmUpdated) {
      removeWallet(ChainType.EVM);
    }
  }, [isEvmConnected]);

  useEffect(() => {
    if (isSolConnected && solanaWallet.publicKey && !solUpdated) {
      addWallet({
        ...state,
        chainType: ChainType.Solana,
        address: solanaWallet.publicKey.toString()
      });
      setSolUpdated(true);
    } else if (!isSolConnected && solUpdated) {
      setSolUpdated(false);
    }
  }, [isSolConnected, solanaWallet.publicKey]);

  useEffect(() => {
    if (nearWallet.accountId && !nearUpdated) {
      addWallet({
        ...state,
        chainType: ChainType.Near,
        address: nearWallet.accountId
      });
      setNearUpdated(true);
    } else if (!nearWallet.accountId && nearUpdated) {
      setNearUpdated(false);
    }
  }, [nearWallet.accountId]);

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

  const handleWalletClick = async (chainType: ChainType) => {
    if (!isWalletConnected(chainType)) {
      try {
        await signIn({ id: chainType });
        setPendingChainType(chainType);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

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
    <div className={clsx(isMobile ? 'p-2.5 bg-[#FFF5A9] border border-[#4B371F] ml-auto w-[134px] h-[50px] rounded-xl' : 'flex items-center bg-[#FFDC50] justify-between border-b border-[#373A53] pt-[20px] pb-[12px] pl-[26px] pr-[20px]')}>
      <span className="font-Montserrat font-[600] md:hidden">Connected</span>
      <Popover
        trigger={PopoverTrigger.Hover}
        placement={PopoverPlacement.BottomLeft}
        offset={0}
        content={connectedWallets.length > 0 ? (<WalletList />) : null}>
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
}

export default ConnectWalletBar;