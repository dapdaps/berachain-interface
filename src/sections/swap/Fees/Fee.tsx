interface Props {
  name: string;
  value: string;
  valueClassName?: string;
}

export default function Route({ name, value, valueClassName }: Props) {
  return (
    <div className='flex items-center justify-between py-[5px]'>
      <div className='flex items-center gap-[10px]'>
        <div className='text-[16px]'>{name}</div>
      </div>

      <div className='flex items-center gap-2'>
        <div className='text-right'>
          <div className={`text-[16px] ${valueClassName}`}>{value}</div>
        </div>
      </div>
    </div>
  );
}
