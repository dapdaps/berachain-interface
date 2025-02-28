'use client';

import { memo } from 'react';
import BGTValidatorPageView from '@/sections/bgt/validator';
import BearBackground from '@/components/bear-background';

export default memo(function BGTValidatorPage() {
  return (
    <BearBackground type="hall">
      <BGTValidatorPageView />
    </BearBackground>
  );
});
