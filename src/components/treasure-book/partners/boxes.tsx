import LightButton from "@/components/check-in/button";
import { GameLootbox } from "@/configs/playground";
import { numberFormatter } from "@/utils/number-formatter";

const PartnersBoxes = (props: any) => {
  const { userBoxes, userBoxesLoading, userBoxesTotal, userBoxesTotalBalance, openBox, opening } = props;

  return (
    <div className="flex-1 h-full font-CherryBomb relative text-[#FDD54C] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000]">
      <div className="w-[200px] text-center pl-[30px] mt-[15px]">
        <div className="text-[60px] leading-[60px]">
          {numberFormatter(userBoxesTotal, 0, true)}
        </div>
        <div className="text-[24px]">Total Collected</div>
      </div>
      <div className="flex flex-col items-center gap-[10px] justify-center pb-[40px] absolute z-[4] right-[30px] top-[-40px] w-[180px] h-[174px] bg-[url('/images/treasure-book/flag2.png')] bg-no-repeat bg-center bg-contain">
        <div className="text-[60px] leading-[50px]">
          {numberFormatter(userBoxesTotalBalance, 0, true)}
        </div>
        <div className="text-[20px] leading-[20px]">To be opened</div>
      </div>
      <div className="grid grid-cols-2 gap-x-[45px] gap-y-[35px] mt-[25px] pl-[50px]">
        {
          Object.values(GameLootbox).map((box, index) => (
            <div key={index} className="group w-[212px] h-[212px] relative flex justify-center items-center">
              <div className="w-full h-full rounded-[20px] border-[3px] border-[#8B6A45] bg-[#D39924] overflow-hidden bg-[url('/images/treasure-book/bg-lights.png')] bg-no-repeat bg-center bg-contain">

              </div>
              <div className="group-hover:opacity-100 group-hover:rotate-[5.177deg] transition-all duration-300 opacity-0 absolute z-[1] w-full h-full rounded-[20px] border-[3px] border-[#8B6A45] bg-[#FFFF9C] overflow-hidden bg-[url('/images/treasure-book/bg-lights.png')] bg-no-repeat bg-center bg-contain">

              </div>
              {
                !!userBoxes?.get(box.category)?.balance_box && (
                  <LightButton
                    className="group-hover:opacity-100 transition-all duration-300 opacity-0 absolute bottom-[-20px] z-[4]"
                    loading={opening}
                    onClick={() => {
                      openBox({
                        category: box.category,
                      });
                    }}
                  >
                    Open
                  </LightButton>
                )
              }
              <div className="w-full h-full absolute z-[3] flex justify-center items-center">
                <div className="absolute right-[10px] top-[10px] w-min h-[30px] px-[15px] bg-[#FF5A5A] text-[#F7F9EA] leading-[28px] border border-black rounded-[16px] [-webkit-text-stroke-color:#4B371F] text-[20px] uppercase">
                  x{numberFormatter(userBoxes?.get(box.category)?.balance_box, 0, true, { isShort: true, isShortUppercase: true })}
                </div>
                <img
                  src={box.imgBox}
                  alt=""
                  className="w-[162px] h-[128px] shrink-0 object-center object-contain"
                />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default PartnersBoxes;
