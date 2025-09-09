import { useState } from "react";
import LootboxSeasonRadioSelector from "../../components/radio-selector";
import LootboxSeasonTitle from "../../components/title";
import LootboxSeasonButton from "../../components/button";

const LootboxSeasonOpen = (props: any) => {
  const {
    onNext,
    loading,
    userCategoryList,
    setUserCategoryList,
  } = props;

  return (
    <div className="w-full">
      <div className="w-full pt-[28px] relative">
        <LootboxSeasonTitle>
          What Brings You To<br /> Beratown Today?
        </LootboxSeasonTitle>
        <img
          src="/images/guiding-tour/lootbox-season/arrow@2x.png"
          alt=""
          className="w-[75px] h-[47px] shrink-0 object-center object-contain absolute bottom-[-20px] md:bottom-[-40px] right-[100px] md:right-[0] scale-x-[-1] rotate-[-30deg]"
        />
      </div>
      <div className="w-full mt-[58px] flex flex-col items-stretch gap-[12px] px-[26px]">
        {
          userCategoryList.map((item: any, index: number) => (
            <LootboxSeasonRadioSelector
              key={item.key}
              selected={item.selected}
              description={item.description}
              onClick={() => {
                setUserCategoryList((prev: any) => {
                  const _list = [...prev];
                  _list.forEach((it) => {
                    it.selected = false;
                    if (it.key === item.key) {
                      it.selected = true;
                    }
                  });
                  return _list;
                });
              }}
            >
              {item.label}
            </LootboxSeasonRadioSelector>
          ))
        }
      </div>
      <div className="w-full mt-[37px] flex justify-center pb-[30px] md:pl-[40px]">
        <LootboxSeasonButton
          className="!px-[100px]"
          onClick={onNext}
          loading={loading}
          disabled={loading || !userCategoryList.some((it: any) => it.selected)}
        >
          <img
            src="/images/guiding-tour/lootbox-season/box@2x.png"
            alt=""
            className="w-[82px] h-[66px] shrink-0 object-center object-contain absolute left-[-40px]"
          />
          <div className="">
            Open Lootbox
          </div>
        </LootboxSeasonButton>
      </div>
    </div>
  );
};

export default LootboxSeasonOpen;
