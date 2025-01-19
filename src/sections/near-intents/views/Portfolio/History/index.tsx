import { FC } from 'react';
import IconLeft from '@public/images/near-intents/icons/icon-left.svg';
import IconHistoryDeposited from '@public/images/near-intents/icons/history-deposited.svg';
import IconHistorySwapped from '@public/images/near-intents/icons/history-swapped.svg';
import IconHistoryWithdraw from '@public/images/near-intents/icons/history-withdraw.svg';
import Empty from '@/components/empty';
import { useHistoryStore } from '../../../providers/HistoryStoreProvider';
import { HistoryStatus } from '../../../stores/historyStore';

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

const History: FC<HistoryProps> = ({ onBack }) => {
  const { data } = useHistoryStore((state) => state);

  const historyArray = Array.from(data.values())
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
      
      <div className="mt-5 max-h-[600px] overflow-y-auto">
        {historyArray.length > 0 ? (
          Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="mb-6">
              <div className="font-Montserrat text-base font-medium mb-3">
                {date}
              </div>
              <div className="space-y-3">
                {items.map((item) => {
                  const type = mapStatusToType(item.status);
                  const amount = item.details?.recoverDetails?.receive?.amount || 
                               item.details?.recoverDetails?.amount || '0';
                  const token = item.details?.tokenOut || 'NEAR';
                  
                  return (
                    <div key={item.hash} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getHistoryIcon(type)}
                        <div className="font-Montserrat text-base capitalize font-[600]">{type}</div>
                      </div>
                      <div className="font-Montserrat text-right">
                        <div className="text-base font-[600]">
                          {amount} {token}
                        </div>
                        <div className="text-sm text-[#8A8A8A]">
                          {item.status}
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
        )}
      </div>
    </div>
  );
};

export default History;