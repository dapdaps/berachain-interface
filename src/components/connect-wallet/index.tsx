"use client";

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAccount, useBalance, useDisconnect, useSwitchChain } from "wagmi";
import Image from "next/image";
import { icons } from "@/configs/chains";
import { motion } from "framer-motion";
import Big from "big.js";
import allTokens from "@/configs/allTokens";
import { utils } from "ethers";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import useToast from "@/hooks/use-toast";
import useUser from "@/hooks/use-user";
import Skeleton from "react-loading-skeleton";
import useIsMobile from "@/hooks/use-isMobile";
import MobileUser from "@/components/connect-wallet/user";
import MobileNetworks from "@/components/connect-wallet/networks";
import { useDebounceFn } from 'ahooks';
import LazyImage from '@/components/layz-image';
import { useWalletName } from '@/hooks/use-wallet-name';
import { ChainType, State } from "@/sections/near-intents/hooks/useConnectWallet";
import { usePathname, useRouter } from "next/navigation";
import { useConnectedWalletsStore } from "@/stores/useConnectedWalletsStore";
import MobileChain from "./chain/mobile";
const dropdownAnimations = {
  active: {
    opacity: [0, 1],
    y: [10, 0],
    display: "block",
  },
  default: {
    opacity: [1, 0],
    y: [0, 10],
    display: "none",
  },
};


import chains from '@/sections/bridge/lib/util/chainConfig'
import { useBgtCount } from "@/hooks/use-bgt-count";
import InviteModal from '../invite';
import { useInvite } from '../invite/use-invite';

