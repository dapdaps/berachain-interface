const DashboardTab = (props: Props) => {
  const { children, icon } = props;

  return (
    <div className="flex justify-center items-center gap-[6px]">
      <img src={`/images/dashboard/${icon}`} alt="" width={24} height={28} />
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
};

export default DashboardTab;

interface Props {
  children: any;
  icon: string;
}
