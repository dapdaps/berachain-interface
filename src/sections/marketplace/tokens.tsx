'use client';

import List from './list';
import Tab from './components/tab';
import Token from './components/token';

export default function Tokens() {
  return (
    <List>
      <Tab index={0}>
        <Token />
      </Tab>
    </List>
  );
}
