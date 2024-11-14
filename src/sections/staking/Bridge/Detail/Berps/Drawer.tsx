import Drawer from '@/components/drawer';
import Index from './Queue';

const WithdrawQueueDrawer = (props: any) => {
  const { visible, onClose, ...restProps } = props;

  return (
    <Drawer
      size="50dvh"
      visible={visible}
      onClose={onClose}
      overlayClassName="z-[101]"
    >
      <div className="px-[12px] h-full">
        <Index className="h-full" {...restProps} />
      </div>
    </Drawer>
  );
};

export default WithdrawQueueDrawer;
