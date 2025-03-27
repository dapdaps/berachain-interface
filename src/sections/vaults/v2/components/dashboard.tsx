import clsx from 'clsx';

const Dashboard = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx("text-[20px] text-black leading-[90%] font-[600] font-Montserrat bg-[#FFDC50] rounded-[10px] p-[20px_24px_23px_31px] md:p-[16px_19px_17px_9px] flex justify-between items-start", className)}>
      <div className="flex items-start gap-[100px] md:gap-[30px]">
        <Item label="You Invested" value="$0.00" />
        <Item label="Your Rewards" value="$0.00" />
      </div>
      <Item label="Your Vaults" value="0" valueClassName="underline" className="lg:items-end" />
    </div>
  );
};

export default Dashboard;

const Item = (props: any) => {
  const { className, label, value, valueClassName } = props;

  return (
    <div className={clsx("flex flex-col gap-[12px]", className)}>
      <div className="text-[#3D405A] text-[14px] font-[500] whitespace-nowrap">
        {label}
      </div>
      <div className={clsx("", valueClassName)}>
        {value}
      </div>
    </div>
  );
};
