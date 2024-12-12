import { useEffect, useState } from 'react';
import LazyImage from '@/components/layz-image';
import { DefaultIcon, txTimeFormatter } from '@/sections/dashboard/utils';
import CircleLoading from '@/components/circle-loading';
import Empty from '@/components/empty';
import { useDebounceFn } from 'ahooks';

export default function Mobile({
  records,
  loading,
  pageIndex,
  onNext,
  hasMore
}: any) {
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    if (records) setList([...list, ...records]);
  }, [records]);

  const { run: scroll } = useDebounceFn(
    (ev) => {
      const el = ev.target;
      if (el.scrollHeight - el.scrollTop < el.clientHeight * 2 && hasMore) {
        onNext();
      }
    },
    { wait: 500 }
  );

  return (
    <div
      className='py-[18px] px-[12px] font-semibold h-full overflow-y-auto'
      onScroll={scroll}
    >
      {list.map((record: any, idx: number) => (
        <div className='mb-[10px] bg-black/10 rounded-[10px] px-[18px] py-[10px]'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-[12px]'>
              <LazyImage
                src={record.dapp_logo}
                width={30}
                height={30}
                fallbackSrc={DefaultIcon}
              />
              <div className='text-[16px]'>{record.dapp_name}</div>
            </div>
            <div className='text-[14px]'>{record.action}</div>
          </div>
          <div className='flex justify-end gap-[6px]'>
            {record.assets?.map?.((token: any, idx: number) => (
              <div
                className={`w-[26px] h-[26px] rounded-[50%] shrink-0 ${
                  idx && 'ml-[-10px]'
                }`}
                key={idx}
              >
                <LazyImage
                  src={token.tokenLogo}
                  alt=''
                  width={26}
                  height={26}
                  style={{
                    borderRadius: '50%'
                  }}
                  fallbackSrc={DefaultIcon}
                />
              </div>
            ))}
            <div className='text-[14px] text-right'>
              {record.executed}
            </div>
          </div>
          <div className='flex items-center justify-between text-[14px]'>
            <div>{txTimeFormatter(record.tx_time)}</div>
            <div>Success</div>
          </div>
        </div>
      ))}
      {loading && (
        <div className='flex justify-center'>
          <CircleLoading />
        </div>
      )}
      {!loading && !list.length && (
        <div className='w-full flex justify-center items-center mt-[100px]'>
          <Empty desc='No Records found' />
        </div>
      )}
    </div>
  );
}
