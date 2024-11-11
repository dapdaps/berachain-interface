import useIsMobile from '@/hooks/use-isMobile';
import { useRouter } from 'next/navigation';

const Back = (props: any) => {
  const { onBack } = props;
  const isMobile = useIsMobile();
  const router = useRouter();

  return isMobile ? (
    <div className="" onClick={onBack}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="#FFF5A9" stroke="#4B371F" />
        <path d="M18 22L13 16L18 10" stroke="black" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  ) : (
    <div
      className="cursor-pointer absolute top-[45px] left-[50px]"
      onClick={() => {
        router.back();
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
        <rect x="0.5" y="0.5" width="33" height="33" rx="10.5" fill="white" stroke="#373A53" />
        <path d="M20 11L15.2 17L20 23" stroke="black" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default Back;
