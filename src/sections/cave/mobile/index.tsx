import MenuButton from "@/components/mobile/menuButton";
import { useChristmas } from '@/hooks/use-christmas';
import { useCaveNft } from "@/stores/useCaveNft";
import clsx from "clsx";
import { useState } from "react";
import Module, { ModuleItem } from "./components/Module";
import Welcome from "./components/Weclome";
import { useGameItems } from "./hooks/useGameItems";
import { useMasUser } from "./hooks/useMasUser";
import { useWelcomeStore } from "./hooks/useWelcomeStore";
import Popup from "./popup";
const Cave = () => {
  const { isChristmas } = useChristmas();
  const welcomeStore: any = useWelcomeStore()
  const storeNft: any = useCaveNft()

  const handleItemClick = (item: ModuleItem) => {
    console.log("Selected item:", item);
  };

  const { moduleConfigs, loading } = useGameItems();
  const { nfts, items, loading: masUserLoading } = useMasUser()
  const [nftVisible, setNftVisible] = useState(false)


  console.log(welcomeStore.show, 'welcomeStore.show');


  return (
    <div className="relative w-full min-h-dvh overflow-x-hidden overflow-y-scroll scrollbar-hide">
      {
        isChristmas && (
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <div className="absolute left-[-400px] top-[40px] w-[996px] z-10">
              <img src="/images/cave/christmas/ribbons.svg" alt="ribbons" />
            </div>
            <div className="absolute left-0 bottom-[28px] z-10">
              <div className="w-[402px]">
                <img src="/images/cave/christmas/stove.png" alt="stove" />
              </div>
              <div className="absolute left-[34px] top-[10px] w-[348px] z-[1]">
                <img src="/images/cave/christmas/ribbons_2.svg" alt="ribbons_2" />
              </div>
              {
                items.slice(0, -2).map((item, index) => {
                  const Positions = [{
                    left: 54,
                    top: 96
                  }, {
                    left: 121,
                    top: 96
                  }, {
                    left: 193,
                    top: 80
                  }, {
                    left: 259,
                    top: 78
                  }, {
                    left: 322,
                    top: 63
                  },]
                  return (
                    <div
                      style={{ left: Positions[index]?.left, top: Positions[index]?.top }}
                      className={clsx("absolute w-[58px] cursor-pointer cave-tip")}
                      onClick={(e) => {
                        tipClick(e, sockTips[index])
                      }}
                    >
                      <div className={clsx("absolute left-[28px] w-[4px] bg-black rounded-[2px]", index === 2 ? 'h-[38px] top-[-32px]' : 'h-[20px] top-[-16px]')} />
                      <img src={`/images/cave/christmas/sock${item.pc_item ? '_has' : ''}.svg`} alt="sock" />


                    </div>
                  )
                })
              }

              {
                items.slice(-2).map((item, index) => {
                  const Positions = [{
                    left: 182,
                    top: 227
                  }, {
                    left: 272,
                    top: 243
                  },]
                  return (
                    <div
                      style={{ left: Positions[index]?.left, top: Positions[index]?.top }}
                      className={clsx("absolute cursor-pointer cave-tip", index === 0 ? "w-[98px]" : "w-[85px]")}
                      onClick={(e) => {
                        tipClick(e, giftBoxTips[index])
                      }}
                    >
                      <img src={index === 0 ? `/images/cave/christmas/gift_box_1${item.pc_item ? '_has' : ''}.png` : `/images/cave/christmas/gift_box_2${item.pc_item ? '_has' : ''}.png`} alt="giftBox" />
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      }
      <div
        className='mt-10 relative'
        style={{
          backgroundImage: `url('/images/mobile/cave/header.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '30.384vw',
          width: '100vw'
        }}
      >
        <MenuButton className='relative my-0 mx-auto z-20' contentClassName='text-2xl'>
          Bera Cave
        </MenuButton>
        <div
          className="font-CherryBomb text-[16px] font-[400] underline leading-[14] absolute right-[40px] top-[-104px] h-[20px]" onClick={() => {
            welcomeStore.set({ show: true })
          }}
          data-bp="1020-001"
        >Rules</div>
      </div>
      <div className='bg-[#9C948F] h-[330vw] w-full'>
        <div className=" flex gap-[30px] justify-center mb-[50px]">
          <div className="relative w-[159px] h-[184px]">
            <img className="relative z-[3]" src="/images/cave/christmas/photo_frame.svg" alt="photo_frame" />
            <div className="absolute left-[18px] top-[42px] z-[2]">
              <svg xmlns="http://www.w3.org/2000/svg" width="118" height="114" viewBox="0 0 118 114" fill="none">
                <path d="M11.02 19.0435V109.182C11.02 111.4 9.22165 113.199 7.00332 113.199C4.83003 113.199 3.05092 111.47 2.98834 109.298L0.0176601 6.17277C-0.0797058 2.79278 2.63378 0 6.01517 0H111.697C115.011 0 117.697 2.68629 117.697 6V7.04348C117.697 10.3572 115.011 13.0435 111.697 13.0435H17.02C13.7063 13.0435 11.02 15.7298 11.02 19.0435Z" fill="black" fill-opacity="0.54" />
              </svg>
            </div>
            <div className="absolute top-[54px] left-[28px] right-[28px] bottom-[32px] z-[1]">
              <img src={storeNft?.nft?.logo} alt="" />
            </div>

            <div
              className="absolute left-[38px] top-[86px] flex items-center justify-center w-[81px] h-[36px] rounded-[18px] border-[2px] border-[#4B371F] bg-[#FFDC50] cursor-pointer text-black font-CherryBomb text-[18px] z-[5]"
              onClick={() => {
                nfts?.length > 0 && setNftVisible(true)
              }}
            >
              Change
            </div>
            <div className="z-[4] flex items-center justify-center absolute left-[13px] bottom-[6px] w-[123px] h-[26px] rounded-[8px] border border-[#B18249] bg-[linear-gradient(90deg,_#CDB34D_0%,_#675A27_100%)] text-[#FFEAA5] font-CherryBomb text-[14px]  text-stroke-1">
              {storeNft?.nft?.name}
            </div>
          </div>
          <img src="/images/cave/youtube.png" className="w-[150px]" />
        </div>
        <div
          className='fixed bottom-0'
          style={{
            backgroundImage: `url('/images/mobile/cave/bottom.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '82.05vw',
            width: '100vw'
          }}
        />
        <div className='flex flex-col justify-center items-center'>
          <div className='w-full flex flex-col items-center justify-center mt-[10.512vw] relative'>
            <img
              src='/images/mobile/cave/backStripe.png'
              className='w-[96.417vw] h-[12.37vw]'
              alt=''
            />

            <Module
              config={{
                ...moduleConfigs.hats,
                onItemClick: handleItemClick,
              }}
            />

            <Module config={moduleConfigs.jackets} />

            <img
              src='/images/mobile/cave/backStripe.png'
              className='w-[96.417vw] h-[12.37vw] absolute top-[57.282vw]'
              alt=''
            />

            {/* Jewelry Modules */}
            <div
              className='absolute top-[73vw] left-2'
              style={{
                backgroundImage: `url('/images/mobile/cave/cupboard-1.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '46.923vw',
                width: '98.461vw'
              }}
            >
              <Module config={moduleConfigs.necklaces} />
            </div>

            {/* Key Modules */}
            <div
              className='absolute top-[123.43vw] left-2'
              style={{
                backgroundImage: `url('/images/mobile/cave/cupboard-2.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '38.974vw',
                width: '98.461vw'
              }}
            >
              <Module config={moduleConfigs.cars} />
            </div>
          </div>
        </div>
      </div>
      <Welcome show={welcomeStore.show} onClose={() => welcomeStore.set({ show: false })} />
      <Popup />
    </div>
  );
};

export default Cave;
