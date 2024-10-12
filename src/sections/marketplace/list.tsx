'use client';

import { FontClass } from '@/utils/classes';
import clsx from 'clsx';
import { memo } from 'react';

export default memo(function List({ children }: any) {
  return (
    <div>
      <div className='w-[1200px] m-auto'>
        <div className={clsx(FontClass, 'text-[60px] text-center')}>
          Marketplace
        </div>
        <div className='mt-[50px]'>{children}</div>
      </div>
    </div>
  );
});
