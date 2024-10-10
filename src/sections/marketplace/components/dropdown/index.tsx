import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  list: any[];
  onChange: (v: any) => void;
  value: any;
  placeholder?: string;
  style?: any;
  dropdownStyle?: any;
}

export default function Dropdown({
  list,
  value,
  onChange,
  placeholder,
  style = {},
  dropdownStyle = {}
}: Props) {
  const [modalShow, setModalShow] = useState(false);
  const domRef = useRef<any>(null);

  const docClick = useCallback((e: any) => {
    const isChild = domRef.current?.contains(e.target);
    if (!isChild) {
      setModalShow(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', docClick, false);

    return () => {
      document.removeEventListener('click', docClick);
    };
  }, []);

  const title = useMemo(() => {
    if (list && value) {
      const cur = list.find((item) => item.key === value);
      if (cur) {
        return cur.name;
      }
    }

    return placeholder;
  }, [value, list, placeholder]);

  return (
    <div
      ref={domRef}
      onClick={() => {
        setModalShow(true);
      }}
      style={style}
      className='flex relative z-50 justify-between items-center bg-[#fff] gap-8 h-[40px] px-[20px]  text-[14px] font-medium rounded-[12px] border border-[#373A53] cursor-pointer'
    >
      <div className='text-nowrap'>{title}</div>
      <div>
        <svg
          width='14'
          height='8'
          viewBox='0 0 14 8'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M13 1L7 5.8L1 0.999999'
            stroke='black'
            stroke-width='2'
            stroke-linecap='round'
          />
        </svg>
      </div>
      {modalShow && (
        <div
          style={dropdownStyle}
          className='absolute w-[100%]  overflow-auto bg-[#fff] rounded-[8px] border border-[#373A53] right-0 top-[45px]'
        >
          {list?.map((item) => {
            return (
              <div
                key={item.key}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(item.key);
                  setModalShow(false);
                }}
                className='h-[40px] px-[10px]  hover:bg-[#0000000F] relative flex justify-between items-center text-nowrap'
              >
                <div>{item.name}</div>
                {item.key === value && (
                  <div className='w-[6px] h-[6px] bg-[#EBF479] absolute top-[18px] right-1 rounded-[6px]'></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
