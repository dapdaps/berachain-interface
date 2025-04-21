import { FC, useEffect, useState } from 'react';
import IconLeft from '@public/images/near-intents/icons/icon-left.svg';
import IconHistoryDeposited from '@public/images/near-intents/icons/history-deposited.svg';
import IconHistorySwapped from '@public/images/near-intents/icons/history-swapped.svg';
import IconHistoryWithdraw from '@public/images/near-intents/icons/history-withdraw.svg';
import Empty from '@/components/empty';
import { HistoryStatus } from '../../../stores/historyStore';

import { get } from '@/utils/http'
import { useConnectedWalletsStore } from '@/stores/useConnectedWalletsStore';
import Skeleton from 'react-loading-skeleton';

interface HistoryProps {
  onBack: () => void;
}

type HistoryType = 'deposit' | 'withdraw' | 'swapped';

const getHistoryIcon = (type: HistoryType) => {
  switch (type) {
    case 'deposit':
      return <IconHistoryDeposited />;
    case 'withdraw':
      return <IconHistoryWithdraw />;
    case 'swapped':
      return <IconHistorySwapped />;
  }
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

const mapStatusToType = (status?: HistoryStatus): HistoryType => {
  switch(status) {
    case HistoryStatus.DEPOSIT:
      return 'deposit';
    case HistoryStatus.WITHDRAW:
      return 'withdraw';
    default:
      return 'swapped';
  }
};

const formatAmount = (amount: string | number) => {
  const num = Number(amount);
  if (num < 0.0001) {
    return '<0.0001';
  }
  return num.toFixed(4);
};

const History: FC<HistoryProps> = ({ onBack }) => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const { connectedWallets } = useConnectedWalletsStore();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchHistoryData = async () => {
      const addresses = connectedWallets
        .map(wallet => wallet.address)
        .filter(Boolean)
        .join(',');

      if (!addresses) return;
      setIsLoading(true);
      try {
        const response = await get('/api/action/get-actions-by-account', {
          account_id: addresses,
          page: 1,
          page_size: 10000,
          template: 'near-intents',
        });

        if (response.code === 0 && response.data?.data) {
          setHistoryData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, [connectedWallets]);

  const formatHistoryData = (item: any) => {
    let status: HistoryStatus;
    switch(item.sub_type?.toLowerCase()) {
      case 'deposit':
        status = HistoryStatus.DEPOSIT;
        break;
      case 'withdraw':
        status = HistoryStatus.WITHDRAW;
        break;
      default:
        status = HistoryStatus.SWAPPED;
    }

    return {
      hash: item.tx_id,
      timestamp: item.timestamp * 1000, 
      status,
      details: {
        tvlusd: item.trading_value,
        tokenOut: item.action_tokens ? JSON.parse(item.action_tokens)[0] : '',
        recoverDetails: {
          amount: item.action_amount
        }
      }
    };
  };

  const historyArray = historyData
    .map(formatHistoryData)
    .sort((a, b) => b.timestamp - a.timestamp);

  const groupedHistory = historyArray.reduce((groups: Record<string, typeof historyArray>, item) => {
    const date = formatDate(item.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="px-5 py-4 pb-8">
      <div className="flex items-center justify-between w-full">
        <IconLeft className="cursor-pointer" onClick={onBack}/>
        <div className="font-montserrat text-2xl font-semibold">
          History
        </div>
        <div className="w-6"></div>
      </div>
      
      <div className="mt-5 max-h-[520px] overflow-y-auto mb-5">
        {
          isLoading ? (
            <div className="space-y-3">
              <Skeleton height={60} borderRadius={10} />
              <Skeleton height={60} borderRadius={10} className="mt-4" />
              <Skeleton height={60} borderRadius={10} className="mt-4" />
              <Skeleton height={60} borderRadius={10} className="mt-4" />
              <Skeleton height={60} borderRadius={10} className="mt-4" />
            </div>
          ) : historyArray.length > 0 ? (
            Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="mb-6">
                <div className="font-Montserrat text-base font-medium mb-3">
                  {date}
                </div>
                <div className="space-y-3">
                  {items.map((item) => {
                    const type = mapStatusToType(item.status);
                    const amount = item.details?.recoverDetails?.amount || '0';
                    const token = item.details?.tokenOut || 'NEAR';
                    
                    return (
                      <div key={item.hash} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getHistoryIcon(type)}
                          <div className="font-Montserrat text-base capitalize font-[600]">{type}</div>
                        </div>
                        <div className="font-Montserrat text-right">
                          <div className="text-base font-[600]">
                            {formatAmount(amount)} {token}
                          </div>
                          <div className="text-sm text-[#8A8A8A]">
                          {formatAmount(item.details.tvlusd)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <Empty mt={80} desc="No history yet" />
          )
        }
      </div>
    </div>
  );
};

export default History;