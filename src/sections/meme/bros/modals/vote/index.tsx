import useIsMobile from '@/hooks/use-isMobile';
import Mobile from './mobile';
import Laptop from './laptop';

export default function Vote() {
  const isMobile = useIsMobile();

  return isMobile ? <Mobile /> : <Laptop />
}
