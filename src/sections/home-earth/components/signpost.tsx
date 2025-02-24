import clsx from 'clsx';
import { useRouter } from 'next/navigation';

const Signpost = (props: any) => {
  const { className } = props;
  const router = useRouter();

  return (
    <div className={clsx('absolute left-0 bottom-0 z-[5] w-[146px] h-[202px] overflow-hidden flex justify-center bg-[url("/images/home-earth/signpost.svg")] bg-no-repeat bg-[center_30px] bg-contain', className)}>
      <img
        src="/images/home-earth/signpost-bintent.png"
        alt=""
        onClick={() => router.push('/bintent')}
        className="w-[94px] h-[27px] object-contain absolute top-[52px] left-[30px]"
      />
      <img
        src="/images/home-earth/signpost-beraciaga.svg"
        alt=""
        className="w-[119px] h-[33px] absolute top-[110px] opacity-50 cursor-not-allowed"
      />
    </div>
  );
};

export default Signpost;
