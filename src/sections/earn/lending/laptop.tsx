import { useState, useMemo } from "react";
import List from "@/sections/marketplace/components/list";
import useMarketStore from "@/stores/useMarketStore";
import { useRouter } from 'next/navigation';
import { useSwapToken } from "@/hooks/use-swap-token";
import SwapModal from '@/sections/swap/SwapModal';
import BendActionModal from '@/sections/Lending/Bend/Action';
import BendBorrowActionModal from '@/sections/Lending/Bend/SupplyBorrowPanel/actionModal';
import ActionPanelLaptop from "@/sections/Lending/components/action-panel/laptop";
import useAddAction from "@/hooks/use-add-action";
import { useAccount } from 'wagmi';
import { useProvider } from "@/hooks/use-provider";


const PAGE_SIZE = 9;

const LaptopList = ({ list, loading, tab: tabType }: any) => {
  const [page, setPage] = useState(1);

  const [tab, setTab] = useState('Supply');

  
  const [actionData, setActionData] = useState<any>(null);
  const [actionType, setActionType] = useState<any>(null);
  const [bendVisible, setBendVisible] = useState(false);
  const [bendBorrowVisible, setBendBorrowVisible] = useState(false);
  const [dolomiteVisible, setDolomiteVisible] = useState(false);
  const [dolomiteLoading, setDolomiteLoading] = useState<boolean>(false);

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
  const honeyInfo = bendInitData.markets.find((market) => market.symbol === 'HONEY');
  const [swapToken, setSwapToken, handleSwap, protocols] = useSwapToken();

  const handleAction = (type: any, data: any) => {
    if (data.protocol.name === 'Dolomite' && ['Borrow', 'Repay'].includes(type)) {
      router.push('/lending/dolomite?tab=borrow');
      return;
    }

    // setActionType(type);

    // if (data.protocol.name === 'Bend' && data.symbol === 'HONEY') {
    //   setActionData(honeyInfo);
    // } else {
    //   setActionData(data);
    // }

    // if (data.protocol.name === 'Bend' && ['Borrow', 'Repay'].includes(type)) {
    //   setBendBorrowVisible(true);
    //   return;
    // }

    // switch (data.protocol.name) {
    //   case "Bend":
    //     setBendVisible(true);
    //     break;
    //   case "Dolomite":
    //     setDolomiteVisible(true);
    //     break;
    //   default:
    //     break;
    // }
  };

  const handleActionClose = () => {
    setBendVisible(false);
    setBendBorrowVisible(false);
    setDolomiteVisible(false);
    setActionData(null);
    setActionType(null);
  };
  
  return (
    <>
      <List
        loading={loading}
        meta={[
          {
            title: "#",
            key: "#",
            sort: false,
            width: "5%",
            render: (item: any, index: number) => {
              return index + 1;
            },
          },
          {
            title: "Pool",
            key: "pool",
            sort: false,
            width: "30%",
            render: (item: any, index: number) => {
              return <div className="flex gap-2 items-center">
                <div className="w-[30px] h-[30px] relative">
                  <img src={item.icon} className="w-[30px] h-[30px]" alt="" />
                  <img src={item.protocol.icon} className="w-[16px] h-[16px] absolute right-0 bottom-0" alt="" />
                </div>
                <div className="flex flex-col">
                  <div className="text-[16px] font-[600]">{item.symbol}</div>
                  <div className="text-[10px] font-[400]">{item.protocol.name}</div>

                </div>
              </div>;
            },
          },
          {
            title: "Supply APR",
            key: "supply_apr",
            sort: true,
            width: "15%",
            render: (item: any, index: number) => {
              return item.protocol.name === 'Bend' ? item.supplyAPR : item.lendAPR;
            },
          },
          {
            title: "In Wallet",
            key: "balance",
            sort: true,
            width: "15%",
            render: (item: any, index: number) => {
              return '$'+Number(item.inWallet).toFixed(2)
            },
          },
          {
            title: "You Supplied",
            key: "your_supply",
            sort: true,
            width: "15%",
            render: (item: any, index: number) => {
              return (
                <div className="flex items-center gap-1">
                  <img src={item.icon} className="w-[20px] h-[20px]" alt="" />
                  <div className="underline">{item.protocol.name === 'Bend' ? Number(item.youSupplied).toFixed(2) : Number(item.yourLends).toFixed(2)}</div>
                </div>
              )
            },
          },
          {
            title: "Action",
            key: "Action",
            sort: false,
            width: "20%",
            render: (item: any, index: number) => {
              return (
                <div className="flex items-center gap-2">
                  {
                    tabType === 'Supply' && (
                      <>
                      <button
                        type="button"
                        className="text-black text-[16px] font-[600] border border-[#373A53] text-center leading-[30px] h-[32px] px-[15px] rounded-[10px]"
                        onClick={() => {
                          handleSwap(item);
                        }}
                      >
                        Get
                      </button>
                      <button onClick={() => handleAction('Deposit', item)}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='34'
                        height='34'
                        viewBox='0 0 34 34'
                        fill='none'
                      >
                          <rect
                            x='0.5'
                            y='0.5'
                            width='33'
                            height='33'
                            rx='10.5'
                            fill='white'
                            stroke='#373A53'
                          />
                          <path
                            d='M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z'
                            fill='black'
                          />
                        </svg>
                      </button>
                      </>
                    )
                  }
                  {
                    tabType === 'Borrow' && (
                      <>
                        <button onClick={() => handleAction('Borrow', item)}
                          className='bg-[#fff] border font-bold border-[#000] p-[7px] disabled:opacity-60 hover:bg-[#FFDC50] rounded-[10px]'
                        >
                          Borrow
                        </button>
                        <button onClick={() => handleAction('Repay', item)}
                          className='border border-[rgba(0,0,0,.5)] font-bold p-[7px] disabled:opacity-60  rounded-[10px]'
                        >
                          Repay
                        </button>
                      </>
                    )
                  }
              </div>
              )
            },
          },
        ]}
        list={data}
        maxPage={maxPage}
        onPageChange={setPage}
        bodyClassName="h-[522px] overflow-y-auto mt-[20px]"
      />
       {/*#region swap*/}
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
      {/*#endregion*/}
      {/*#region Bend Deposit*/}
      <BendActionModal
        isOpen={bendVisible}
        onClose={handleActionClose}
        action={actionType?.toLowerCase()}
        token={actionData}
      />
      {/*#endregion*/}
      {/*#region Bend Borrow*/}
      <BendBorrowActionModal
        isOpen={bendBorrowVisible}
        onClose={handleActionClose}
        action={actionType?.toLowerCase()}
        token={actionData}
      />
      {/*#endregion*/}
      {/*#region Dolomite Deposit*/}
      {
        dolomiteVisible && (
          <ActionPanelLaptop
          title={actionType}
          actionText={actionType}
          placeholder="0.00"
          token={actionData}
          CHAIN_ID={80084}
          onSuccess={() => {
            // reload data
            setDolomiteLoading(true);
          }}
          addAction={addAction}
        />
        )
      }
      {/*#endregion*/}
    </>
  );
};

export default LaptopList;
