import { FontClass } from '@/utils/classes';
import clsx from 'clsx';
import { memo } from 'react';
import Tab from '../components/tab';
export default memo(function List() {
  return (
    <div>
      <div className='w-[1200px] m-auto'>
        <div className={clsx(FontClass, 'text-[60px] text-center')}>
          Marketplace
        </div>
        <div className='mt-[50px]'>
          <Tab />
        </div>
      </div>
    </div>
  );
});
