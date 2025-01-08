import MenuButton from "@/components/mobile/menuButton";
import Popover, { PopoverPlacement } from "@/components/popover";
import { SceneContext } from '@/context/scene';
import useCustomAccount from "@/hooks/use-account";
import { useChristmas } from '@/hooks/use-christmas';
import useIsMobile from "@/hooks/use-isMobile";
import NftModal from "@/sections/cave/NftModal";
import useCollect, { giftBoxTips, sockTips } from "@/sections/cave/useCollect";
import { useCavePhotoList } from "@/stores/useCavePhotoList";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import ImportEquipments from "../ImportEquipments";
import Module, { ModuleItem } from "./components/Module";
import Welcome from "./components/Weclome";
import { useGameItems } from "./hooks/useGameItems";
import { useMasUser } from "./hooks/useMasUser";
import { useWelcomeStore } from "./hooks/useWelcomeStore";
import Popup from "./popup";
import TransferItemsModal from '@/sections/cave/components/TransferItems/Modal';


const TipsPopover = ({
  tips,
  currentSceneInfoValid
}: any) => {
  const router = useRouter()
  return (
    <div className="border-[3px] p-[10px] border-[#C7FF6E] rounded-xl w-[166px] bg-black bg-opacity-50 flex flex-col justify-center items-center gap-2">
      <div className="flex justify-center items-center w-[75px]">
        <img className="w-full h-full" src={tips?.img} alt={tips?.name} />
      </div>
      <div className="text-[#F7F9EA] font-CherryBomb text-[18px] font-[400] leading-[18px] text-center text-stroke-2">
        {tips?.name}
      </div>
      <div className="w-[38.461vw] text-left text-[12px] font-[400] leading-[14.4px] text-white px-3">
        {tips?.content}
      </div>
      <div
        onClick={() => {
          if (!currentSceneInfoValid) return;
          router.push("/activity/christmas")
        }}
        className="w-full h-8 border-[2px] bg-[#FFF5A9] rounded-[30px] border-[#4B371F] font-CherryBomb text-[18px] font-[400] text-center text-stroke-2 text-white"
      >
        {tips?.btnText}
      </div>
    </div>
  )
}
const Cave = () => {

  const { account } = useCustomAccount()
  const { currentSceneInfoValid } = useContext(SceneContext);
  const { isChristmas } = useChristmas();
  const welcomeStore: any = useWelcomeStore()
  const storePhotoList: any = useCavePhotoList()
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()

  const handleItemClick = (item: ModuleItem) => {
    console.log("Selected item:", item);
  };

  const { cars, hats, clothes, necklaces, getItems } = useCollect({
    address: account as string
  })
  const { moduleConfigs, loading, fetchGameItems } = useGameItems();
  const { nfts, items, loading: masUserLoading } = useMasUser()
  const [checkPhotoIndex, setCheckPhotoIndex] = useState(-1)

  return (
    <div className="relative w-full min-h-dvh overflow-x-hidden overflow-y-scroll scrollbar-hide">
      {
        isChristmas && (
          <div className="absolute top-0 left-0 right-0 bottom-0 z-20">
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
                items.slice(0, -2).map((item: any, index: any) => {
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
                  const tips = currentSceneInfoValid ? sockTips[index] : {...sockTips[index], btnText: 'Campaign Ended'}
                  return (
                    <div
                      style={{ left: Positions[index]?.left, top: Positions[index]?.top }}
                      className={clsx("absolute w-[58px] cursor-pointer cave-tip")}
                    >
                      <Popover
                        placement={PopoverPlacement.Top}
                        contentClassName="backdrop-blur-[10px]"
                        content={(
                          <TipsPopover tips={tips} currentSceneInfoValid={currentSceneInfoValid} />
                        )}
                      >
                        <div className={clsx("absolute left-[28px] w-[4px] bg-black rounded-[2px]", index === 2 ? 'h-[38px] top-[-32px]' : 'h-[20px] top-[-16px]')} />
                        <img src={`/images/cave/christmas/sock${item.pc_item ? '_has' : ''}.svg`} alt="sock" />
                      </Popover>
                    </div>
                  )
                })
              }
              {
                items.slice(-2).map((item: any, index: any) => {
                  const Positions = [{
                    left: 182,
                    top: 227
                  }, {
                    left: 272,
                    top: 243
                  },]
                  const tips = currentSceneInfoValid ? giftBoxTips[index] : { ...giftBoxTips[index], btnText: 'Campaign Ended' }
                  return (
                    <div
                      style={{ left: Positions[index]?.left, top: Positions[index]?.top }}
                      className={clsx("absolute cursor-pointer cave-tip", index === 0 ? "w-[98px]" : "w-[85px]")}
                    >
                      <Popover
                        placement={PopoverPlacement.Top}
                        contentClassName="backdrop-blur-[10px]"
                        content={(
                          <TipsPopover tips={tips} currentSceneInfoValid={currentSceneInfoValid} />
                        )}
                      >
                        <img src={index === 0 ? `/images/cave/christmas/gift_box_1${item.pc_item ? '_has' : ''}.png` : `/images/cave/christmas/gift_box_2${item.pc_item ? '_has' : ''}.png`} alt="giftBox" />
                      </Popover>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      }
      <div
        className='mt-10 relative z-10'
        style={{
          backgroundImage: `url('/images/mobile/cave/header.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '30.384vw',
          width: '100vw'
        }}
      />

      <div className="absolute top-10 left-0 right-0">
        <MenuButton className='relative my-0 mx-auto z-20' contentClassName='text-2xl'>
          Bera Cave
        </MenuButton>
        <div
          className="font-CherryBomb text-[16px] font-[400] underline leading-[14] absolute right-[40px] top-[-104px] h-[20px] z-20" onClick={() => {
            welcomeStore.set({ show: true })
          }}
          data-bp="1020-001"
        >Rules</div>
      </div>
      <div className={clsx('bg-[#9C948F] w-full', isChristmas ? 'h-[330vw]' : 'h-[240vw]')}>
        <div className="relative flex gap-[30px] justify-center mb-[50px] z-30">
          {
            storePhotoList?.photoList?.map((photo: any, index: any) => (
              <div className="relative w-[159px] h-[184px] group z-20"
                onClick={() => {
                  isMobile && nfts?.length > 0 && setCheckPhotoIndex(index)
                }}
              >
                <img className="relative z-[3]" src="/images/cave/christmas/photo_frame.svg" alt="photo_frame" />
                <div className="absolute left-[18px] top-[42px] z-[2]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="118" height="114" viewBox="0 0 118 114" fill="none">
                    <path d="M11.02 19.0435V109.182C11.02 111.4 9.22165 113.199 7.00332 113.199C4.83003 113.199 3.05092 111.47 2.98834 109.298L0.0176601 6.17277C-0.0797058 2.79278 2.63378 0 6.01517 0H111.697C115.011 0 117.697 2.68629 117.697 6V7.04348C117.697 10.3572 115.011 13.0435 111.697 13.0435H17.02C13.7063 13.0435 11.02 15.7298 11.02 19.0435Z" fill="black" fill-opacity="0.54" />
                  </svg>
                </div>

                <div
                  className="absolute left-[38px] top-[86px] flex items-center justify-center w-[81px] h-[36px] rounded-[18px] border-[2px] border-[#4B371F] bg-[#FFDC50] cursor-pointer text-black font-CherryBomb text-[18px] z-[5] md:hidden opacity-0 group-hover:opacity-100"
                  onClick={() => {
                    nfts?.length > 0 && setCheckPhotoIndex(index)
                  }}
                >
                  Change
                </div>
                {
                  photo ? (
                    <>
                      <div className="absolute top-[54px] left-[28px] right-[28px] bottom-[32px] z-[1]">
                        <img className="w-full" src={photo?.logo} alt={photo?.name} />
                      </div>
                      <div className="z-[4] flex items-center justify-center absolute left-[13px] bottom-[6px] w-[123px] h-[26px] rounded-[8px] border border-[#B18249] bg-[linear-gradient(90deg,_#CDB34D_0%,_#675A27_100%)] text-[#FFEAA5] font-CherryBomb text-[14px]  text-stroke-1">
                        {photo?.name}
                      </div>
                    </>
                  ) : (
                    <div className="absolute top-[54px] left-[28px] right-[28px] bottom-[32px] z-[1] bg-[#656565] flex items-center justify-center">
                      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40.0846 2.1665C45.5013 2.1665 49.8346 6.49984 49.8346 11.9165C49.8346 14.4082 48.8596 16.8998 47.1263 18.6332C48.2096 21.3415 48.7513 24.1582 48.7513 27.0832C48.7513 39.6498 38.568 49.8332 26.0013 49.8332C13.4346 49.8332 3.2513 39.6498 3.2513 27.0832C3.2513 24.1582 3.79297 21.3415 4.8763 18.6332C3.14297 16.8998 2.16797 14.4082 2.16797 11.9165C2.16797 6.49984 6.5013 2.1665 11.918 2.1665C14.7346 2.1665 17.3346 3.35817 19.1763 5.4165C23.618 4.00817 28.3846 4.00817 32.8263 5.4165C34.668 3.35817 37.268 2.1665 40.0846 2.1665ZM42.5763 19.0665C42.143 18.0915 42.3596 17.0082 43.2263 16.3582C44.6346 15.2748 45.5013 13.6498 45.5013 11.9165C45.5013 8.88317 43.118 6.49984 40.0846 6.49984C38.1346 6.49984 36.5096 7.47484 35.4263 9.09984C34.8846 9.9665 33.8013 10.3998 32.8263 9.9665C28.493 8.23317 23.618 8.23317 19.1763 9.9665C18.2013 10.3998 17.118 9.9665 16.5763 9.09984C15.6013 7.47484 13.868 6.49984 11.918 6.49984C8.99297 6.49984 6.5013 8.88317 6.5013 11.9165C6.5013 13.6498 7.36797 15.2748 8.7763 16.3582C9.64297 17.0082 9.96797 18.0915 9.4263 19.0665C8.23464 21.5582 7.58463 24.2665 7.58463 27.0832C7.58463 37.2665 15.818 45.4998 26.0013 45.4998C36.1846 45.4998 44.418 37.2665 44.418 27.0832C44.418 24.2665 43.768 21.5582 42.5763 19.0665Z" fill="#8D8D8D" />
                        <path d="M29.9013 30.3335H22.1013C21.5596 30.3335 21.2346 31.0918 21.7763 31.4168L24.0513 33.0418C24.593 33.3668 24.918 33.9085 25.0263 34.4502L25.4596 36.1835C25.568 36.7252 26.3263 36.7252 26.4346 36.1835L26.868 34.4502C27.0846 33.9085 27.4096 33.3668 27.843 33.0418L30.3346 31.4168C30.768 31.0918 30.5513 30.3335 29.9013 30.3335ZM33.5846 20.5835C31.743 20.5835 30.3346 21.9918 30.3346 23.8335C30.3346 25.6752 31.743 27.0835 33.5846 27.0835C35.4263 27.0835 36.8346 25.6752 36.8346 23.8335C36.8346 21.9918 35.4263 20.5835 33.5846 20.5835ZM18.418 20.5835C16.5763 20.5835 15.168 21.9918 15.168 23.8335C15.168 25.6752 16.5763 27.0835 18.418 27.0835C20.2596 27.0835 21.668 25.6752 21.668 23.8335C21.668 21.9918 20.2596 20.5835 18.418 20.5835Z" fill="#8D8D8D" />
                      </svg>
                    </div>
                  )
                }

              </div>
            ))
          }
        </div>
        <div
          className='fixed bottom-0 z-[5]'
          style={{
            backgroundImage: `url('/images/mobile/cave/bottom.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '82.05vw',
            width: '100vw'
          }}
        />
        {
          !isChristmas && (
            <div className="fixed w-[15.641vw] bottom-[50px] left-[8.974%] z-10">
              <img className="w-full" src="/images/cave/leaves.png" alt="" />
            </div>
          )
        }
        <div className='relative flex flex-col justify-center items-center z-20'>
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

      <NftModal
        visible={checkPhotoIndex > -1}
        nfts={nfts}
        store={storePhotoList}
        checkedIndex={checkPhotoIndex}
        onClose={() => {
          setCheckPhotoIndex(-1)
        }}
      />
      <ImportEquipments
        equimentsMapping={{
          cars,
          hats,
          clothes,
          necklaces
        }}
      />
      <TransferItemsModal
        onAfterTransfer={() => {
          fetchGameItems();
          getItems();
        }}
        isMobile
      />
    </div>
  );
};

export default Cave;
