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
          <div className="text-white font-Montserrat text-[24px] font-bold">Your Adventure Gear Awaits!</div>
          <div className="text-[#979ABE] font-Montserrat text-[16px] leading-[150%]">Dear player! Join our mini app now and stay tuned to ensure you can use<br /> your exclusive gear right away when the game starts, embarking on your<br /> adventure!</div>
        </div>
        <div
          className="cursor-pointer mx-auto mt-[46px] flex items-center justify-center w-[394px] h-[40px] rounded-[10px] bg-[#EBF479] text-black font-Montserrat text-[16px] font-semibold"
          data-bp="1010-019"
          onClick={() => {
            window.open(process.env.NEXT_TG_ADDRESS || "https://t.me/berachain_game_test_bot/beraciaga")
          }}
        >Join us and gear up for adventure!</div>
      </div>
    </Modal>
  )
})
