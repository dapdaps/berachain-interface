import { getDappLogo } from '@/sections/dashboard/utils';

const ROUTE_CONFIG = {
  infrared: {
    type: 'staking',
    theme: {
      '--button-color': '#FFF',
      '--button-text-color': '#1E2028'
    },
    icon: 'images/dapps/infrared.svg'
  },
  berps: {
    type: 'staking',
    theme: {
      '--button-color': '#FFF',
      '--button-text-color': '#1E2028'
    },
    icon: '/images/dapps/infrared/berps.svg'
  },
  aquabera: {
    type: 'staking',
    theme: {
      '--button-color': '#FFF',
      '--button-text-color': '#1E2028'
    },
    icon: '/images/dapps/infrared/aquabera.png'
  },
  bedrock: {
    type: 'staking',
    theme: {
      '--button-color': '#FFF',
      '--button-text-color': '#1E2028'
    },
    icon: '/images/dapps/bedrock.svg'
  },
  berapaw: {
    type: 'staking',
    theme: {
      '--button-color': '#FFF',
      '--button-text-color': '#1E2028'
    },
    icon: getDappLogo("BeraPaw")
  },
};

export default ROUTE_CONFIG;
