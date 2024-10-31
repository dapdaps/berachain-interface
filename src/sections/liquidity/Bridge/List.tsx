// @ts-nocheck
import { DEFAULT_CHAIN_ID } from '@/configs';
import useAccount from '@/hooks/use-account';
import { useMultiState } from '@/hooks/use-multi-state';
import { useProvider } from '@/hooks/use-provider';
import { formatValueDecimal } from '@/utils/balance';
import { asyncFetch } from '@/utils/http';
import Big from 'big.js';
import clsx from 'clsx';
import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import type { ColumnType } from '../types';
import Skeleton from 'react-loading-skeleton';
import useInfraredData from '../Datas/Infrared';
import _ from 'lodash';
import useInfraredList from '../hooks/use-infrared-list';

export default function List(props: any) {
  const {
    pairs,
    sender,
    chainId,
    provider,
    addresses,
    ALL_DATA_URL,
    multicallAddress,
    onChangeData
  } = props;

  const { dataList, loading } = useInfraredList();
  const [state, updateState] = useMultiState<any>({
    allData: null,
    filterList: [],
    sortKey: ''
  });

  const tvl = useMemo(() => {
    return formatValueDecimal(
      dataList?.reduce((prev, cur) => {
        return prev.plus(
          Big(
            ethers.utils.formatUnits(cur?.initialData?.current_staked_amount)
          ).times(cur?.initialData?.stake_token?.price ?? 0)
        );
      }, Big(0)),
      '$',
      2,
      true
    );
  }, [dataList]);

  function renderTD(data: any, column: ColumnType, index: number) {
    if (column.type === 'slot') {
      return column.render(data, index);
    }
    return (
      <div className='text-black font-Montserrat text-[16px] font-medium leading-[100%]'>
        {data[column.key]}
      </div>
    );
  }



  useEffect(() => {
    const cloneDataList = _.cloneDeep(dataList);
    updateState({
      filterList: state?.sortKey
        ? cloneDataList.sort((prev, next) => {
          return Big(next[state?.sortKey])
            .minus(prev[state?.sortKey])
            .toFixed();
        })
        : cloneDataList
    });
  }, [state?.sortKey, dataList]);

  const columnList: ColunmListType = [
    {
      width: '25%',
      key: 'pool',
      label: 'Pool',
      type: 'slot',
      render: (data) => {
        const pool = data?.initialData?.pool;
        return (
          <div className='flex items-center gap-[8px]'>
            <div className='flex items-center'>
              {data?.images[0] && (
                <div className='w-[30px] h-[30px]'>
                  <img
                    src={data?.images[0]}
                    style={{ objectPosition: 'left' }}
                  />
                </div>
              )}
              {data?.images[1] && (
                <div className='w-[30px] h-[30px] ml-[-10px]'>
                  <img src={data?.images[1]} />
                </div>
              )}
            </div>
            <div className='text-black font-Montserrat text-[16px] font-medium leading-[100%]'>
              {pool?.name || 'iBGT'}
            </div>
          </div>
        );
      }
    },
    {
      width: '15%',
      key: 'protocol',
      label: 'Protocol',
      type: 'slot',
      render: (data: any) => {
        const pool = data?.initialData?.pool;
        return (
          <img
            style={{ width: 26 }}
            src={`/images/dapps/infrared/${pool ? (pool?.protocol === 'BEX' ? 'bex' : 'berps') : 'infrared'
              }.svg`}
          />
        );
      }
    },
    {
      width: '15%',
      key: 'tvl',
      label: 'TVL',
      type: 'slot',
      sort: true,
      render: (data) => {
        return (
          <div className='text-black font-Montserrat text-[16px] font-medium leading-[100%]'>
            {formatValueDecimal(data.tvl, '$', 2, true)}
          </div>
        );
      }
    },
    {
      width: '15%',
      key: 'apy',
      label: 'APY',
      type: 'slot',
      sort: true,
      render: (data) => {
        return (
          <div className='text-black font-Montserrat text-[16px] font-medium leading-[100%]'>
            {Big(data?.apy ?? 0).toFixed(2)}%
          </div>
        );
      }
    },
    {
      width: '15%',
      key: 'usdDepositAmount',
      label: 'Yours',
      type: 'slot',
      sort: true,
      render: (data) => {
        return (
          <div
            className={clsx(
              'text-black font-Montserrat text-[16px] font-medium leading-[100%]',
              { 'opacity-30	': Big(data?.usdDepositAmount ?? 0).eq(0) }
            )}
          >
            {formatValueDecimal(data?.usdDepositAmount, '$', 2, true, false)}
          </div>
        );
      }
    },
    {
      width: '15%',
      key: 'action',
      label: 'Action',
      type: 'slot',
      render: (data) => {
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
                onChangeData(data, 0);
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
              className={Big(data?.usdDepositAmount ?? 0).eq(0) ? 'cursor-not-allowed' : 'cursor-pointer'}
              onClick={() => {
                Big(data?.usdDepositAmount ?? 0).gt(0) && onChangeData(data, 1);
              }}
            >
              <g opacity={Big(data?.usdDepositAmount ?? 0).eq(0) ? '0.3' : '1'}>
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
    }
  ];

  return (
    <div>
      <div className='pl-[18px] text-black font-Montserrat text-[26px] font-bold leading-[90%]'>
        Vaults
      </div>
      <div className='pt-[7px] pb-[12px] pl-[18px] text-[#3D405A] font-Montserrat text-[14px] font-medium'>
        Deposit or mint BGT-whitelisted LP tokens to earn iBGT (liquid BGT) &
        Boosted Yield.
      </div>
      <div className='px-[30px] pb-[23px]'></div>
      <div className='flex items-center h-[90px] rounded-[10px] p-[18px] bg-[#FFDC50]'>
        <div className='flex flex-col gap-[12px] w-[20%]'>
          <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
            TVL
          </div>
          <div className='text-black font-Montserrat text-[26px] font-semibold leading-[90%]'>
            {tvl}
          </div>
        </div>

        <div className='flex flex-col gap-[12px] w-[80%]'>
          <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
            APY up to
          </div>
          <div className='text-black font-Montserrat text-[26px] font-semibold leading-[90%]'>
            500%
          </div>
        </div>
      </div>
      <div className='flex items-center pt-[23px] pb-[8px]'>
        {columnList.map((column: ColumnType, index: number) => {
          return (
            <div
              key={index}
              style={{ width: column.width }}
              className={clsx('flex items-center gap-[5px] pl-[19px]', {
                'cursor-pointer': column?.sort
              })}
              onClick={() => {
                column?.sort &&
                  updateState({
                    sortKey: state?.sortKey === column.key ? '' : column.key
                  });
              }}
            >
              <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
                {column?.label}
              </div>
              {column?.sort && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='13'
                  height='8'
                  viewBox='0 0 13 8'
                  fill='none'
                >
                  <path
                    d='M5.37058 7.5C5.88774 8.16667 7.18062 8.16667 7.69778 7.5L12.3522 1.5C12.8693 0.833334 12.2229 4.76837e-07 11.1886 4.76837e-07H1.87979C0.845482 4.76837e-07 0.199039 0.833334 0.716193 1.5L5.37058 7.5Z'
                    fill={state?.sortKey === column?.key ? 'black' : '#D1CEB4'}
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className='flex items-center gap-[4px]'>
          {columnList.map((column: ColumnType) => {
            return (
              <Skeleton
                width={(928 * parseInt(column?.width)) / 100 - 4}
                height={58}
              />
            );
          })}
        </div>
      ) : state?.filterList && state?.filterList.length > 0 ? (
        <div className='flex flex-col gap-[2px]'>
          {state?.filterList.map((data: any, index: number) => {
            return (
              <div
                key={index}
                className={clsx(
                  'flex items-center w-full h-[58px] rounded-[10px]',
                  {
                    'bg-black/[0.06]': index % 2 === 0
                  }
                )}
              >
                {columnList.map((column: ColumnType, columnIndex: number) => {
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
            );
          })}
        </div>
      ) : (
        <div className='flex justify-center'>
          You didn’t add any liquidity yet
        </div>
      )}
    </div>
  );
}
