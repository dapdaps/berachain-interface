import PageTitle from '@/components/title';
import PageBack from '@/components/back';

const DashboardView = () => {

  return (
    <div className="relative">
      <PageBack className="absolute left-[36px] top-[31px]" />
      <PageTitle className="pt-[30px]">Dashboard</PageTitle>
    </div>
  );
};

export default DashboardView;
