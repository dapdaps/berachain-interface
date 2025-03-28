import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import SignpostBubble from '@/sections/home-earth/components/signpost-bubble';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import useIsMobile from '@/hooks/use-isMobile';

const Signpost = (props: any) => {
  const { className } = props;
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div className={clsx('absolute left-0 bottom-0 z-[5] w-[178px] h-[277px] overflow-hidden flex justify-center bg-[url("/images/home-earth/signpost.svg")] bg-no-repeat bg-[center_30px] bg-contain', className)}>
      <img
        src="/images/home-earth/signpost-bintent.png"
        alt=""
        onClick={() => router.push('/bintent')}
        className="w-[94px] h-[27px] absolute top-[58px] left-[36px] cursor-pointer object-center object-contain"
      />
      <Popover
        placement={PopoverPlacement.Right}
        trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
        triggerContainerClassName="absolute left-[20px] top-[112px]"
        contentClassName={isMobile ? "!z-[53]" : ""}
        offset={50}
        // closeDelayDuration={0}
        content={(
          <SignpostBubble className={clsx("", isMobile && "scale-[0.8322]")}>
            <div className="text-[#FF7040] font-CherryBomb text-[26px] font-normal not-italic leading-[90%] text-stroke-1">
              APR up to 300%!
            </div>
            <div className="mt-[11px] text-[#000] font-CherryBomb text-[16px] font-normal not-italic leading-[120%]">
              Join vaults and earn money easily in BeraTown, be a happy gummy bear
            </div>
            <button
              type="button"
              className="mt-[16px] h-[50px] flex-shrink-0 w-full rounded-[10px] border border-[#000] bg-[#FFDC50] shadow-[6px_6px_0px_rgba(0,0,0,0.25)] text-[#000] text-center font-Montserrat text-[16px] font-bold leading-normal"
              onClick={() => router.push('/vaults')}
            >
              Join Now
            </button>
          </SignpostBubble>
        )}
      >
        <img
          src="/images/home-earth/signpost-vaults.png"
          alt=""
          onClick={() => {
            if (isMobile) return;
            router.push('/vaults');
          }}
          className="w-[110px] h-[47px] cursor-pointer object-center object-contain"
        />
      </Popover>
      <img
        src="/images/home-earth/signpost-btc-lst.png"
        alt=""
        onClick={() => {}}
        className="w-[77px] h-[17px] absolute left-[66px] top-[196px] cursor-not-allowed opacity-50 object-center object-contain"
      />
    </div>
  );
};

export default Signpost;
