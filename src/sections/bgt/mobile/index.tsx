import Drawer from '@/components/drawer';
import SwitchTabs from '@/components/switch-tabs';
import { useBGT } from '@/hooks/use-bgt';
import BgtHead from '@/sections/bgt/components/bgt-head';
import BgtGaugeDrawer from '@/sections/bgt/gauge/drawer';
import Market from '@/sections/bgt/mobile/market';
import BgtValidatorDrawer from '@/sections/bgt/validator/drawer';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
// import Vaults from '@/sections/bgt/mobile/vaults';
import { useVaultList } from "@/sections/bgt/hooks/useList";
import AllVaults from "@/sections/bgt/mobile/vaults/all";
import YourVaults from "@/sections/bgt/mobile/vaults/your";
import { useDebounceFn } from 'ahooks';

const TABS = [
  {
    value: 'deposit',
    label: 'Deposit',
    disabled: false
  },
  {
    value: 'withdraw',
    label: 'Withdraw',
    disabled: false
  }
];
const BGTMobileView = (props: Props) => {
  const { visible, onClose } = props;
  const [tab, setTab] = useState('all');

  const {
    data: bgtData,
    // loading,
    isLoading: isBGTLoading,
    sortDataIndex,
    setSortDataIndex,
    pageData,
    filterList,
    handleClaim,
    handleExplore,
    handleValidator,
  } = useBGT(tab);

  const {
    data: vaults,
    params,
    loading: isLoading,
    maxPage,
    setPage,
    setSortBy,
  } = useVaultList({
    sortBy: "activeIncentivesInHoney",
    sortOrder: "desc",
    add: true
  });

  const [infraredVisible, setInfraredVisible] = useState(false);
  const [gaugeVisible, setGaugeVisible] = useState(false)
  const [gaugeId, setGaugeId] = useState(null)
  const [infraredData, setInfraredData] = useState<any>();

  const onTop3 = (data: any) => {
    handleValidator(data);
    setInfraredData(data);
    setInfraredVisible(true);
  };


  const { run: scroll } = useDebounceFn(
    (ev) => {
      const el = ev.target;
      const hasMore = params.page < maxPage
      if (el.scrollHeight - el.scrollTop < el.clientHeight * 2 && hasMore) {
        setPage(params.page++)
      }
    },
    { wait: 500 }
  );

  const handleDeposit = (record: any) => {
    setGaugeVisible(true)
    setGaugeId(record?.id)
  }

  console.log('=====infraredData====', infraredData)
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
          style={{ position: 'absolute', zIndex: 2 }}
          className="scale-75 translate-y-[-50%] left-[50%] translate-x-[-50%]"
        />
        <div className="pt-[50px] h-full overflow-auto" onScroll={scroll}>
          <Market
            pageData={pageData}
            onTop3={onTop3}
            bgtData={bgtData}
          />
          <div className='px-[12px]'>
            <SwitchTabs
              tabs={[
                { label: 'All Vaults', value: 'all' },
                { label: 'Your Vaults', value: 'your' },
              ]}
              onChange={(val) => {
                setTab(val);
              }}
              current={tab}
              style={{ height: 40, borderRadius: 12 }}
              cursorStyle={{ borderRadius: 10 }}
            />
          </div>


          <AnimatePresence mode="wait">
            {
              tab === 'all' ? (
                <AllVaults
                  data={vaults}
                  isLoading={isLoading}
                  onDeposit={handleDeposit}
                />
              ) : (
                <YourVaults
                  filterList={filterList}
                  isLoading={isBGTLoading}
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
        id={infraredData?.id}
        onClose={() => {
          setInfraredVisible(false);
        }}
        onBack={() => {
          setInfraredVisible(false);
        }}
      />

      <BgtGaugeDrawer
        visible={gaugeVisible}
        bgtData={bgtData}
        id={gaugeId}
        onClose={() => {
          setGaugeVisible(false);
        }}
        onBack={() => {
          setGaugeVisible(false);
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
