import useToast from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import useClickTracking from "@/hooks/use-click-tracking";
import { useEffect } from "react";
import useCustomAccount from "@/hooks/use-account";
import { useAppKit } from "@reown/appkit/react";
import { post } from "@/utils/http";
import { useAccount } from "wagmi";
import { useWalletName } from "@/hooks/use-wallet-name";
import { useActivityStore } from "@/stores/useActivityStore";

const InviteViews = () => {
  return (
    <div className="flex min-h-screen justify-center items-center relative">
      <div className="absolute left-0 bottom-0 z-0 w-[603px] h-[748px] bg-[url(/images/invite/cloud-left.png)] bg-no-repeat bg-center bg-contain">
        <div className="w-full h-full relative">
          <img
            src="/images/invite/fllower-left.png"
            className="absolute bottom-0 left-0 w-[310px] h-[202px] z-0"
            alt=""
          />
          <div className="absolute left-0 bottom-0 w-[224px] h-[377px] z-10">
            <div className="w-full h-full relative">
              <motion.img
                src="/images/invite/flowers-left.png"
                className="w-full h-full object-contain"
                alt="Flowers"
                animate={{
                    rotate: [0, 2, -2, 0], 
                  }}
                  transition={{
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                  }}
                  style={{
                    transformOrigin: "left bottom",
                  }}
              />
              <motion.img
                src="/images/invite/bee.svg"
                className="absolute right-0 top-0 w-[44px] h-[40px]"
                alt="Bee"
                animate={{
                  x: [0, -20, 0], 
                  y: [0, -10, 0], 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut", 
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[url(/images/invite-bera.png)] absolute left-1/2 -translate-x-1/2 bottom-0 z-10 bg-no-repeat bg-center bg-contain w-[993px] h-[817px]">
        <Content />
      </div>
      <div className="absolute right-0 bottom-0 z-0 w-[663px] h-[765px] bg-[url(/images/invite/cloud-right.png)] bg-no-repeat bg-center bg-contain">
        <div className="w-full h-full relative">
          <img
            src="/images/invite/fllower-right.png"
            className="absolute bottom-0 right-0 w-[270px] h-[294px] z-0"
            alt=""
          />
          <div className="absolute w-[362px] h-[216px] right-0 bottom-0 z-10 overflow-hidden">
            <div className="relative w-full h-full flex justify-between items-baseline">
                <motion.img 
                  animate={{
                    rotate: [0, 2, -2, 0], 
                  }}
                  transition={{
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                  }}
                  style={{
                    transformOrigin: "left bottom",
                  }} 
                  src="/images/invite/flowers-right-2.png" 
                  className="w-[221px] h-[162px]" alt="" />
                <motion.img 
                  animate={{
                    rotate: [0, 2, -2, 0], 
                  }}
                  transition={{
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                  }}
                  style={{
                    transformOrigin: "left bottom",
                  }}  
                  src="/images/invite/flowers-right-1.png" className="w-[144px] h-[229px]" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const brands = [
  {
    name: "beraland",
    logo: "/images/invite/beraland.png",
  },
  {
    name: "thc",
    logo: "/images/invite/thc.png",
  },
  {
    name: "berabaddies",
    logo: "/images/invite/berabaddies.png",
  },
  {
    name: "thc",
    logo: "/images/invite/thc.png",
  },
  {
    name: "thj",
    logo: "/images/invite/thj.png",
  }
]


const Content = () => {
  const { handleReport } = useClickTracking();
  const walletInfo = useWalletName();
  const { address, isConnecting, isConnected } = useAccount();
  const { name = '' } = useParams();
  const modal = useAppKit();
  const { toggleTheme, isDefaultTheme } = useActivityStore();
  const router = useRouter();
  
  const brand = brands.find(brand => brand.name === name);

  if (!brand) {
    return (
      <div className="relative z-10 w-full h-full">
        <div className="flex justify-center overflow-hidd">
          <div className="w-[480px] h-auto mt-[180px]">
            <div className="font-CherryBomb text-[48px] text-[#453636] text-center">Brand not found:(</div>
            <div className="w-full flex flex-col items-end justify-end mt-2 text-[20px] font-CherryBomb px-[80px] text-[#453636] leading-[18px]">
              <div>Love</div>
              <div>BeraTown</div>
            </div>
          </div>
      </div>
    </div>
    );
  }

  useEffect(() => {
    handleReport('1021-001');
  }, [address]);

  useEffect(() => {
    if (!isConnecting && isConnected && address) {
      post('/api/invite/project', {
        address,
        project: name,
        wallet: walletInfo.name || ''
      });
    }
  }, [isConnecting, isConnected, address, name]);

  const handleConnect = async () => {
    if (address) return;
    await modal.open();
  }

  const handleGo = () => {
      if (brand.name === 'berabaddies' && isDefaultTheme()) {
        toggleTheme();
    }
    router.replace('/')
  }

  return (
    <div className="relative z-10 w-full h-full">
      <div className="flex justify-center overflow-hidd">
        <div className="w-[480px] h-auto mt-[120px]">
          <div className="flex justify-center items-center w-full gap-[28px]">
            <img src={brand.logo} className="w-[68px] h-[68px] object-contain" alt="" />
            <img src="/images/invite/town.png" className="w-[91px] h-[56px] object-contain" alt="" />
          </div>
          <div className="mt-4 px-[40px] font-CherryBomb text-[20px] text-[#453636] leading-[18px]">
            <div>Dear Bera:</div>
            <div className="mt-3">Welcome to Beratown: Your Gateway to Berachain</div>
            <div className="mt-3">Join Berachain's largest community hub on Beratown</div>
            <div className="mt-3">You have been invited by <span className="underline">[{brand.name}]</span></div>
          </div>
          {
            address ? (
              <div className="mt-[28px] mx-auto font-CherryBomb text-black w-[220px] h-[40px] rounded-[10px] border border-black flex justify-center items-center bg-[#FFDC50] hover:opacity-60 cursor-pointer" style={{
                'boxShadow': '6px 6px 0px 0px rgba(0, 0, 0, 0.25)'
              }} onClick={handleGo}>Let's go all in!</div>
            ) : (
              <div className="mt-[28px] mx-auto font-CherryBomb text-black w-[220px] h-[40px] rounded-[10px] border border-black flex justify-center items-center bg-[#FFDC50] hover:opacity-60 cursor-pointer" style={{
                'boxShadow': '6px 6px 0px 0px rgba(0, 0, 0, 0.25)'
              }} onClick={handleConnect}>Connect Wallet</div>
            )
          }

          <div className="w-full flex flex-col items-end justify-end mt-2 text-[20px] font-CherryBomb px-[40px] text-[#453636] leading-[18px]">
            <div>Love</div>
            <div>{brand.name} & BeraTown</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteViews;
