import MenuButton from "@/components/mobile/menuButton";
import Welcome from "./components/Weclome";
import Popup from "./popup";
import Module, { ModuleItem } from "./components/Module";
import { useGameItems } from "./hooks/useGameItems";
import { useWelcomeStore } from "./hooks/useWelcomeStore";

const Cave = () => {

  const welcomeStore: any = useWelcomeStore()
  
  const handleItemClick = (item: ModuleItem) => {
    console.log("Selected item:", item);
  };

  const {  moduleConfigs, loading} = useGameItems();

console.log(welcomeStore.show, 'welcomeStore.show');


  return (
    <div className='relative w-full h-dvh overflow-x-hidden overflow-y-scroll'>
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
        <MenuButton className='my-0 mx-auto' contentClassName='text-2xl'>
          Bera Cave
        </MenuButton>
        <div
          className="font-CherryBomb text-[16px] font-[400] underline leading-[14] absolute right-[40px] top-[-104px] h-[20px]"  onClick={() => {
                    welcomeStore.set({ show: true })
                }}
          data-bp="1020-001"
        >Rules</div>
      </div>
      <div className='bg-[#9C948F] h-[240vw] w-full'>
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
      <Welcome show={welcomeStore.show} onClose={() => welcomeStore.set({ show: false })}/>
      <Popup />
    </div>
  );
};

export default Cave;