const ConnectWallet = ({ className }: { className?: string }) => {
  const modal = useConnectModal();
  const { removeWallet } = useConnectedWalletsStore.getState();
  const currentWallet = useRef<State>();
  const [_, setUpdater] = useState({})

  useEffect(() => {
    const state = useConnectedWalletsStore.getState();
    currentWallet.current = state.connectedWallets.length === 0 ? undefined : state.connectedWallets[0];

    const unsubscribe = useConnectedWalletsStore.subscribe((state) => {
      if (!state) return;
      currentWallet.current = state.connectedWallets.length === 0 ? undefined : state.connectedWallets[0];
      setUpdater({})
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const pathname = usePathname();
  const isNearPage = ['/bintent', '/my-near-wallet-gateway', '/bintent-trading-challenge'].includes(pathname);
  const isMobile = useIsMobile();
  const total = useToast();
  const { address, isConnected, chainId, chain, isConnecting } = useAccount();
  const balance = useBalance({
    address
  });
  const { userInfo } = useUser();
  const walletInfo = useWalletName();

  const [connecting, setConnecting] = useState<boolean>(isConnecting);
  const [mobileUserInfoVisible, setMobileUserInfoVisible] =
    useState<boolean>(false);
  const [mobileNetworksVisible, setMobileNetworksVisible] =
    useState<boolean>(false);

  const chainListRef = useRef<any>();

  const handleConnect = function () {
    if (isMobile && isConnected) {
      setMobileUserInfoVisible(true);
      return;
    }

    !address && modal.openConnectModal?.();
  };

  const addressShown = useMemo(() => {
    if (isNearPage && currentWallet.current) {
      if (currentWallet.current.chainType === ChainType.Near && currentWallet.current?.address && currentWallet.current.address.length < 30) {
        return currentWallet.current.address;
      }
      return currentWallet.current.address && `${currentWallet.current.address.slice(0, 5)}...${currentWallet.current.address.slice(-4)}`;
    }
    if (!address) return "";
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  }, [address, isNearPage, isMobile, currentWallet.current]);

  const handleCopy = () => {
    const addr = isNearPage && currentWallet.current && currentWallet.current.address ? currentWallet.current.address : address;
    navigator.clipboard.writeText(addr as string);
    total.success({
      title: `Copied address ${address}`
    });
  };


  const balanceShown = useMemo(() => {
    if (balance?.data?.value) {
      return Big(
        utils.formatUnits(balance.data.value.toString(), balance.data.decimals)
      ).toFixed(3, 0);
    }
    return "0.000";
  }, [balance]);

  const tokenSymbolShown = useMemo(() => {
    if (balance?.data?.symbol) {
      return balance?.data?.symbol;
    }
    if (chain) {
      return chain.nativeCurrency?.symbol;
    }
    return "";
  }, [balance, chain]);

  const tokenLogoShown = useMemo(() => {
    const defaultLogo = "/images/tokens/default_icon.png";
    if (!chainId) {
      return defaultLogo;
    }
    const currChainTokens = allTokens[chainId];
    if (!currChainTokens) {
      return defaultLogo;
    }
    const currChainToken = currChainTokens.find(
      (it: any) => it.symbol === tokenSymbolShown
    );
    if (!currChainToken) {
      return defaultLogo;
    }
    return currChainToken.icon;
  }, [chainId, tokenSymbolShown]);

  const handleChainDropdown = () => {
    if (isMobile) {
      setMobileNetworksVisible(true);
      return;
    }
  };

  const { run: closeConnecting, cancel: cancelCloseConnecting } = useDebounceFn(
    () => {
      setConnecting(false);
    },
    { wait: 10000 }
  );

  useEffect(() => {
    cancelCloseConnecting();
    if (!isConnecting) {
      setConnecting(false);
      return;
    }
    setConnecting(true);
    closeConnecting();
  }, [isConnecting]);

  return (
    <>
      {connecting ? (
        <Skeleton
          width={isMobile ? 102 : 125}
          height={42}
          borderRadius={21}
          style={{ transform: "translateY(-4px)" }}
        />
      ) : (isConnected || (isNearPage && currentWallet.current)) ? (
        <div className="flex justify-start items-center gap-x-[20px] md:gap-x-[8px] pl-2 pr-3 md:min-w-[105px]">
          {isMobile ? (
            <>
              <User
                handleConnect={handleConnect}
                isMobile={isMobile}
                address={address}
                userInfo={userInfo}
                walletInfo={walletInfo}
                handleCopy={handleCopy}
                tokenLogoShown={tokenLogoShown}
                chainId={chainId}
                balanceShown={balanceShown}
                tokenSymbolShown={tokenSymbolShown}
                addressShown={addressShown}
                isNearPage={isNearPage}
                currentWallet={currentWallet.current}
                setMobileUserInfoVisible={setMobileUserInfoVisible}
              />
              {
                !isNearPage && (
                  <MobileChain
                    chainListRef={chainListRef}
                    handleChainDropdown={handleChainDropdown}
                  />
                )
              }
            </>
          ) : (
            <>
              <User
                handleConnect={handleConnect}
                isMobile={isMobile}
                address={address}
                userInfo={userInfo}
                walletInfo={walletInfo}
                handleCopy={handleCopy}
                tokenLogoShown={tokenLogoShown}
                chainId={chainId}
                balanceShown={balanceShown}
                tokenSymbolShown={tokenSymbolShown}
                addressShown={addressShown}
                isNearPage={isNearPage}
                currentWallet={currentWallet.current}
                removeWallet={removeWallet}
                setMobileUserInfoVisible={setMobileUserInfoVisible}
              />
            </>
          )}
        </div>
      ) : (
        <>
          <button
            className={`click cursor-pointer rounded-full px-[10px] py-[4px] text-[14px] font-semibold bg-black lg:shadow-shadow1 text-white whitespace-nowrap ${className}`}
            onClick={handleConnect}
          >
            Connect Wallet
          </button>
          {isMobile && (
            <div className="ml-[10px]">
              <MobileChain
                chainListRef={chainListRef}
                handleChainDropdown={handleChainDropdown}
              />
            </div>
          )}
        </>
      )}
      <MobileUser
        visible={mobileUserInfoVisible}
        setMobileUserInfoVisible={setMobileUserInfoVisible}
        onClose={() => {
          setMobileUserInfoVisible(false);
        }}
        walletInfo={walletInfo}
        addressShown={addressShown}
        address={address}
        tokenLogoShown={tokenLogoShown}
        balanceShown={balanceShown}
        tokenSymbolShown={tokenSymbolShown}
        chainId={chainId}
        handleDisconnect={() => void 0}
        handleCopy={handleCopy}
        userInfo={userInfo}
        isNearPage={isNearPage}
      />
      <MobileNetworks
        visible={mobileNetworksVisible}
        onClose={() => {
          setMobileNetworksVisible(false);
        }}
      />
    </>
  );
};

export default memo(ConnectWallet);

const User = (props: any) => {
  const {
    handleConnect,
    isMobile,
    address,
    userInfo,
    walletInfo,
    handleCopy,
    tokenLogoShown,
    chainId,
    balanceShown,
    tokenSymbolShown,
    addressShown,
    isNearPage,
    currentWallet,
    setMobileUserInfoVisible,
  } = props;


  const toast = useToast();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);  
  const { invitedUsers, totalRewards, loading, claimLoading, handleClaim, setPage, page, totalPage } = useInvite();

  console.log('invitedUsers', invitedUsers);

  const inviteLink = useMemo(() => {
    return window.location.origin + '/referral/' + userInfo?.invite_code;
  }, [userInfo]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink as string);
    toast.success({
      title: `Copied link ${inviteLink}`
    });
  };

  const router = useRouter()
  if (isNearPage && currentWallet) {
    return (
      <div className="h-[30px] border border-black rounded-xl bg-white flex items-center justify-center font-Montserrat text-[14px] font-semibold text-black px-5 py-2">{addressShown}</div>
    )
  }



  const content = (
    <div className="w-[266px] pt-[24px] pb-[14px] rounded-[20px] bg-[#FFFDEB] border border-black shadow-[10px_10px_0_0_rgba(0, 0, 0, 0.25)]">
      <div className="pl-[22px] pr-[26px] text-[#77350F] text-[16px] font-Montserrat text-nowrap leading-[1] overflow-hidden overflow-ellipsis">
        Connected with {walletInfo.name}
      </div>
      <div className="pl-[22px] pr-[26px] flex justify-between items-center mt-[13px]">
        <div className="text-black text-[18px] font-semibold leading-[1]">
          {addressShown}
        </div>
        <div className="click cursor-pointer" onClick={handleCopy}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="4.73047" width="9.62531" height="10.2668" rx="2" stroke="#77350F" stroke-width="2" />
            <path d="M5.375 3.33336V3C5.375 1.89543 6.27043 1 7.375 1H13.0003C14.1049 1 15.0003 1.89543 15.0003 3V9.26676C15.0003 10.3713 14.1049 11.2668 13.0003 11.2668H12.3752" stroke="#77350F" stroke-width="2" />
          </svg>
        </div>
      </div>
      <div className="pl-[22px] pr-[26px] pb-4 mt-3 w-full flex flex-col items-center gap-3 border-b border-[rgba(0, 0, 0, 0.15)]">
        <div className="pl-[9px] pr-[12px] w-full h-[36px] border border-[rgba(0, 0, 0, 0.15)] rounded-[18px] flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div
              className="relative w-[20px] h-[20px] rounded-full shrink-0 bg-[#F0F0F0]"
              style={{
                backgroundImage: `url("${tokenLogoShown}")`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }} />
            <div className="text-black text-[14px] font-Montserrat flex-shrink-0">{tokenSymbolShown}</div>
          </div>
          <div className="text-black text-[14px] font-Montserrat flex-shrink-0 overflow-hidden text-nowrap">
            {balanceShown}
          </div>
        </div>

        <div>
        <div className="w-[230px] rounded-[14px] border border-[#E6E1C2] bg-[#FFFDEB] p-[10px] flex flex-col gap-[8px] font-Montserrat">
          <div className="flex items-center justify-between text-[#77350F] text-[16px]">
            <span className="font-[600]">Invited Frenz</span>
            <span onClick={() => setInviteModalVisible(true)} className="underline cursor-pointer">12</span>
          </div>
          <div className="flex items-center justify-between bg-[#FDD54C] rounded-[8px] px-2 py-2">
            <span className="text-[#77350F] text-[16px]">
              {inviteLink?.length > 14
                ? '...' + inviteLink.slice(-14)
                : inviteLink}
            </span>
            <div className="click cursor-pointer" onClick={handleCopyLink}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="4.73047" width="9.62531" height="10.2668" rx="2" stroke="#77350F" stroke-width="2" />
                <path d="M5.375 3.33336V3C5.375 1.89543 6.27043 1 7.375 1H13.0003C14.1049 1 15.0003 1.89543 15.0003 3V9.26676C15.0003 10.3713 14.1049 11.2668 13.0003 11.2668H12.3752" stroke="#77350F" stroke-width="2" />
              </svg>
          </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <img src="/images/treasure-book/gem.png" alt="gem" className="w-[22px] h-[22px]" />
              <span className="text-black font-[600] text-[14px]">{ totalRewards || 0 }</span>
            </div>
            <button onClick={() => setInviteModalVisible(true)} className="text-black text-[14px] underline cursor-pointer px-1">Claim</button>
          </div>
        </div>
        </div>

        {/* <div
          onClick={() => {
            router.push("/hall?tab=bgt")
          }}
          className="cursor-pointer pl-[9px] pr-[12px] w-full h-[36px] border border-[rgba(0, 0, 0, 0.15)] rounded-[18px] flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <img className="relative w-[20px] h-[20px] rounded-full shrink-0 bg-[#F0F0F0]" src="/images/icon-bgt.svg" />
            <div className="text-black text-[14px] font-Montserrat flex-shrink-0">BGT</div>
          </div>
          <div className="text-black text-[14px] font-Montserrat flex-shrink-0 overflow-hidden text-nowrap">
            {Number(BGTCount).toFixed(4)}
          </div>
        </div>
        <div
          onClick={() => {
            router.push("/hall?tab=ibgt")
          }}
          className="cursor-pointer pl-[9px] pr-[12px] w-full h-[36px] border border-[rgba(0, 0, 0, 0.15)] rounded-[18px] flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <img className="relative w-[20px] h-[20px] rounded-full shrink-0 bg-[#F0F0F0]" src="/images/icon-iBGT.svg" />
            <div className="text-black text-[14px] font-Montserrat flex-shrink-0">iBGT</div>
          </div>
          <div className="text-black text-[14px] font-Montserrat flex-shrink-0 overflow-hidden text-nowrap">
            {Number(iBGTCount).toFixed(4)}
          </div>
        </div> */}
      </div>
      <DisconnectButton isNearPage={isNearPage} setMobileUserInfoVisible={setMobileUserInfoVisible} />
    </div>
  );

  return (
    <>
    <motion.div
      className="relative flex justify-center items-center cursor-pointer transition-all duration-300"
      onClick={isNearPage ? null : handleConnect}
      whileHover="active"
      animate="default"
      initial="default"
    >
      <Popover
        trigger={PopoverTrigger.Hover}
        placement={PopoverPlacement.BottomRight}
        content={isMobile ? null : content}
        contentStyle={{
          zIndex: 52
        }}
      >
        {address && userInfo?.avatar ? (
          <img
            src={userInfo?.avatar}
            alt=""
            className="w-[28px] h-[28px] rounded-full"
          />
        ) : (
          <div className="w-[28px] h-[28px] rounded-[50%] border-[2px] border-black bg-[conic-gradient(from_180deg_at_50%_50%,#00D1FF_0deg,#FF008A_360deg)]" />
        )}
      </Popover>
    </motion.div>
    <InviteModal
      open={inviteModalVisible}
      invitedUsers={invitedUsers}
      totalRewards={totalRewards}
      loading={loading}
      claimLoading={claimLoading}
      handleClaim={handleClaim}
      onClose={() => setInviteModalVisible(false)}
      setPage={setPage}
      page={page}
      totalPage={totalPage}
    />
    </>
  );
};

const DisconnectButton = ({ isNearPage, setMobileUserInfoVisible }: any) => {
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    setMobileUserInfoVisible(false);
  };

  if (isNearPage) return null

  return (
    <div
      className="cursor-pointer pl-[22px] pr-[26px] flex justify-between items-center click mt-[10px] pt-[10px] pb-[10px] transition-all duration-300 hover:opacity-50"
      onClick={handleDisconnect}
    >
      <div className="text-[#77350F] text-[16px] font-medium leading-[1]">
        Disconnect
      </div>
      <div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1.91613 16H10.5731C11.0656 16 11.4652 15.57 11.4652 15.04C11.4652 14.51 11.0656 14.08 10.5731 14.08H2.00906C1.92728 13.974 1.78417 13.662 1.78417 13.164V2.838C1.78417 2.34 1.92728 2.028 2.00906 1.92H10.5731C11.0656 1.92 11.4652 1.49 11.4652 0.96C11.4652 0.43 11.0656 0 10.5731 0H1.91613C0.823322 0 0 1.22 0 2.838V13.162C0 14.78 0.823322 16 1.91613 16ZM12.3929 12.2771L15.7266 8.69156L15.7383 8.67941C15.913 8.49136 16.0004 8.24579 16.0003 8.00023C16.0003 7.75467 15.913 7.5091 15.7383 7.32106L15.7237 7.30575L12.3948 3.72341C12.0454 3.34741 11.4823 3.34741 11.1329 3.72341C10.7835 4.09941 10.7835 4.70541 11.1329 5.08141L12.953 7.03906H6.83918C6.34667 7.03906 5.94709 7.46906 5.94709 7.99906C5.94709 8.52906 6.34667 8.95906 6.83918 8.95906H12.9542L11.1329 10.9191C10.7835 11.2951 10.7835 11.9011 11.1329 12.2771C11.3057 12.4651 11.5343 12.5591 11.7629 12.5591C11.9915 12.5591 12.2201 12.4651 12.3929 12.2771Z" fill="#FF4F52" />
        </svg>
      </div>
    </div>
  );
};