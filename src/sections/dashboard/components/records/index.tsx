import useClickTracking from '@/hooks/use-click-tracking';
import { useEffect } from 'react';
import Laptop from './laptop';
import Mobile from './mobile';
import useIsMobile from '@/hooks/use-isMobile';

const DashboardRecords = (props: Props) => {
  const isMobile = useIsMobile();

  const { handleReport } = useClickTracking();

  useEffect(() => {
    handleReport('1002-003');
  }, []);

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
};

export default DashboardRecords;

interface Props {
  loading?: boolean;
  records?: any;
  hasMore?: boolean;
  pageIndex: number;
  pageTotal: number;
  onNext(): void;
  onPrev(): void;
}
