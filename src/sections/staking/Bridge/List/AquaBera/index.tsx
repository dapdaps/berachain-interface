import { useMultiState } from "@/hooks/use-multi-state";
import { ColunmListType } from "@/sections/staking/types";
import { formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import clsx from "clsx";
import _ from "lodash";
import { useParams, useSearchParams } from 'next/navigation';
import { memo, useEffect } from "react";
import Skeleton from 'react-loading-skeleton';

function renderTD(data: any, column: ColumnType, index: number, parentData: any) {
  if (column.type === 'slot') {
    return column.render(data, index, parentData);
  }
  return (
    <div className='text-black font-Montserrat text-[16px] font-medium leading-[100%]'>
      {data[column.key]}
    </div>
  );
}
export const PairedList = (props: any) => {
  const {
    columnList,
    dataList,
    parentData
  } = props

  return (
    <div className="flex flex-col gap-[21px] mt-[14px] mb-[23px]">
      <div className="flex items-center">
        {columnList?.map((column: ColumnType, index: number) => {
          return (
            <div
              key={index}
              style={{ width: column.width }}
              className={clsx('flex items-center gap-[5px] pl-[19px]', column?.class)}
            >
              <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
                {column?.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-[23px]">
        {
          dataList?.map((pairedToken: any, index: number) => (
            <div className="flex items-center">
              {columnList.map((column: ColumnType, columnIndex: number) => {
                return (
                  <div
                    key={index + columnIndex}
                    className="pl-[19px]"
                    style={{ width: column.width }}
                  >
                    {renderTD(pairedToken, column, index, parentData)}
                  </div>
                );
              })}
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default memo(function AquaBera(props: any) {


  const {
    onChangeData,
    dataList,
    loading,
    reload,
  } = props

  const searchParams = useSearchParams();


  console.log('===address', searchParams.get("address"))

  const [state, updateState] = useMultiState<any>({
    filterList: [],
    checkedIndex: -1
  });
  const ColumnList: ColunmListType = [
    {
      width: '35%',
      key: 'token',
      label: 'Deposit Token',
      type: 'slot',
      render: (data) => {
        return (
          <div className="flex items-center gap-[10px]">
            <div className="w-[42px] h-[42px] rounded-full overflow-hidden">
              <img className="w-full" src={data?.icon} alt={data?.symbol} />
            </div>
            <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">{data?.symbol}</div>
          </div>
        )
      }
    },
    {
      width: '25%',
      key: 'apr',
      label: '7-day APR',
      type: 'slot',
      render: (data) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">{formatValueDecimal(data?.minApr, '', 2, false, false)}% - {formatValueDecimal(data?.maxApr, '', 2, false, false)}%</div>
        )
      }
    },
    {
      width: '25%',
      key: 'wallet',
      label: 'In Wallet',
      type: 'slot',
      render: (data) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">{formatValueDecimal(data?.balance, '', 2, false, false)}</div>
        )
      }
    },
    {
      width: '15%',
      key: 'action',
      label: 'Action',
      align: 'right',
      type: 'slot',
      render: (data, index) => {
        return (
          <div className='flex justify-end pr-[26px]'>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"
              className={clsx("cursor-pointer", state?.checkedIndex === -1 ? "rotate-0" : "rotate-180")}
              onClick={() => {
                updateState({
                  checkedIndex: (state?.checkedIndex === -1 || state?.checkedIndex !== index) ? index : -1
                })
              }}>
              <rect x="0.5" y="0.5" width="33" height="33" rx="10.5" fill="white" stroke="#373A53" />
              <path d="M11 15L17 20L23 15" stroke="black" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
        );
      }
    }
  ];

  const PairedColumnList: ColunmListType = [{
    width: '35%',
    key: 'paired',
    label: 'Paired with',
    type: 'slot',
    headClass: 'pl-0',
    render: (data) => {
      return (
        <div className="flex items-center gap-[10px]">
          <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
            <img className="w-full" src={data?.icon} alt={data?.symbol} />
          </div>
          <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">{data?.symbol}</div>
        </div>
      );
    }
  }, {
    width: '25%',
    key: 'apr',
    label: '7-day APR',
    type: 'slot',
    headClass: 'pl-0',
    render: (data) => {
      return (
        <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">{formatValueDecimal(data?.apr, '', 2, false, false)}%</div>
      );
    }
  }, {
    width: '25%',
    key: 'value',
    label: 'Your Value',
    type: 'slot',
    headClass: 'pl-0',
    render: (data) => {
      return (
        <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">{formatValueDecimal(data?.yourValue, '', 2)}</div>
      );
    }
  }, {
    width: '15%',
    key: 'action',
    label: '',
    type: 'slot',
    render: (data, index, parentData) => {
      const token = _.cloneDeep(parentData)
      delete token.pairedTokens

      const _data = {
        token0: token,
        token1: data,
      }
      return (
        <div className='flex gap-[10px]'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='34'
            height='34'
            viewBox='0 0 34 34'
            fill='none'
            className='cursor-pointer'
            onClick={() => {
              onChangeData(_data, 0);
            }}
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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='34'
            height='34'
            viewBox='0 0 34 34'
            fill='none'
            className={
              Big(data?.yourValue ?? 0).eq(0)
                ? 'cursor-not-allowed'
                : 'cursor-pointer'
            }
            onClick={() => {
              Big(data?.yourValue ?? 0).gt(0) && onChangeData(_data, 1);
            }}
          >
            <g opacity={Big(data?.yourValue ?? 0).eq(0) ? '0.3' : '1'}>
              <rect
                x='0.5'
                y='0.5'
                width='33'
                height='33'
                rx='10.5'
                fill='white'
                stroke='#373A53'
              />
              <rect x='11' y='16' width='13' height='2' rx='1' fill='black' />
            </g>
          </svg>
        </div>
      );
    }
  },]

  useEffect(() => {
    const cloneDataList = _.cloneDeep(dataList);

    console.log('===cloneDataList', cloneDataList)
    const idx = cloneDataList?.findIndex((data: any) => data.address === searchParams.get("address"))
    updateState({
      filterList: cloneDataList,
      checkedIndex: idx
    });
  }, [dataList, searchParams.get("address")]);

  console.log('===loading', loading)
  return (
    <div className="flex flex-col">
      <div className="text-black font-Montserrat text-[26px] font-bold leading-[90%]">Vaults</div>
      <div className='flex items-center mt-[39px] mb-[17px]'>
        {ColumnList.map((column: ColumnType, index: number) => {
          return (
            <div
              key={index}
              style={{ width: column.width }}
              className={clsx('flex items-center gap-[5px] pl-[19px]', column?.align === 'right' ? 'justify-end pr-[26px]' : 'justify-start')}
            >
              <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
                {column?.label}
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className='flex items-center gap-[4px]'>
          {ColumnList.map((column: ColumnType) => {
            return (
              <Skeleton
                width={(928 * parseInt(column?.width)) / 100 - 4}
                height={58}
              />
            );
          })}
        </div>
      ) : state?.filterList && state?.filterList?.length > 0 ? (
        <div className='flex flex-col gap-[14px] h-[calc(100vh-260px)] overflow-y-scroll'>
          {state?.filterList.map((data: any, index: number) => {
            return (
              <div className="flex flex-col rounded-[10px] shrink-0 bg-black/[0.06]" key={index}>
                <div className={clsx(
                  "flex items-center w-full h-[70px] border-b border-transparent",
                  state?.checkedIndex === index ? "!border-black/[0.1]" : ""
                )}>
                  {ColumnList.map((column: ColumnType, columnIndex: number) => {
                    return (
                      <div
                        key={index + columnIndex}
                        className={clsx('pl-[19px]', {
                          'flex-col': column.direction === 'column'
                        })}
                        style={{ width: column.width }}
                      >
                        {renderTD(data, column, index)}
                      </div>
                    );
                  })}
                </div>
                {
                  data?.pairedTokens?.length > 0 && state?.checkedIndex === index && (
                    <PairedList columnList={PairedColumnList} parentData={state?.filterList[state?.checkedIndex]} dataList={data?.pairedTokens} />
                  )
                }
              </div>
            )
          })}
        </div>
      ) : (
        <div className='flex justify-center'>
          You didn’t add any liquidity yet
        </div>
      )
      }
    </div >
  )
})
