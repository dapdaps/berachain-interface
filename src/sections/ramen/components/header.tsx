import clsx from 'clsx';

const Header = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('mt-[20px] text-[#3D405A] text-[14px] font-[500] font-Montserrat rounded-[10px] p-[8px_15px_7px] grid grid-cols-[280px_115px_180px_130px_90px_1fr]', className)}>
      <div className="">Project Name</div>
      <div className="">Paricipants</div>
      <div className="">Total Raised</div>
      <div className="">Sale Price</div>
      <div className="">ATH ROI</div>
      <div className="">Date Ended</div>
    </div>
  );
};

export default Header;
