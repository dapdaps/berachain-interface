import { useState, useMemo } from 'react';
import Image from 'next/image';
import Dropdown from '../dropdown';
import SearchBox from '../searchbox';
import List from '../list';
import dexs from '@/configs/pools';
import PoolTable from '@/sections/pools/components/pool-table';
import AddLiquidityModal from '@/sections/pools/add-liquidity-modal';
import RemoveLiquidityModal from '@/sections/pools/remove-liquidity-modal';
import V3PoolsModal from '@/sections/pools/v3-pools-modal';
import { balanceFormated } from '@/utils/balance';
import Action from './action';
import usePools from './use-pools';

const PAGE_SIZE = 9;

const checkIsExist = ({ record, balance, hasFee }: any) => {
  return (
    balance[
      `${record.token0.address.toLowerCase()}-${record.token1.address.toLowerCase()}${
        hasFee ? '-' + record.fee : ''
      }`
    ] ||
    balance[
      `${record.token1.address.toLowerCase()}-${record.token0.address.toLowerCase()}${
        hasFee ? '-' + record.fee : ''
      }`
    ]
  );
};

export default function Liquidity() {
  const [protocol, setProtocol] = useState('all');
  const [searchVal, setSearchVal] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [modalType, setModalType] = useState('');
  const [selectedTokenId, setSelectedTokenId] = useState('');
  const {
    pools,
    loading,
    bexLoading,
    bexBalances,
    kodiakV2Loading,
    kodiakV2Balances,
    kodiakV3Loading,
    kodiakV3Balances,
    kodiakTicksInfo
  } = usePools();
  const [protocols] = useMemo(() => {
    let _dexs: any = [{ key: 'all', name: 'All Protocols' }];
    Object.values(dexs).forEach((dex) => {
      _dexs.push({
        key: dex.name,
        name: dex.name
      });
    });
    return [_dexs];
  }, [dexs]);

  const list = useMemo(
    () =>
      pools.filter((token: any) => {
        let flag = true;
        if (protocol !== 'all' && protocol !== token.protocol) {
          flag = false;
        }
        if (
          searchVal &&
          !(
            token.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            token.symbol.toLowerCase().includes(searchVal.toLowerCase())
          )
        )
          flag = false;
        return flag;
      }),
    [pools, protocol, searchVal]
  );

  const maxPage = useMemo(() => {
    return Math.ceil(list.length / PAGE_SIZE) || 1;
  }, [list]);

  const data = useMemo(
    () => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [list, page]
  );

  return (
    <div>
      <div className='flex justify-between items-center'>
        <Dropdown
          list={protocols}
          value={protocol}
          onChange={(val) => {
            setProtocol(val);
          }}
          placeholder=''
        />
        <SearchBox value={searchVal} onChange={setSearchVal} />
      </div>

      <div className='mt-[20px]'>
        <List
          meta={[
            {
              title: '#',
              key: '#',
              sort: false,
              width: '5%',
              render: (item: any, index: number) => {
                return item.id;
              }
            },
            {
              title: 'Pool',
              key: 'pool',
              sort: false,
              width: '25%',
              render: (item: any, index: number) => {
                return <PoolTable item={item} />;
              }
            },
            {
              title: 'Protocol',
              key: 'Protocol',
              sort: false,
              width: '20%',
              render: (item: any, index: number) => {
                return (
                  <div className='flex items-center gap-[12px]'>
                    <Image
                      src={item.protocolIcon}
                      width={30}
                      height={30}
                      alt={item.protocol}
                      className='rounded-[50%]'
                    />
                    <div>{item.protocol}</div>
                  </div>
                );
              }
            },
            {
              title: 'TVL',
              key: 'TVL',
              sort: true,
              width: '10%',
              render: (item: any, index: number) => {
                return item['tvl'] || balanceFormated(Math.random() * 1400, 2);
              }
            },
            {
              title: '24h Volume',
              key: '24h_volume',
              sort: true,
              width: '15%',
              render: (item: any, index: number) => {
                return item['yours'] || balanceFormated(Math.random() * 14, 2);
              }
            },
            {
              title: '24h Fees',
              key: '24h_fees',
              sort: true,
              width: '15%',
              render: (item: any, index: number) => {
                return item['yours'] || balanceFormated(Math.random() * 14, 2);
              }
            },
            {
              title: 'Action',
              key: 'Action',
              sort: false,
              width: '10%',
              render: (item: any, index: number) => {
                let _removeable = false;
                if (item.protocol.toLowerCase() === 'bex') {
                  _removeable = checkIsExist({
                    record: item,
                    balance: bexBalances
                  });
                }
                if (
                  item.protocol.toLowerCase() === 'kodiak' &&
                  item.version === 'v2'
                ) {
                  _removeable = checkIsExist({
                    record: item,
                    balance: kodiakV2Balances
                  });
                }
                if (
                  item.protocol.toLowerCase() === 'kodiak' &&
                  item.version === 'v3'
                ) {
                  _removeable = checkIsExist({
                    record: item,
                    balance: kodiakV3Balances,
                    hasFee: true
                  });
                }
                return (
                  <Action
                    onAdd={() => {
                      setModalType('add');
                      setSelectedRecord(item);
                    }}
                    onRemove={() => {
                      setModalType(item.version === 'v3' ? 'pools' : 'remove');
                      setSelectedRecord(
                        item.version === 'v3'
                          ? { ...item, pools: _removeable }
                          : item
                      );
                    }}
                    removeable={_removeable}
                  />
                );
              }
            }
          ]}
          list={data}
          maxPage={maxPage}
          onPageChange={setPage}
          bodyClassName='h-[522px] overflow-y-auto'
        />
      </div>
      {selectedRecord && (
        <>
          <AddLiquidityModal
            token0={selectedRecord.token0}
            token1={selectedRecord.token1}
            version={selectedRecord.version}
            dex={selectedRecord.protocol}
            fee={selectedRecord.fee}
            open={modalType === 'add'}
            onClose={() => {
              setModalType('');
              setSelectedRecord(null);
            }}
          />
          <RemoveLiquidityModal
            token0={selectedRecord.token0}
            token1={selectedRecord.token1}
            version={selectedRecord.version}
            dex={selectedRecord.protocol}
            fee={selectedRecord.fee}
            open={modalType === 'remove'}
            tokenId={selectedTokenId}
            onClose={() => {
              setModalType('');
              setSelectedRecord(null);
            }}
          />
          <V3PoolsModal
            open={modalType === 'pools'}
            token0={selectedRecord.token0}
            token1={selectedRecord.token1}
            fee={selectedRecord.fee}
            dex={selectedRecord.protocol}
            data={selectedRecord.pools}
            loading={false}
            ticksInfo={kodiakTicksInfo}
            onPick={(item: any) => {
              setModalType('remove');
              setSelectedTokenId(item.tokenId);
            }}
            onClose={() => {
              setModalType('');
              setSelectedRecord(null);
            }}
          />
        </>
      )}
    </div>
  );
}
