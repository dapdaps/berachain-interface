import { useState, useMemo } from 'react';
import Image from 'next/image';
import Dropdown from '../dropdown';
import SearchBox from '../searchbox';
import List from '../list';
import dexs from '@/configs/swap';
import { DEFAULT_CHAIN_ID } from '@/configs';
import SwapModal from '@/sections/swap/SwapModal';
import { balanceFormated } from '@/utils/balance';

const PAGE_SIZE = 9;

export default function Token() {
  const [protocol, setProtocol] = useState('all');
  const [searchVal, setSearchVal] = useState('');
  const [page, setPage] = useState(1);
  const [protocols, tokens] = useMemo(() => {
    let _tokens: any = [];
    let _dexs: any = [{ key: 'all', name: 'All Protocols' }];
    Object.values(dexs).forEach((dex) => {
      dex.tokens[DEFAULT_CHAIN_ID]?.forEach((token: any) => {
        _tokens.push({
          ...token,
          protocol: dex.name,
          protocolIcon: dex.icon,
          defaultInputCurrency: dex.defaultInputCurrency,
          defaultOutputCurrency: dex.defaultOutputCurrency,
          id: _tokens.length + 1
        });
      });
      _dexs.push({
        key: dex.name,
        name: dex.name
      });
    });
    return [_dexs, _tokens];
  }, [dexs]);

  const list = useMemo(
    () =>
      tokens.filter((token: any) => {
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
    [tokens, protocol, searchVal]
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
              title: 'Token',
              key: 'token',
              sort: false,
              width: '25%',
              render: (item: any, index: number) => {
                return (
                  <div className='flex items-center gap-[12px]'>
                    <Image
                      src={item.icon}
                      width={30}
                      height={30}
                      alt={item.name}
                      className='rounded-[50%]'
                    />
                    <div>{item.name}</div>
                  </div>
                );
              }
            },
            {
              title: 'Protocol',
              key: 'Protocol',
              sort: false,
              width: '25%',
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
              title: 'Yours',
              key: 'Yours',
              sort: true,
              width: '20%',
              render: (item: any, index: number) => {
                return item['yours'] || balanceFormated(Math.random() * 14, 2);
              }
            },
            {
              title: 'Action',
              key: 'Action',
              sort: false,
              width: '15%',
              render: (item: any, index: number) => {
                return (
                  <button className='hover:bg-[#FFDC50] text-[16px] font-medium border border-[#000] w-[95px] h-[32px] text-center leading-[32px] bg-white rounded-[10px]'>
                    Swap
                  </button>
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
    </div>
  );
}
