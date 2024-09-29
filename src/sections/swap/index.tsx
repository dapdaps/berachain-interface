import DappIcon from '@/components/dapp-icon';
import Content from './Content';

export default function Swap({ dapp }: any) {
  return (
    <div className='relative w-[520px] mx-[auto] pt-[110px]'>
      <Content dapp={dapp} />
      <DappIcon
        src='/images/dapps/kodiak.svg'
        alt='Kodiak'
        name='Kodiak'
        type='swap'
      />
    </div>
  );
}
