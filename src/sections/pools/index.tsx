import { useSearchParams, useRouter, usePathname } from "next/navigation";
import DappIcon from "@/components/dapp-icon";
import Tabs from "@/components/tabs";
import PoolsC from "./pools";
import YoursC from "./yours";

export default function Pools({ dapp }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="relative w-[990px] pt-[30px] md:w-full md:h-full md:pt-[10px]">
      <Tabs
        currentTab={searchParams.get("tab") || "list"}
        isCard={true}
        tabs={[
          {
            key: "list",
            label: <div className="text-[18px] font-bold">Liquidity</div>,
            children: <PoolsC dex={dapp.name} />
          },
          {
            key: "yours",
            label: <div className="text-[18px] font-bold">Yours</div>,
            children: <YoursC dex={dapp.name} />
          }
        ]}
        onChange={(tabKey: any) => {
          const params = new URLSearchParams(searchParams);
          params.set("tab", tabKey);
          router.replace(`${pathname}?${params.toString()}`);
        }}
        bodyClassName="md:px-0 md:h-full md:pt-[10px] md:!rounded-b-none md:!border-b-0 md:!border-x-0"
        bodyInnerClassName="md:h-[calc(100%-62px)]"
      />
      <DappIcon
        src={dapp.icon}
        alt={dapp.name}
        name={dapp.name}
        type="swap"
        className="top-[-76px] md:top-[-30px]  md:left-[56px]"
      />
    </div>
  );
}
