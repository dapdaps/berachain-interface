import { useState } from 'react';
import { CoinType } from '@/layouts/main/BGTCoin';

export function useBgt() {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<CoinType | undefined>();

  const handleBgt = (_visible: boolean, _type?: CoinType) => {
    if (!_visible) {
      setType(void 0);
      setVisible(false);
      return;
    }
    setType(_type);
    setVisible(_visible);
  };

  return {
    visible,
    type,
    handleBgt,
  };
}
