import clsx from 'clsx';
import Title from '@/sections/ramen/components/title';
import LaunchCard from '@/sections/ramen/components/launch-card';
import Skeleton from 'react-loading-skeleton';
import React from 'react';
import Empty from '@/components/empty';

const CurrentLaunches = (props: any) => {
  const { className, list, loading } = props;

  return (
    <div className={clsx('', className)}>
      <Title className="md:hidden">Current & Upcoming Launches</Title>
      <div className={clsx('mt-[23px] md:mt-[0] gap-[24px]', (!loading && list.length <= 0) ? '' : 'grid grid-cols-2 md:grid-cols-1')}>
        {
          loading ? (
            <>
              {
                [...new Array(2)].map((_, idx) => (
                  <Skeleton key={idx} width="100%" height={410} borderRadius={10} />
                ))
              }
            </>
          ) : (
            list.length > 0 ? list.map((it: any, idx: number) => (
              <LaunchCard key={idx} project={it} />
            )) : (
              <img src="/images/ramen/upcoming.svg" alt="" className="w-full h-[230px]" />
            )
          )
        }
      </div>
    </div>
  );
};

export default CurrentLaunches;
