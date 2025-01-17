import { FC } from 'react';
import IconLeft from '@public/images/near-intents/icons/icon-left.svg';
import IconHistoryDeposited from '@public/images/near-intents/icons/history-deposited.svg';
import IconHistorySwapped from '@public/images/near-intents/icons/history-swapped.svg';
import IconHistoryWithdraw from '@public/images/near-intents/icons/history-withdraw.svg';

interface HistoryProps {
  onBack: () => void;
}

type HistoryType = 'deposit' | 'withdraw' | 'swapped';

interface HistoryItem {
  id: string;
  type: HistoryType;
  amount: string;
  token: string;
  usdValue: string;
  timestamp: number;
}

interface GroupedHistory {
  date: string;
  items: HistoryItem[];
}

const mockData: HistoryItem[] = [
  {
    id: '1',
    type: 'deposit',
    amount: '10',
    token: 'USDC',
    usdValue: '-$10.00',
    timestamp: 1705104000000, // Jan 13, 2024
  },
  {
    id: '2',
    type: 'withdraw',
    amount: '-10',
    token: 'USDC',
    usdValue: '-$10.00',
    timestamp: 1705104000000,
  },
  {
    id: '3',
    type: 'swapped',
    amount: '3.3512',
    token: 'NEAR',
    usdValue: '-$10.00',
    timestamp: 1705104000000,
  },
  {
    id: '4',
    type: 'deposit',
    amount: '10',
    token: 'USDC',
    usdValue: '-$10.00',
    timestamp: 1704844800000, // Jan 10, 2024
  },
];

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

const groupHistoryByDate = (history: HistoryItem[]): GroupedHistory[] => {
  const groups: { [key: string]: HistoryItem[] } = {};
  
  history.forEach(item => {
    const date = formatDate(item.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
  });

  return Object.entries(groups).map(([date, items]) => ({
    date,
    items,
  }));
};

const History: FC<HistoryProps> = ({ onBack }) => {
  const groupedHistory = groupHistoryByDate(mockData);

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
        {groupedHistory.length > 0 ? (
          groupedHistory.map((group) => (
            <div key={group.date} className="mb-6">
              <div className="font-Montserrat text-base font-medium mb-3">
                {group.date}
              </div>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getHistoryIcon(item.type)}
                      <div className="font-Montserrat text-base capitalize font-[600]">{item.type}</div>
                    </div>
                    <div className="font-Montserrat text-right">
                      <div className="text-base font-[600]">
                        {item.amount} {item.token}
                      </div>
                      <div className="text-sm text-[#8A8A8A]">{item.usdValue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No history yet</div>
        )}
      </div>
    </div>
  );
};

export default History;