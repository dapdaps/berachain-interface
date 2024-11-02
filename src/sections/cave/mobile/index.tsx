import MenuButton from "@/components/mobile/menuButton";
import Welcome from "../Welcome";
import Popup from "./popup";
import Module, { ModuleItem } from "./components/Module";
import { ModuleConfigs } from "./config";

const Cave = () => {
  const handleItemClick = (item: ModuleItem) => {
    console.log('Selected item:', item);
  };
  return (
    <div className="relative">
      <div
        className="mt-10"
        style={{
          backgroundImage: `url('/images/mobile/cave/header.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "30.384vw",
          width: "100vw",
        }}
      >
        <MenuButton className="my-0 mx-auto" contentClassName="text-2xl">
          Bear Cave
        </MenuButton>
      </div>
      <div className="bg-[#9C948F] h-[100vh] w-full">
        <div
          className="absolute bottom-0"
          style={{
            backgroundImage: `url('/images/mobile/cave/bottom.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "82.05vw",
            width: "100vw",
          }}
        />
        <div className="flex flex-col justify-center items-center">
          <div className="w-full flex flex-col items-center justify-center mt-[10.512vw] relative">
            <img
              src="/images/mobile/cave/backStripe.png"
              className="w-[96.417vw] h-[12.37vw]"
              alt=""
            />

            <Module 
                    config={{
                      ...ModuleConfigs.hat,
                      onItemClick: handleItemClick
                    }} 
            />
            <Module config={ModuleConfigs.jacket} />

            <img
              src="/images/mobile/cave/backStripe.png"
              className="w-[96.417vw] h-[12.37vw] absolute top-[57.282vw]"
              alt=""
            />

            {/* Jewelry Modules */}
            <div
              className="absolute top-[73vw] left-2"
              style={{
                backgroundImage: `url('/images/mobile/cave/cupboard-1.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "46.923vw",
                width: "98.461vw",
              }}
            >
              <Module config={ModuleConfigs.jewelry} />
            </div>

            {/* Key Modules */}
            <div
              className="absolute top-[123.43vw] left-2"
              style={{
                backgroundImage: `url('/images/mobile/cave/cupboard-2.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "38.974vw",
                width: "98.461vw",
              }}
            >
              <Module config={ModuleConfigs.key} />
            </div>
          </div>
        </div>
      </div>
      <Welcome />
      <Popup />
    </div>
  );
};

export default Cave;
