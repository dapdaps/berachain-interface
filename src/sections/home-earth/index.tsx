import HomeEarthTop from '@/sections/home-earth/components/top';

const HomeEarth = () => {

  return (
    <div className="w-full relative h-[calc(100dvh_-_68px)] flex flex-col items-center">
      <HomeEarthTop />
      <div className="relative w-full overflow-hidden h-[calc(100%_-_229px)] flex justify-center">
        {/*#region Cloud*/}
        <div
          className="w-[3000px] h-[3000px] absolute z-[1] rounded-full top-[24.5dvh]"
        >

        </div>
        {/*#endregion*/}
        {/*#region Mountain*/}
        <div
          className="w-[3000px] h-[3000px] absolute z-[2] rounded-full top-[24.5dvh]"
        >

        </div>
        {/*#endregion*/}
        {/*#region Ground*/}
        <div
          className="w-[3000px] h-[3000px] absolute z-[3] border border-[#5A6F2F] bg-[#B6DF5D] rounded-full top-[24.5dvh]"
        >

        </div>
        {/*#endregion*/}
        <img src="/images/background/bear.gif" alt="" className="w-[360px] h-[356px] absolute z-[4] top-[37.4dvh]" />
      </div>
    </div>
  );
};

export default HomeEarth;
