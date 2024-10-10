import { useEffect, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import Big from 'big.js';

export function useHandler(props: Props) {
  const [amount, setAmount] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [txData, setTxData] = useState<any>();
  const [isMax, setIsMax] = useState(false);

  const { run: debouncedGetTrade, cancel: cancelGetTrade } = useDebounceFn(() => {
    setLoading(true);
  }, { wait: 500 });

  const handleAmountChange = (ev: any) => {
    if (isNaN(Number(ev.target.value))) {
      setLoading(false);
      cancelGetTrade();
      return;
    }
    const _amount = ev.target.value.replace(/\s+/g, '');
    setAmount(_amount);
    if (!_amount || Big(_amount).lte(0)) {
      setLoading(false);
      cancelGetTrade();
      return _amount;
    }
    debouncedGetTrade();
    return _amount;
  };

  const handleAmount = (ev: any) => {
    const _amount = handleAmountChange(ev);
    if (!_amount) {
      setIsMax(false);
      return;
    }
    if (Big(_amount).eq(props.balance)) {
      setIsMax(true);
    } else {
      setIsMax(false);
    }
  };

  const handleBalance = () => {
    setIsMax(true);
    handleAmountChange({ target: { value: props.balance } });
  };

  useEffect(() => {
    if (!amount || Big(amount).lte(0)) {
      setDisabled(true);
      return;
    }
    if (Big(amount).gt(props.balance)) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
  }, [amount, props.balance]);

  return {
    amount,
    disabled,
    loading,
    txData,
    isMax,
    setAmount,
    setDisabled,
    setLoading,
    setTxData,
    setIsMax,
    debouncedGetTrade,
    handleAmountChange,
    handleAmount,
    handleBalance,
  };
}

interface Props {
  balance: string;
}
