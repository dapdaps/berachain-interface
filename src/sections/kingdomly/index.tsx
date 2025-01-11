import { useSearchParams, useRouter, usePathname } from "next/navigation";
import DappIcon from "@/components/dapp-icon";
import Tabs from "@/components/tabs";
import Mint from './mint'

export default function Pools({ dapp }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="relative w-[990px] pt-[30px] md:w-full md:h-full md:pt-[10px] mt-[80px]">
      <Tabs
        currentTab={searchParams.get("tab") || "mint"}
        isCard={true}
        tabs={[
          {
            key: "mint",
            label: <div className="text-[18px] font-bold">Mint</div>,
            children: <Mint />,
          },
          {
            key: "marketplace",
            label: <div className="text-[18px] font-bold">Marketplace</div>,
            children: <></>,
            post: 'Thoon',
            disabled: true
          }
        ]}
        onChange={(tabKey: any) => {
          const params = new URLSearchParams(searchParams);
          params.set("tab", tabKey);
          router.replace(`${pathname}?${params.toString()}`);
        }}
        bodyClassName="md:px-0 md:h-full md:pt-[10px] md:!rounded-b-none md:!border-b-0 md:!border-x-0"
        bodyInnerClassName="md:h-full"
      />
      <DappIcon
        src='/images/dapps/kingdomly.png'
        alt='kingdomly'
        name='kingdomly'
        type="NFT Marketplace"
        className="top-[-76px] md:top-[-30px]  md:left-[56px]"
      />
    </div>
  );
}
