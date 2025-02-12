import { useAirdropStore } from '@/stores/use-airdrop';
import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { get } from '@/utils/http';
import useToast from '@/hooks/use-toast';

export function useAirdrop() {
  const { visible, setVisible } = useAirdropStore();
  const toast = useToast();

  const [address, setAddress] = useState<string>();
  const [pending, setPending] = useState<boolean>(false);
  const [checkData, setCheckData] = useState<CheckData>();
  const [checked, setChecked] = useState<boolean>(false);

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
    setChecked(false);
    setAddress(_address);
    setCheckData(undefined);
  };

  const handleCheck = async () => {
    if (pending || !isValidAddress) return;
    setChecked(false);
    setPending(true);
    try {
      const res = await get('/api/airdrop', { address });
      if (res.code !== 0) {
        toast.fail(res.msg || 'Check failed');
        setPending(false);
        return;
      }
      setCheckData(res.data);
      setChecked(true);
    } catch (err) {
      console.log(err);
    }
    setPending(false);
  };

  useEffect(() => {
    if (!visible) {
      setAddress('');
      setCheckData(undefined);
      setChecked(false);
    }
  }, [visible]);

  return {
    visible,
    handleVisible,
    address,
    handleAddress,
    isValidAddress,
    invalidMsg,
    pending,
    handleCheck,
    checkData,
    checked,
  };
}

export interface CheckData {
  account_id?: number;
  account_time?: number;
  address?: string;
  amount?: number;
  id?: number;
  items?: string;
}
