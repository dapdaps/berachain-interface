import SwitchTabs from "@/components/switch-tabs";
import SearchBox from "@/sections/marketplace/components/searchbox";
import { useState } from "react";
import List from "@/sections/marketplace/components/list";
import NextStep from './NextStep';
import { usePartnerCollections } from "../hooks/usePartnerCollections";
import { NFTCollectionWithStatus } from "../types";
import Big from "big.js";
const Mint = () => {
  const [tab, setTab] = useState("live");
  const [value, setValue] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { collections } = usePartnerCollections()

  if (selectedItem) {
    return <NextStep item={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  return (
    <div className="w-full h-full">
      <div className="w-full flex items-center justify-between">
        <SwitchTabs
          tabs={[
            { label: "Live", value: "live" },
            { label: "Upcoming", value: "upcoming" },
          ]}
          onChange={(val) => {
            setTab(val);
          }}
          current={tab}
          className="w-[220px]"
          style={{ height: 40, borderRadius: 12 }}
          cursorStyle={{ borderRadius: 10 }}
        />
        <SearchBox value={value} onChange={setValue} />
      </div>
      <div className="w-full h-full mt-[20px]">
      <List
        loading={false}
        meta={[
          {
            title: "Name",
            key: "name",
            sort: false,
            width: "30%",
            render: (item: NFTCollectionWithStatus, index: number) => {
              return (
                <div className="flex items-center gap-[15px]">
                    <img src={item.profile_image} className="w-[78px] h-[78px] object-cover aspect-square rounded-[10px]" alt="" />
                    <span className="font-Montserrat font-bold">{item.collection_name}</span>
                </div>
              )
            },
          },
          {
            title: "Network",
            key: "network",
            sort: false,
            width: "10%",
            render: () => {
              return <img src="/images/dapps/berachain.png" className="w-[20px] h-[20px]" alt="" />
            },
          },
          {
            title: "Supply",
            key: "supply",
            sort: false,
            width: "20%",
            render: (item: NFTCollectionWithStatus, index: number) => {
              return <div className="flex flex-col gap-1">
                <div className="text-[14px] font-[600]">{item.totalSupplyByContract}/{item.maxSupplyByContract}</div>
                <div className="text-[10px] font-[400]">{Big(item.totalSupplyByContract || 0).div(item.maxSupplyByContract || 0).mul(100).toFixed(2)}%</div>
              </div>
            },
          },
          {
            title: "Mint Price",
            key: "price",
            sort: false,
            width: "20%",
            render: (item: NFTCollectionWithStatus, index: number) => {
              return <div className="text-[16px] font-Montserrat font-[600]">{item.displayPrice > 0 ? item.displayPrice + ' ETH' : 'Free Mint'}</div>
            },
          },

          {
            title: "Action",
            key: "action",
            sort: false,
            width: "20%",
            render: (item: NFTCollectionWithStatus, index: number) => {
              return (
                <button 
                  className="w-[112px] h-[32px] bg-white text-black rounded-[10px] font-[600] text-center leading-[32px] border border-[#373A53]"
                  onClick={() => setSelectedItem(item)}
                >
                  View
                </button>
              );
            },
          },
        ]}
        list={collections}
        bodyClassName="h-[500px] overflow-y-auto mt-[20px]"
        itemContainerClassName="mb-[10px] rounded-[10px] overflow-hidden"
        itemClassName="h-[98px] bg-[#000000] bg-opacity-[0.06]"
      />
      </div>
    </div>
  );
};

export default Mint;
