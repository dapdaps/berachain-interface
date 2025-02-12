import { useAirdropStore } from '@/stores/use-airdrop';
import { useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { get } from '@/utils/http';

export function useAirdrop() {
  const { visible, setVisible } = useAirdropStore();

  const [address, setAddress] = useState<string>();
  const [pending, setPending] = useState<boolean>(false);

  const [isValidAddress, invalidMsg] = useMemo(() => {
    if (!address) return [false, ''];
    if (!ethers.utils.isAddress(address)) {
      return [false, 'Invalid wallet address'];
    }
    return [true, ''];
  }, [address]);

  const handleVisible = (_visible: boolean) => {
    setVisible(_visible);
  };

  const handleAddress = (_address?: string) => {
    setAddress(_address);
  };

  const handleCheck = async () => {
    if (pending || !isValidAddress) return;
    setPending(true);
    try {
      const res = await get('/api/airdrop', { address });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setPending(false);
  };

  return {
    visible,
    handleVisible,
    address,
    handleAddress,
    isValidAddress,
    invalidMsg,
    pending,
    handleCheck,
  };
}
