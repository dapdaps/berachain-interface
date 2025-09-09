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
import { useGameItems } from "./hooks/useGameItems";
import { useMasUser } from "./hooks/useMasUser";
import { useWelcomeStore } from "./hooks/useWelcomeStore";
import Popup from "./popup";
import TransferItemsModal from '@/sections/cave/components/TransferItems/Modal';
import TransferButton from "./components/TransferButton";
import { useAirdrop } from "../useAirdrop";
import DappsModal from "../components/DappsModal";



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
        style={{
          opacity: tips?.btnText === 'Delegate' ? 0.5 : 1
        }}
        onClick={() => {
          if (!currentSceneInfoValid) return;
          if (tips?.btnText === 'Delegate') {
            return
          }
          if (tips?.link) {
            router.push(tips?.link)
          } else {
            // router.push("/activity/christmas")
          }
        }}
        className="w-full h-8 border-[2px] bg-[#FFF5A9] rounded-[30px] border-[#4B371F] font-CherryBomb text-[18px] font-[400] text-center text-stroke-2 text-white"
      >
        {tips?.btnText}
      </div>
    </div>
  )
}
const Cave = () => {

  const router = useRouter()
  const { account } = useCustomAccount()
  const { currentSceneInfoValid } = useContext(SceneContext);
  const { isChristmas } = useChristmas();
  const welcomeStore: any = useWelcomeStore()
  const storePhotoList: any = useCavePhotoList()

  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const [dapps, setDapps] = useState([])
  const [modalTitle, setModalTitle] = useState('')

  const handleItemClick = (item: ModuleItem) => {
    console.log('item', item)
    if (item?.dapps?.length > 0) {
      setDapps(item?.dapps)
      setModalTitle(item?.type)
    } else {
      router.push(item.link)
    }
  };

  const { airDropRound, airDropPrize, airDropHistory } = useAirdrop();
  const { cars, hats, clothes, necklaces, getItems } = useCollect({
    address: account as string,
    round: airDropRound?.round || -1,
  })
  const { moduleConfigs, loading, fetchGameItems } = useGameItems({ round: airDropRound?.round || -1 });
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
                  const tips = currentSceneInfoValid ? sockTips[index] : { ...sockTips[index], btnText: 'Campaign Ended' }
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
        {/* <div
          className="font-CherryBomb text-[16px] font-[400] underline leading-[14] absolute right-[40px] top-[-104px] h-[20px] z-20" onClick={() => {
            welcomeStore.set({ show: true })
          }}
          data-bp="1020-001"
        >Rules</div> */}
      </div>
      <div className={clsx('bg-[#9C948F] w-full', isChristmas ? 'h-[330vw]' : 'h-[280vw]')}>
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
                onItemClick: handleItemClick
              }}
            />

            <Module config={{ ...moduleConfigs.jackets, onItemClick: handleItemClick }} />

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
              <Module config={{ ...moduleConfigs.necklaces, onItemClick: handleItemClick }} />
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
              <Module config={{ ...moduleConfigs.cars, onItemClick: handleItemClick }} />
            </div>


            <div
              className='absolute top-[167.33vw] left-2'
              style={{
                backgroundImage: `url('/images/mobile/cave/cupboard-3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '54.269vw',
                width: '98.461vw'
              }}
            >
              <Module config={{ ...moduleConfigs.pets, onItemClick: handleItemClick }} />
            </div>

          </div>
        </div>

      </div>

      {/* <TransferButton /> */}
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

      <DappsModal
        open={dapps.length}
        onClose={() => {
          setDapps([])
          setModalTitle("")
        }}
        dapps={dapps}
        title={modalTitle}
      />
    </div>
  );
};

export default Cave;
