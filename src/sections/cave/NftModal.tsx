import Card from "@/components/card";
import Modal from "@/components/modal";
import { memo } from "react";
import CheckBox from "./CheckBox";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";
export default memo(function NftModal({
  nfts,
  store,
  visible,
  onClose,
  checkedIndex
}: any) {
  const isMobile = useIsMobile()

  return (
    <Modal open={visible} onClose={onClose}>
      <Card>
        <div className="w-[442px] md:w-full h-[426px] px-[10px] md:px-[22px] py-[4px]">
          <div className="text-black font-Montserrat text-[20px] font-bold leading-[90%]">Change NFT</div>
          <div className="mt-[28px] flex flex-wrap gap-x-[10px] gap-y-[12px] md:gap-[20px]">
            {
              nfts?.map((nft: any, index: number) => {
                const photoList = store.photoList
                const otherIndex = checkedIndex === 0 ? 1 : 0
                return (
                  <div className="relative h-[154px] rounded-[10px] bg-black/[0.06] w-[134px] md:w-[calc(50% - 10px)]">
                    <div className="absolute right-0 top-0">
                      <CheckBox disabled={nft.token_id === photoList?.[otherIndex]?.token_id} checked={nft.token_id === photoList?.[checkedIndex]?.token_id} onCheckChange={(isChecked) => {
                        photoList[checkedIndex] = nft
                        store.set({
                          photoList
                        })
                      }} />
                    </div>
                    <div className="px-[12px] mt-[12px] md:px-[25px] md:rounded-[10px] mb-[7px] h-[110px] rounded-[10px] overflow-hidden">
                      <img className="w-full" src={nft?.logo} alt={nft?.name} />
                    </div>
                    <div className="text-center text-black font-Montserrat text-[14px] font-semibold leading-[90%]">{nft?.name}</div>
                  </div>
                )
              })
            }

          </div>
        </div>
      </Card>

    </Modal>
  )
})
