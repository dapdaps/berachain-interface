import Category from './category';

const Laptop = ({ icon, name, category, onClick }: any) => {
  return (
    <div className='justify-between items-center gap-[10px] hidden lg:flex'>
      <div className='flex items-center gap-[7px]'>
        <img src={icon} alt='' width={31} height={31} onClick={onClick} className="cursor-pointer" />
        <span className='text-black text-[16px] font-[600] leading-[90%] cursor-pointer' onClick={onClick}>
          {name}
        </span>
      </div>
      <Category>{category}</Category>
    </div>
  );
};

const Mobile = ({ icon, name, category, onClick }: any) => {
  return (
    <div className='items-center gap-[10px] hidden md:flex'>
      <img src={icon} alt='' width={40} height={40} onClick={onClick} className="cursor-pointer" />
      <div className='flex flex-col gap-[7px]'>
        <span className='text-black text-[16px] font-[600] leading-[90%] cursor-pointer' onClick={onClick}>
          {name}
        </span>
        <Category>{category}</Category>
      </div>
    </div>
  );
};

export default function DappName(props: any) {
  return (
    <>
      <Laptop {...props} />
      <Mobile {...props} />
    </>
  );
}
