import { useState, useMemo, useRef } from 'react';
import SwitchTabs from '@/components/switch-tabs';
import V3List from './v3';
import V2List from './v2';
import IncreaseLiquidityModal from '../../increase-liquidity-modal';
import RemoveLiquidityModal from '../../remove-liquidity-modal';
import CollectFees from '../../collect-fees';

const PAGE_SIZE = 9;

export default function Yours({
  pools = [],
  onChangeTab,
  currentTab,
  loading,
  ticksInfo,
  onSuccess,
  dex
}: any) {
  const [selectedReocrd, setSelectedRecord] = useState<any>(null);
  const [openModal, setOpenModal] = useState('');
  const [page, setPage] = useState(1);

  const maxPage = useMemo(() => {
    return Math.ceil(pools.length / PAGE_SIZE) || 1;
  }, [pools]);

  const data = useMemo(
    () => pools.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [pools, page]
  );

  return (
    <div className='pb-[20px]'>
      <div className='flex items-center'>
        {currentTab && (
          <SwitchTabs
            tabs={[
              { label: 'V3 Pools', value: 'v3' },
              { label: 'V2 Pools', value: 'v2' }
            ]}
            current={currentTab}
            onChange={onChangeTab}
            style={{
              width: 200,
              height: 40,
              padding: 4
            }}
            tabStyle={{
              fontSize: 14,
              fontWeight: 'normal'
            }}
          />
        )}
      </div>
      <div className='mt-[20px]'>
        {currentTab === 'v3' ? (
          <V3List
            data={data}
            maxPage={maxPage}
            setPage={setPage}
            loading={loading}
            ticksInfo={ticksInfo}
            onAction={(val: string, item: any) => {
              setSelectedRecord(item);
              setOpenModal(val);
            }}
          />
        ) : (
          <V2List
            data={data}
            maxPage={maxPage}
            setPage={setPage}
            loading={loading}
            onAction={(val: string, item: any) => {
              setSelectedRecord(item);
              setOpenModal(val);
            }}
          />
        )}
      </div>
      {selectedReocrd && (
        <>
          <IncreaseLiquidityModal
            version={currentTab || 'v2'}
            fee={selectedReocrd.fee}
            tokenId={selectedReocrd.tokenId}
            token0={selectedReocrd.token0}
            token1={selectedReocrd.token1}
            open={openModal === 'increase'}
            onClose={() => {
              setOpenModal('');
              setSelectedRecord(null);
              onSuccess();
            }}
            dex={dex}
          />
          <RemoveLiquidityModal
            version={currentTab || 'v2'}
            fee={selectedReocrd.fee}
            tokenId={selectedReocrd.tokenId}
            token0={selectedReocrd.token0}
            token1={selectedReocrd.token1}
            open={openModal === 'remove'}
            onClose={() => {
              setOpenModal('');
              setSelectedRecord(null);
              onSuccess();
            }}
            dex={dex}
          />
          <CollectFees
            fee={selectedReocrd.fee}
            tokenId={selectedReocrd.tokenId}
            token0={selectedReocrd.token0}
            token1={selectedReocrd.token1}
            version={currentTab}
            dex={dex}
            open={openModal === 'claim'}
            onClose={() => {
              setOpenModal('');
              setSelectedRecord(null);
            }}
          />
        </>
      )}
    </div>
  );
}
