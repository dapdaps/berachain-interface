import { useState } from "react";
import LootboxSeasonRadioSelector from "../../components/radio-selector";
import LootboxSeasonTitle from "../../components/title";
import LootboxSeasonButton from "../../components/button";

const LootboxSeasonOpen = (props: any) => {
  const { onNext, loading } = props;

  const [list, setList] = useState([
    {
      key: 1,
      label: "Yield Farmer",
      description: "Show me the highest APY",
      selected: false,
    },
    {
      key: 2,
      label: "DeFi Curious",
      description: "Help me explore DeFi",
      selected: false,
    },
    {
      key: 3,
      label: "Cross-chain Explorer",
      description: "I want to bridge and swap",
      selected: false,
    },
    {
      key: 4,
      label: "Berachain Baller",
      description: "Here for the vibes",
      selected: true,
    },
    {
      key: 5,
      label: "First Timer",
      description: "I’m new, help me start",
      selected: false,
    },
  ]);

  return (
    <div className="w-full">
      <div className="w-full pt-[28px] relative">
        <LootboxSeasonTitle>
          What Brings You To<br /> Beratown Today?
        </LootboxSeasonTitle>
        <img
          src="/images/guiding-tour/lootbox-season/arrow@2x.png"
          alt=""
          className="w-[75px] h-[47px] shrink-0 object-center object-contain absolute bottom-[-20px] right-[100px] scale-x-[-1] rotate-[-30deg]"
        />
      </div>
      <div className="w-full mt-[58px] flex flex-col items-stretch gap-[12px] px-[26px]">
        {
          list.map((item, index) => (
            <LootboxSeasonRadioSelector
              key={item.key}
              selected={item.selected}
              description={item.description}
              onClick={() => {
                setList((prev) => {
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
      <div className="w-full mt-[37px] flex justify-center pb-[30px]">
        <LootboxSeasonButton
          className="!px-[100px]"
          onClick={onNext}
          loading={loading}
          disabled={loading || !list.some((it) => it.selected)}
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
