import Category from '@/sections/dashboard/components/category';
import Value from '@/sections/dashboard/components/value';

const DashboardPortfolioDetail = (props: Props) => {
  const {
    name,
    icon,
    category,
    value,
  } = props;

  return (
    <div className="mt-[18px] flex-1 border border-[#373A53] rounded-[12px] bg-white p-[11px_12px_11px_9px]">
      <div className="flex justify-between items-center gap-[10px]">
        <div className="flex items-center gap-[7px]">
          <img src={icon} alt="" width={31} height={31} />
          <span className="text-black text-[16px] font-[600] leading-[90%]">{name}</span>
          <Category className="ml-[3px]">{category}</Category>
        </div>
        <Value>{value}</Value>
      </div>
    </div>
  );
};

export default DashboardPortfolioDetail;

interface Props {
  name: string;
  icon: string;
  category: string;
  value: string;
}
