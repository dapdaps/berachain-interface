import clsx from 'clsx';
import Title from '@/sections/ramen/components/title';
import Item from '@/sections/ramen/components/item';
import Header from '@/sections/ramen/components/header';

const PastLaunches = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('', className)}>
      <Title className="mt-[38px]">Past Launches</Title>
      <Header />
      <div className="flex flex-col items-stretch gap-[12px] max-h-[calc(100dvh_-_680px)] overflow-x-hidden overflow-y-auto">
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
    </div>
  );
};

export default PastLaunches;
