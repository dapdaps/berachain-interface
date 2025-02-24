"use client";

import MobileNetworks from "@/components/connect-wallet/networks";
import MobileUser from "@/components/connect-wallet/user";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import allTokens from "@/configs/allTokens";
import useIsMobile from "@/hooks/use-isMobile";
import useToast from "@/hooks/use-toast";
import useUser from "@/hooks/use-user";
import { useWalletName } from '@/hooks/use-wallet-name';
import chains from '@/sections/bridge/lib/util/chainConfig';
import { ChainType, State } from "@/sections/near-intents/hooks/useConnectWallet";
import { useConnectedWalletsStore } from "@/stores/useConnectedWalletsStore";
import { useAppKit } from "@reown/appkit/react";
import { useDebounceFn } from 'ahooks';
import Big from "big.js";
import { utils } from "ethers";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useAccount, useBalance, useDisconnect } from "wagmi";
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
const ConnectWallet = ({ className }: { className?: string }) => {
  const modal = useAppKit();
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
  const isNearPage = ['/near-intents', '/my-near-wallet-gateway'].includes(pathname);
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

    !address && modal.open();
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
            className={`click cursor-pointer rounded-full px-[10px] py-[4px] text-[14px] font-semibold bg-black lg:shadow-shadow1 text-white ${className}`}
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

  if (isNearPage && currentWallet) {
    return (
      <div className="h-[30px] border border-black rounded-xl bg-white flex items-center justify-center font-Montserrat text-[14px] font-semibold text-black px-5 py-2">{addressShown}</div>
    )
  }

  const content = (
    <div className="w-[266px] pt-[24px] pb-[14px] rounded-[12px] bg-white border border-[#F0F0F0] shadow-[0px_15px_30px_0px_rgba(0,_0,_0,_0.30)]">
      {!isNearPage && (
        <div className="pl-[22px] pr-[26px] text-[#6F6F6F] text-[16px] font-normal text-nowrap leading-[1] overflow-hidden overflow-ellipsis">
          Connected with {walletInfo.name}
        </div>
      )}
      <div className="pl-[22px] pr-[26px] flex justify-between items-center mt-[13px]">
        <div className="text-black text-[16px] font-semibold leading-[1]">
          {addressShown}
        </div>
        <div className="click cursor-pointer" onClick={handleCopy}>
          <svg
            width="13"
            height="12"
            viewBox="0 0 13 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.69238 4.88464C3.69238 4.05622 4.36396 3.38464 5.19238 3.38464H10.577C11.4054 3.38464 12.077 4.05622 12.077 4.88464V10.5C12.077 11.3285 11.4054 12 10.577 12H5.19238C4.36396 12 3.69238 11.3285 3.69238 10.5V4.88464ZM5.19238 4.38464C4.91624 4.38464 4.69238 4.6085 4.69238 4.88464V10.5C4.69238 10.7762 4.91624 11 5.19238 11H10.577C10.8531 11 11.077 10.7762 11.077 10.5V4.88464C11.077 4.6085 10.8531 4.38464 10.577 4.38464H5.19238Z"
              fill="#6F6F6F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 1.5C0 0.671572 0.671573 0 1.5 0H6.88462C7.71304 0 8.38461 0.671573 8.38461 1.5V2.61538H7.38462V1.5C7.38462 1.22386 7.16076 1 6.88462 1H1.5C1.22386 1 1 1.22386 1 1.5V7.11539C1 7.39153 1.22386 7.61539 1.5 7.61539H2.34615V8.61539H1.5C0.671573 8.61539 0 7.94381 0 7.11539V1.5Z"
              fill="#6F6F6F"
            />
          </svg>
        </div>
      </div>
      {!isNearPage && (
        <div className="pl-[22px] pr-[26px]">
          <div className="pl-[9px] pr-[16px] w-fit h-[36px] border border-black rounded-full flex items-center gap-[8px] mt-[14px]">
            <div
              className="relative w-[20px] h-[20px] rounded-full shrink-0 bg-[#F0F0F0]"
              style={{
                backgroundImage: `url("${tokenLogoShown}")`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            >
              {chainId && chains?.[chainId]?.icon ? (
                <Image
                  src={chains?.[chainId]?.icon}
                  alt=""
                  width={10}
                  height={10}
                  className="absolute right-[-3px] bottom-[-3px]"
                />
              ) : (
                <div className="absolute w-[10px] h-[10px] rounded-[2px] border border-black right-[-3px] bottom-[-3px]" />
              )}
            </div>
            <div className="text-black text-[16px] font-normal flex-shrink-0 overflow-hidden text-nowrap">
              {balanceShown} {tokenSymbolShown}
            </div>
          </div>
        </div>
      )}
      <DisconnectButton isNearPage={isNearPage} setMobileUserInfoVisible={setMobileUserInfoVisible} />
    </div>
  );

  return (
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
          zIndex: 50
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
      className="cursor-pointer pl-[22px] pr-[26px] flex justify-between items-center click mt-[10px] pt-[10px] pb-[10px] transition-all duration-300 hover:bg-[#f7f7f7]"
      onClick={handleDisconnect}
    >
      <div className="text-[#a6703d] text-[16px] font-medium leading-[1]">
        Disconnect
      </div>
      <div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.13019 0C6.16853 -1.75877e-09 6.20649 0.00739019 6.24191 0.0217487C6.27732 0.0361072 6.3095 0.0571528 6.33661 0.0836838C6.36372 0.110215 6.38522 0.141712 6.39989 0.176376C6.41456 0.211041 6.42211 0.248194 6.42211 0.285714V0.857143C6.42211 0.894663 6.41456 0.931817 6.39989 0.966481C6.38522 1.00115 6.36372 1.03264 6.33661 1.05917C6.3095 1.0857 6.27732 1.10675 6.24191 1.12111C6.20649 1.13547 6.16853 1.14286 6.13019 1.14286H1.16766V10.8571H6.13019C6.16853 10.8571 6.20649 10.8645 6.24191 10.8789C6.27732 10.8933 6.3095 10.9143 6.33661 10.9408C6.36372 10.9674 6.38522 10.9989 6.39989 11.0335C6.41456 11.0682 6.42211 11.1053 6.42211 11.1429V11.7143C6.42211 11.7518 6.41456 11.789 6.39989 11.8236C6.38522 11.8583 6.36372 11.8898 6.33661 11.9163C6.3095 11.9428 6.27732 11.9639 6.24191 11.9783C6.20649 11.9926 6.16853 12 6.13019 12H1.16766C0.868082 12 0.579967 11.8873 0.362904 11.6852C0.145842 11.4831 0.0164383 11.2071 0.00145957 10.9143L0 10.8571V1.14286C-2.33049e-07 0.849645 0.115141 0.567649 0.321609 0.355197C0.528076 0.142744 0.810073 0.0160892 1.10927 0.00142857L1.16766 0H6.13019ZM8.79274 2.94086L11.2991 5.394C11.4563 5.54784 11.5478 5.75439 11.5551 5.97181C11.5624 6.18923 11.485 6.40123 11.3385 6.56486L11.2991 6.606L8.79274 9.05914C8.738 9.11271 8.66376 9.1428 8.58636 9.1428C8.50895 9.1428 8.43472 9.11271 8.37998 9.05914L7.96721 8.65514C7.91248 8.60156 7.88174 8.5289 7.88174 8.45314C7.88174 8.37738 7.91248 8.30472 7.96721 8.25114L9.68279 6.57143H3.79488C3.75655 6.57143 3.71859 6.56404 3.68317 6.54968C3.64775 6.53532 3.61557 6.51428 3.58847 6.48774C3.56136 6.46121 3.53986 6.42972 3.52519 6.39505C3.51052 6.36039 3.50297 6.32323 3.50297 6.28571V5.71429C3.50297 5.67676 3.51052 5.63961 3.52519 5.60495C3.53986 5.57028 3.56136 5.53879 3.58847 5.51226C3.61557 5.48572 3.64775 5.46468 3.68317 5.45032C3.71859 5.43596 3.75655 5.42857 3.79488 5.42857H9.68279L7.96721 3.74886C7.91248 3.69528 7.88174 3.62262 7.88174 3.54686C7.88174 3.4711 7.91248 3.39844 7.96721 3.34486L8.37998 2.94086C8.43472 2.88729 8.50895 2.8572 8.58636 2.8572C8.66376 2.8572 8.738 2.88729 8.79274 2.94086Z"
            fill="#FF3D83"
          />
        </svg>
      </div>
    </div>
  );
};