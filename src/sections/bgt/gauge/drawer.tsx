import Drawer from '@/components/drawer';
import Index from './index';
import BgtHead from '@/sections/bgt/components/bgt-head';

const BgtGaugeDrawer = (props: any) => {
  const { visible, onClose, bgtData, ...rest } = props;

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
    >
      <div className="h-full rounded-t-[20px] overflow-hidden">
        <BgtHead
          bgtData={bgtData}
          className="!absolute scale-75 translate-y-[-50%] left-[50%] translate-x-[-50%] z-[10]"
        />
        <Index {...rest} />
      </div>
    </Drawer>
  );
};

export default BgtGaugeDrawer;
