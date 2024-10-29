import Loading from '@/components/loading';
import React from 'react';
import Empty from '@/components/empty';

const FlexTable = (props: FlexTableProps) => {
  const {
    wrapperClass = '',
    headClass = '',
    bodyClass = '',
    loading,
    list,
    columns,
    pagination,
    sortDataIndex,
    renderEmpty = () => (
      <div className='mt-[50px] w-full flex justify-center items-center'>
        <Empty desc='No data' />
      </div>
    ),
    renderTitle,
    onChangeSortDataIndex
  } = props;

  return (
    <div>
      <div className={wrapperClass}>
        <div className={`flex items-center p-[14px] ${headClass}`}>
          {columns.map((column: any, columnIdx) => (
            <div
              key={column.dataIndex}
              style={{
                width: column.width ?? 0,
                flexGrow: column.width ? 0 : 1,
                textAlign: column.align ?? 'left',
                flexShrink: column.width ? 0 : 1
              }}
              className='flex items-center gap-[5px] flex-shrink-0 text-[14px] text-[#3D405A]'
              onClick={() => {
                column?.sort &&
                  onChangeSortDataIndex &&
                  onChangeSortDataIndex(column?.dataIndex);
              }}
            >
              {renderTitle ? renderTitle(column, columnIdx) : column.title}
              {column?.sort && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='13'
                  height='8'
                  viewBox='0 0 13 8'
                  fill='none'
                >
                  <path
                    d='M5.37058 7.5C5.88774 8.16667 7.18062 8.16667 7.69778 7.5L12.3522 1.5C12.8693 0.833334 12.2229 4.76837e-07 11.1886 4.76837e-07H1.87979C0.845482 4.76837e-07 0.199039 0.833334 0.716193 1.5L5.37058 7.5Z'
                    fill={
                      sortDataIndex === column?.dataIndex ? 'black' : '#D1CEB4'
                    }
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
        {loading ? (
          <div className='flex items-center justify-center py-[30px] flex-col'>
            <Loading size={24} />
          </div>
        ) : (
          <div>
            {list?.length > 0
              ? list.map((record: any, index: number) => (
                  <div
                    className={`odd:bg-[rgba(0,0,0,0.06)] rounded-[10px] md:rounded-none py-[16px] flex-shrink-0 flex items-center ${bodyClass}`}
                    key={index}
                  >
                    {columns.map((column: any) => (
                      <div
                        key={column.dataIndex + column.title}
                        style={{
                          width: column.width ?? 0,
                          flexGrow: column.width ? 0 : 1,
                          textAlign: column.align ?? 'left',
                          flexShrink: column.width ? 0 : 1
                        }}
                        className={`font-[600] first:pl-[13px] last:pr-[13px] ${
                          column.ellipsis ? 'truncate' : ''
                        }`}
                      >
                        {typeof column.render === 'function'
                          ? column.render(
                              JSON.stringify(record[column.dataIndex]),
                              record,
                              index
                            )
                          : record[column.dataIndex]}
                      </div>
                    ))}
                  </div>
                ))
              : renderEmpty()}
          </div>
        )}
      </div>
      {!loading && (pagination ?? null)}
    </div>
  );
};

export default FlexTable;

export type Column = {
  title: string | React.ReactNode;
  dataIndex: string;
  render?: (text: any, record: Record<string, any>, idx?: number) => any;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  sort?: boolean;
};

export type FlexTableProps = {
  columns: Column[];
  list: Record<string, any>[];
  loading?: boolean;
  wrapperClass?: string;
  headClass?: string;
  bodyClass?: string;
  pagination?: any;
  renderEmpty?(): any;
  sortDataIndex?: string;
  onChangeSortDataIndex?(index: string): void;
  renderTitle?(column: Column, columnIdx: number): any;
};
