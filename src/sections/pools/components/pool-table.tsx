import Image from 'next/image';

export default function PoolTable({ item, onClick = () => {} }: any) {
  return (
    <div className='flex items-center gap-[12px]' onClick={onClick}>
      <div className='flex items-center'>
        <Image
          src={item.token0.icon || '/assets/tokens/default_icon.png'}
          width={30}
          height={30}
          alt={item.token0.name}
          className='rounded-[50%]'
        />
        <Image
          src={item.token1.icon || '/assets/tokens/default_icon.png'}
          width={30}
          height={30}
          alt={item.token1.name}
          className='rounded-[50%] ml-[-8px]'
        />
      </div>
      <div>
        <div className='text-[16px]'>
          {item.token0.symbol}-{item.token1.symbol}
        </div>
        {item.fee && <div className='text-[10px]'>{item.fee / 1e4} %</div>}
      </div>
    </div>
  );
}
