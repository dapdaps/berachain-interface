import { useState, useMemo, useEffect } from "react";
import Dropdown from "../dropdown";
import SearchBox from "../searchbox";
import List from "../list";
import dexs from "@/configs/pools";
import PoolTable from "@/sections/pools/components/pool-table";
import AddLiquidityModal from "@/sections/pools/add-liquidity-modal";
import RemoveLiquidityModal from "@/sections/pools/remove-liquidity-modal";
import V3PoolsModal from "@/sections/pools/v3-pools-modal";
import { balanceFormated } from "@/utils/balance";
import Action from "./action";
import usePools from "./use-pools";
import useIsMobile from "@/hooks/use-isMobile";
import CheckBox from "@/components/check-box";
import MobileList from "./mobile/list";
import useClickTracking from "@/hooks/use-click-tracking";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";

const PAGE_SIZE = 9;

const checkIsExist = ({ record, balance, hasFee }: any) => {
  return (
    balance[
    `${record.token0.address.toLowerCase()}-${record.token1.address.toLowerCase()}${hasFee ? "-" + record.fee : ""
    }`
    ] ||
    balance[
    `${record.token1.address.toLowerCase()}-${record.token0.address.toLowerCase()}${hasFee ? "-" + record.fee : ""
    }`
    ]
  );
};

