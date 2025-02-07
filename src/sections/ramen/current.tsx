import clsx from 'clsx';
import Title from '@/sections/ramen/components/title';

const CurrentLaunches = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('', className)}>
      <Title>Current & Upcoming Launches</Title>
      <div className="mt-[23px]">
        <img src="/images/ramen/upcoming.svg" alt="" className="w-full h-[230px]" />
      </div>
    </div>
  );
};

export default CurrentLaunches;
