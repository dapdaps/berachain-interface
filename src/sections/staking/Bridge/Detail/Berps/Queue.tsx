import FlexTable from '@/components/flex-table';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { get } from '@/utils/http';
import { ethers } from 'ethers';
import useCustomAccount from '@/hooks/use-account';
import LazyImage from '@/components/layz-image';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';
import Loading from '@/components/loading';
import { withdrawAbi } from '@/sections/staking/Bridge/Detail';
import useToast from '@/hooks/use-toast';
import useAddAction from '@/hooks/use-add-action';
import { useProvider } from '@/hooks/use-provider';
import useIsMobile from '@/hooks/use-isMobile';
import Empty from '@/components/empty';
import Skeleton from 'react-loading-skeleton';

const WithdrawQueue = forwardRef<any, any>((props, ref) => {
  const { data, className } = props;

  const isMobile = useIsMobile();
  const { account, chainId } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction('dapp');
  const { provider } = useProvider();

  const contract = new ethers.Contract(data?.LP_ADDRESS, withdrawAbi, provider?.getSigner());

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [withdrawPending, setWithdrawPending] = useState<any>({});
  const [withdrawCancelPending, setWithdrawCancelPending] = useState<any>({});

  const getList = async () => {
    setLoading(true);
    const res = await get(`https://bartio-berps.berachain.com/vaultwithdrawals/${account}`);
    const { withdraw_requests = [] } = res || {};
    const _list = withdraw_requests.map((it: any) => ({
      ...it,
      amount: ethers.utils.formatUnits(it.shares, data?.withdrawToken?.decimals),
      symbol: data?.withdrawToken?.symbol,
      icon: data?.withdrawToken?.icon,
      unlockEpoch: it.unlock_epoch,
    }));
    console.log('data: %o, list res: %o, list: %o', data, res, _list);
    setList(_list);
    setLoading(false);
  };

  const handleWithdraw = (record: any) => {
    if (withdrawPending[record.unlockEpoch]) return;
    const toastId = toast?.loading({
      title: `Withdrawing...`
    });
    setWithdrawPending({ ...withdrawPending, [record.unlockEpoch]: true });
    const params = [record.shares, account, account];
    const createTx = (gasLimit: any) => {
      contract.redeem(...params, { gasLimit })
        .then((tx: any) => tx.wait())
        .then((res: any) => {
          const { status, transactionHash } = res;
          getList();
          addAction?.({
            type: 'Staking',
            action: 'UnStake',
            token: data?.withdrawToken,
            symbol: data?.withdrawToken?.symbol,
            amount: record.amount,
            template: "Infrared",
            status: status,
            transactionHash,
            chain_id: chainId,
            sub_type: 'Withdraw'
          });
          toast?.success({
            title: 'Withdraw Successfully!',
            tx: transactionHash,
            chainId
          });
        }).catch((err: any) => {
        console.log('Withdraw failed: %o', err);
        toast?.fail({
          title: 'Withdraw Failed!',
          text: err?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : err?.message ?? ''
        });
      }).finally(() => {
        toast?.dismiss(toastId);
        setWithdrawPending({ ...withdrawPending, [record.unlockEpoch]: false });
      });
    };
    contract.estimateGas.redeem(...params).then((res: any) => {
      createTx(res);
    }).catch((err: any) => {
      console.log('estimateGas failed: %o', err);
      createTx(4000000);
    });
  };

  const handleWithdrawCancel = (record: any) => {
    if (withdrawCancelPending[record.unlockEpoch]) return;
    const toastId = toast?.loading({
      title: `Canceling...`
    });
    setWithdrawCancelPending({ ...withdrawCancelPending, [record.unlockEpoch]: true });
    const params = [record.shares, record.unlockEpoch];
    const createTx = (gasLimit: any) => {
      contract.cancelWithdrawRequest(...params, { gasLimit })
        .then((tx: any) => tx.wait())
        .then((res: any) => {
          const { status, transactionHash } = res;
          getList();
          addAction?.({
            type: 'Staking',
            action: 'UnStake',
            token: data?.withdrawToken,
            symbol: data?.withdrawToken?.symbol,
            amount: record.amount,
            template: data?.initialData?.pool?.protocol,
            status: status,
            transactionHash,
            chain_id: chainId,
            sub_type: 'Withdraw'
          });
          toast?.success({
            title: 'Cancel Withdraw Successfully!',
            tx: transactionHash,
            chainId
          });
        }).catch((err: any) => {
        console.log('Cancel Withdraw failed: %o', err);
        toast?.fail({
          title: 'Cancel Withdraw Failed!',
          text: err?.message?.includes('user rejected transaction')
            ? 'User rejected transaction'
            : err?.message ?? ''
        });
      }).finally(() => {
        toast?.dismiss(toastId);
        setWithdrawCancelPending({ ...withdrawCancelPending, [record.unlockEpoch]: false });
      });
    };
    contract.estimateGas.cancelWithdrawRequest(...params).then((res: any) => {
      createTx(res);
    }).catch((err: any) => {
      console.log('estimateGas failed: %o', err);
      createTx(4000000);
    });
  };

  const refs = {
    getList,
  };
  useImperativeHandle(ref, () => refs);

  useEffect(() => {
    if (!account) return;
    getList();
  }, [account]);

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      width: "30%",
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[8px]">
            <LazyImage src={record?.icon} alt={record?.symbol} width={20} height={20} />
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">
              {numberFormatter(record?.amount, 2, true)}
            </div>
          </div>
        );
      },
    },
    {
      title: "Unlock Epoch",
      dataIndex: "unlockEpoch",
      width: "30%",
      render: (text: string, record: any) => {
        return numberFormatter(record.unlockEpoch, 0, true);
      },
    },
    {
      title: "",
      dataIndex: "action",
      width: "30%",
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              className="border text-[12px] font-normal border-black flex justify-center items-center rounded-[36px] h-[36px] bg-[#FFDC50] px-[8px] disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={Big(data?.currentEpoch).lt(record.unlockEpoch) || withdrawPending[record.unlockEpoch]}
              onClick={() => handleWithdraw(record)}
            >
              {
                withdrawPending[record.unlockEpoch] ?
                  (<div className="px-[10px] flex justify-center items-center"><Loading size={12} /></div>) :
                  'Withdraw'
              }
            </button>
            <button
              type="button"
              className="border text-[12px] font-normal border-black flex justify-center items-center rounded-[36px] h-[36px] bg-[#FFF] px-[8px] disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => handleWithdrawCancel(record)}
              disabled={withdrawCancelPending[record.unlockEpoch]}
            >
              {
                withdrawCancelPending[record.unlockEpoch] ?
                  (<div className="px-[10px] flex justify-center items-center"><Loading size={12} /></div>) :
                  'Cancel'
              }
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={`mt-[20px] ${className}`}>
      <div className="font-Montserrat text-[20px] font-semibold leading-[90%]">
        Withdrawal Queue
      </div>
      {
        isMobile ? (
          <div className="h-[calc(100%_-_48px)] overflow-y-auto">
            {
              !loading ? (
                list.length > 0 ?
                  list.map((record: any, idx: number) => (
                    <div key={`row-${idx}`} className="flex flex-col items-stretch gap-[10px] bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[10px_15px] mt-[10px]">
                      <div className="flex justify-between">
                        <div className="w-1/2 flex flex-col gap-[8px]">
                          <div className="text-[#3D405A] text-[14px] font-[500]">Amount</div>
                          <div className="text-black text-[16px] font-[600]">{record.amount}</div>
                        </div>
                        <div className="w-1/2 flex flex-col gap-[8px]">
                          <div className="text-[#3D405A] text-[14px] font-[500]">Unlock Epoch</div>
                          <div className="text-black text-[16px] font-[600]">{record.unlockEpoch}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <button
                          type="button"
                          className="border text-[16px] font-[600] border-black flex-1 flex justify-center items-center gap-[8px] rounded-[10px] h-[46px] bg-[#FFDC50] px-[8px] disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={Big(data?.currentEpoch).lt(record.unlockEpoch) || withdrawPending[record.unlockEpoch]}
                          onClick={() => handleWithdraw(record)}
                        >
                          {withdrawPending[record.unlockEpoch] && <Loading size={16} />}
                          Withdraw
                        </button>
                        <button
                          type="button"
                          className="border text-[16px] font-[600] border-black flex-1 flex justify-center items-center gap-[8px] rounded-[10px] h-[46px] bg-[#FFF] px-[8px] disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => handleWithdrawCancel(record)}
                          disabled={withdrawCancelPending[record.unlockEpoch]}
                        >
                          {withdrawCancelPending[record.unlockEpoch] && <Loading size={16} />}
                          Cancel
                        </button>
                      </div>
                    </div>
                  )) :
                  (
                    <div className="pt-[50px]">
                      <Empty desc="No data" />
                    </div>
                  )
              ) : (
                <div className="flex flex-col items-stretch gap-[10px] pt-[10px]">
                  <Skeleton width="1005" height={129} borderRadius={10} />
                  <Skeleton width="1005" height={129} borderRadius={10} />
                </div>
              )
            }
          </div>
        ) : (
          <FlexTable
            loading={loading}
            columns={columns}
            list={list}
          />
        )
      }
    </div>
  );
});

export default WithdrawQueue;
