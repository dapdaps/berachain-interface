import LazyImage from '@/components/layz-image';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import FlexTable from '@/components/flex-table';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { numberFormatter } from '@/utils/number-formatter';
import { get } from '@/utils/http';
import { ethers } from 'ethers';
import Big from 'big.js';
import { withdrawAbi } from '@/sections/staking/Bridge/Detail/index';
import Loading from '@/components/loading';

const DetailBerps = forwardRef<any, any>((props, ref) => {
  const { data, account, provider, addAction, chainId, toast } = props;

  const { depositToken, withdrawToken } = data;
  const contract = new ethers.Contract(data?.LP_ADDRESS, withdrawAbi, provider?.getSigner());

  const [loading, setLoading] = useState(false);
  const [withdrawPending, setWithdrawPending] = useState<any>({});
  const [withdrawCancelPending, setWithdrawCancelPending] = useState<any>({});
  const [list, setList] = useState([]);

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
            template: data?.initialData?.pool?.protocol,
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

  useEffect(() => {
    if (!account) return;
    getList();
  }, [account]);

  const refs = {
    getList,
  };
  useImperativeHandle(ref, () => refs);

  return (
    <div className="flex-1 pr-[24px] pl-[13px] py-[24px] rounded-[10px] bg-black/[0.06]">
      <div className="grid grid-cols-2 gap-[15px]">
        <Item
          label={`Total ${depositToken?.symbol} Value`}
          value={(
            <>
              <LazyImage src={depositToken?.icon} width={20} height={20} />
              <span>
                {numberFormatter(data?.completeBalanceOfAssets, 2, true)}
              </span>
            </>
          )}
        />
        <Item
          label="Est. Earnings"
          value={(
            <>
              <LazyImage src={depositToken?.icon} width={20} height={20} />
              <span>
                {numberFormatter(data?.estimatedEarnings, 2, true)}
              </span>
            </>
          )}
          tooltip={`Estimated earnings = ${withdrawToken?.symbol} balance (including cooldown amount) market value + total ${depositToken?.symbol} withdrawn - total ${depositToken?.symbol} deposited`}
        />
        <Item
          label={`${withdrawToken?.symbol} Balance`}
          value={(
            <>
              <LazyImage src={withdrawToken?.icon} width={20} height={20} />
              <span>
                {numberFormatter(data?.completeBalanceOf, 2, true)}
              </span>
            </>
          )}
          tooltip={`Total ${withdrawToken?.symbol} including the amount in cooldown`}
        />
        <Item
          label="Cooldown"
          value={(
            <>
              <LazyImage src={withdrawToken?.icon} width={20} height={20} />
              <span>
                {data?.totalSharesBeingWithdrawn}
              </span>
            </>
          )}
          tooltip={`This amount of ${withdrawToken?.symbol} is non-transferable until the withdrawal is processed. You won't be able to transfer it during this time.`}
        />
      </div>
      <div className="mt-[20px]">
        <div className="font-Montserrat text-[20px] font-semibold leading-[90%]">
          Withdrawal Queue
        </div>
        <FlexTable
          loading={loading}
          columns={columns}
          list={list}
        />
      </div>
    </div>
  );
});

export default DetailBerps;

const Item = (props: any) => {
  const { label, value, tooltip } = props;

  return (
    <div className="rounded-[10px] bg-[#FFDC50] py-[15px] px-[20px]">
      <Popover
        content={tooltip ? (
          <div className="rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 p-[5px_10px] max-w-[300px]">{tooltip}</div>
        ) : void 0}
        trigger={PopoverTrigger.Hover}
        placement={PopoverPlacement.TopLeft}
      >
        <div className={`text-[#3D405A] font-Montserrat text-[14px] font-medium ${tooltip ? 'underline decoration-dashed cursor-pointer' : ''}`}>
          {label}
        </div>
      </Popover>
      <div className="flex items-center gap-[10px] mt-[5px] text-black font-Montserrat text-[20px] font-semibold leading-[90%] whitespace-nowrap">
        {value}
      </div>
    </div>
  );
};
