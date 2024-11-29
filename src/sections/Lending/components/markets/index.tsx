import useIsMobile from '@/hooks/use-isMobile';
import MarketsMobile from '@/sections/Lending/components/markets/mobile';
import MarketsLaptop from '@/sections/Lending/components/markets/laptop';

const Markets = (props: Props) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MarketsMobile {...props} />
  ) : (
    <MarketsLaptop {...props} />
  );
};

export default Markets;

export interface Props {
  loading?: boolean;
  loadingLength?: number;
  laptopGridCols?: string;
  columns: {
    title: string;
    dataIndex: string;
    type?: 'asset' | 'assets' | 'action';
    skeletonWidth?: number;
    style?(market: any, index: number): any;
    render?(text: any, market: any, index: number): any;
    actionDisabled?(market: any, index: number): { deposit?: boolean; withdraw?: boolean; };
  }[];
  markets: any;
  onSuccess?: any;
  isSwap?: boolean;
  depositPanel?: any;
  withdrawPanel?: any;
  onDeposit?(market: any, index: number): void;
  onWithdraw?(market: any, index: number): void;
}
