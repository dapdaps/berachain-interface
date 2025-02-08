import clsx from 'clsx';
import Title from '@/sections/ramen/components/title';
import Item from '@/sections/ramen/components/item';
import Header from '@/sections/ramen/components/header';
import Skeleton from 'react-loading-skeleton';
import React from 'react';
import Empty from '@/components/empty';
import Pagination from '@/components/pagination';

const PastLaunches = (props: any) => {
  const { className, list, loading, page, onPage, total, more } = props;

  return (
    <div className={clsx('', className)}>
      <Title className="mt-[38px]">Past Launches</Title>
      <Header />
      <div className="flex flex-col items-stretch gap-[12px]">
        {
          loading ? (
            <>
              {
                [...new Array(10)].map((_, idx) => (
                  <Skeleton key={idx} width="100%" height={95} borderRadius={10} />
                ))
              }
            </>
          ) : (
            list.length > 0 ? list.map((it: any, idx: number) => (
              <Item key={idx} project={it} />
            )) : (
              <Empty desc="Empty launches" mt={20} />
            )
          )
        }
        <div className="flex justify-end">
          <Pagination
            className=""
            pageIndex={page}
            pageTotal={total}
            hasMore={more}
            onPage={(page) => {
              if (loading) return;
              onPage?.(page);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PastLaunches;
