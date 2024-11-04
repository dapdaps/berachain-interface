import { IProps } from './index';
import React, { forwardRef } from 'react';
import Drawer from '@/components/drawer';
import ActionPanelForm from './form';

const ActionMobile = forwardRef<HTMLDivElement, IProps>((props: IProps, ref) => {
  const { isOpen, onClose, action, token } = props;

  if (!isOpen) return null;

  return (
    <Drawer
      visible={isOpen}
      onClose={onClose}
      size="50vh"
    >
      <div className="py-[23px]">
        <div className="text-[18px] font-[700] text-black px-[24px]">
          {action?.[0].toUpperCase() + action?.slice(1)} {token?.symbol}
        </div>
        <div className="px-[12px] mt-[33px]">
          <ActionPanelForm {...props} isMobile={true} />
        </div>
      </div>
    </Drawer>
  );
});

export default ActionMobile;
