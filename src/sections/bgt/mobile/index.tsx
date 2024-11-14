import Drawer from '@/components/drawer';
import SwitchTabs from '@/components/switch-tabs';
import { useState } from 'react';
import { useBGT } from '@/hooks/use-bgt';
import BgtHead from '@/sections/bgt/components/bgt-head';
import { formatThousandsSeparator, formatValueDecimal } from '@/utils/balance';
import { AnimatePresence, motion } from 'framer-motion';
import Loading from '@/components/loading';
import BgtEmpty from '@/sections/bgt/components/bgt-empty';
import BgtValidatorDrawer from '@/sections/bgt/validator/drawer';
import Big from 'big.js';
import Market from '@/sections/bgt/mobile/market';
import Vaults from '@/sections/bgt/mobile/vaults';

const BGTMobileView = (props: Props) => {
  const { visible, onClose } = props;

  const [tab, setTab] = useState('market');
  const {
    data: bgtData,
    loading,
    sortDataIndex,
    setSortDataIndex,
    pageData,
    filterList,
    handleClaim,
    handleExplore,
    handleValidator,
  } = useBGT();

  const [infraredVisible, setInfraredVisible] = useState(false);
  const [infraredData, setInfraredData] = useState<any>();

  const onTop3 = (data: any) => {
    handleValidator(data);
    setInfraredData(data);
    setInfraredVisible(true);
  };

  return (
    <>
      <Drawer
        visible={visible}
        onClose={onClose}
        size="80dvh"
        className='bg-[#FFFDEB]'
      >
        <BgtHead
          bgtData={bgtData}
          style={{ position: 'absolute' }}
          className="scale-75 translate-y-[-50%] left-[50%] translate-x-[-50%]"
        />
        <div className="h-full">
          <div className="pt-[50px] px-[12px]">
            <SwitchTabs
              tabs={[
                { label: 'BGT Market', value: 'market' },
                { label: 'Your Vaults', value: 'vaults' }
              ]}
              onChange={(val) => {
                setTab(val);
              }}
              current={tab}
              className="md:h-[52px] rounded-[12px] bg-[#DFDCC4!important] border-0"
              cursorClassName="rounded-[10px]"
            />
          </div>
          <AnimatePresence mode="wait">
            {
              tab === 'market' ? (
                <Market
                  pageData={pageData}
                  onTop3={onTop3}
                  bgtData={bgtData}
                />
              ) : (
                <Vaults
                  filterList={filterList}
                  handleExplore={handleExplore}
                />
              )
            }
          </AnimatePresence>
        </div>
      </Drawer>
      <BgtValidatorDrawer
        visible={infraredVisible}
        bgtData={bgtData}
        id={infraredData?.validator?.id}
        onClose={() => {
          setInfraredVisible(false);
        }}
        onBack={() => {
          setInfraredVisible(false);
        }}
      />
    </>
  );
};

export default BGTMobileView;

interface Props {
  visible: boolean;

  onClose(): void;
}
