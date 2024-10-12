'use client';

import List from './list';
import Tab from './components/tab';
import LiquidityList from './components/liquidity';

export default function Liquidity() {
  return (
    <List>
      <Tab index={1}>
        <LiquidityList />
      </Tab>
    </List>
  );
}
