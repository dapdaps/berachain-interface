import PageBack from '@/components/back';
import Content from '@/sections/staking/Content';
import Chest from '../components/chest';
import Bg from '../components/pc-bg';
export default function Laptop({ dapp }: any) {

  // const onChangeData = (data: any, index: number) => {
  //   if (data?.platform === "aquabera") {
  //     router.push(`/staking/aquabera?address=${data.address}`)
  //     return
  //   }
  //   router.push(`/staking/infrared?id=${data.id}&tab=${index}`);
  // }
  // const ColumnList: ColunmListType = [
  //   {
  //     width: '20%',
  //     key: 'pool',
  //     label: 'Pool',
  //     type: 'slot',
  //     render: (data) => {
  //       const pool = data?.pool;
  //       return (
  //         <div className='flex items-center gap-[8px]'>
  //           <div className='flex items-center min-w-[50px]'>
  //             {data?.images[0] && (
  //               <img
  //                 className='w-[30px] h-[30px] rounded-full'
  //                 src={data?.images[0]}
  //                 style={{ objectPosition: 'left' }}
  //               />
  //             )}
  //             {data?.images[1] && (
  //               <img
  //                 src={data?.images[1]}
  //                 className='w-[30px] h-[30px] rounded-full ml-[-10px]'
  //               />
  //             )}
  //           </div>
  //           <div className='text-black font-Montserrat text-[16px] font-medium leading-[100%]'>
  //             {data?.poolName}
  //           </div>
  //         </div>
  //       );
  //     }
  //   },
  //   {
  //     width: '10%',
  //     key: 'protocol',
  //     label: 'Protocol',
  //     type: 'slot',
  //     render: (data: any) => {
  //       const pool = data?.pool;
  //       return (
  //         <img
  //           style={{ width: 26 }}
  //           src={
  //             pool?.protocol === 'BEX'
  //               ? '/images/dapps/infrared/bex.svg'
  //               : pool?.protocol === 'Kodiak Finance'
  //                 ? '/images/dapps/kodiak.svg'
  //                 : '/images/dapps/infrared/berps.svg'
  //           }
  //         />
  //       );
  //     }
  //   },
  //   {
  //     width: '10%',
  //     key: 'platform',
  //     label: 'Platform',
  //     type: 'slot',
  //     render: (data: any) => {
  //       return (
  //         <img
  //           style={{ width: 26 }}
  //           src={
  //             data?.platform === 'infrared' ? '/images/dapps/infrared/infrared.svg' : '/images/dapps/infrared/aquabera.svg'
  //           }
  //         />
  //       );
  //     }
  //   },
  //   {
  //     width: '15%',
  //     key: 'tvl',
  //     label: 'TVL',
  //     type: 'slot',
  //     sort: true,
  //     render: (data) => {
  //       return (
  //         <div className='text-black font-Montserrat text-[16px] font-medium leading-[100%]'>
  //           {formatValueDecimal(data.tvl, '$', 2, true)}
  //         </div>
  //       );
  //     }
  //   },
  //   {
  //     width: '15%',
  //     key: 'apy',
  //     label: 'APY',
  //     type: 'slot',
  //     sort: true,
  //     render: (data) => {
  //       return (
  //         <div className='text-black font-Montserrat text-[16px] font-medium leading-[100%]'>
  //           {Big(data?.apy ?? 0).toFixed(2)}%
  //         </div>
  //       );
  //     }
  //   },
  //   {
  //     width: '15%',
  //     key: 'usdDepositAmount',
  //     label: 'Yours',
  //     type: 'slot',
  //     sort: true,
  //     render: (data) => {
  //       return (
  //         <div
  //           className={clsx(
  //             'text-black font-Montserrat text-[16px] font-medium leading-[100%]',
  //             { 'opacity-30	': Big(data?.usdDepositAmount ?? 0).eq(0) }
  //           )}
  //         >
  //           {formatValueDecimal(data?.usdDepositAmount, '$', 2, true, false)}
  //         </div>
  //       );
  //     }
  //   },
  //   {
  //     width: '15%',
  //     key: 'action',
  //     label: 'Action',
  //     type: 'slot',
  //     render: (data) => {
  //       return (
  //         <div className='flex gap-[10px]'>
  //           <svg
  //             xmlns='http://www.w3.org/2000/svg'
  //             width='34'
  //             height='34'
  //             viewBox='0 0 34 34'
  //             fill='none'
  //             className='cursor-pointer'
  //             onClick={() => {
  //               onChangeData(data, 0);
  //             }}
  //           >
  //             <rect
  //               x='0.5'
  //               y='0.5'
  //               width='33'
  //               height='33'
  //               rx='10.5'
  //               fill='white'
  //               stroke='#373A53'
  //             />
  //             <path
  //               d='M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z'
  //               fill='black'
  //             />
  //           </svg>
  //           <svg
  //             xmlns='http://www.w3.org/2000/svg'
  //             width='34'
  //             height='34'
  //             viewBox='0 0 34 34'
  //             fill='none'
  //             className={
  //               Big(data?.usdDepositAmount ?? 0).eq(0)
  //                 ? 'cursor-not-allowed'
  //                 : 'cursor-pointer'
  //             }
  //             onClick={() => {
  //               Big(data?.usdDepositAmount ?? 0).gt(0) && onChangeData(data, 1);
  //             }}
  //           >
  //             <g opacity={Big(data?.usdDepositAmount ?? 0).eq(0) ? '0.3' : '1'}>
  //               <rect
  //                 x='0.5'
  //                 y='0.5'
  //                 width='33'
  //                 height='33'
  //                 rx='10.5'
  //                 fill='white'
  //                 stroke='#373A53'
  //               />
  //               <rect x='11' y='16' width='13' height='2' rx='1' fill='black' />
  //             </g>
  //           </svg>
  //         </div>
  //       );
  //     }
  //   }
  // ];


  return (
    <div className='bg-vault relative h-full overflow-hidden'>
      <div className='absolute w-full flex flex-col items-center'>
        <Bg />
      </div>
      <div className='pt-[68px] relative z-[2]'>
        <PageBack className='absolute left-[36px] top-[100px] text-white' />
        <div className='text-center text-[60px] font-CherryBomb text-white mt-[10px]'>
          Vaults
        </div>
        <div className='w-[970px] mx-[auto] mt-[20px] relative'>
          <Content dapp={dapp} />
          <Chest />
        </div>
      </div>
      <div className='w-full h-[249px] bg-[#FFDC50] absolute bottom-0' />
    </div>
  );
}
