import Big from 'big.js';
import Category from '@/sections/dashboard/components/category';
import Value from '@/sections/dashboard/components/value';
import DashboardPortfolioDetail from '@/sections/dashboard/components/portfolio-detail';

const DashboardPortfolio = (props: Props) => {
  const {} = props;

  return (
    <div className="h-full overflow-y-auto">
      <h5 className="font-CherryBomb text-black text-center text-[32px] font-[400] leading-[95%]">$302.56</h5>
      <div className="text-[#3D405A] text-[14px] font-[500] text-center mt-[8px]">Total assets value</div>
      <div className="flex justify-between items-stretch gap-[16px] mt-[29px]">
        <Card title="Bridged" value="100.35" amount={3} />
        <Card title="Swapped" value="102.16" amount={55} />
        <Card title="Added Liquidity" value="0" amount={0} />
        <Card title="Lent&Borrowed" value="99999999.15" amount={99} />
      </div>
      <section className="mt-[43px]">
        <Title>Your dApps</Title>
        <div className="flex justify-between items-stretch gap-[15px] mt-[18px]">
          <DAppCard
            name="Bend"
            icon="/images/dapps/bend.svg"
            category="Lending"
            value="96.82"
            percent="32"
          />
          <DAppCard
            name="Infrared"
            icon="/images/dapps/infrared.svg"
            category="Liquidity"
            value="169.43"
            percent="56"
          />
          <DAppCard
            name="Dolomite"
            icon="/images/dapps/dolomite.svg"
            category="Lending"
            value="99999999.82"
            percent="100"
          />
        </div>
      </section>
      <section className="mt-[34px] mb-[12px]">
        <Title>Details</Title>
        <div className="flex justify-between items-stretch gap-[15px]">
          <DashboardPortfolioDetail
            dapp={{
              show_name: 'Bend',
              dappLogo: '/images/dapps/bend.svg',
              type: 'Lending',
              totalUsd: '96.82',
              detailList: [],
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardPortfolio;

interface Props {
}

const Card = (props: any) => {
  const { title, value, amount } = props;

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
      <Value disabled={Big(amount).lte(0)} style={{ marginTop: 12 }}>
        {value}
      </Value>
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
    <div className="flex-1 bg-white border border-[#373A53] rounded-[12px] p-[10px_9px_10px_9px]">
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
