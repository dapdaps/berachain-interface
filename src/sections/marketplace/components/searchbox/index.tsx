export default function SearchBox({ value, onChange, placeholder = 'search token' }: any) {
  return (
    <div>
      <div className='flex items-center border bg-[#fff] rounded-[12px] overflow-hidden border-[#373A53] px-[15px] gap-[10px]'>
        <svg
          width='21'
          height='15'
          viewBox='0 0 21 15'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle
            cx='7.01829'
            cy='7.01829'
            r='6.01829'
            stroke='#3D4159'
            stroke-width='2'
          />
          <rect
            x='14.9138'
            y='9.64978'
            width='6.141'
            height='2.63186'
            rx='1.31593'
            transform='rotate(30 14.9138 9.64978)'
            fill='#3D4159'
          />
        </svg>

        <input
          className='flex-1 h-[40px] bg-inherit outline-none w-[200px]'
          placeholder={placeholder}
          value={value || ''}
          onChange={(ev: any) => {
            onChange(ev.target.value);
          }}
        />
      </div>
    </div>
  );
}
