import { forwardRef } from 'react';
import V2 from './v2';
import V3 from './v3';

export default forwardRef(function RemoveLiquidity(
  { version, ...rest }: any,
  ref: any
) {
  if (version === 'v2') {
    return <V2 {...rest} />;
  }
  if (version === 'v3') {
    return <V3 {...rest} ref={ref} />;
  }
});
