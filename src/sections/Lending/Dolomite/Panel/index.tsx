import { TabPanelProps } from '@/sections/Lending/Dolomite/Panel/types';
import useIsMobile from '@/hooks/use-isMobile';
import TabPanelLaptop from '@/sections/Lending/Dolomite/Panel/laptop';
import TabPanelMobile from '@/sections/Lending/Dolomite/Panel/mobile';

const TabPanel = (props: TabPanelProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? <TabPanelMobile {...props} /> : <TabPanelLaptop {...props} />}
    </>
  );
};

export default TabPanel;
