export default function Action({ onAdd, onRemove, removeable }: any) {
  return (
    <div className='flex gap-[10px]'>
      <button onClick={onAdd}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='34'
          height='34'
          viewBox='0 0 34 34'
          fill='none'
        >
          <rect
            x='0.5'
            y='0.5'
            width='33'
            height='33'
            rx='10.5'
            fill='white'
            stroke='#373A53'
          />
          <path
            d='M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z'
            fill='black'
          />
        </svg>
      </button>
      <button
        onClick={() => {
          if (removeable) onRemove();
        }}
        disabled={!removeable}
        className='disabled:opacity-60'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='34'
          height='34'
          viewBox='0 0 34 34'
          fill='none'
        >
          <rect
            x='0.5'
            y='0.5'
            width='33'
            height='33'
            rx='10.5'
            fill='white'
            stroke='#373A53'
          />
          <rect x='11' y='16' width='13' height='2' rx='1' fill='black' />
        </svg>
      </button>
    </div>
  );
}
