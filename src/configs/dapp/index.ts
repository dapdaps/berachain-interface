import lending from './lending';
import staking from './staking';
import swap from './swap';
import swapDApps from '../swap';
import stakingDApps from '../staking';
import lendingDApps from '../lending';

export default {
  ...swap,
  ...lending,
  ...staking
} as { [key: string]: any };

export const dAppsInfo = [
  ...Object.values(swapDApps).map((it) => ({
    name: it.name,
    icon: it.icon,
    path: it.path,
  })),
  ...Object.values(stakingDApps).map((it) => ({
    name: it.name,
    icon: it.icon,
    path: it.path,
  })),
  ...Object.values(lendingDApps).map((it) => ({
    name: it.basic.name,
    icon: it.basic.icon,
    path: it.basic.path,
  })),
];
