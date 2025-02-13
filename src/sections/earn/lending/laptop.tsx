import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import List from "@/sections/marketplace/components/list";
import useMarketStore from "@/stores/useMarketStore";
import { useRouter } from "next/navigation";
import { useSwapToken } from "@/hooks/use-swap-token";
import SwapModal from "@/sections/swap/SwapModal";
import ActionPanelLaptop from "@/sections/Lending/components/action-panel/laptop";
import ActionModal from "@/sections/Lending/Bend/Action";
import BendActionPanelLaptop from "@/sections/Lending/Bend/Action/laptop";
import useAddAction from "@/hooks/use-add-action";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import IconAdd from "@public/images/add.svg";
import { numberFormatter } from "@/utils/number-formatter";
import Pool from "@/sections/Lending/Beraborrow/pool";

const PAGE_SIZE = 9;

const getListMeta = (
  tabType: "Supply" | "Borrow",
  { handleSwap, handleAction, addAction, honeyInfo, onSuccess }: any
) => {
  const commonColumns = [
    {
      title: "#",
      key: "#",
      sort: false,
      width: "5%",
      render: (item: any, index: number) => index + 1
    },
    {
      title: "Pool",
      key: "pool",
      sort: false,
      width: "25%",
      render: (item: any) => (
        <div className="flex gap-2 items-center">
          <div className="w-[30px] h-[30px] relative">
            <img src={item.icon} className="w-[30px] h-[30px]" alt="" />
            <img
              src={item.protocol.icon}
              className="w-[16px] h-[16px] absolute right-0 bottom-0"
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <div className="text-[16px] font-[600]">{item.symbol}</div>
            <div className="text-[10px] font-[400]">{item.protocol.name}</div>
          </div>
        </div>
      )
    }
  ];

  const supplyColumns = [
    {
      title: "Supply APR",
      key: "supply_apr",
      sort: true,
      width: "15%",
      render: (item: any) => item.supplyAPR
    },
    {
      title: "In Wallet",
      key: "inWallet",
      sort: true,
      width: "15%",
      render: (item: any) =>
        numberFormatter(item.inWallet, 2, true, { prefix: "$" })
    },
    {
      title: "You Supplied",
      key: "youSupplied",
      sort: true,
      width: "20%",
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <img src={item.icon} className="w-[20px] h-[20px]" alt="" />
          <div className="underline">
            {numberFormatter(item.youSupplied, 2, true)}
          </div>
        </div>
      )
    },
    {
      title: "Action",
      key: "Action",
      sort: false,
      width: "20%",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-black text-[16px] font-[600] border border-[#373A53] text-center leading-[30px] h-[32px] px-[15px] rounded-[10px]"
            onClick={() => handleSwap(item)}
          >
            Get
          </button>
          {item.protocol.name === "Dolomite" && (
            <Popover
              trigger={PopoverTrigger.Click}
              placement={PopoverPlacement.BottomRight}
              content={
                <ActionPanelLaptop
                  title="Deposit"
                  actionText="Deposit"
                  placeholder="0.00"
                  token={item}
                  CHAIN_ID={80094}
                  onSuccess={() => {
                    // reload data
                    onSuccess(item.protocol.name);
                  }}
                  addAction={addAction}
                />
              }
              triggerContainerClassName="cursor-pointer"
            >
              <IconAdd />
            </Popover>
          )}
          {item.protocol.name === "Bend" && (
            <Popover
              trigger={PopoverTrigger.Click}
              placement={PopoverPlacement.BottomRight}
              content={
                <BendActionPanelLaptop
                  action="deposit"
                  token={
                    item.protocol.name === "Bend" && item.symbol === "HONEY"
                      ? honeyInfo
                      : item
                  }
                  onSuccess={() => {
                    // reload data
                    onSuccess(item.protocol.name);
                  }}
                />
              }
              triggerContainerClassName="cursor-pointer"
            >
              <IconAdd />
            </Popover>
          )}
          {item.protocol.name === "Beraborrow" && (
            <Popover
              trigger={PopoverTrigger.Click}
              placement={PopoverPlacement.BottomRight}
              content={
                <Pool
                  title="Deposit"
                  actionText="Deposit"
                  isSkipApproved
                  placeholder="0.00"
                  token={item}
                  CHAIN_ID={80094}
                  onSuccess={() => {
                    // reload data
                    onSuccess(item.protocol.name);
                  }}
                  addAction={addAction}
                />
              }
              triggerContainerClassName="cursor-pointer"
            >
              <IconAdd />
            </Popover>
          )}
        </div>
      )
    }
  ];

  const borrowColumns = [
    {
      title: "Borrow APR",
      key: "borrow_apr",
      sort: true,
      width: "15%",
      render: (item: any) => item.borrowAPR
    },
    {
      title: "Borrow Capacity",
      key: "borrowCapacity",
      sort: true,
      width: "15%",
      render: (item: any) =>
        numberFormatter(item.borrowCapacity, 2, true, { prefix: "$" })
    },
    {
      title: "You Borrowed",
      key: "youBorrowed",
      sort: true,
      width: "15%",
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <img src={item.icon} className="w-[20px] h-[20px]" alt="" />
          <div className="underline">
            {numberFormatter(item.youBorrowed, 2, true)}
          </div>
        </div>
      )
    },
    {
      title: "Rewards",
      key: "rewards",
      sort: true,
      width: "10%",
      render: (item: any) => numberFormatter(item.rewards, 2, true)
    },
    {
      title: "Action",
      key: "Action",
      sort: false,
      width: "15%",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Popover
            trigger={PopoverTrigger.Click}
            placement={PopoverPlacement.BottomRight}
            content={
              ["Dolomite", "Beraborrow"].includes(item.protocol.name) ? null : (
                <ActionModal
                  isOpen={true}
                  onClose={() => {}}
                  action="borrow"
                  token={
                    item.protocol.name === "Bend" && item.symbol === "HONEY"
                      ? honeyInfo
                      : item
                  }
                />
              )
            }
            triggerContainerClassName="cursor-pointer"
          >
            <button
              onClick={() => handleAction("Borrow", item)}
              className="bg-[#fff] border font-bold border-[#000] p-[7px] disabled:opacity-60 hover:bg-[#FFDC50] rounded-[10px]"
            >
              Borrow
            </button>
          </Popover>
          <Popover
            trigger={PopoverTrigger.Click}
            placement={PopoverPlacement.BottomRight}
            content={
              ["Dolomite", "Beraborrow"].includes(item.protocol.name) ? null : (
                <ActionModal
                  isOpen={true}
                  onClose={() => {}}
                  action="repay"
                  token={
                    item.protocol.name === "Bend" && item.symbol === "HONEY"
                      ? honeyInfo
                      : item
                  }
                />
              )
            }
            triggerContainerClassName="cursor-pointer"
          >
            <button
              onClick={() => handleAction("Repay", item)}
              className="border border-[rgba(0,0,0,.5)] font-bold p-[7px] disabled:opacity-60 rounded-[10px]"
            >
              Repay
            </button>
          </Popover>
        </div>
      )
    }
  ];

  return [
    ...commonColumns,
    ...(tabType === "Supply" ? supplyColumns : borrowColumns)
  ];
};

