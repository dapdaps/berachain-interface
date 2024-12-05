import Top from "@/sections/activity/christmas/sections/top";
import NFTProgress from '@/sections/activity/christmas/sections/progress';
import Summary from "@/sections/activity/christmas/sections/summary";
import GiftBox from "@/sections/activity/christmas/sections/gift-box";
import Quest from "@/sections/activity/christmas/sections/quest";

export default function Christmas() {
  return (
    <div className="">
      <Top>
        <NFTProgress />
      </Top>
      <Summary />
      <GiftBox />
      <Quest />
    </div>
  );
}
