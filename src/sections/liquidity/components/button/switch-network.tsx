import Button from './increase-button';
import Loading from '@/components/circle-loading';
import { useSwitchChain } from 'wagmi';
import { DEFAULT_CHAIN_ID } from '@/configs';

export default function SwitchNetworkButton() {
  const { isPending: switching, switchChain } = useSwitchChain();
  return (
    <Button
      onClick={() => {
        switchChain({
          chainId: DEFAULT_CHAIN_ID
        });
      }}
    >
      {switching ? <Loading size={20} /> : 'Switch Network'}
    </Button>
  );
}
