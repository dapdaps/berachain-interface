'use client';

import { memo } from 'react';
import IBGTPageView from '@/sections/bgt/ibgt';
import useCustomAccount from '@/hooks/use-account';

export default memo(function IBGTPage() {
  const {
    chainId
  } = useCustomAccount()
  return <IBGTPageView chainId={chainId} />;
});
