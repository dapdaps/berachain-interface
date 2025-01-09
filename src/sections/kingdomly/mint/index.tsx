import SwitchTabs from "@/components/switch-tabs";
import SearchBox from "@/sections/marketplace/components/searchbox";
import { useState } from "react";
import List from "@/sections/marketplace/components/list";
import NextStep from './NextStep';
import { usePartnerCollections } from "../hooks/usePartnerCollections";
import { NFTCollectionWithStatus, Status } from "../types";
import Big from "big.js";
import { useCountDown } from "@/hooks/use-count-down";

const CountdownCell = ({ timestamp }: { timestamp: number }) => {
  const countdown = useCountDown({
    targetTimestamp: timestamp,
    format: ' DDd HHh mmm sss'
  });
  return <div className="text-[14px] font-[600]">{countdown}</div>;
};

const Mint = () => {
  const [tab, setTab] = useState("live");
  const [value, setValue] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { collections } = usePartnerCollections()

  const filteredCollections = collections.filter(
    (item: NFTCollectionWithStatus) => item.status === (tab === "live" ? Status.LIVE : Status.UPCOMING)
  );

  console.log('filteredCollections', filteredCollections);

  const getMetaConfig = () => {
    const baseConfig = [
      {
        title: "Name",
        key: "name",
        sort: false,
        width: tab === "upcoming" ? "25%" : "30%",
        render: (item: NFTCollectionWithStatus) => {
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
        width: "15%",
        render: () => {
          return <img src="/images/dapps/berachain.png" className="w-[20px] h-[20px]" alt="" />
        },
      },
      {
        title: "Supply",
        key: "supply",
        sort: false,
        width: tab === "upcoming" ? "15%" : "20%",
        render: (item: NFTCollectionWithStatus) => {
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
        width: tab === "upcoming" ? "15%" : "20%",
        render: (item: NFTCollectionWithStatus) => {
          return <div className="text-[16px] font-Montserrat font-[600]">{item.displayPrice > 0 ? item.displayPrice + ' ETH' : 'Free Mint'}</div>
        },
      },
    ];

    if (tab === "upcoming") {
      baseConfig.push({
        title: "Live in",
        key: "liveIn",
        sort: false,
        width: "25%",
        render: (item: NFTCollectionWithStatus) => {
          return <CountdownCell timestamp={item.mint_live_timestamp} />;
        },
      });
    }

    baseConfig.push({
      title: "Action",
      key: "action",
      sort: false,
      width: "15%",
      render: (item: NFTCollectionWithStatus) => {
        return (
          <button 
            className="w-[112px] h-[32px] bg-white text-black rounded-[10px] font-[600] text-center leading-[32px] border border-[#373A53]"
            onClick={() => setSelectedItem(item)}
          >
            View
          </button>
        );
      },
    });

    return baseConfig;
  };

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
        <SearchBox value={value} onChange={setValue} placeholder={'search NFT'} />
      </div>
      <div className="w-full h-full mt-[20px]">
      <List
        loading={false}
        meta={getMetaConfig()}
        list={filteredCollections}
        bodyClassName="h-[500px] overflow-y-auto mt-[20px]"
        itemContainerClassName="mb-[10px] rounded-[10px] overflow-hidden"
        itemClassName="h-[98px] bg-[#000000] bg-opacity-[0.06]"
      />
      </div>
    </div>
  );
};

export default Mint;