export default function Liquidity() {
  const [protocol, setProtocol] = useState("all");
  const [searchVal, setSearchVal] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [refresher, setRefresher] = useState(0);

  const {
    pools,
    loading,
    bexLoading,
    bexBalances,
    kodiakV2Loading,
    kodiakV2Balances,
    kodiakV3Loading,
    kodiakV3Balances,
    kodiakTicksInfo,
    kodiakIslandsBalances
  } = usePools(refresher);
  const { handleReport } = useClickTracking();

  const [protocols] = useMemo(() => {
    let _dexs: any = [{ key: "all", name: "All Protocols" }];
    Object.values(dexs).forEach((dex) => {
      _dexs.push({
        key: dex.name,
        name: dex.name
      });
    });
    return [_dexs];
  }, [dexs]);

  const list = useMemo(
    () =>
      pools.filter((token: any) => {
        let flag = true;
        if (protocol !== "all" && protocol !== token.protocol) {
          flag = false;
        }

        const pool = [token?.token0?.symbol, token?.token1?.symbol].join("-");

        if (
          searchVal &&
          !(pool?.toLowerCase().indexOf(searchVal.toLowerCase()) > -1)
        )
          flag = false;
        return flag;
      }),
    [pools, protocol, searchVal]
  );

  const maxPage = useMemo(() => {
    return Math.ceil(list.length / PAGE_SIZE) || 1;
  }, [list]);

  const data = useMemo(
    () => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [list, page]
  );

  const isMobile = useIsMobile();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    isMobile && handleReport("1019-001");
  }, [isMobile]);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="hidden lg:block font-Montserrat text-[26px] font-bold leading-[23px] text-left">
          Liquidity
        </div>
        <div className="md:w-full flex items-center gap-2 md:justify-between">
          {/* {!isMobile && (
            <div className="flex items-center gap-2">
              <div>You Added only</div>
              <CheckBox
                checked={checked}
                onClick={() => {
                  setChecked(!checked);
                }}
              />
            </div>
          )} */}
          <Dropdown
            list={protocols}
            value={protocol}
            onChange={(val) => {
              setProtocol(val);
            }}
            placeholder=""
          />
          {isMobile ? (
            <div className="flex items-center gap-[8px]">
              {/* <div>You Added only</div>
              <CheckBox
                checked={checked}
                onClick={() => {
                  setChecked(!checked);
                }}
              /> */}
            </div>
          ) : (
            <SearchBox value={searchVal} onChange={setSearchVal} />
          )}
        </div>
      </div>

      <div className="mt-[20px]">
        {isMobile ? (
          <MobileList
            list={data}
            onClick={(nums: any, item: any) => {
              if (nums === 0) {
                setModalType("add");
                setSelectedRecord(item);
              }
            }}
          />
        ) : (
          <List
            loading={loading}
            meta={[
              {
                title: "#",
                key: "#",
                sort: false,
                width: "5%",
                render: (item: any, index: number) => {
                  return index + 1 + PAGE_SIZE * (page - 1);
                }
              },
              {
                title: "Pool",
                key: "pool",
                sort: false,
                width: "45%",
                render: (item: any, index: number) => {
                  return <PoolTable item={item} />;
                }
              },
              {
                title: "Apr",
                key: "apr",
                sort: true,
                width: "15%",
                render: (item: any, index: number) => {
                  return Big(item?.["apr"] ?? 0).gt(0)
                    ? `${numberFormatter(item["apr"], 2, true)}%`
                    : "-";
                }
              },
              {
                title: "TVL",
                key: "tvl",
                sort: true,
                width: "15%",
                render: (item: any, index: number) => {
                  return item["tvl"]
                    ? numberFormatter(item["tvl"], 2, true, { isShort: true })
                    : "-";
                }
              },
              {
                title: "Volume",
                key: "volume",
                sort: true,
                width: "15%",
                render: (item: any, index: number) => {
                  return item["volume"]
                    ? numberFormatter(item["volume"], 2, true, {
                      isShort: true
                    })
                    : "-";
                }
              },
              {
                title: "Action",
                key: "Action",
                sort: false,
                width: "10%",
                render: (item: any, index: number) => {
                  let _removeable: any = false;
                  if (item?.protocol?.toLowerCase() === "bex") {
                    _removeable = checkIsExist({
                      record: item,
                      balance: bexBalances
                    });

                  }


                  if (item?.protocol?.toLowerCase() === "kodiak") {
                    if (item.version === "v2") {
                      _removeable = checkIsExist({
                        record: item,
                        balance: kodiakV2Balances
                      });
                    } else if (item.version === "v3") {
                      _removeable = checkIsExist({
                        record: item,
                        balance: kodiakV3Balances,
                        hasFee: true
                      });
                    } else if (item.version === "island") {
                      _removeable = checkIsExist({
                        record: item,
                        balance: kodiakIslandsBalances,
                        hasFee: true
                      });
                    }

                    console.log('====item', item)
                    console.log('=====_removeable', _removeable)
                  }

                  return (
                    <Action
                      onAdd={() => {
                        setModalType("add");
                        setSelectedRecord(item);
                      }}
                      onRemove={() => {
                        if (item.type === "island") {
                          setModalType("remove");
                          setSelectedRecord({
                            ...item,
                            ...(_removeable[0] ? _removeable[0] : {})
                          });
                          console.log('=====111111=====', {
                            ...item,
                            ...(_removeable[0] ? _removeable[0] : {})
                          })
                          return;
                        } else {
                          if (item.version === "v3") {
                            setModalType("pools");
                            setSelectedRecord({ ...item, pools: _removeable });
                          } else {
                            setModalType("remove");
                            setSelectedRecord({
                              ...item,
                              ...(_removeable[0] ? _removeable[0] : {})
                            });
                          }
                          // if (_removeable.length === 1) {
                          //   setModalType("remove");
                          //   setSelectedRecord({
                          //     ...item,
                          //     ...(_removeable[0] ? _removeable[0] : {})
                          //   });
                          //   setSelectedTokenId(_removeable[0].tokenId);
                          //   return;
                          // }
                          // setModalType("pools");
                          // setSelectedRecord({ ...item, pools: _removeable });
                        }

                        console.log("11111_removeable", _removeable)

                      }}
                      removeable={_removeable}
                    />
                  );
                }
              }
            ]}
            list={data}
            maxPage={maxPage}
            onPageChange={setPage}
            bodyClassName="h-[522px] overflow-y-auto"
          />
        )}
      </div>
      {selectedRecord && (
        <>
          <AddLiquidityModal
            data={selectedRecord}
            dex={selectedRecord.protocol}
            open={modalType === "add"}
            onClose={() => {
              setModalType("");
              setSelectedRecord(null);
              setRefresher(refresher + 1);
            }}
          />
          <RemoveLiquidityModal
            data={selectedRecord}
            dex={selectedRecord.protocol}
            open={modalType === "remove"}
            tokenId={selectedTokenId}
            onClose={() => {
              setModalType("");
              setSelectedRecord(null);
            }}
            onSuccess={() => {
              setModalType("");
              setSelectedRecord(null);
              setRefresher(refresher + 1);
            }}
          />
          <V3PoolsModal
            open={modalType === "pools"}
            token0={selectedRecord.token0}
            token1={selectedRecord.token1}
            fee={selectedRecord.fee}
            dex={selectedRecord.protocol}
            data={selectedRecord.pools}
            loading={false}
            ticksInfo={kodiakTicksInfo}
            onPick={(item: any) => {
              setModalType("remove");
              setSelectedTokenId(item.tokenId);
              console.log('=====1111111111====', selectedRecord)
            }}
            onClose={() => {
              setModalType("");
              setSelectedRecord(null);
            }}
          />
        </>
      )}
    </>
  );
}
