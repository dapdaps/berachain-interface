import { useMemo, useState } from 'react';
import MenuButton from '@/components/mobile/menuButton';
import Image from 'next/image';
import Dropdown from '@/components/dropdown';
import CheckBox from '@/components/check-box';
import Empty from '@/components/empty';
import CircleLoading from '@/components/circle-loading';
import Big from 'big.js';
import { cloneDeep } from 'lodash';
import useInfraredList from '../hooks/use-infrared-list';
import { formatValueDecimal } from '@/utils/balance';
import HandleModal from './handle-modal';
import UserInfo from './user-info';

export default function Mobile({ dapp }: any) {
  const { dataList, loading, fetchAllData } = useInfraredList();
  const [sortType, setSortType] = useState(-1);
  const [sortItem, setSortItem] = useState<any>('tvl');
  const [hasStaked, setHasStaked] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [type, setType] = useState(0);

  const data = useMemo(() => {
    if (!dataList?.length) return [];
    if (!sortItem) return dataList;
    return cloneDeep(dataList)
      .filter((item: any) =>
        hasStaked ? Big(item?.usdDepositAmount || 0).gt(0) : true
      )
      .sort((a: any, b: any) =>
        Big(b[sortItem.key] || 0).gt(a[sortItem.key] || 0)
          ? sortType
          : -sortType
      );
  }, [sortItem, sortType, dataList, hasStaked]);

  return (
    <div className='h-full bg-vault relative pt-[25px]'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='389'
        height='271'
        viewBox='0 0 389 271'
        fill='none'
        className='absolute opacity-30 z-[1]'
      >
        <path
          opacity='0.3'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M193.948 76.0192C193.948 76.019 193.947 76.0183 193.946 76.0175L193.897 75.9325C193.826 75.8085 193.866 75.6501 193.988 75.5753L356.552 -24.1536C357.056 -24.4628 357.183 -25.1392 356.826 -25.6102L334.385 -55.2068C334.026 -55.6796 333.337 -55.7381 332.904 -55.3326L195.685 73.1755C195.011 73.8072 193.914 73.2643 194.007 72.3449L213.151 -116.899C213.211 -117.488 212.748 -118 212.156 -118H175.083C174.491 -118 174.029 -117.488 174.089 -116.899L193.521 75.1899C193.521 75.1971 193.519 75.2043 193.514 75.2092C193.503 75.2194 193.485 75.2168 193.478 75.2038L193.262 74.8304C193.25 74.8092 193.24 74.7869 193.232 74.7637L133.019 -105.692C132.832 -106.255 132.198 -106.531 131.658 -106.287L97.8679 -90.9909C97.3292 -90.7471 97.1186 -90.0916 97.4144 -89.5797L191.486 73.2498C191.84 73.8627 191.463 74.6393 190.763 74.7399L190.597 74.7637C190.441 74.7861 190.282 74.7713 190.133 74.7205L10.7455 13.6631C10.1843 13.4721 9.5811 13.8084 9.44857 14.3862L1.13662 50.6224C1.0043 51.1992 1.39912 51.7641 1.98628 51.8381L180.117 74.2841C181.274 74.4299 181.288 76.1004 180.134 76.2661L1.09418 101.977C0.508417 102.061 0.123423 102.632 0.265623 103.207L9.19894 139.294C9.34139 139.869 9.95033 140.195 10.5081 139.995L189.553 75.5827C189.701 75.5293 189.86 75.5118 190.016 75.5315L192.456 75.8389C192.491 75.8433 192.524 75.8593 192.549 75.8842L192.593 75.9283C192.634 75.9684 192.633 76.0339 192.591 76.0728L192.455 76.2006C192.446 76.2087 192.432 76.2029 192.432 76.1911C192.431 76.1743 192.406 76.173 192.404 76.1896L192.394 76.2515C192.394 76.256 192.391 76.2601 192.388 76.2632L192.085 76.5469C192.011 76.6163 192.1 76.7334 192.187 76.6803C192.248 76.6427 192.325 76.6941 192.314 76.7651L191.8 80.0674C191.778 80.214 191.722 80.3537 191.639 80.4763L84.8033 237.404C84.4706 237.893 84.6322 238.562 85.1513 238.845L117.723 256.602C118.244 256.886 118.896 256.657 119.124 256.11L188.095 91.0598C188.551 89.9698 190.188 90.4318 190.006 91.5992L162.588 267.792C162.497 268.377 162.931 268.913 163.522 268.945L200.541 270.94C201.132 270.972 201.622 270.486 201.594 269.895L192.633 80.4509C192.626 80.3028 192.652 80.155 192.709 80.0181L192.733 79.9609C193.09 79.1079 194.313 79.1539 194.605 80.0312L253.524 257.352C253.711 257.915 254.344 258.192 254.885 257.949L288.694 242.695C289.233 242.452 289.445 241.797 289.15 241.285L199.345 85.3888C198.763 84.3782 200.087 83.3584 200.915 84.1795L329.523 211.695C329.944 212.112 330.635 212.074 331.006 211.611L354.279 182.668C354.65 182.207 354.542 181.528 354.047 181.204L196.729 78.4028C195.957 77.898 196.222 76.7056 197.135 76.5756L384.934 49.8496C385.52 49.7662 385.905 49.1951 385.764 48.6205L376.876 12.5221C376.734 11.9465 376.126 11.6198 375.568 11.8198L194.598 76.6663C194.464 76.714 194.316 76.6596 194.246 76.537L193.955 76.0322C193.954 76.0302 193.955 76.0278 193.958 76.0281C193.961 76.0285 193.962 76.0238 193.959 76.0228L193.948 76.0192ZM192.414 74.856C192.33 74.7109 192.155 74.6466 191.997 74.7033L191.445 74.9022C191.319 74.9472 191.321 75.1249 191.447 75.1678L191.982 75.3498C191.992 75.3534 192 75.3403 191.992 75.3324C191.983 75.3235 191.995 75.3092 192.006 75.3161L192.136 75.4016C192.138 75.4028 192.14 75.4038 192.142 75.4045L192.172 75.4147C192.416 75.4978 192.633 75.2341 192.504 75.011L192.414 74.856ZM193.659 77.5088C193.705 77.442 193.716 77.3577 193.691 77.281L193.63 77.0963C193.626 77.0843 193.614 77.0768 193.601 77.0786L193.594 77.0797C193.563 77.084 193.553 77.0407 193.581 77.0304C193.594 77.0257 193.601 77.0115 193.597 76.9983L193.569 76.9132C193.563 76.8957 193.553 76.8799 193.54 76.8669L193.125 76.4553C192.997 76.3282 192.798 76.3052 192.644 76.3996C192.523 76.4743 192.451 76.6093 192.458 76.7519L192.486 77.3396C192.513 77.9075 193.247 78.1148 193.567 77.6448L193.659 77.5088ZM265.641 -106.968C265.858 -107.52 266.504 -107.763 267.031 -107.49L299.976 -90.4386C300.501 -90.1668 300.677 -89.5013 300.355 -89.0056L200.081 65.2993C199.424 66.3098 197.871 65.5103 198.312 64.3887L265.641 -106.968ZM387.904 103.335C388.491 103.414 388.881 103.982 388.744 104.557L380.133 140.723C379.996 141.3 379.39 141.631 378.83 141.436L205.394 80.7927C204.257 80.3952 204.663 78.6972 205.857 78.8577L387.904 103.335ZM51.9155 214.104C51.4979 214.525 50.8073 214.493 50.4314 214.034L26.9012 185.301C26.5266 184.843 26.6284 184.163 27.1203 183.835L180.098 81.9021C181.101 81.234 182.211 82.5821 181.363 83.438L51.9155 214.104ZM32.1585 -35.4127C31.6715 -35.7478 31.58 -36.4299 31.9613 -36.8815L55.9184 -65.2576C56.3011 -65.7109 56.9921 -65.7333 57.4033 -65.3055L184.883 67.2916C185.718 68.1602 184.587 69.4915 183.595 68.8085L32.1585 -35.4127Z'
          fill='url(#paint0_radial_25008_32579)'
        />
        <defs>
          <radialGradient
            id='paint0_radial_25008_32579'
            cx='0'
            cy='0'
            r='1'
            gradientUnits='userSpaceOnUse'
            gradientTransform='translate(194.5 76.5) rotate(90) scale(194.5)'
          >
            <stop offset='0.65' stopColor='#EBF479' />
            <stop offset='1' stopColor='#EBF479' stopOpacity='0' />
          </radialGradient>
        </defs>
      </svg>
      <div className='relative z-[3]'>
        <MenuButton className='my-0 mx-auto' contentClassName='text-2xl'>
          <div className='flex gap-[12px] text-[24px] items-center'>
            <Image
              src='/images/dapps/infrared.svg'
              width={33}
              height={33}
              alt='Icon'
            />
            <div>Vaults</div>
          </div>
        </MenuButton>
        <div className='mt-[12px] text-[14px] font-medium px-[12px] text-center'>
          Deposit or mint BGT-whitelisted LP tokens to earn iBGT (liquid BGT) &
          boosted yield.
        </div>
        <div className='px-[12px] pt-[20px] flex justify-between items-center text-[14px] font-medium'>
          <div className='flex items-center gap-[8px]'>
            <div>Sort by</div>
            <Dropdown
              list={[
                { key: 'tvl', name: 'TVL' },
                { key: 'apy', name: 'Apy' }
              ]}
              title={`${sortItem?.name || 'TVL'}`}
              value='tvl'
              onChange={(val: any) => {
                setSortType(val.key === sortItem.key ? -sortType : 1);
                setSortItem(val);
              }}
              className='gap-[3px] px-0'
              titleClassName='text-[14px] font-normal'
              dropPanelClassName='top-[30px]'
            />
          </div>
          <div className='flex items-center gap-[8px]'>
            <div>You staked only</div>
            <CheckBox
              checked={hasStaked}
              onClick={() => {
                setHasStaked(!hasStaked);
              }}
            />
          </div>
        </div>
      </div>
      <div className='relative z-[2] flex flex-col gap-[12px] px-[12px] pb-[12px] mt-[12px] h-[calc(100%-244px)] overflow-y-auto'>
        {data.map((item: any, idx: number) => (
          <Item
            key={item.id}
            data={item}
            onClick={(type: 0 | 1) => {
              setSelectedRecord(item);
              setType(type);
            }}
          />
        ))}
        {data.length === 0 && !loading && (
          <div className='mt-[50px] w-full flex justify-center items-center'>
            <Empty desc='No Pools.' />
          </div>
        )}
        {loading && (
          <div className='flex justify-center items-center h-[200px]'>
            <CircleLoading />
          </div>
        )}
      </div>
      {!!selectedRecord && (
        <HandleModal
          show={!!selectedRecord}
          data={selectedRecord}
          type={type}
          onClose={() => {
            setSelectedRecord(null);
          }}
          onSuccess={() => {
            fetchAllData();
          }}
        />
      )}
    </div>
  );
}

