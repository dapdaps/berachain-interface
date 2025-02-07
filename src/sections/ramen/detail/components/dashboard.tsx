import clsx from 'clsx';
import Back from '@/sections/ramen/detail/components/back';
import Step from '@/sections/ramen/detail/components/step';

const Dashboard = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('bg-[#FFDC50] rounded-[10px] w-full p-[14px_22px_28px_19px]', className)}>
      <div className="flex justify-between gap-[20px]">
        <div className="flex gap-[18px] items-start">
          <Back className="shrink-0 translate-y-[10px]" />
          <img
            src="https://storage.googleapis.com/ramen-finance-staging/8806ff19-8ab8-4262-91cb-cdc2881e13ce"
            alt=""
            className="w-[78px] h-[78px] rounded-full shrink-0 ml-[4px]"
          />
          <div className="ml-[4px] text-[20px] text-black font-Montserrat font-[600] leading-[100%] translate-y-[10px]">
            <div className="">
              Gaymen Finance
            </div>
            <div className="mt-[8px] text-[#3D405A] text-[0.7em] font-[500] underline decoration-solid">
              $GAYMEN
            </div>
          </div>
          <div className="translate-y-[10px] p-[9px_11px_8px_12px] w-[219px] shrink-0 bg-[#D4EEFF] border border-black rounded-[10px] text-black font-Montserrat text-[14px] font-[600] leading-[100%]">
            Launch is completed: Tokens are now claimable
          </div>
        </div>
        <div className="flex justify-end items-start gap-[20px] translate-y-[16px]">
          {
            SOCIALS.map((s) => (
              <a href={s.link} target="_blank" key={s.key} className="" rel="nofollow">
                <img src={s.icon} alt="" className="w-[24px] h-[24px]" />
              </a>
            ))
          }
        </div>
      </div>
      <div className="">
        <Step
          className="mt-[24px] w-[calc(100%_-_120px)] ml-[55px]"
          list={STEPS}
        />
      </div>
    </div>
  );
};

export default Dashboard;

const SOCIALS = [
  { key: 1, icon: '/images/ramen/icon-doc.svg', link: 'https://gaymen.finance/' },
  { key: 2, icon: '/images/ramen/icon-website.svg', link: 'https://gaymen.finance/' },
  { key: 3, icon: '/images/ramen/icon-x.svg', link: 'https://x.com/ramen_finance' },
  { key: 4, icon: '/images/ramen/icon-points.svg', link: 'https://ramenfinance.medium.com/' },
];

const STEPS = [
  { label: 'Auction', icon: '/images/ramen/icon-check.svg', date: '31/01/2025, 10:00 PM' },
  { label: 'Decrypting Bids', icon: '/images/ramen/icon-check.svg', date: '31/01/2025, 10:00 PM' },
  { label: 'Claim', icon: '/images/ramen/icon-claim.svg', date: '31/01/2025, 10:00 PM' },
];
