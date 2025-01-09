import Card from "@/components/card";
import Loading from "@/components/loading";
import Modal from "@/components/modal";
import useCustomAccount from "@/hooks/use-account";
import { useAppKit } from '@reown/appkit/react';
import Big from "big.js";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";
import useToast from '@/hooks/use-toast';
export default memo(function ImportEquipments({
  equimentsMapping
}: any) {
  const {
    account
  } = useCustomAccount()
  const { open } = useAppKit();
  const searchParams = useSearchParams()
  const toast = useToast();

  const [openModal, setOpenModal] = useState(false)
  const [bindLoading, setBindLoading] = useState(false)

  const findHighestLevelEquiment = (equiments: any[]) => {
    const lastIndex = equiments.findLastIndex(equiment => equiment?.pc_item)
    return lastIndex > -1 ? equiments[lastIndex] : null
  }

  const equiments = useMemo(() => (
    Object.keys(equimentsMapping).map(key => {
      const equiment = findHighestLevelEquiment(equimentsMapping[key])
      return equiment ? equiment : null
    }).filter(equiment => equiment)
  ), [equimentsMapping])
  const multiple = useMemo(() => equiments?.reduce((acc, curr) => Big(acc).plus(curr?.bonus_percentage ?? 0), 100), [equiments])

  const shortAccount = useMemo(() => {
    if (!account) return "";
    return `${account.slice(0, 5)}...${account.slice(-4)}`;
  }, [account]);

  const handleBind = async () => {
    toast.dismiss();
    setBindLoading(true)
    try {
      const response = await fetch('/dapdap.game/api/user/bind', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tg_user_id: searchParams.get('tg_user_id'),
          address: account,
        })
      })
      const result = await response.json();
      setBindLoading(false)
      if (result?.code === 200) {
        setOpenModal(false)
        window.open(process.env.NEXT_PUBLIC_TG_ADDRESS || "https://t.me/berachain_game_test_bot/beraciaga")
        return;
      }
      toast.fail({
        title: result?.message,
      });
    } catch (error: any) {
      console.error(error)
      setBindLoading(false)
      toast.fail({
        title: error?.message ?? 'Bind failed!',
      });
    }
  }
  const handleGetUserBind = async (tg_user_id: string) => {
    try {
      const response = await fetch(`/dapdap.game/api/user/bind?tg_user_id=${tg_user_id}`)
      const result = await response.json()
      if (result?.data?.address) {
        setOpenModal(false)
      } else {
        setOpenModal(true)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    const tgId = searchParams.get("tg_user_id")
    if (tgId) {
      handleGetUserBind(tgId)
    }
  }, [searchParams.get("tg_user_id")])

  return (
    <Modal
      open={openModal}
      onClose={() => {
        setOpenModal(false)
      }}
    >
      <Card className="!px-0 !py-0">
        <div className={clsx("w-[590px] md:w-full px-[54px] md:px-0 pt-[31px] pb-[27px]", equiments?.length > 0 ? "h-[590px]" : "h-[429px]")}>

          <div className="text-black font-CherryBomb text-[32px] md:text-[20px] text-center leading-[90%]">Import Equipments</div>

          <div className="relative h-[213px] md:h-[202px]">
            <div className={clsx("absolute w-[198px]", equiments?.length > 0 ? "left-[144px] md:left-[98px] top-[36px] md:top-[15px]" : "left-[144px] md:left-[98px] top-[70px] md:top-[30px]")}>
              <img src="/images/beraciaga/point_to.svg" alt="point_to" />
            </div>
            <div className="absolute left-[29px] md:left-[23px] top-[96px] md:top-[89px] w-[124px]">
              <img src="/images/beraciaga/cave.png" alt="cave" />
            </div>
            <div className="absolute -right-[22px] md:right-[7px] top-[62px] md:top-[61px] w-[165px] md:w-[136px]">
              <img src="/images/beraciaga/beraciaga.png" alt="beraciaga" />
            </div>
            {
              equiments?.length > 0 && (
                <div className="absolute left-[200px] md:left-[154px] top-[97px] md:top-[80px] flex items-center justify-center w-[82px] h-[82px] bg-[url('/images/beraciaga/circle.svg')] bg-center bg-contain bg-no-repeat">
                  <span className="text-[#6376FF] font-Montserrat text-[36px] italic font-bold leading-[100%]">{Big(multiple).div(100).toFixed()}x</span>
                </div>
              )
            }
          </div>
          {
            equiments?.length > 0 ? (

              <div className="flex flex-col gap-[23px] mb-[21px]">
                <div className="flex items-center gap-[12px] pl-0 md:pl-[19px]">
                  {
                    Object.keys(equimentsMapping).map(key => {
                      const equiment = findHighestLevelEquiment(equimentsMapping[key])

                      return equiment ? (
                        <div className="relative w-[150px] h-[170px] rounded-[13px] border-[3px] border-[#C7FF6E] bg-black/50 ">
                          <div className="text-[#F7F9EA] text-center text-stroke-1 font-CherryBomb text-[16px] leading-[120%]">{equiment?.name}</div>

                          <div className="w-[55px] mx-auto mt-[10px]">

                            {key === "cars" && equiment.level === 1 && <img src="/images/cave/key/key-tip-1.png" />}
                            {key === "cars" && equiment.level === 2 && <img src="/images/cave/key/key-tip-2.png" />}
                            {key === "cars" && equiment.level === 3 && <img src="/images/cave/key/key-tip-3.png" />}
                            {key === "cars" && equiment.level === 4 && <img src="/images/cave/key/key-tip-4.png" />}


                            {key === "hats" && equiment.level === 1 && <img src="/images/cave/hat/hat-1-1.png" />}
                            {key === "hats" && equiment.level === 2 && <img src="/images/cave/hat/hat-2-2.png" />}
                            {key === "hats" && equiment.level === 3 && <img src="/images/cave/hat/hat-3-3.png" />}
                            {key === "hats" && equiment.level === 4 && <img src="/images/cave/hat/hat-4-4.png" />}


                            {key === "clothes" && equiment.level === 1 && <img src="/images/cave/clothing/cloth-1-1.png" />}
                            {key === "clothes" && equiment.level === 2 && <img src="/images/cave/clothing/cloth-2-2.png" />}
                            {key === "clothes" && equiment.level === 3 && <img src="/images/cave/clothing/cloth-3-3.png" />}
                            {key === "clothes" && equiment.level === 4 && <img src="/images/cave/clothing/cloth-4-4.png" />}

                            {key === "necklaces" && equiment.level === 1 && <img src="/images/cave/neck/neck-tip-1.png" />}
                            {key === "necklaces" && equiment.level === 2 && <img src="/images/cave/neck/neck-tip-2.png" />}
                            {key === "necklaces" && equiment.level === 3 && <img src="/images/cave/neck/neck-tip-3.png" />}
                            {key === "necklaces" && equiment.level === 4 && <img src="/images/cave/neck/neck-tip-4.png" />}
                          </div>

                          <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-[5px] w-[67px] h-[30px] bg-[url('/images/beraciaga/button_bg.svg')] bg-center bg-no-repeat backdrop-blur-[5px]">
                            <div className="w-[14px]">
                              <img src="/images/beraciaga/lightning.png" alt="lightning" />
                            </div>
                            <div className="text-black font-Montserrat text-[12px] font-bold leading-[100%]">+{equiment?.bonus_percentage}%</div>

                          </div>
                        </div>
                      ) : <></>
                    })
                  }

                </div>
                <div className="-mx-[54px] text-center text-black font-Montserrat text-[16px] font-medium leading-[100%]">Current items will boost up your Beraciaga mining speed by {multiple.toFixed()}%</div>
              </div>
            ) : (
              <div className="-mx-[54px] md:-mx-0 px-0 md:px-[8px] mb-[52px] text-center text-black font-Montserrat text-[16px] font-medium leading-[100%]">Looks like you haven't got any Beracave's item :(<br />Wallahi grab 'em now to boost up your mining speed in Beraciaga!</div>
            )
          }
          {
            account ? (
              <div className={clsx("cursor-pointer flex items-center justify-center mx-auto w-[292px] h-[52px] rounded-[16px] border border-black bg-[#FFD335] text-black font-Montserrat text-[16px] font-bold", bindLoading ? "opacity-50" : "opacity-100")} onClick={handleBind}>
                {
                  bindLoading ? (
                    <Loading />
                  ) : (
                    <>Bind {shortAccount}</>
                  )
                }
              </div>
            ) : (
              <div
                className="cursor-pointer flex items-center justify-center mx-auto w-[292px] h-[52px] rounded-[16px] border border-black bg-[#FFD335] text-black font-Montserrat text-[16px] font-bold"
                onClick={() => {
                  open()
                }}
              >
                Connect Wallet
              </div>
            )
          }

        </div>
      </Card>
    </Modal>
  )
})
