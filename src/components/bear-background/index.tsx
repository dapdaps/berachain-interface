import Laptop from './laptop';
import Mobile from './mobile';
import useIsMobile from '@/hooks/use-isMobile';

export default function BearBackground(props: any) {
  const isMobile = useIsMobile();
  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}
