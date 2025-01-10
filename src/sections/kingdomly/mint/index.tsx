import SwitchTabs from "@/components/switch-tabs";
import SearchBox from "@/sections/marketplace/components/searchbox";
import { useState, useMemo } from "react";
import List from "@/sections/marketplace/components/list";
import NextStep from "./NextStep";
import { usePartnerCollections } from "../hooks/usePartnerCollections";
import { NFTCollectionWithStatus, Status } from "../types";
import Big from "big.js";
import { useCountDown } from "../hooks/use-count-down";
import useIsMobile from "@/hooks/use-isMobile";
import { useDebounce } from 'ahooks';
import Skeleton from "react-loading-skeleton";

const CountdownCell = ({ timestamp }: { timestamp: number }) => {
  const countdown = useCountDown({
    targetTimestamp: timestamp,
    format: " DDd HHh mmm sss",
  });
  return <div className="text-[14px] font-[600]">{countdown}</div>;
};

const MobileCard = ({
  item,
  onSelect,
}: {
  item: NFTCollectionWithStatus;
  onSelect: (item: NFTCollectionWithStatus) => void;
}) => {
  return (
    <div className="bg-[#000000] bg-opacity-[0.06] rounded-[10px] p-[15px] mb-[10px] shadow-sm">
      <div className="flex items-center gap-[10px]">
        <img
          src={item.profile_image}
          className="w-[60px] h-[60px] object-cover rounded-[8px]"
          alt=""
        />
        <div className="flex-1">
          <div className="font-Montserrat font-bold text-[14px] mb-[5px]">
            {item.collection_name}
          </div>
          <div className="flex items-center gap-[10px]">
            <img
              src="/images/dapps/berachain.png"
              className="w-[16px] h-[16px]"
              alt=""
            />
            <span className="text-[12px]">
              {item.totalSupplyByContract}/{item.maxSupplyByContract} (
              {Big(item.totalSupplyByContract || 0)
                .div(item.maxSupplyByContract || 0)
                .mul(100)
                .toFixed(2)}
              %)
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-[10px] pt-[10px] border-t">
        <div className="text-[14px] font-[600]">
          {item.displayPrice > 0 ? item.displayPrice + item.chain.native_currency : "Free Mint"}
        </div>
        {item.status === Status.UPCOMING && (
          <CountdownCell timestamp={item.mint_live_timestamp} />
        )}
        <button
          className="w-[80px] h-[28px] bg-white text-black rounded-[8px] text-[12px] font-[600] border border-[#373A53]"
          onClick={() => onSelect(item)}
        >
          View
        </button>
      </div>
    </div>
  );
};

const MobileSkeletonCard = () => (
  <div className="bg-[#000000] bg-opacity-[0.06] rounded-[10px] p-[15px] mb-[10px] shadow-sm">
    <div className="flex items-center gap-[10px]">
      <Skeleton width={60} height={60} borderRadius={8} />
      <div className="flex-1">
        <Skeleton width={120} height={16} className="mb-[5px]" />
        <Skeleton width={80} height={12} />
      </div>
    </div>
    <div className="flex items-center justify-between mt-[10px] pt-[10px] border-t">
      <Skeleton width={60} height={14} />
      <Skeleton width={80} height={28} borderRadius={8} />
    </div>
  </div>
);

const Mint = () => {
  const [tab, setTab] = useState("live");
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, { wait: 300 }); 
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { collections, isLoading } = usePartnerCollections();
  const isMobile = useIsMobile();

  const filteredCollections = useMemo(() => {
    return collections
      .filter(
        (item: NFTCollectionWithStatus) =>
          item.status === (tab === "live" ? Status.LIVE : Status.UPCOMING)
      )
      .filter((item: NFTCollectionWithStatus) => 
        debouncedValue === "" || 
        item.collection_name.toLowerCase().includes(debouncedValue.toLowerCase())
      );
  }, [collections, tab, debouncedValue]);

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
              <img
                src={item.profile_image}
                className="w-[78px] h-[78px] object-cover aspect-square rounded-[10px]"
                alt=""
              />
              <span className="font-Montserrat font-bold">
                {item.collection_name}
              </span>
            </div>
          );
        },
      },
      {
        title: "Network",
        key: "network",
        sort: false,
        width: "15%",
        render: () => {
          return (
            <img
              src="/images/dapps/berachain.png"
              className="w-[20px] h-[20px]"
              alt=""
            />
          );
        },
      },
      {
        title: "Supply",
        key: "supply",
        sort: false,
        width: tab === "upcoming" ? "15%" : "20%",
        render: (item: NFTCollectionWithStatus) => {
          return (
            <div className="flex flex-col gap-1">
              <div className="text-[14px] font-[600]">
                {item.totalSupplyByContract}/{item.maxSupplyByContract}
              </div>
              <div className="text-[10px] font-[400]">
                {Big(item.totalSupplyByContract || 0)
                  .div(item.maxSupplyByContract || 0)
                  .mul(100)
                  .toFixed(2)}
                %
              </div>
            </div>
          );
        },
      },
      {
        title: "Mint Price",
        key: "price",
        sort: false,
        width: tab === "upcoming" ? "15%" : "20%",
        render: (item: NFTCollectionWithStatus) => {
          return (
            <div className="text-[16px] font-Montserrat font-[600]">
              {item.displayPrice > 0 ? item.displayPrice + ' ' + item.chain.native_currency : "Free Mint"}
            </div>
          );
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
    return (
      <NextStep item={selectedItem} onBack={() => setSelectedItem(null)} />
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex md:flex-col lg:flex-row md:gap-[15px] lg:items-center lg:justify-between shrink-0">
        <SwitchTabs
          tabs={[
            { label: "Live", value: "live" },
            { label: "Upcoming", value: "upcoming" },
          ]}
          onChange={(val) => {
            setTab(val);
          }}
          current={tab}
          className="lg:w-[220px] md:w-full h-[40px]"
          style={{
            borderRadius: "12px",
          }}
          cursorStyle={{ borderRadius: "10px" }}
        />
        <SearchBox
          value={value}
          onChange={setValue}
          placeholder={"search NFT"}
        />
      </div>

      <div className="w-full mt-[20px] md:h-[280px] overflow-y-auto">
        {isMobile ? (
          <div className="flex flex-col gap-[10px] pb-[20px]">
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <MobileSkeletonCard key={index} />
              ))
            ) : (
              filteredCollections.map((item: NFTCollectionWithStatus, index: number) => (
                <MobileCard 
                  key={index} 
                  item={item} 
                  onSelect={setSelectedItem}
                />
              ))
            )}
          </div>
        ) : (
          <List
            loading={isLoading}
            meta={getMetaConfig()}
            list={filteredCollections}
            bodyClassName="h-[500px] overflow-y-auto mt-[20px]"
            itemContainerClassName="mb-[10px] rounded-[10px] overflow-hidden"
            itemClassName="h-[98px] bg-[#000000] bg-opacity-[0.06]"
          />
        )}
      </div>
    </div>
  );
};

export default Mint;
