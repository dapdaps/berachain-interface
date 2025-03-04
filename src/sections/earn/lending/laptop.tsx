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
// import IconAdd from "@public/images/add.svg";
import { numberFormatter } from "@/utils/number-formatter";
import Pool from "@/sections/Lending/Beraborrow/pool";
import clsx from "clsx";
import Big from "big.js";


const PAGE_SIZE = 9;

const ActionButton = ({
  color,
  type,
  disabled,
  onClick,
  className
}: {
  color: string
  type: 'plus' | 'minus'
  disabled: boolean
  onClick?: (event: Event) => void
  className?: string
}) => {
  return (
    <svg className={clsx(className, disabled ? 'cursor-not-allowed' : '')} xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none" onClick={onClick}>
      <g opacity={disabled ? "0.3" : "1"}>
        <rect x="0.5" y="0.5" width="33" height="33" rx="10.5" fill="white" stroke="#373A53" />
        {
          type === 'plus' ? (
            <path d="M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z" fill="black" />
          ) : (
            <rect x="11" y="16" width="13" height="2" rx="1" fill="black" />
          )
        }
      </g>
    </svg>
  )
}

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
      render: (item: any) => (
        Big(item?.inWallet ? item?.inWallet : 0).eq(0) ? (
          <div className="opacity-30">
            $0.00
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <img src={item.icon} className="w-[20px] h-[20px]" alt="" />
            <div>
              {numberFormatter(item.inWallet, 2, true)}
            </div>
          </div>
        )
      )
    },
    {
      title: "You Supplied",
      key: "youSupplied",
      sort: true,
      width: "20%",
      render: (item: any) => (
        Big(item?.youSupplied ? item?.youSupplied : 0).eq(0) ? (
          <div className="opacity-30">
            $0.00
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <img src={item.icon} className="w-[20px] h-[20px]" alt="" />
            <div className="underline">
              {numberFormatter(item.youSupplied, 2, true)}
            </div>
          </div>
        )
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
            <>
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
                      onSuccess(item.protocol.name);
                    }}
                    addAction={addAction}
                  />
                }
                triggerContainerClassName="cursor-pointer"
              >
                <ActionButton type="plus" />
              </Popover>
              {
                Big(item?.youSupplied ? item?.youSupplied : 0).eq(0) ? (
                  <ActionButton type="minus" disabled />
                ) : (
                  <Popover
                    trigger={PopoverTrigger.Click}
                    placement={PopoverPlacement.BottomRight}
                    content={
                      <ActionPanelLaptop
                        title="Withdraw"
                        actionText="Withdraw"
                        placeholder="0.00"
                        token={item}
                        CHAIN_ID={80094}
                        onSuccess={() => {
                          onSuccess(item.protocol.name);
                        }}
                        addAction={addAction}
                      />
                    }
                    triggerContainerClassName="cursor-pointer"
                  >
                    <ActionButton type="minus" disabled={Big(item?.youSupplied ? item?.youSupplied : 0).eq(0)} />
                  </Popover>
                )
              }
            </>

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
              <ActionButton />
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
              <ActionButton />
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
                  onClose={() => { }}
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
                  onClose={() => { }}
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
          defaultSort="supply_apr"
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
