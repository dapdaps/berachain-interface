import Card from "@/components/card";
import Modal from "@/components/modal";
import { memo } from "react";
import CheckBox from "./CheckBox";
export default memo(function NftModal({
  nfts,
  store,
  visible,
  onClose
}: any) {

  return (
    <Modal open={visible} onClose={onClose}>
      <Card>
        <div className="w-[482px] h-[426px] px-[10px] py-[4px]">
          <div className="text-black font-Montserrat text-[20px] font-bold leading-[90%]">Change NFT</div>
          <div className="mt-[28px] flex flex-wrap gap-x-[10px] gap-y-[12px]">
            {
              nfts?.map((nft: any, index: number) => (
                <div className="relative w-[134px] h-[154px] rounded-[10px] bg-black/[0.06]">

                  <div className="absolute right-0 top-0">
                    <CheckBox checked={nft.token_id === store?.nft?.token_id} onCheckChange={(isChecked) => {
                      store.set({
                        nft: isChecked ? nft : null
                      })
                    }} />
                  </div>
                  <div className="px-[12px] mt-[12px] mb-[7px] h-[110px] rounded-[10px] overflow-hidden">
                    <img src={nft?.logo} alt={nft?.name} />
                  </div>
                  <div className="text-center text-black font-Montserrat text-[14px] font-semibold leading-[90%]">{nft?.name}</div>
                </div>
              ))
            }

          </div>
        </div>
      </Card>

    </Modal>
  )
})
