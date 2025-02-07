import clsx from 'clsx';
import StepVertical from '@/sections/ramen/detail/components/step/vertical';

const ParticipationOverview = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('mt-[22px]', className)}>
      <StepVertical
        className=""
        list={STEPS}
      />
      <div className="border border-[rgba(0,_0,_0,_0.10)] rounded-[10px] p-[19px_15px_12px] flex flex-col items-stretch gap-[15px] mt-[23px]">
        <div className="text-[14px] text-black font-[600] leading-[90%] font-Montserrat flex justify-between items-center">
          <div className="">
            Claimable from Auction
          </div>
          <div className="text-[1.14em]">
            0 BOWL
          </div>
        </div>
        <button
          type="button"
          className="w-full h-[46px] flex justify-center items-center rounded-[10px] border border-black bg-[#FFDC50]"
        >
          No Claimable Token
        </button>
      </div>
    </div>
  );
};

export default ParticipationOverview;

const STEPS = [
  { label: 'Airdrop Campaign', icon: '/images/ramen/icon-check.svg', value: '0 BOWL', status: 'Not Eligible' },
  { label: 'Auction', icon: '/images/ramen/icon-check.svg', value: 'No Bid Submitted', status: 'Spend Amount: -' },
  { label: 'Decrypting Bids', icon: '/images/ramen/icon-check.svg', value: 'Bids Decrypted' },
  {
    label: 'Claim',
    icon: '/images/ramen/icon-claim.svg',
    value: 'No Allocation Won',
    status: (
      <div className="flex flex-col items-end gap-[4px] text-[#3D405A] text-[12px] font-Montserrat font-[500] leading-[100%]">
        <div className="">
          Final Token Price: 0.42 BERA
        </div>
        <div className="">
          Total Cost: -
        </div>
      </div>
    )
  },
];
