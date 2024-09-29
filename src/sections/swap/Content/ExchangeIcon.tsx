export default function ExchangeIcon({ onClick }: any) {
  return (
    <div
      onClick={onClick}
      className='h-[8px] flex justify-center items-center duration-500'
    >
      <svg
        className=' cursor-pointer'
        width='42'
        height='42'
        viewBox='0 0 42 42'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <rect
          x='2'
          y='2'
          width='38'
          height='38'
          rx='10'
          fill='#BC9549'
          stroke='#FFFDEB'
          stroke-width='4'
        />
        <path
          d='M21.4999 16V26.5M21.4999 26.5L16 21M21.4999 26.5L27 21'
          stroke='black'
          stroke-width='2'
          stroke-linecap='round'
        />
      </svg>
    </div>
  );
}
