import useClickTracking from '@/hooks/use-click-tracking';
import { useEffect } from 'react';
import Laptop from './laptop';
import Mobile from './mobile';
import useIsMobile from '@/hooks/use-isMobile';
import { Column } from '@/components/flex-table';

const DashboardRecords = (props: Props) => {
  const { isReport = true } = props;
  const isMobile = useIsMobile();

  const { handleReport } = useClickTracking();

  useEffect(() => {
    if (!isReport) return;
    handleReport(isMobile ? '1018-003' : '1002-003');
  }, [isMobile, isReport]);

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
};

export default DashboardRecords;

interface Props {
  loading?: boolean;
  records?: any;
  hasMore?: boolean;
  pageIndex: number;
  pageTotal: number;
  isReport?: boolean;
  showHeader?: boolean;
  tableBodyClassName?: string | ((record: any, index: number) => string);
  className?: string;
  onNext(): void;
  onPrev(): void;
  formatColumns?(columns: Column[]): Column[];
}