const LaptopList = forwardRef(
  ({ list, loading, tab: tabType, onSuccess }: any, ref: any) => {
    const [page, setPage] = useState(1);

    const { addAction } = useAddAction("lending");

    const maxPage = useMemo(() => {
      return Math.ceil(list.length / PAGE_SIZE) || 1;
    }, [list]);

    const data = useMemo(
      () => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      [list, page]
    );
    const router = useRouter();
    const { initData: bendInitData } = useMarketStore();
    const honeyInfo = bendInitData.markets.find(
      (market) => market.symbol === "HONEY"
    );
    const [swapToken, setSwapToken, handleSwap, protocols] = useSwapToken();

    const handleAction = (type: any, data: any) => {
      if (
        data.protocol.name === "Dolomite" &&
        ["Borrow", "Repay"].includes(type)
      ) {
        router.push("/lending/dolomite?tab=borrow");
        return;
      }
      if (
        data.protocol.name === "Beraborrow" &&
        ["Borrow", "Repay"].includes(type)
      ) {
        router.push("/lending/beraborrow");
        return;
      }
    };

    const metaData = getListMeta(tabType, {
      handleSwap,
      handleAction,
      addAction,
      honeyInfo,
      onSuccess
    });

    const refs = {
      setPage
    };
    useImperativeHandle(ref, () => refs);

    return (
      <>
        <List
          loading={loading}
          meta={metaData}
          list={data}
          maxPage={maxPage}
          onPageChange={setPage}
          bodyClassName="h-[522px] overflow-y-auto mt-[20px]"
        />
        {swapToken && (
          <SwapModal
            defaultOutputCurrency={swapToken}
            outputCurrencyReadonly={true}
            show={!!swapToken}
            protocols={protocols}
            onClose={() => {
              setSwapToken(null);
            }}
          />
        )}
      </>
    );
  }
);

export default LaptopList;
