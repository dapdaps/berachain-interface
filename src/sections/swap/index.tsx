import DappIcon from '@/components/dapp-icon';
import Content from './Content';

export default function Swap({ dapp }: any) {
  return (
    <div className='relative w-[520px] md:w-[calc(100%-32px)] md:ml-[16px] pt-[30px]'>
      <Content dapp={dapp} />
      <DappIcon
        src={dapp.icon}
        alt={dapp.name}
        name={dapp.name}
        type='swap'
        className='top-[-76px] md:top-[-30px] md:left-[40px]'
      />
    </div>
  );
}
