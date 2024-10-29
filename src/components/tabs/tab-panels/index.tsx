import Laptop from './laptop';
import Mobile from './mobile';

export default function TabPanels(props: any) {
  return (
    <>
      <Laptop {...props} />
      <Mobile {...props} />
    </>
  );
}
