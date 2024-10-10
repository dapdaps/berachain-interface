'use client';

import Bex from './bex/yours';
import Kodiak from './kodiak/yours';

const Panel = ({ dex, ...rest }: any) => {
  if (dex?.toLowerCase() === 'bex') return <Bex {...rest} />;
  if (dex?.toLowerCase() === 'kodiak') return <Kodiak {...rest} />;
};

export default function Yours({ dex }: any) {
  return <Panel dex={dex} />;
}
