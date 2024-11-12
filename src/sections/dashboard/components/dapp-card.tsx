import { useState } from 'react';
import Value from '@/sections/dashboard/components/value';
import Modal from '@/components/modal';
import DashboardPortfolioDetail from './portfolio-detail';
import DappName from './dapp-name';
import useIsMobile from '@/hooks/use-isMobile';
import { useRouter } from 'next/navigation';

const Laptop = ({ icon, name, category, value, percent, path }: any) => {
  const router = useRouter();
  return (
    <div
      className='bg-white border border-[#373A53] rounded-[12px] p-[10px_9px_10px_9px] hidden lg:block'
      onClick={() => {
        if (!path) return;
        router.push(path);
      }}
    >
      <DappName {...{ icon, name, category }} />
      <div className='flex justify-between items-center gap-[10px] mt-[10px]'>
        <Value>{value}</Value>
        <div className='text-[#3D405A] text-[14px] font-[500] lending-[100%]'>
          {percent}%
        </div>
      </div>
    </div>
  );
};

const Mobile = ({
  icon,
  name,
  category,
  value,
  percent,
  showName,
  version,
  detailList
}: any) => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <>
      <div
        onClick={() => {
          setShowDetail(true);
        }}
        className='bg-white border border-[#373A53] rounded-[12px] p-[10px_9px_10px_9px] hidden md:flex justify-between'
      >
        <DappName {...{ icon, name, category }} />
        <div className='flex flex-col items-center gap-[10px]'>
          <Value>{value}</Value>
          <div className='text-[#3D405A] text-[14px] font-[500] lending-[100%]'>
            {percent}%
          </div>
        </div>
      </div>
      <Modal
        open={showDetail}
        onClose={() => {
          setShowDetail(false);
        }}
      >
        <DashboardPortfolioDetail
          dapp={{
            dappLogo: icon,
            show_name: showName,
            totalUsd: value,
            version,
            type: category,
            detailList
          }}
        />
      </Modal>
    </>
  );
};

export default function DappCard(props: any) {
  const isMobile = useIsMobile();
  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}
