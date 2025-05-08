import Big from 'big.js';
import Value from '@/sections/dashboard/components/value';
import DashboardPortfolioDetail from '@/sections/dashboard/components/portfolio-detail';
import Skeleton from 'react-loading-skeleton';
import React, { useEffect } from 'react';
import { numberFormatter } from '@/utils/number-formatter';
import CircleLoading from '@/components/circle-loading';
import Empty from '@/components/empty';
import useClickTracking from '@/hooks/use-click-tracking';
import UserCard from './user-card';
import useUser from '@/hooks/use-user';
import DappCard from './dapp-card';
import useIsMobile from '@/hooks/use-isMobile';
import useUserPoints from '@/hooks/use-user-points';
import Modal from '@/components/modal';
import ModalPointsInfrared from './modal-points-infrared';

const DashboardPortfolio = (props: Props) => {
  const { loading, dapps, totalBalance, tvls, tvlsLoading } = props;

  const { handleReport } = useClickTracking();
  const { userInfo } = useUser();
  const isMobile = useIsMobile();
  const { loading: pointsLoading, userPoints = { points: 0 } } = useUserPoints()
  const [openUserPoints, setOpenUserPoints] = React.useState(false);

  useEffect(() => {
    handleReport(isMobile ? '1018-002' : '1011-002');
  }, [isMobile]);

  return (
    <div className='h-full overflow-y-auto'>
      <>
          <div className='flex justify-center gap-10 items-center'>
            <div className='hidden lg:block'>
              <h5 className='font-CherryBomb text-black text-center text-[32px] font-[400] leading-[95%]'>
                {loading ? (
                  <Skeleton width={140} height={30} />
                ) : (
                  numberFormatter(totalBalance, 2, true, { prefix: '$' })
                )}
              </h5>
              <div className='text-[#3D405A] text-[14px] font-[500] text-center mt-[8px]'>
                Total assetsss value
              </div>
            </div>
            <div className='flex flex-col items-center' onClick={() => setOpenUserPoints(true)}>
              <div className='flex items-center gap-2'>
                <img src="/db3/dapp/infrared.png" className="w-6 h-6 rounded-full" alt="" />
                <h5 className='font-CherryBomb underline text-black text-center text-[32px] font-[400] leading-[95%] cursor-pointer'>
                {pointsLoading ? (
                  <Skeleton width={140} height={30} />
                ) : Big(userPoints?.points ?? 0).toFixed(0)}
              </h5>
              </div>
              <div className='text-[#3D405A] text-[14px] font-[500] text-center mt-[8px]'>
                Infrared Points
              </div>
            </div>
          </div>

        <div className='hidden md:block'>
          <UserCard
            userInfo={userInfo}
            loading={loading}
            totalBalance={totalBalance}
          />
        </div>
      </>
      <div className=''>
        <div className='flex justify-between items-stretch gap-[16px] mt-[29px] md:gap-[6px] md:mt-[20px] md:px-[12px] md:flex-wrap'>
          {tvls.map((tvl: any, idx: number) => (
            <Card
              key={idx}
              title={tvl.label}
              value={tvl.usd}
              amount={tvl.executions}
              loading={tvlsLoading}
            />
          ))}
        </div>
        <section className='mt-[43px] md:mt-[30px] md:px-[12px]'>
          <Title>Your dApps</Title>
          <div className='grid grid-cols-3 justify-between items-stretch gap-[15px] mt-[18px] flex-wrap md:grid-cols-1 md:gap-[10px] md:pb-[20px]'>
            {loading
              ? [...new Array(3)].map((i) => (
                  <Skeleton key={i} width={268} height={84} />
                ))
              : dapps.map((dapp: any, idx: number) => (
                  <DappCard
                    key={idx}
                    name={`${dapp.show_name}${
                      dapp.version ? ' ' + dapp.version : ''
                    }`}
                    icon={dapp.dappLogo}
                    category={dapp.type}
                    categories={dapp.categories}
                    value={dapp.totalUsd}
                    showName={dapp.show_name}
                    version={dapp.version}
                    detailList={dapp.detailList}
                    path={dapp.path}
                    percent={
                      Big(totalBalance || 0).eq(0)
                        ? '0'
                        : numberFormatter(
                            Big(dapp.totalUsd)
                              .div(totalBalance || 1)
                              .times(100),
                            0,
                            true
                          )
                    }
                  />
                ))}
          </div>
          {!loading && !dapps.length && (
            <div className='w-full flex justify-center items-center'>
              <Empty desc='No asset found' />
            </div>
          )}
        </section>
      </div>
      <section className='mt-[34px] mb-[12px] md:px-[12px]'>
        <Title>Details</Title>
        <div className='flex flex-col justify-between items-stretch gap-[15px]'>
          {loading ? (
            <Skeleton className='mt-[18px]' height={188} borderRadius={12} />
          ) : (
            dapps.map((dapp: any, idx: number) => (
              <DashboardPortfolioDetail key={idx} dapp={dapp} />
            ))
          )}
        </div>
        {!loading && !dapps.length && (
          <div className='w-full flex justify-center items-center'>
            <Empty desc='No asset found' />
          </div>
        )}
      </section>
      <ModalPointsInfrared open={openUserPoints} onClose={() => setOpenUserPoints(false)}></ModalPointsInfrared>
    </div>
  );
};

export default DashboardPortfolio;

interface Props {
  loading?: boolean;
  dapps?: any;
  totalBalance?: Big.Big;
  tvls?: any;
  tvlsLoading?: boolean;
}

const Card = (props: any) => {
  const { title, value, amount, loading } = props;

  return (
    <div className='bg-[#FFDC50] rounded-[10px] p-[12px_9px_15px_15px] flex-1 md:w-1/2'>
      <div className='flex justify-between items-center gap-[10px]'>
        <div className=''>{title}</div>
        <div
          className='rounded-[8px] bg-[#FFFDEB] text-center w-[22px] h-[22px] border border-[#373A53] leading-[20px] text-[#3D405A] text-[14px] font-[500]'
          style={{
            opacity: Big(amount).lte(0) ? 0.3 : 1
          }}
        >
          {amount}
        </div>
      </div>
      {loading ? (
        <CircleLoading size={18} style={{ marginTop: 12 }} />
      ) : (
        <Value disabled={Big(amount).lte(0)} style={{ marginTop: 12 }} isShort>
          {value}
        </Value>
      )}
    </div>
  );
};

const Title = (props: any) => {
  const { children } = props;

  return (
    <div className='text-black text-[16px] font-[600] leading-[90%]'>
      {children}
    </div>
  );
};
