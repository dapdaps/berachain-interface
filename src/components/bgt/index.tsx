import Image from '@/components/layz-image';
const BGT = () => {

  return (
    <div>
      <div className='relative'>
        <Image
          containerStyle={{ position: 'absolute' }}
          containerClassName='left-[-6px] top-[50%] translate-y-[-50%]'
          src='/images/icon-coin.svg'
          alt='coin'
          width={33}
          height={30}
        />
        <div className="rounded-[26px] bg-[#DAA56B] shadow-[1px_1px_0_0_#77481E] p-[3px]">
          <div className="text-[14px] font-[400] items-center rounded-[26px] bg-[#A6703D] border border-[#924E00] pl-[30px] pr-[12px] py-[4px] leading-[0.9]">
            0 BGT
          </div>
        </div>
      </div>

    </div>
  );
};

export default BGT;