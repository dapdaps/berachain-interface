import { useEffect, useState } from 'react';
import clsx from 'clsx';
import useIsMobile from '@/hooks/use-isMobile';
import {
  formatExecution,
  gasFormatter,
  getDappLogo,
  txTimeFormatter
} from '@/sections/dashboard/utils';
import chains from '@/configs/chains';
import { upperFirst } from 'lodash';
import DashboardRecords from '../records';
import Loading from '@/components/loading';

const currentChain = chains[80094];

interface FeeRebateListProps {
  className?: string;
}

const FeeRebateList = ({ className }: FeeRebateListProps) => {
  const [transactions, setTransactions] = useState<any[]>([]);

  const isMobile = useIsMobile();

  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const getList = () => {
    setIsLoading(true);
    // FIXME test data
    const _list: any = [
      {
          "id": 1101845094,
          "chain_id": 80084,
          "block_number": 9744878,
          "tx_hash": "0xc0387160d1af0c741a3b6638cbf0c663997c8f707634601f618c38ea4d9da139",
          "tx_time": 1737788638,
          "contract": "0x496e305C03909ae382974cAcA4c580E1BF32afBE",
          "sender": "0x8C7f311f5174b636Bc1849e523810b1e9a4B7a1D",
          "receive": "",
          "type": "swap",
          "sub_type": "",
          "method": "multicall",
          "dapp": "kodiak",
          "gas": {
              "chain_id": 80084,
              "address": "bera",
              "symbol": "BERA",
              "name": "BERA",
              "decimals": 18,
              "logo": "",
              "volume": "4609646313625",
              "amount": "0.000004609646313625",
              "price": "5.980693030102463",
              "usd": "0.000027568879579135",
              "type": "",
              "nft_token_id": ""
          },
          "trading_usd": "50",
          "extra_data": {
              "lp_token": null,
              "pool": null,
              "meme_pool": ""
          },
          "token_in": {
              "chain_id": 80084,
              "address": "bera",
              "symbol": "BERA",
              "name": "BERA",
              "decimals": 18,
              "logo": "",
              "volume": "100000000000000000",
              "amount": "0.1",
              "price": "5.980693030102463",
              "usd": "50.000000000000000000",
              "type": "ft",
              "nft_token_id": ""
          },
          "token_in_1": null,
          "token_out": {
              "chain_id": 80084,
              "address": "0x0e4aaf1351de4c0264c5c7056ef3777b41bd8e03",
              "symbol": "HONEY",
              "name": "Honey",
              "decimals": 18,
              "logo": "",
              "volume": "721205066963182091",
              "amount": "0.721205066963182091",
              "price": "0.9960884570098143",
              "usd": "0.721205066963182091",
              "type": "ft",
              "nft_token_id": ""
          },
          "token_out_1": null,
          "tokens_in": [
              {
                  "chain_id": 80084,
                  "address": "bera",
                  "symbol": "BERA",
                  "name": "BERA",
                  "decimals": 18,
                  "logo": "",
                  "volume": "100000000000000000",
                  "amount": "0.1",
                  "price": "5.980693030102463",
                  "usd": "50.000000000000000000",
                  "type": "ft",
                  "nft_token_id": ""
              }
          ],
          "tokens_out": [
              {
                  "chain_id": 80084,
                  "address": "0x0e4aaf1351de4c0264c5c7056ef3777b41bd8e03",
                  "symbol": "HONEY",
                  "name": "Honey",
                  "decimals": 18,
                  "logo": "",
                  "volume": "721205066963182091",
                  "amount": "0.721205066963182091",
                  "price": "0.9960884570098143",
                  "usd": "0.721205066963182091",
                  "type": "ft",
                  "nft_token_id": ""
              }
          ]
      },
      {
          "id": 1101837092,
          "chain_id": 80084,
          "block_number": 9744820,
          "tx_hash": "0xef1e8a53337d53fb2d9aade5f3a0b7d4c37db240121c3eca3fb07ada089960d3",
          "tx_time": 1737788521,
          "contract": "0x496e305C03909ae382974cAcA4c580E1BF32afBE",
          "sender": "0x8C7f311f5174b636Bc1849e523810b1e9a4B7a1D",
          "receive": "",
          "type": "swap",
          "sub_type": "",
          "method": "multicall",
          "dapp": "kodiak",
          "gas": {
              "chain_id": 80084,
              "address": "bera",
              "symbol": "BERA",
              "name": "BERA",
              "decimals": 18,
              "logo": "",
              "volume": "4868807233359",
              "amount": "0.000004868807233359",
              "price": "5.980693030102463",
              "usd": "0.000029118841485463",
              "type": "",
              "nft_token_id": ""
          },
          "trading_usd": "50",
          "extra_data": {
              "lp_token": null,
              "pool": null,
              "meme_pool": ""
          },
          "token_in": {
              "chain_id": 80084,
              "address": "bera",
              "symbol": "BERA",
              "name": "BERA",
              "decimals": 18,
              "logo": "",
              "volume": "100000000000000000",
              "amount": "0.1",
              "price": "5.980693030102463",
              "usd": "50.000000000000000000",
              "type": "ft",
              "nft_token_id": ""
          },
          "token_in_1": null,
          "token_out": {
              "chain_id": 80084,
              "address": "0x0e4aaf1351de4c0264c5c7056ef3777b41bd8e03",
              "symbol": "HONEY",
              "name": "Honey",
              "decimals": 18,
              "logo": "",
              "volume": "731450667894470140",
              "amount": "0.73145066789447014",
              "price": "0.9960884570098143",
              "usd": "0.731450667894470140",
              "type": "ft",
              "nft_token_id": ""
          },
          "token_out_1": null,
          "tokens_in": [
              {
                  "chain_id": 80084,
                  "address": "bera",
                  "symbol": "BERA",
                  "name": "BERA",
                  "decimals": 18,
                  "logo": "",
                  "volume": "100000000000000000",
                  "amount": "0.1",
                  "price": "5.980693030102463",
                  "usd": "50.000000000000000000",
                  "type": "ft",
                  "nft_token_id": ""
              }
          ],
          "tokens_out": [
              {
                  "chain_id": 80084,
                  "address": "0x0e4aaf1351de4c0264c5c7056ef3777b41bd8e03",
                  "symbol": "HONEY",
                  "name": "Honey",
                  "decimals": 18,
                  "logo": "",
                  "volume": "731450667894470140",
                  "amount": "0.73145066789447014",
                  "price": "0.9960884570098143",
                  "usd": "0.731450667894470140",
                  "type": "ft",
                  "nft_token_id": ""
              }
          ]
      },
      {
          "id": 1052265455,
          "chain_id": 80084,
          "block_number": 9468499,
          "tx_hash": "0x28a79f7fdda955ce666f62a9e8093b5c3c2f9d5e076f348f3111ba9908a49800",
          "tx_time": 1737192396,
          "contract": "0x406846114B2A9b65a8A2Ab702C2C57d27784dBA2",
          "sender": "0x8C7f311f5174b636Bc1849e523810b1e9a4B7a1D",
          "receive": "",
          "type": "liquidity",
          "sub_type": "add",
          "method": "addLiquidity",
          "dapp": "kodiak",
          "gas": {
              "chain_id": 80084,
              "address": "bera",
              "symbol": "BERA",
              "name": "BERA",
              "decimals": 18,
              "logo": "",
              "volume": "169272877590",
              "amount": "0.00000016927287759",
              "price": "5.980693030102463",
              "usd": "0.000001012369119188",
              "type": "",
              "nft_token_id": ""
          },
          "trading_usd": "1.646063288536344552",
          "extra_data": {
              "lp_token": null,
              "pool": null,
              "meme_pool": ""
          },
          "token_in": {
              "chain_id": 80084,
              "address": "0x46efc86f0d7455f135cc9df501673739d513e982",
              "symbol": "iBGT",
              "name": "Infrared BGT",
              "decimals": 18,
              "logo": "",
              "volume": "19595991530194578",
              "amount": "0.019595991530194578",
              "price": "9.39931567070408",
              "usd": "1.646063288536344552",
              "type": "ft",
              "nft_token_id": ""
          },
          "token_in_1": {
              "chain_id": 80084,
              "address": "0x7507c1dc16935b82698e4c63f2746a2fcf994df8",
              "symbol": "WBERA",
              "name": "Wrapped Bera",
              "decimals": 18,
              "logo": "",
              "volume": "100000000000000000",
              "amount": "0.1",
              "price": "5.99438409098408",
              "usd": "0.599438409098408000",
              "type": "ft",
              "nft_token_id": ""
          },
          "token_out": {
              "chain_id": 80084,
              "address": "0xf1690b22082a467668f937b5d0d8024821ecee48",
              "symbol": "UNI-V2",
              "name": "Uniswap V2",
              "decimals": 18,
              "logo": "",
              "volume": "41613071405216327",
              "amount": "0.041613071405216327",
              "price": "0",
              "usd": "0.000000000000000000",
              "type": "ft",
              "nft_token_id": ""
          },
          "token_out_1": null,
          "tokens_in": [
              {
                  "chain_id": 80084,
                  "address": "0x46efc86f0d7455f135cc9df501673739d513e982",
                  "symbol": "iBGT",
                  "name": "Infrared BGT",
                  "decimals": 18,
                  "logo": "",
                  "volume": "19595991530194578",
                  "amount": "0.019595991530194578",
                  "price": "9.39931567070408",
                  "usd": "1.646063288536344552",
                  "type": "ft",
                  "nft_token_id": ""
              },
              {
                  "chain_id": 80084,
                  "address": "0x7507c1dc16935b82698e4c63f2746a2fcf994df8",
                  "symbol": "WBERA",
                  "name": "Wrapped Bera",
                  "decimals": 18,
                  "logo": "",
                  "volume": "100000000000000000",
                  "amount": "0.1",
                  "price": "5.99438409098408",
                  "usd": "0.599438409098408000",
                  "type": "ft",
                  "nft_token_id": ""
              }
          ],
          "tokens_out": [
              {
                  "chain_id": 80084,
                  "address": "0xf1690b22082a467668f937b5d0d8024821ecee48",
                  "symbol": "UNI-V2",
                  "name": "Uniswap V2",
                  "decimals": 18,
                  "logo": "",
                  "volume": "41613071405216327",
                  "amount": "0.041613071405216327",
                  "price": "0",
                  "usd": "0.000000000000000000",
                  "type": "ft",
                  "nft_token_id": ""
              }
          ]
      }
    ];
    const _transactions = _list.map((record: any) => {
      return {
        key: record.id,
        ...record,
        id: record.id,
        executed: formatExecution(record, isMobile),
        action: upperFirst(record.type),
        gas: gasFormatter(record),
        dapp_logo: getDappLogo(record.dapp),
        dapp_name: record.dapp,
        chain_logo: currentChain.icon,
        isBeraTown: true,
      };
    });
    setTransactions(_transactions);
    setIsLoading(false);
  };

  const handleRequest = () => {};

  const handleSelected = (record: any) => {
    const _list = transactions.slice();
    const curr = _list.find((it) => it.id === record.id);
    curr.selected = !curr.selected;
    setTransactions(_list);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <DashboardRecords
        isReport={false}
        showHeader={false}
        pageIndex={1}
        pageTotal={1}
        loading={isLoading}
        hasMore={true}
        records={transactions}
        tableBodyClassName="odd:bg-[unset] hover:bg-[rgba(0,0,0,0.06)] transition-all duration-150"
        onNext={() => {}}
        onPrev={() => {}}
        formatColumns={(columns) => {
          return columns.map((c) => {
            if (c.dataIndex === 'time') {
              c.width = '37%';
              c.render = (_, record) => {
                return (
                  <div className='pr-[20px] text-[14px] flex justify-end items-center gap-[6px]'>
                    <div>{txTimeFormatter(record.tx_time)}</div>
                    <a href="" target="_blank">
                      <img src="/images/dashboard/icon-link.svg" alt="" className="w-[11px] h-[11px]" />
                    </a>
                    <div
                      className={clsx(
                        'ml-[7px] cursor-pointer flex justify-center items-center w-[20px] h-[20px] rounded-[6px] border border-black transition-all duration-150',
                        record.selected ? 'bg-[#FFDC50]' : 'bg-white'
                      )}
                      onClick={() => handleSelected(record)}
                    >
                      <img
                        src="/images/dashboard/icon-check.svg"
                        alt=""
                        className={clsx(
                          'w-[11px] h-[9px] transition-all duration-150',
                          record.selected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </div>
                  </div>
                );
              }
            }
            return c;
          }).filter((c) => c.dataIndex !== 'status');
        }}
      />
      <button
        className="mt-[20px] w-full h-[46px] flex border border-black justify-center items-center gap-[10px] bg-[#FFDC50] rounded-[10px] font-[600] disabled:opacity-50 disabled:!cursor-not-allowed text-[18px] text-black"
        onClick={handleRequest}
        disabled={isPending || isLoading}
      >
        {isPending && (<Loading size={16} />)}
        <div className="">Request 3 Fee Rebate</div>
      </button>
    </div>
  );
};

export default FeeRebateList;
