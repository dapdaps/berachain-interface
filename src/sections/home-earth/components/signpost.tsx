import clsx from 'clsx';

const Signpost = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('absolute right-0 bottom-0 z-[5] w-[148px] h-[159px] overflow-hidden flex justify-center bg-[url("/images/home-earth/signpost-pole.svg")] bg-no-repeat bg-[center_50px] bg-contain', className)}>
      <img
        src="/images/home-earth/signpost-beraciaga.svg"
        alt=""
        className="w-[144px] h-[100px] absolute top-0"
      />
      <img
        src="/images/home-earth/signpost-bintent.png"
        alt=""
        className="w-[133px] h-[75px] absolute top-[85px]"
      />
    </div>
  );
};

export default Signpost;
