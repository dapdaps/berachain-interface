import DappIcon from '@/components/dapp-icon';
import Content from './Content';

export default function Swap({ dapp }: any) {
  return (
    <div className='relative w-[520px] pt-[30px]'>
      <Content dapp={dapp} />
      <DappIcon
        src={dapp.icon}
        alt={dapp.name}
        name={dapp.name}
        type='swap'
        style={{ top: -76 }}
      />
    </div>
  );
}
