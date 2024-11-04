import { Props } from './index';
import ActionPanelForm from './form';

const ActionPanelMobile = (props: Props) => {


  return (
    <div className="px-[12px]">
      <ActionPanelForm {...props} isMobile={true} />
    </div>
  );
};

export default ActionPanelMobile;
