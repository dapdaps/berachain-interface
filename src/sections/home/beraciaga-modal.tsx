import Modal from "@/components/modal"
import { useBeraciaga } from "@/stores/beraciaga"
import { memo, useState } from "react"
export default memo(function BeraciagaModal() {
  const beraciagaStore = useBeraciaga(store => store)
  return (
    <Modal
      open={beraciagaStore.openModal}
      closeIcon={(
        <img src="/images/beraciaga/close.svg" alt="close" />
      )}
      onClose={() => {
        beraciagaStore.set({
          openModal: false
        })
      }}
    >
      <div className="w-[680px] h-[615px] rounded-[12px] bg-[#1F2229] border border-[#333648] shadow-[0_0_4px_0_rgba(0, 0, 0, 0.25)]">
        <div className="relative h-[354px] bg-black rounded-tl-[12px] rounded-tr-[12px]">
          <div className="absolute top-[141px] left-[13px] right-[13px] text-white font-Montserrat text-[90px] font-bold tracking-[9px] leading-[100%]">BERACIAGA</div>
          <div className="absolute top-[98px] left-0 right-0">
            <img src="/images/beraciaga/beraciaga_font.svg" alt="beraciaga_font" />
          </div>
          <div className="absolute top-[25px] left-[222px] w-[268px]">
            <img src="/images/beraciaga/beraciaga_box.png" alt="beraciaga_box" />
          </div>
        </div>

        <div className="flex flex-col mt-[30px] pl-[32px] gap-[14px]">
          <div className="text-white font-Montserrat text-[24px] font-bold">New shop is coming thoon to town in Q5!</div>
          <div className="text-[#979ABE] font-Montserrat text-[16px] leading-[150%]">Henlo and be ready for the epic launch ofthe Beraciaga shop, coming thoon to<br />your nearest town in O5!</div>
          <div className="text-[#979ABE] font-Montserrat text-[16px] leading-[150%]">Sign up with your Beratown account and claim early benefits now!</div>
        </div>
        <div
          className="cursor-pointer mx-auto mt-[30px] flex items-center justify-center w-[394px] h-[40px] rounded-[10px] bg-[#EBF479] text-black font-Montserrat text-[16px] font-semibold"
          data-bp="1010-019"
          onClick={() => {
            window.open(process.env.NEXT_PUBLIC_TG_ADDRESS || "https://t.me/beraciaga_official_bot/Beraciaga")
          }}
        >Sign up to Beraciaga TG Mini app!</div>
      </div>
    </Modal>
  )
})
