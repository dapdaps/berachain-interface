import Big from 'big.js';
import Category from '@/sections/dashboard/components/category';
import Value from '@/sections/dashboard/components/value';
import DashboardPortfolioDetail from '@/sections/dashboard/components/portfolio-detail';
import Skeleton from 'react-loading-skeleton';
import React from 'react';
import { numberFormatter } from '@/utils/number-formatter';
import CircleLoading from '@/components/circle-loading';
import Empty from '@/components/empty';

const DashboardPortfolio = (props: Props) => {
  const { loading, dapps, totalBalance, tvls, tvlsLoading } = props;

  return (
    <div className="h-full overflow-y-auto">
      <h5 className="font-CherryBomb text-black text-center text-[32px] font-[400] leading-[95%]">
        {
          loading ? (
            <Skeleton width={140} height={30} />
          ) : numberFormatter(totalBalance, 2, true, { prefix: '$' })
        }
      </h5>
      <div className="text-[#3D405A] text-[14px] font-[500] text-center mt-[8px]">Total assets value</div>
      <div className="flex justify-between items-stretch gap-[16px] mt-[29px]">
        {
          tvls.map((tvl: any, idx: number) => (
            <Card key={idx} title={tvl.label} value={tvl.usd} amount={tvl.executions} loading={tvlsLoading} />
          ))
        }
      </div>
      <section className="mt-[43px]">
        <Title>Your dApps</Title>
        <div className="grid grid-cols-3 justify-between items-stretch gap-[15px] mt-[18px] flex-wrap">
          {
            loading ? [...new Array(3)].map((i) => (
              <Skeleton key={i} width={268} height={84} />
            )) : dapps.map((dapp: any, idx: number) => (
              <DAppCard
                key={idx}
                name={`${dapp.show_name}${dapp.version ? ' ' + dapp.version : ''}`}
                icon={dapp.dappLogo}
                category={dapp.type}
                value={dapp.totalUsd}
                percent={numberFormatter(Big(dapp.totalUsd).div(totalBalance || 1).times(100), 0, true)}
              />
            ))
          }
        </div>
        {
          !loading && !dapps.length && (
            <div className="w-full flex justify-center items-center">
              <Empty desc="No asset found" />
            </div>
          )
        }
      </section>
      <section className="mt-[34px] mb-[12px]">
        <Title>Details</Title>
        <div className="flex flex-col justify-between items-stretch gap-[15px]">
          {
            loading ? (
              <Skeleton className="mt-[18px]" height={188} borderRadius={12} />
            ) : dapps.map((dapp: any, idx: number) => (
              <DashboardPortfolioDetail
                key={idx}
                dapp={dapp}
              />
            ))
          }
        </div>
        {
          !loading && !dapps.length && (
            <div className="w-full flex justify-center items-center">
              <Empty desc="No asset found" />
            </div>
          )
        }
      </section>
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
    <div className="bg-[#FFDC50] rounded-[10px] p-[12px_9px_15px_15px] flex-1">
      <div className="flex justify-between items-center gap-[10px]">
        <div className="">{title}</div>
        <div
          className="rounded-[8px] bg-[#FFFDEB] text-center w-[22px] h-[22px] border border-[#373A53] leading-[20px] text-[#3D405A] text-[14px] font-[500]"
          style={{
            opacity: Big(amount).lte(0) ? 0.3 : 1,
          }}
        >
          {amount}
        </div>
      </div>
      {
        loading ? (
          <CircleLoading size={18} style={{ marginTop: 12 }} />
          ) : (
          <Value disabled={Big(amount).lte(0)} style={{ marginTop: 12 }}>
            {value}
          </Value>
        )
      }
    </div>
  );
};

const Title = (props: any) => {
  const { children } = props;

  return (
    <div className="text-black text-[16px] font-[600] leading-[90%]">
      {children}
    </div>
  );
};

const DAppCard = (props: any) => {
  const { icon, name, category, value, percent } = props;

  return (
    <div className="bg-white border border-[#373A53] rounded-[12px] p-[10px_9px_10px_9px]">
      <div className="flex justify-between items-center gap-[10px]">
        <div className="flex items-center gap-[7px]">
          <img src={icon} alt="" width={31} height={31} />
          <span className="text-black text-[16px] font-[600] leading-[90%;]">{name}</span>
        </div>
        <Category>{category}</Category>
      </div>
      <div className="flex justify-between items-center gap-[10px] mt-[10px]">
        <Value>{value}</Value>
        <div className="text-[#3D405A] text-[14px] font-[500] lending-[100%]">{percent}%</div>
      </div>
    </div>
  );
};
