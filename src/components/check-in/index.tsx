import clsx from "clsx";
import LightButton from "./button";
import { useRequest } from "ahooks";
import useCustomAccount from "@/hooks/use-account";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { RewardType } from "./config";

const CheckIn = (props: any) => {
  const { className, setOpenReward, setRewardData } = props;

  const { accountWithAk } = useCustomAccount();

  const [mockCheckedDay, setMockCheckedDay] = useState(0);

  const { data: checkInData, loading: checkInDataLoading, runAsync: getCheckInData } = useRequest(async (mockCheckDay?: number) => {
    if (!accountWithAk) {
      return;
    }
    const checkInDays = cloneDeep(CheckInDays);
    if (mockCheckDay !== void 0) {
      for (let i = 0; i < (mockCheckDay % 7 === 0 ? 7 : mockCheckDay % 7); i++) {
        checkInDays[i].checked = true;
      }
    }
    return checkInDays;
  }, {
    refreshDeps: [accountWithAk]
  });

  const { runAsync: checkIn, loading: checkInPending } = useRequest(async () => {
    if (!accountWithAk) {
      return;
    }
    setMockCheckedDay((prev) => prev + 1);
    getCheckInData(mockCheckedDay + 1);
    if ((mockCheckedDay + 1) % 7 === 0) {
      setOpenReward(true);
      const randomMockGemAmount = Math.ceil(Math.random() * 1000);
      const randomMockSpinAmount = Math.ceil(Math.random() * 10);
      setRewardData([
        {
          type: RewardType.Spin,
          amount: randomMockSpinAmount,
          label: `${randomMockSpinAmount} Free Spin`,
        },
        {
          type: RewardType.Gem,
          amount: randomMockGemAmount,
          label: `${randomMockGemAmount} Gem`,
        },
      ]);
    }
  }, {
    manual: true,
  });

  return (
    <div
      className={clsx(
        "w-[386px] p-[12px_7px_10px_8px] shrink-0 rounded-[10px] border-[2px] border-[#E5C375] bg-[#FFF1C7] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] text-black font-Montserrat text-[14px] font-medium leading-[14px]",
        className
      )}
    >
      <div className="text-[#FDD54C] font-CherryBomb text-[26px] font-[400] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000] pl-[12px]">
        Daily Check-in
      </div>
      <div className="flex justify-between items-center mt-[16px] pl-[12px]">
        <div className="flex flex-col gap-[9px] ">
          <div className="text-[#FDD54C] font-CherryBomb text-[26px] font-[400] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000] h-[24px] leading-[100%]">
            56
          </div>
          <div className="">
            times in total
          </div>
        </div>
        <div className="flex flex-col gap-[9px] ">
          <div className="text-[#FDD54C] font-CherryBomb text-[26px] font-[400] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000] h-[24px] leading-[100%] flex items-center gap-[10px]">
            <div className="">3</div>
            <img
              src="/images/check-in/box.png"
              alt=""
              className="w-[26px] h-[22px] shrink-0 object-center object-contain translate-y-[3px]"
            />
          </div>
          <div className="">
            times in total
          </div>
        </div>
        <LightButton
          onClick={checkIn}
          disabled={checkInPending}
        >
          BM!
        </LightButton>
      </div>
      <div className="mt-[12px] bg-[#FFFAEA] border-[2px] border-[#D7C69D] p-[14px_5px_35px_10px] rounded-[12px]">
        <div className="">
          7 days in row to get 1 Lootbox
        </div>
        <div className="relative flex items-center justify-center gap-[16px] mt-[16px]">
          {
            checkInData?.map((item, index) => (
              <div className="relative z-[2] flex justify-center items-center w-[36px] h-[36px] rounded-full bg-[#D9D9D9] p-[4px] shrink-0">
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-20px]">
                  {item.day}
                </div>
                {
                  item.checked ? (
                    <div className="w-full h-full rounded-full bg-[#FDD54C] relative z-[2] flex items-center justify-center">
                      <img
                        src="/images/check-in/icon-checked.png"
                        alt=""
                        className="w-[20px] h-[17px] object-center object-contain shrink-0"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full relative z-[2] flex items-center justify-center">
                      {
                        item.reward === CheckInReward.Lootbox && (
                          <div className="bg-[url('/images/check-in/box.png')] bg-no-repeat bg-center bg-contain w-[40px] h-[34px] shrink-0" />
                        )
                      }
                      {
                        item.reward === CheckInReward.Points && (
                          <div className="bg-[url('/images/check-in/gem2.png')] bg-no-repeat bg-center bg-contain w-[28px] h-[25px] shrink-0" />
                        )
                      }
                    </div>
                  )
                }
                {
                  index !== 0 && item.checked && (
                    <div className="w-[30px] h-[12px] bg-[#FDD54C] absolute top-1/2 -translate-y-1/2 left-[-23px] z-[1]"></div>
                  )
                }
              </div>
            ))
          }
          <div className="absolute z-[1] w-[calc(100%_-_36px)] h-[20px] bg-[#D9D9D9] left-[18px] top-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;

enum CheckInReward {
  Lootbox = "lootbox",
  Points = "points",
}

interface CheckInDay {
  day: number;
  checked: boolean;
  reward: CheckInReward;
}

const CheckInDays: CheckInDay[] = [...new Array(7).fill(0)].map((_, index) => {
  const item: any = {
    day: index + 1,
    checked: false,
    reward: CheckInReward.Points,
  };
  if (index === 6) {
    item.reward = CheckInReward.Lootbox;
  }
  return item;
});
