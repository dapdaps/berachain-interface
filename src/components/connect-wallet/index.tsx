"use client";

import { useWalletInfo, useAppKit } from "@reown/appkit/react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useBalance, useDisconnect, useSwitchChain } from "wagmi";
import Image from "next/image";
import { icons } from "@/configs/chains";
import { AnimatePresence, motion } from "framer-motion";
import Big from "big.js";
import allTokens from "@/configs/allTokens";
import { utils } from "ethers";
import Popover, {
  PopoverPlacement,
  PopoverTrigger,
} from "@/components/popover";
import useToast from "@/hooks/use-toast";
import useUser from "@/hooks/use-user";
import Skeleton from "react-loading-skeleton";
import useIsMobile from "@/hooks/use-isMobile";
import MobileUser from "@/components/connect-wallet/user";
import MobileNetworks from "@/components/connect-wallet/networks";

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

  const isMobile = useIsMobile();
  const total = useToast();
  const { address, isConnected, chainId, chain, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  const balance = useBalance({
    address,
  });
  const { walletInfo } = useWalletInfo();
  const { userInfo } = useUser();

  const [chainDropdownShow, setChainDropdownShow] = useState<boolean>(false);
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
    modal.open();
  };

  const addressShown = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  }, [address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address as string);
    total.success({
      title: `Copied address ${address}`,
    });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleChainSelect = (chainId: number, chain: any) => {
    switchChain({ chainId });
    console.log(chains, chain);
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

  const handleClickOutside = (event: any) => {
    if (
      chainListRef.current &&
      !chainListRef.current?.contains(event.target) &&
      !chainListRef.current.contains(event.target)
    ) {
      setChainDropdownShow(false);
    }
  };

  const handleChainDropdown = () => {
    if (isMobile && isConnected) {
      setMobileNetworksVisible(true);
      return;
    }
    setChainDropdownShow(true);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const RenderChain = () => (
    <motion.div
      className={`relative rounded-[10px] px-[6px] py-[6px] flex justify-center items-center cursor-pointer transition-all duration-300 ${
        chainDropdownShow ? "bg-[rgba(0,0,0,0.04)]" : ""
      }`}
      ref={chainListRef}
      onClick={handleChainDropdown}
    >
      {chainId && icons[chainId] ? (
        <div className="flex items-center gap-x-[8px]">
          <Image src={icons[chainId]} alt="" width={26} height={26} />
          <Image src="/images/icon-arrow.svg" width={11} height={5} alt="" />
        </div>
      ) : (
        <div className="w-[26px] h-[26px] shrink-0 rounded-[8px] bg-[#eceff0]"></div>
      )}
      {/*#region dropdown*/}
      <AnimatePresence mode="wait">
        {chainDropdownShow && (
          <motion.div
            animate={{
              opacity: [0, 1],
              y: [10, 0],
              display: "block",
              transition: {
                duration: 0.3,
              },
            }}
            className="absolute pt-[11px] top-[30px] left-[-114px] w-[228px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-[6px] pb-[5px] rounded-[12px] bg-white border border-[#F0F0F0] shadow-[0px_15px_30px_0px_rgba(0,_0,_0,_0.30)]">
              {chains.map((_chain: any) => (
                <div
                  key={_chain.name}
                  className="w-full h-[45px] flex justify-start gap-[9px] items-center px-[20px] cursor-pointer hover:bg-[#F2F2F2] transition-all ease-in-out duration-300"
                  style={{
                    background: chainId === _chain.id ? "#F2F2F2" : "",
                  }}
                  onClick={(e) => handleChainSelect(_chain.id, _chain)}
                >
                  {icons[_chain.id] ? (
                    <Image
                      src={icons[_chain.id]}
                      alt=""
                      width={20}
                      height={20}
                    />
                  ) : (
                    <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] bg-[#eceff0]"></div>
                  )}
                  <div className="text-black text-[16px] font-medium">
                    {_chain.name}
                  </div>
                  {chainId === _chain.id && (
                    <div className="ml-auto">
                      <svg
                        width="13"
                        height="10"
                        viewBox="0 0 13 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3.72727L5 8L12 1"
                          stroke="black"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/*#endregion*/}
    </motion.div>
  );

  const RenderUser = () => (
    <motion.div
      className="relative flex justify-center items-center cursor-pointer transition-all duration-300"
      onClick={handleConnect}
      whileHover="active"
      animate="default"
      initial="default"
    >
      <Popover
        trigger={PopoverTrigger.Hover}
        placement={PopoverPlacement.BottomRight}
        content={
          isMobile ? null : (
            <div className="w-[266px] pt-[24px] pb-[14px] rounded-[12px] bg-white border border-[#F0F0F0] shadow-[0px_15px_30px_0px_rgba(0,_0,_0,_0.30)]">
              <div className="pl-[22px] pr-[26px] text-[#6F6F6F] text-[16px] font-normal text-nowrap leading-[1] overflow-hidden overflow-ellipsis">
                Connected with {walletInfo?.name}
              </div>
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
                    {chainId ? (
                      <Image
                        src={icons[chainId]}
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
              <div
                className="cursor-pointer pl-[22px] pr-[26px] flex justify-between items-center click mt-[10px] pt-[10px] pb-[10px] transition-all duration-300 hover:bg-[#f7f7f7]"
                onClick={handleDisconnect}
              >
                <div className="text-[#a6703d] text-[16px] font-medium leading-[1]">
                  Disconnect
                </div>
                <div className="">
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
            </div>
          )
        }
        contentStyle={{
          zIndex: 50,
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

  return (
    <>
      {isConnecting ? (
        <Skeleton
          width={isMobile ? 102 : 125}
          height={42}
          borderRadius={21}
          style={{ transform: "translateY(-4px)" }}
        />
      ) : isConnected ? (
        <div className="flex justify-start items-center gap-x-[20px] md:gap-x-[8px] pl-2 pr-3">
          {isMobile ? (
            <>
              <RenderUser />
              <RenderChain />
            </>
          ) : (
            <>
              <RenderChain />
              <RenderUser />
            </>
          )}
        </div>
      ) : (
        <button
          className={`click cursor-pointer rounded-full px-[10px] py-[4px] text-[14px] font-semibold bg-black shadow-shadow1 text-white ${className}`}
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      )}
      <MobileUser
        visible={mobileUserInfoVisible}
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
        handleDisconnect={handleDisconnect}
        handleCopy={handleCopy}
        userInfo={userInfo}
      />
      <MobileNetworks
        visible={mobileNetworksVisible}
        onClose={() => {
          setMobileNetworksVisible(false);
        }}
        chains={chains}
        chainId={chainId}
        handleChainSelect={handleChainSelect}
      />
    </>
  );
};

export default memo(ConnectWallet);
