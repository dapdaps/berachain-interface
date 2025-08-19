import MenuButton from "@/components/mobile/menuButton";
import useIsMobile from "@/hooks/use-isMobile";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PageBack from "@/components/back";
import { useActivityStore } from "@/stores/useActivityStore";
import clsx from "clsx";
import useBridgeType from "./Hooks/useBridgeType";
import History from "./History";
import { useMemo, useState } from "react";
import BridgeContent from "./content";

export default function Bridge({ type, defaultFromChain, defaultToChain, defaultFromToken, defaultToToken }: { type?: string, defaultFromChain?: number, defaultToChain?: number, defaultFromToken?: string, defaultToToken?: string }) {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { isDefaultTheme } = useActivityStore();
  const { bridgeType } = useBridgeType();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");
  const [historyShow, setHistoryShow] = useState(false);


  return (
    <div className="h-full overflow-auto">
      {!isMobile ? (
        <PageBack className="ml-[30px] absolute top-[20px] left-[30px] z-10" />
      ) : null}
      {isMobile ? null : (
        <div className="absolute left-[36px] md:left-[15px] top-[31px] md:top-[14px] z-[12]" />
      )}
      <div className="lg:w-[520px] md:w-[92.307vw] m-auto relative z-10 ">
        <DappHeader type={type} />
        <BridgeContent
          type={type}
          defaultFromChain={defaultFromChain}
          defaultToChain={defaultToChain}
          defaultFromToken={searchParams.get("fromToken") || defaultFromToken}
          defaultToToken={searchParams.get("toToken") || defaultToToken}
          onShowHistory={() => {
            setHistoryShow(true);
            setActiveTab("pending");
          }}
        />
      </div>

      {
        bridgeType !== 'kodiak' && <>
          <div
            className={clsx(
              "absolute z-50  left-[50%] translate-x-[400px] w-[164px] h-[191px]",
              isDefaultTheme() ? "bottom-[213px]" : "bottom-[14vw]"
            )}
          >
            <img
              src="/images/background/bridge-type-bg.svg"
              className="w-[164px]"
            />
            <div className="absolute top-[22px] right-[12px]">
              {bridgeType === "stargate" ? checkIcon : unCheckIcon}
            </div>
            <div className="absolute top-[90px] right-[32px]">
              {bridgeType === "jumper" ? checkIcon : unCheckIcon}
            </div>

            <div
              className="absolute w-[164px] h-[65px] cursor-pointer  left-0 top-0"
              onClick={() => {
                router.push("/bridge/stargate");
              }}
            ></div>

            <div
              className="absolute w-[164px] h-[65px] cursor-pointer  left-0 top-[75px]"
              onClick={() => {
                router.push("/bridge/lifi");
              }}
            ></div>
          </div>
          <History
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={historyShow}
            setIsOpen={setHistoryShow}
          />
        </>
      }

    </div>
  );
}

const DappHeader: React.FC<{ type?: string }> = ({ type }) => {
  const { dapp: dappName } = useParams();
  const isMobile = useIsMobile();

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const name = useMemo(() => {
    if (type) {
      return type
    }
    return 'Bridge'
  }, [type])

  if (dappName) {
    return (
      <div className="flex gap-2 my-[30px] w-full justify-center items-center">
        <img
          src={`/images/dapps/${(dappName as string).toLowerCase()}.png`}
          alt={dappName as string}
          className="w-9 h-9"
        />
        <span className="font-CherryBomb text-xl text-black">
          {capitalize(dappName as string)}
        </span>
      </div>
    );
  }



  return (
    <>
      {isMobile ? (
        <div className="relative left-[25%] mt-7 top-5">
          <MenuButton className="w-[51.282vw]">{name}</MenuButton>
        </div>
      ) : (
        <div className="text-[60px] text-center py-[30px] font-CherryBomb">
          {name}
        </div>
      )}
    </>
  );
};

const checkIcon = (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="10.705"
      cy="10.5166"
      r="9.5"
      transform="rotate(-3 10.705 10.5166)"
      fill="#FFDC50"
      stroke="#373A53"
    />
    <path
      d="M7.73411 10.1674L10.1951 12.5418L14.5937 7.30442"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
);

const unCheckIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="9.5" fill="white" stroke="#373A53" />
  </svg>
);
