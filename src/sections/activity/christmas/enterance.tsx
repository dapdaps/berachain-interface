import useIsMobile from "@/hooks/use-isMobile";
import BearSnow from "@public/images/home/christmas/bear-snow.svg";
import { useRouter } from "next-nprogress-bar";
import Countdown from '@/sections/activity/christmas/components/countdown';

export default function Enterance({ path }: any) {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <>
      {
        !isMobile && (
          <div
            className="cursor-pointer absolute right-[10px] bottom-[10px] z-10 hover:scale-105 transition-transform duration-500"
            onClick={() => {
              router.push(path);
            }}
          >
            <div className="relative z-[1]">
              <BearSnow />
              <Countdown />
            </div>
          </div>
        )
      }
    </>
  );
}
