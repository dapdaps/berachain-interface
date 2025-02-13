import clsx from 'clsx';
import { useRouter } from 'next/navigation';

const Signpost = (props: any) => {
  const { className } = props;
  const router = useRouter();

  return (
    <div className={clsx('absolute right-[100px] bottom-0 z-[5] w-[146px] h-[169px] overflow-hidden flex justify-center bg-[url("/images/home-earth/signpost.svg")] bg-no-repeat bg-[center_20px] bg-contain', className)}>
      <img
        src="/images/home-earth/signpost-beraciaga.svg"
        alt=""
        className="w-[86px] h-[69px] absolute top-[16px] opacity-50 cursor-not-allowed"
      />
      <img
        src="/images/home-earth/signpost-bintent.png"
        alt=""
        onClick={() => router.push('/near-intents')}
        className="w-[103px] h-[43px] absolute top-[104px] opacity-50 cursor-pointer"
      />
    </div>
  );
};

export default Signpost;
