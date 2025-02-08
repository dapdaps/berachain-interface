import clsx from 'clsx';
import { numberFormatter } from '@/utils/number-formatter';

const AuctionHead = (props: any) => {
  const { className, detail, isLaunched, countdown } = props;

  return (
    <div className={clsx('mb-[37px] whitespace-nowrap flex items-center gap-[10px] font-Montserrat font-[500] text-black text-[14px] leading-[90%]', className)}>
      <div className="text-[18px] font-[600]">
        {numberFormatter(detail?.bidSubmitted, 2, true)}
      </div>
      <div className="">bids submitted</div>
      <div className={clsx('ml-auto', isLaunched ? '' : 'flex items-center gap-[5px] justify-end')}>
        {
          isLaunched ? 'Auction Ended' : (
            <>
              <div className="">Closed in</div>
              <div className="font-[700] flex items-center gap-[5px]">
                <div>
                  {countdown?.endSplit?.[0]}d {countdown?.endSplit?.[1]}h {countdown?.endSplit?.[2]}m
                </div>
                <div className="md:hidden">
                  {countdown?.endSplit?.[3]}s
                </div>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default AuctionHead;
