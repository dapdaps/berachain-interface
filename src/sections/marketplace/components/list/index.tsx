import CircleLoading from '@/components/circle-loading';
import Pager from '@/components/pager';
import { useState } from 'react';

interface Meta {
  title: string;
  key: string | number;
  sort?: boolean;
  render?: (item: any, index: number) => React.ReactNode;
  width: string;
}

interface Props {
  meta: Meta[];
  list: any[];
  maxPage?: number;
  onPageChange?: (page: number) => void;
  onItemClick?: (record: any) => void;
  bodyClassName?: string;
  loading?: boolean;
  withoutHeader?: boolean;
}

export default function List({
  meta,
  list,
  maxPage,
  onPageChange,
  bodyClassName,
  onItemClick = () => {},
  loading,
  withoutHeader = false
}: Props) {
  const [sortItem, setSortItem] = useState(null);
  const [sortType, setSortType] = useState(1);

  return (
    <div>
      <div className='w-[100%]'>
        {!withoutHeader && (
          <div className='flex items-center'>
            {meta.map((item: any) => {
              return (
                <div
                  key={item.key}
                  style={{
                    width: item.width
                  }}
                  onClick={() => {
                    if (item.sort) {
                      if (sortItem === item) {
                        setSortType(sortType ^ 1);
                      } else {
                        setSortItem(item);
                        setSortType(1);
                      }
                    }
                  }}
                  className='text-[14px] font-medium pl-[10px] py-[5px] text-center flex gap-[10px] items-center'
                >
                  <span> {item.title}</span>
                  {item.sort ? (
                    <svg
                      width='12'
                      height='8'
                      viewBox='0 0 12 8'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className={
                        sortItem === item && sortType === 0 ? 'rotate-180' : ''
                      }
                    >
                      <path
                        d='M4.8364 7.5C5.35356 8.16667 6.64644 8.16667 7.1636 7.5L11.818 1.5C12.3351 0.833334 11.6887 4.76837e-07 10.6544 4.76837e-07H1.34561C0.311302 4.76837e-07 -0.335141 0.833334 0.182014 1.5L4.8364 7.5Z'
                        fill={sortItem === item ? '#000000' : '#D1CEB4'}
                      />
                    </svg>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
        <div className={`${bodyClassName} mp-list`}>
          {loading ? (
            <div className='h-full flex items-center justify-center'>
              <CircleLoading size={30} />
            </div>
          ) : (
            list.map((item: any, index: number) => {
              return (
                <div
                  className='rounded-md flex tr'
                  key={item.id}
                  onClick={() => {
                    onItemClick(item);
                  }}
                >
                  {meta.map((metaItem) => {
                    return (
                      <div
                        key={item.key}
                        className='text-left h-[58px] pl-[10px] flex items-center td'
                        style={{
                          width: metaItem.width
                        }}
                      >
                        {metaItem.render
                          ? metaItem.render(item, index)
                          : item.title}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>

      {onPageChange && (
        <div className='flex justify-end mt-[30px]'>
          <Pager maxPage={maxPage || 1} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
