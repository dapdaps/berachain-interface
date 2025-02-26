import { Token } from '@/types';

export interface TokenInfo extends Token {
  APR: string;
  APY: string;
  balance: string;
  balanceShown: string;
  walletBalance: string;
  walletBalanceShown: string;
}

export interface TabPanelProps {
  totalBalance: string;
  totalRate: string;
  rateName: string;
  tokens: TokenInfo[];
  showRateSwitch?: boolean;
  rateKey: 'APY' | 'APR',
  rateOrder: 'asc' | 'desc',
  totalRateLabel: string;
  totalBalanceLabel: string;
  loading?: boolean;
  CHAIN_ID: number;
  setRateKey: (rateKey: 'APY' | 'APR') => void;
  setRateOrder: (rateOrder: 'asc' | 'desc') => void;
  onSuccess?(): void;
}

export const Tabs: any = [
  { value: 'APY', label: 'APY' },
  { value: 'APR', label: 'APR' },
];
