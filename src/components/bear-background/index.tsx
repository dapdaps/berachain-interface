import Laptop from './laptop';
import Mobile from './mobile';

export default function BearBackground(props: any) {
  return (
    <>
      <Laptop {...props} />
      <Mobile {...props} />
    </>
  );
}
