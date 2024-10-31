"use client";
import FlexTable, { Column } from "@/components/flex-table";
import Loading from "@/components/loading";
import useCustomAccount from "@/hooks/use-account";
import { useBGT } from "@/hooks/use-bgt";
import useToast from "@/hooks/use-toast";
import useBendReward from "@/sections/Lending/Bend/hooks/useBendReward";
import useInfraredList from "@/sections/liquidity/hooks/use-infrared-list";
import { formatValueDecimal } from "@/utils/balance";
import { asyncFetch } from "@/utils/http";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
export default memo(function BGTPageView() {

  const router = useRouter()

  const Columns: Column[] = [
    {
      title: 'Vaults',
      dataIndex: 'Vaults',
      align: 'left',
      width: '25%',
      render: (text: string, record: any) => {
        return (
          <div className='flex items-center gap-[10px]'>
            <div className='flex items-center'>
              {record?.images[0] && (
                <div className='w-[30px] h-[30px] rounded-full'>
                  <img src={record?.images[0]} />
                </div>
              )}
              {record?.images[1] && (
                <div className='ml-[-10px] w-[30px] h-[30px] rounded-full'>
                  <img src={record?.images[1]} />
                </div>
              )}
            </div>
            <div className='text-black font-Montserrat text-[16px] font-medium leading-[100%]'>{record?.id}</div>
          </div>
        );
      },
    },
    {
      title: 'Protocol',
      dataIndex: 'protocol',
      align: 'left',
      width: '15%',
      render: (text: string, record: any) => {
        const pool = record?.initialData?.pool
        return (
          <div className="flex items-center gap-[6px]">

            <img
              style={{ width: 20 }}
              src={`/images/dapps/infrared/${(pool?.protocol ?? "infrared").toLocaleLowerCase()}.svg`}
            />
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">{pool?.protocol ?? "infrared"}</div>
          </div>
        );
      },
    },
    {
      title: 'Amount Deposited',
      dataIndex: 'type',
      align: 'left',
      width: '20%',
      sort: true,
      render: (text: string, record: any) => {
        return (
          <div className='flex justify-start'>
            <div className='px-[10px] py-[5px] rounded-[12px] border border-[#373A53] bg-white text-black font-Montserrat text-[14px] font-medium leading-[100%]'>{formatValueDecimal(record?.depositAmount, "", 2)}</div>
          </div>
        );
      },
    },
    {
      title: 'BGT Rewards',
      dataIndex: 'earned',
      align: 'left',
      width: '20%',
      sort: true,
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[6px]">
            <div className="w-[26px] h-[26px] rounded-full">
              <img src="/images/dapps/infrared/bgt.svg" />
            </div>
            <div className='text-[#7EA82B] font-Montserrat text-[16px] font-medium leading-[100%]'>
              {record?.earned ?? 0}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'left',
      width: '20%',
      render: (text: string, record: any) => {
        return (
          <div
            className='flex items-center justify-center w-[90px] h-[32px] border border-[#373A53] rounded-[10px] text-black font-Montserrat text-[14px] font-medium leading-[100%] bg-white hover:bg-[#FFDC50]'
            onClick={record.claim}>
            {
              record.claiming ? <Loading /> : 'Claim BGT'
            }
          </div>
        );
      },
    },
  ];
  const toast = useToast();


  const { data: bgtData, } = useBGT()
  const { account, provider } = useCustomAccount()
  const [updater, setUpdater] = useState(0)
  const { loading, dataList } = useInfraredList(updater)
  const [sortDataIndex, setSortDataIndex] = useState("")

  const [pageData, setPageData] = useState<any>(null)
  // const filterList = useMemo(() => dataList?.filter((data: any) => Big(data?.earned ?? 0).gt(0)) ?? [], [dataList])
  const queryPageData = async function () {
    const result = await asyncFetch("https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/homepage")
    if (result?.top3EmittingValidators?.validators) {
      result.top3EmittingValidators.validators.forEach((v: any) => {
        if (!v.validator?.metadata) return;
        switch (v.validator.metadata.name) {
          case 'Infrared':
            v.validator.metadata.bp = '1010-004-001';
            break;
          case 'Kodiak Finance':
            v.validator.metadata.bp = '1010-004-002';
            break;
          case 'The-Honey-Jar':
            v.validator.metadata.bp = '1010-004-003';
            break;
          default:
            break;
        }
      });
    }
    setPageData(result)
  }
  const refresh = function () {
    setUpdater(Date.now())
  }

  const { rewardValue, depositAmount, icon, platform, vaultToken, claim, claiming } = useBendReward({
    provider, account
  })



  const filterList = [
    {
      id: vaultToken,
      images: [
        icon
      ],
      initialData: {
        pool: {
          protocol: platform
        }
      },
      depositAmount: depositAmount,
      earned: rewardValue,
      claim: claim,
      claiming: claiming
    }
  ];



  const handleClaim = function (data: any) {

    const toastId = toast?.loading({
      title: `Claim...`
    });

    const abi = [{
      "constant": false,
      "inputs": [],
      "name": "getReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }]
    const contract = new ethers.Contract(data?.vaultAddress, abi, provider.getSigner())
    contract
      .getReward()
      .then((tx: any) => tx.wait())
      .then((receipt: any) => {
        toast?.dismiss(toastId);
        toast?.success({
          title: 'Claim Successfully!'
        });
        refresh()
      })
      .catch((error: Error) => {
        console.log('error: ', error);
        toast?.dismiss(toastId);
        toast?.fail({
          title: 'Claim Failed!',
          text: error?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : (error?.message ?? '')
        });
      });
  }

  const handleExplore = function () {
    // window.open("https://bartio.station.berachain.com/")
    router.push("/marketplace/invest?type=vaults")
  }


  useEffect(() => {
    queryPageData()
  }, [])
  return (
    <div className="flex flex-col items-center pt-[75px]">
      <div className="relative mb-[25px]">
        <div className="absolute left-[-13px] top-[-3px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="105" height="98" viewBox="0 0 105 98" fill="none">
            <path d="M104.034 48.6624C104.034 75.2965 83.9647 96.8247 59.2831 96.8247H43.7554V0.5H59.2831C83.9647 0.5 104.034 22.0282 104.034 48.6624Z" fill="#DD7D00" stroke="#924E00" />
            <path d="M89.6155 48.6624C89.6155 75.2986 69.6308 96.8247 45.0577 96.8247C20.4847 96.8247 0.5 75.2986 0.5 48.6624C0.5 22.0261 20.4847 0.5 45.0577 0.5C69.6308 0.5 89.6155 22.0261 89.6155 48.6624Z" fill="#FCD824" stroke="#924E00" />
            <path d="M78.3378 48.4453C78.3378 70.0016 62.9728 87.3642 44.1491 87.3642C25.3254 87.3642 9.96045 70.0016 9.96045 48.4453C9.96045 26.889 25.3254 9.52637 44.1491 9.52637C62.9728 9.52637 78.3378 26.889 78.3378 48.4453Z" fill="#FCBE24" stroke="#924E00" />
            <path d="M60.855 56.4392C62.9588 59.1822 63.3998 62.1638 62.1781 65.3844C60.9565 68.6048 58.5321 70.7174 54.9056 71.7217C53.171 72.202 51.4017 72.2208 49.5976 71.7783C47.7934 71.3358 46.3147 70.4981 45.1611 69.2656C40.9776 71.0893 37.0469 71.0002 33.3695 68.998C29.6921 66.9955 27.4821 63.7415 26.7399 59.2361C24.9095 58.8007 23.3538 57.9428 22.0728 56.6624C20.7918 55.3823 19.8679 53.7675 19.3012 51.8182C18.3913 48.6891 19.1153 45.7589 21.4731 43.0275C23.8309 40.2961 26.5668 39.109 29.6807 39.4658L35.1506 40.1128C35.7394 38.2314 36.7556 36.5504 38.1992 35.07C39.6431 33.5893 41.3485 32.5211 43.3162 31.8654L42.1527 27.8644C41.9589 27.1975 42.0219 26.5842 42.3417 26.0245C42.6618 25.4648 43.1633 25.0903 43.8468 24.9011C44.53 24.7118 45.1585 24.7733 45.7319 25.0856C46.3056 25.3979 46.6894 25.8875 46.8832 26.5543L48.2256 31.1709C50.3344 31.1965 52.1948 31.6374 53.8069 32.4935C55.4187 33.3496 56.9848 34.7311 58.5048 36.6381L63.0777 35.3715C63.7609 35.1824 64.3894 35.2439 64.9628 35.5562C65.5365 35.8684 65.9201 36.3581 66.1142 37.0248C66.308 37.6918 66.245 38.305 65.9249 38.8648C65.605 39.4243 65.1033 39.799 64.4201 39.9881L60.3203 41.1236C60.7819 43.1018 60.7728 45.0722 60.2925 47.0341C59.8122 48.9961 58.9066 50.7158 57.5756 52.1928L60.855 56.4392ZM41.8392 63.7008C41.4363 62.3159 41.1631 60.9365 41.0193 59.563C40.8756 58.1895 40.8612 56.8217 40.9763 55.4596C39.9313 56.3587 38.746 57.1166 37.4204 57.7332C36.0944 58.3495 34.7334 58.7958 33.3371 59.0719C33.9188 61.0723 34.9687 62.4858 36.4869 63.3124C38.0051 64.1391 39.7893 64.2685 41.8392 63.7008ZM32.3356 52.698C34.0175 52.2323 35.4429 51.6159 36.6112 50.8489C37.7797 50.0819 39.2099 48.799 40.9017 47.0001L30.3219 45.7732C28.6187 45.5796 27.3216 45.9528 26.4305 46.8924C25.5394 47.832 25.2953 48.9944 25.698 50.3792C26.0858 51.713 26.816 52.5639 27.8885 52.9319C28.961 53.3001 30.4433 53.222 32.3356 52.698ZM53.1156 65.5662C54.4296 65.2024 55.3636 64.4587 55.9172 63.3356C56.4709 62.2122 56.3957 61.2215 55.6918 60.3634L48.3916 51.0781C47.8703 52.9961 47.5723 54.8523 47.4976 56.6466C47.423 58.4409 47.5796 60.0048 47.9675 61.3385C48.4597 63.0313 49.1386 64.2428 50.004 64.973C50.8696 65.7033 51.9068 65.9011 53.1156 65.5662ZM53.3524 47.044C53.7287 46.3854 53.9516 45.5893 54.021 44.6556C54.09 43.7219 53.9906 42.7934 53.7221 41.8701C53.2449 40.2286 52.2902 38.9964 50.8582 38.1736C49.4263 37.3508 47.8957 37.1651 46.2663 37.6162C45.3202 37.8782 44.4713 38.2798 43.7198 38.8203C42.9682 39.3611 42.3855 39.9935 41.9715 40.7178L48.9265 41.7849L53.3524 47.044Z" fill="#451D07" />
          </svg>
        </div>
        <div className="absolute left-[-48px] top-[-33px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="60" viewBox="0 0 140 60" fill="none">
            <path d="M13.2599 35.909C13.7431 34.6031 15.5902 34.6031 16.0734 35.909L17.8399 40.6829C18.0931 41.3672 18.6327 41.9067 19.317 42.1599L24.0908 43.9264C25.3967 44.4096 25.3967 46.2567 24.0908 46.7399L19.317 48.5064C18.6327 48.7596 18.0931 49.2992 17.8399 49.9835L16.0734 54.7573C15.5902 56.0632 13.7431 56.0632 13.2599 54.7573L11.4934 49.9835C11.2402 49.2992 10.7007 48.7596 10.0164 48.5064L5.24253 46.74C3.9366 46.2567 3.9366 44.4096 5.24253 43.9264L10.0164 42.1599C10.7007 41.9067 11.2402 41.3672 11.4934 40.6829L13.2599 35.909Z" fill="#FFEC8E" stroke="#924E00" />
            <path d="M125.593 15.2425C126.076 13.9366 127.924 13.9366 128.407 15.2425L129.723 18.7999C129.976 19.4842 130.516 20.0237 131.2 20.2769L134.757 21.5932C136.063 22.0765 136.063 23.9235 134.757 24.4068L131.2 25.7231C130.516 25.9763 129.976 26.5158 129.723 27.2001L128.407 30.7575C127.924 32.0634 126.076 32.0634 125.593 30.7575L124.277 27.2001C124.024 26.5158 123.484 25.9763 122.8 25.7231L119.243 24.4068C117.937 23.9235 117.937 22.0765 119.243 21.5932L122.8 20.2769C123.484 20.0237 124.024 19.4842 124.277 18.7999L125.593 15.2425Z" fill="#FFEC8E" stroke="#924E00" />
            <path d="M30.3933 5.24253C30.8765 3.9366 32.7236 3.9366 33.2068 5.24253L36.1437 13.1793C36.3969 13.8636 36.9364 14.4031 37.6207 14.6563L45.5575 17.5932C46.8634 18.0765 46.8634 19.9235 45.5575 20.4068L37.6207 23.3437C36.9364 23.5969 36.3969 24.1364 36.1437 24.8207L33.2068 32.7575C32.7236 34.0634 30.8765 34.0634 30.3933 32.7575L27.4564 24.8207C27.2032 24.1364 26.6637 23.5969 25.9794 23.3437L18.0426 20.4068C16.7366 19.9235 16.7366 18.0765 18.0426 17.5932L25.9794 14.6563C26.6637 14.4031 27.2032 13.8636 27.4564 13.1793L30.3933 5.24253Z" fill="#FFEC8E" stroke="#924E00" />
          </svg>
        </div>
        <div className="min-w-[278px] h-[88px] p-[10px] rounded-[30px] bg-[#DAA56B] shadow-[1px_1px_0px_0px_#77481E]">
          <div className="flex justify-end pl-[95px] pr-[25px] items-center w-full h-full bg-[#924E00] border border-[#924E00] rounded-[26px] font-CherryBomb text-[32px] text-white leading-[90%]">
            {bgtData?.count} BGT
          </div>
        </div>
      </div>

      <div className="w-[1200px] p-[30px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0_0_rgba(0,0,0,0.25)">
        <div className="flex items-center h-[223px] rounded-[20px] bg-[#FFDC50]">
          <div className="h-full flex flex-col flex-1 py-[34px] pl-[30px] relative justify-between">
            <div className="flex flex-col gap-[12px]">
              <div className="text-[#3D405A]">Active Reward Vaults</div>
              <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">{pageData?.vaultCount}</div>
            </div>
            <div className="flex flex-col gap-[12px]">
              <div className="text-[#3D405A]">Active Incentives</div>
              <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">{formatValueDecimal(pageData?.sumAllIncentivesInHoney, "$", 2, true)}</div>
            </div>

            <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
          </div>

          <div className="h-full flex flex-col items-start flex-1 py-[34px] pl-[30px] relative">
            <div className="mb-[10px] text-[#3D405A] ">Top 3 Validators</div>
            <div className="flex flex-col gap-[12px]">
              {
                pageData?.top3EmittingValidators?.validators?.map((data: any) => (
                  <div data-bp={data?.validator?.metadata?.bp} className="flex items-center h-[36px] py-[5px] pr-[18px] pl-[5px] border border-[#373A53] bg-[#FFFDEB] rounded-[18px]">
                    <div className="w-[26px] h-[26px] rounded-full overflow-hidden">
                      <img src={data?.validator?.metadata?.logoURI} alt={data?.validator?.metadata?.name} />
                    </div>
                    <div className="ml-[7px] mr-[10px] text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{data?.validator?.metadata?.name}</div>
                    <div className="text-black font-Montserrat text-[12px] font-medium leading-[90%]">BGT/Year: 9.02M</div>
                  </div>
                ))
              }
            </div>
            <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
          </div>
          <div className="h-full flex flex-col flex-1 py-[34px] pl-[30px] justify-between">
            <div className="flex flex-col gap-[12px]">
              <div className="text-[#3D405A]">Est. Yearly BGT Distribution</div>
              <div className="flex items-center gap-[10px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="0.5" y="0.5" width="25" height="25" rx="12.5" fill="#FCBE24" stroke="black" />
                  <path d="M18.2975 15.0349C18.9646 15.9048 19.1045 16.8502 18.7171 17.8715C18.3297 18.8927 17.5609 19.5626 16.4109 19.8811C15.8609 20.0334 15.2998 20.0394 14.7277 19.899C14.1556 19.7587 13.6867 19.4931 13.3209 19.1023C11.9942 19.6806 10.7478 19.6523 9.58166 19.0174C8.41553 18.3824 7.71474 17.3505 7.47938 15.9218C6.89895 15.7838 6.40563 15.5117 5.99941 15.1057C5.59321 14.6998 5.30023 14.1877 5.1205 13.5696C4.83198 12.5773 5.06156 11.6481 5.80924 10.782C6.55692 9.91582 7.42448 9.5394 8.41192 9.65255L10.1465 9.85772C10.3332 9.26109 10.6554 8.72806 11.1132 8.25861C11.5711 7.78906 12.1119 7.45034 12.7358 7.2424L12.3669 5.97365C12.3054 5.76219 12.3254 5.56771 12.4268 5.39021C12.5283 5.21272 12.6874 5.09397 12.9041 5.03396C13.1207 4.97396 13.32 4.99346 13.5019 5.09249C13.6838 5.19152 13.8055 5.34676 13.867 5.55821L14.2926 7.02216C14.9614 7.0303 15.5513 7.1701 16.0625 7.44157C16.5736 7.71304 17.0702 8.15113 17.5522 8.75586L19.0023 8.35422C19.219 8.29424 19.4183 8.31373 19.6001 8.41279C19.782 8.51177 19.9037 8.66706 19.9652 8.87849C20.0267 9.08999 20.0067 9.28443 19.9052 9.46195C19.8038 9.6394 19.6447 9.75819 19.428 9.81817L18.128 10.1782C18.2743 10.8055 18.2714 11.4304 18.1191 12.0525C17.9668 12.6747 17.6797 13.22 17.2576 13.6883L18.2975 15.0349ZM12.2675 17.3376C12.1397 16.8985 12.0531 16.461 12.0075 16.0255C11.9619 15.59 11.9573 15.1562 11.9938 14.7243C11.6624 15.0094 11.2866 15.2497 10.8662 15.4452C10.4458 15.6407 10.0142 15.7822 9.57139 15.8698C9.75586 16.5041 10.0888 16.9523 10.5702 17.2144C11.0517 17.4766 11.6174 17.5176 12.2675 17.3376ZM9.2538 13.8486C9.78716 13.7009 10.2392 13.5054 10.6096 13.2622C10.9802 13.019 11.4337 12.6122 11.9702 12.0417L8.61525 11.6527C8.07517 11.5913 7.66383 11.7096 7.38127 12.0076C7.0987 12.3055 7.02128 12.6741 7.14898 13.1133C7.27196 13.5362 7.5035 13.806 7.84361 13.9227C8.18371 14.0395 8.65377 14.0147 9.2538 13.8486ZM15.8433 17.9292C16.26 17.8138 16.5561 17.5779 16.7317 17.2218C16.9073 16.8656 16.8834 16.5514 16.6602 16.2793L14.3453 13.3349C14.18 13.9431 14.0855 14.5317 14.0618 15.1007C14.0381 15.6697 14.0878 16.1656 14.2108 16.5885C14.3669 17.1253 14.5821 17.5095 14.8566 17.7411C15.1311 17.9726 15.46 18.0353 15.8433 17.9292ZM15.9184 12.0556C16.0377 11.8468 16.1084 11.5943 16.1304 11.2983C16.1523 11.0022 16.1208 10.7077 16.0356 10.415C15.8843 9.89444 15.5815 9.50369 15.1275 9.24277C14.6734 8.98185 14.188 8.92296 13.6713 9.06603C13.3713 9.14912 13.1021 9.27644 12.8638 9.44786C12.6255 9.61935 12.4407 9.81989 12.3094 10.0496L14.5149 10.3879L15.9184 12.0556Z" fill="#451D07" />
                </svg>
                <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">{formatValueDecimal(pageData?.bgtInfo?.blockCountPerYear, "", 2, true)} Yearly</div>
              </div>
            </div>

            <div className="flex flex-col gap-[12px]">
              <div className="text-[#3D405A]">Total Circulating BGT</div>
              <div className="flex items-center gap-[10px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="0.5" y="0.5" width="25" height="25" rx="12.5" fill="#FCBE24" stroke="black" />
                  <path d="M18.2975 15.0349C18.9646 15.9048 19.1045 16.8502 18.7171 17.8715C18.3297 18.8927 17.5609 19.5626 16.4109 19.8811C15.8609 20.0334 15.2998 20.0394 14.7277 19.899C14.1556 19.7587 13.6867 19.4931 13.3209 19.1023C11.9942 19.6806 10.7478 19.6523 9.58166 19.0174C8.41553 18.3824 7.71474 17.3505 7.47938 15.9218C6.89895 15.7838 6.40563 15.5117 5.99941 15.1057C5.59321 14.6998 5.30023 14.1877 5.1205 13.5696C4.83198 12.5773 5.06156 11.6481 5.80924 10.782C6.55692 9.91582 7.42448 9.5394 8.41192 9.65255L10.1465 9.85772C10.3332 9.26109 10.6554 8.72806 11.1132 8.25861C11.5711 7.78906 12.1119 7.45034 12.7358 7.2424L12.3669 5.97365C12.3054 5.76219 12.3254 5.56771 12.4268 5.39021C12.5283 5.21272 12.6874 5.09397 12.9041 5.03396C13.1207 4.97396 13.32 4.99346 13.5019 5.09249C13.6838 5.19152 13.8055 5.34676 13.867 5.55821L14.2926 7.02216C14.9614 7.0303 15.5513 7.1701 16.0625 7.44157C16.5736 7.71304 17.0702 8.15113 17.5522 8.75586L19.0023 8.35422C19.219 8.29424 19.4183 8.31373 19.6001 8.41279C19.782 8.51177 19.9037 8.66706 19.9652 8.87849C20.0267 9.08999 20.0067 9.28443 19.9052 9.46195C19.8038 9.6394 19.6447 9.75819 19.428 9.81817L18.128 10.1782C18.2743 10.8055 18.2714 11.4304 18.1191 12.0525C17.9668 12.6747 17.6797 13.22 17.2576 13.6883L18.2975 15.0349ZM12.2675 17.3376C12.1397 16.8985 12.0531 16.461 12.0075 16.0255C11.9619 15.59 11.9573 15.1562 11.9938 14.7243C11.6624 15.0094 11.2866 15.2497 10.8662 15.4452C10.4458 15.6407 10.0142 15.7822 9.57139 15.8698C9.75586 16.5041 10.0888 16.9523 10.5702 17.2144C11.0517 17.4766 11.6174 17.5176 12.2675 17.3376ZM9.2538 13.8486C9.78716 13.7009 10.2392 13.5054 10.6096 13.2622C10.9802 13.019 11.4337 12.6122 11.9702 12.0417L8.61525 11.6527C8.07517 11.5913 7.66383 11.7096 7.38127 12.0076C7.0987 12.3055 7.02128 12.6741 7.14898 13.1133C7.27196 13.5362 7.5035 13.806 7.84361 13.9227C8.18371 14.0395 8.65377 14.0147 9.2538 13.8486ZM15.8433 17.9292C16.26 17.8138 16.5561 17.5779 16.7317 17.2218C16.9073 16.8656 16.8834 16.5514 16.6602 16.2793L14.3453 13.3349C14.18 13.9431 14.0855 14.5317 14.0618 15.1007C14.0381 15.6697 14.0878 16.1656 14.2108 16.5885C14.3669 17.1253 14.5821 17.5095 14.8566 17.7411C15.1311 17.9726 15.46 18.0353 15.8433 17.9292ZM15.9184 12.0556C16.0377 11.8468 16.1084 11.5943 16.1304 11.2983C16.1523 11.0022 16.1208 10.7077 16.0356 10.415C15.8843 9.89444 15.5815 9.50369 15.1275 9.24277C14.6734 8.98185 14.188 8.92296 13.6713 9.06603C13.3713 9.14912 13.1021 9.27644 12.8638 9.44786C12.6255 9.61935 12.4407 9.81989 12.3094 10.0496L14.5149 10.3879L15.9184 12.0556Z" fill="#451D07" />
                </svg>
                <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">10,059,127,002.24</div>
              </div>
            </div>

          </div>

        </div>

        <div className="mt-[30px] flex justify-between items-center">
          <div className="text-black font-Montserrat text-[18px] font-bold leading-[90%]">Your Vaults</div>
          <div
            className="flex items-center justify-center gap-[10px] w-[164px] h-[40px] rounded-[10px] border border-[#373A53] bg-white"
            onClick={handleExplore}
            data-bp="1010-004-004"
          >
            <span>Explore Vaults</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1L5.8 7L1 13" stroke="black" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        {/* <div className="flex items-center mb-[71px]">
         {
         columnList.map(column => (
         <div key={column?.key} className="flex items-center gap-[7px]" style={{ width: column.width }}>
         <span className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
         {column?.label}
         </span>
         </div>
         ))
         }
         </div> */}
        <FlexTable
          loading={loading}
          columns={Columns}
          list={filterList}
          sortDataIndex={sortDataIndex}
          renderEmpty={() => (
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="65" height="47" viewBox="0 0 65 47" fill="none">
                <ellipse cx="29.5" cy="41.5" rx="29.5" ry="5.5" fill="black" fill-opacity="0.5" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0722 11.8919C9.31048 11.4734 8 9.88976 8 8V5C8 2.79086 9.79086 1 12 1H36C38.2091 1 40 2.79086 40 5V8C40 9.88976 38.6895 11.4734 36.9277 11.8919C42.2285 13.8855 46 19.0023 46 25V31C46 36.5228 41.5228 41 36 41H12C6.47715 41 2 36.5228 2 31V25C2 19.0023 5.7715 13.8855 11.0722 11.8919Z" fill="#FFFDEB" />
                <path d="M11.0722 11.8919L11.2483 12.3599L12.7804 11.7836L11.1878 11.4054L11.0722 11.8919ZM36.9277 11.8919L36.8122 11.4054L35.2196 11.7836L36.7517 12.3599L36.9277 11.8919ZM7.5 8C7.5 10.1266 8.97471 11.9076 10.9567 12.3783L11.1878 11.4054C9.64625 11.0393 8.5 9.65289 8.5 8H7.5ZM7.5 5V8H8.5V5H7.5ZM12 0.5C9.51472 0.5 7.5 2.51472 7.5 5H8.5C8.5 3.067 10.067 1.5 12 1.5V0.5ZM36 0.5H12V1.5H36V0.5ZM40.5 5C40.5 2.51472 38.4853 0.5 36 0.5V1.5C37.933 1.5 39.5 3.067 39.5 5H40.5ZM40.5 8V5H39.5V8H40.5ZM37.0433 12.3783C39.0253 11.9076 40.5 10.1266 40.5 8H39.5C39.5 9.65289 38.3538 11.0393 36.8122 11.4054L37.0433 12.3783ZM36.7517 12.3599C41.864 14.2826 45.5 19.2173 45.5 25H46.5C46.5 18.7873 42.593 13.4884 37.1038 11.4239L36.7517 12.3599ZM45.5 25V31H46.5V25H45.5ZM45.5 31C45.5 36.2467 41.2467 40.5 36 40.5V41.5C41.799 41.5 46.5 36.799 46.5 31H45.5ZM36 40.5H12V41.5H36V40.5ZM12 40.5C6.7533 40.5 2.5 36.2467 2.5 31H1.5C1.5 36.799 6.20101 41.5 12 41.5V40.5ZM2.5 31V25H1.5V31H2.5ZM2.5 25C2.5 19.2173 6.13604 14.2826 11.2483 12.3599L10.8962 11.4239C5.40696 13.4884 1.5 18.7873 1.5 25H2.5Z" fill="black" />
                <path d="M15 12H33" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 2" />
                <path d="M12 39C13.1667 38 17.3 36 24.5 36C31.7 36 36.8333 38.3333 37.5 39" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 2" />
                <path d="M58.0126 40.9325C57.6762 41.2422 57.0866 41.3806 56.1624 41.2024C55.2502 41.0265 54.115 40.5585 52.8263 39.814C50.2543 38.3281 47.172 35.8003 44.2042 32.5762C41.2364 29.3521 38.9718 26.0715 37.7036 23.3855C37.0681 22.0398 36.6954 20.8697 36.5956 19.9461C36.4944 19.0103 36.681 18.4342 37.0174 18.1245L39.2247 16.0927L60.2198 38.9007L58.0126 40.9325Z" fill="#D9D9D9" stroke="black" />
                <path d="M60.5877 38.5621C60.2513 38.8718 59.6617 39.0102 58.7375 38.8321C57.8253 38.6562 56.6901 38.1882 55.4014 37.4437C52.8294 35.9578 49.7471 33.4299 46.7793 30.2059C43.8115 26.9818 41.5469 23.7012 40.2787 21.0152C39.6432 19.6694 39.2705 18.4994 39.1707 17.5758C39.0695 16.64 39.2561 16.0639 39.5925 15.7542C39.929 15.4445 40.5186 15.3061 41.4427 15.4843C42.355 15.6601 43.4902 16.1282 44.7789 16.8727C47.3508 18.3585 50.4331 20.8864 53.401 24.1105C56.3688 27.3346 58.6333 30.6152 59.9016 33.3011C60.5371 34.6469 60.9097 35.8169 61.0096 36.7406C61.1108 37.6763 60.9241 38.2525 60.5877 38.5621Z" fill="#FFFDEB" stroke="black" />
              </svg>
              <div className="mt-[8px] mb-[20px] text-[#3D405A] font-Montserrat text-[14px] font-medium">No active vaults yet</div>
              <div className="flex items-center justify-center w-[242px] h-[48px] rounded-[10px] border border-black bg-[#FFDC50]" onClick={handleExplore}>
                <span className="text-[#3D405A] font-Montserrat text-[16px] font-semibold">Explore Vaults</span>
              </div>
            </div>
          )}
          onChangeSortDataIndex={(index) => {
            setSortDataIndex(sortDataIndex === index ? "" : index)
          }}
        />




      </div>
    </div>
  )
})