const Item = ({ data, onClick }: any) => {
  const pool = data?.initialData?.pool;
  return (
    <div>
      <div className='bg-white/50 rounded-[10px] backdrop-blur-sm p-[14px]'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-[10px]'>
            <div className='flex items-center relative'>
              {data?.images[0] && (
                <Image
                  className='mr-[-8px] rounded-full'
                  src={data?.images[0]}
                  width={40}
                  height={40}
                  alt='Token'
                />
              )}
              {data?.images[1] && (
                <Image
                  className='rounded-full'
                  src={data?.images[1]}
                  width={40}
                  height={40}
                  alt='Token'
                />
              )}
              <Image
                className='absolute right-[-2px] bottom-[0px]'
                src={`/images/dapps/infrared/${
                  pool
                    ? pool?.protocol === 'BEX'
                      ? 'bex'
                      : 'berps'
                    : 'infrared'
                }.svg`}
                width={20}
                height={20}
                alt='Protocol'
              />
            </div>
            <div>
              <div className='text-[16px] font-semibold'>
                {pool?.name || 'iBGT'}
              </div>
              <div className='text-[14px] mt-[4px]'>{pool?.protocol}</div>
            </div>
          </div>
          <button
            onClick={() => {
              onClick(0);
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='34'
              height='34'
              viewBox='0 0 34 34'
              fill='none'
            >
              <rect
                x='1'
                y='1'
                width='32'
                height='32'
                rx='10'
                fill='#FFDC50'
                stroke='black'
              />
              <path
                d='M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z'
                fill='black'
              />
            </svg>
          </button>
        </div>
        <div className='mt-[16px] flex justify-between'>
          <div>
            <div className='font-medium	text-[14px]'>TVL</div>
            <div className='font-semibold	text-[16px] mt-[8px]'>
              {formatValueDecimal(data.tvl, '$', 2, true)}
            </div>
          </div>
          <div className='text-right'>
            <div className='font-medium	text-[14px]'>APY</div>
            <div className='font-semibold	text-[16px] mt-[8px]'>
              {Big(data?.apy ?? 0).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      {Big(data?.usdDepositAmount || 0).gt(0) && (
        <div className='text-white bg-black/50 rounded-[10px] p-[14px] flex items-center justify-between gap-[20px]'>
          <UserInfo data={data} />
          <button
            onClick={() => {
              onClick(1);
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='34'
              height='34'
              viewBox='0 0 34 34'
              fill='none'
            >
              <rect
                opacity='0.5'
                x='1'
                y='1'
                width='32'
                height='32'
                rx='10'
                stroke='white'
              />
              <rect x='11' y='16' width='13' height='2' rx='1' fill='white' />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};