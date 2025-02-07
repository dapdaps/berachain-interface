import clsx from 'clsx';
import CurrentLaunches from '@/sections/ramen/current';
import PastLaunches from '@/sections/ramen/past';

const Content = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('', className)}>
      <CurrentLaunches />
      <PastLaunches />
    </div>
  );
};

export default Content;
