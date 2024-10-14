'use client';

import { FontClass } from '@/utils/classes';
import clsx from 'clsx';
import { memo } from 'react';
import PageBack from '@/components/back';

export default memo(function List({ children }: any) {

  return (
    <div className="relative">
      <PageBack className='absolute left-[40px] top-[31px]' />
      <div className='pt-[30px] w-[1200px] m-auto'>
        <div className={clsx(FontClass, 'text-[60px] text-center')}>
          Marketplace
        </div>
        <div className='mt-[50px]'>{children}</div>
      </div>
    </div>
  );
});
