import Laptop from './laptop';
import Mobile from './mobile';
import useIsMobile from '@/hooks/use-isMobile';

export default function TabPanels(props: any) {
  const isMobile = useIsMobile();
  
  return isMobile && !props.isCard ? (
    <Mobile {...props} />
  ) : (
    <Laptop {...props} />
  );
}
