import Laptop from './laptop';
import Mobile from './mobile';
import useIsMobile from '@/hooks/use-isMobile';

export default function Liquidity(props: any) {
  const isMobile = useIsMobile();

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}
