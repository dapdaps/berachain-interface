import { beraB } from '@/configs/tokens/bera-bArtio';

export default {
  name: 'Infrared',
  icon: '/images/dapps/infrared.svg',
  ICON_VAULT_MAP: {
    'HONEY-WBERA':
      'https://www.infrared.finance/_next/image?url=%2Fassets%2Ficons%2Fhoney-wbera.png&w=64&q=75',
    BHONEY:
      'https://www.infrared.finance/_next/static/media/bhoney.7829fa2c.svg',
    'HONEY-USDC':
      'https://www.infrared.finance/_next/image?url=%2Fassets%2Ficons%2Fhoney-usdc.png&w=64&q=75',
    'HONEY-WETH':
      'https://www.infrared.finance/_next/image?url=%2Fassets%2Ficons%2Fhoney-weth.png&w=64&q=75',
    'HONEY-WBTC':
      'https://www.infrared.finance/_next/image?url=%2Fassets%2Ficons%2Fhoney-wbtc.png&w=64&q=75'
  },
  chains: {
    80084: {
      ALL_DATA_URL:
        'https://api.staging.infrared.finance/v2/vaults?offset=0&limit=9999',
      BHONEY_ADDRESS: '0x7d91Bf5851B3A8bCf8C39A69AF2F0F98A4e2202A',
      IBGT_ADDRESS: '0x46eFC86F0D7455F135CC9df501673739d513E982',
      pairs: [
        {
          id: 'HONEY-WETH',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['HONEY', 'WETH'],
          images: [
            '/images/dapps/infrared/honey.svg',
            '/images/dapps/infrared/weth.svg'
          ],
          decimals: 18,
          decimals0: 18,
          decimals1: 18,
          LP_ADDRESS: '0x50f7d4da89f720fbfb35be369f34c6b51e2cada1'
        },
        {
          id: 'HONEY-USDC',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['HONEY', 'USDC'],
          images: [
            '/images/dapps/infrared/honey.svg',
            '/images/dapps/infrared/usdc.svg'
          ],
          decimals: 18,
          decimals0: 18,
          decimals1: 6,
          LP_ADDRESS: '0xd69adb6fb5fd6d06e6ceec5405d95a37f96e3b96'
        },
        {
          id: 'BHONEY',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['bHONEY'],
          images: ['/images/dapps/infrared/bhoney.svg'],
          decimals: 18,
          decimals0: 18,
          decimals1: 18,
          LP_ADDRESS: '0x1306d3c36ec7e38dd2c128fbe3097c2c2449af64'
        },
        {
          id: 'HONEY-STGUSDC',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['HONEY', 'STGUSDC'],
          images: [
            '/images/dapps/infrared/honey.svg',
            '/images/dapps/infrared/usdc.svg'
          ],
          decimals: 18,
          decimals0: 18,
          decimals1: 6,
          LP_ADDRESS: '0xb73dee52f38539ba854979eab6342a60dd4c8c03'
        },
        {
          id: 'iBGT-HONEY',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['iBGT'],
          images: ['/images/dapps/infrared/ibgt.svg'],
          decimals: 18,
          decimals0: 18,
          decimals1: 18,
          LP_ADDRESS: '0x46eFC86F0D7455F135CC9df501673739d513E982'
        },
        {
          id: 'HONEY-WBERA',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['HONEY', 'WBERA'],
          images: [
            '/images/dapps/infrared/honey.svg',
            '/assets/tokens/wbera.png'
          ],
          decimals: 18,
          decimals0: 18,
          decimals1: 18,
          LP_ADDRESS: '0xd28d852cbcc68dcec922f6d5c7a8185dbaa104b7'
        },
        {
          id: 'WBERA-tHPOT',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['WBERA', 'tHPOT'],
          images: ['/assets/tokens/wbera.png', '/assets/tokens/thpot.svg'],
          decimals: 18,
          decimals0: 18,
          decimals1: 18,
          LP_ADDRESS: '0x28fec64eabc1e4af7f5cd33d2bd20b01d5e8f203'
        },
        {
          id: 'HONEY-WBTC',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['HONEY', 'WBTC'],
          images: [
            '/images/dapps/infrared/honey.svg',
            '/images/dapps/infrared/wbtc.svg'
          ],
          decimals: 18,
          decimals0: 18,
          decimals1: 8,
          LP_ADDRESS: '0x9df84a72e6eb08ecd074626b931c93f92a134e23'
        },
        {
          id: 'NECT-HONEY',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['NECT', 'HONEY'],
          images: [
            '/assets/tokens/nectar.png',
            '/images/dapps/infrared/honey.svg'
          ],
          decimals: 18,
          decimals0: 18,
          decimals1: 18,
          LP_ADDRESS: '0x63b0edc427664d4330f72eec890a86b3f98ce225'
        },
        {
          id: 'YEET-BERA',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['YEET', 'BERA'],
          images: ['/assets/tokens/YEET.png', '/assets/tokens/bera.svg'],
          decimals: 18,
          decimals0: 18,
          decimals1: 18,
          LP_ADDRESS: '0xe5a2ab5d2fb268e5ff43a5564e44c3309609aff9'
        },
        {
          id: 'iBGT-WBERA',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['iBGT', 'WBERA'],
          images: ['/assets/tokens/ibgt.png', '/assets/tokens/wbera.png'],
          decimals: 18,
          decimals0: 18,
          decimals1: 18,
          LP_ADDRESS: '0x7fd165b73775884a38aa8f2b384a53a3ca7400e6'
        },
        {
          id: 'sNECT',
          strategy: 'Dynamic',
          strategy2: '',
          tokens: ['sNECT'],
          images: ['/assets/tokens/nectar.png'],
          decimals: 18,
          decimals0: 18,
          decimals1: 18,
          LP_ADDRESS: '0x3a7f6f2f27f7794a7820a32313f4a68e36580864'
        }
      ],
      addresses: {
        HONEY: '0x0e4aaf1351de4c0264c5c7056ef3777b41bd8e03',
        WBERA: '0x7507c1dc16935b82698e4c63f2746a2fcf994df8',
        iBGT: '0x46efc86f0d7455f135cc9df501673739d513e982',
        iRED: '0xe9eea54fb348b8b4a350fe88ae8db6e1a7a39ae0',
        USDC: '0xd6d83af58a19cd14ef3cf6fe848c9a4d21e5727c',
        WETH: '0x6e1e9896e93f7a71ecb33d4386b49deed67a231a',
        'HONEY-WBERA': '0x5c5f9a838747fb83678ece15d85005fd4f558237',
        VDHONEY: '0xe1d93e7106fd449f782c58463f19e6b87cbabf89',
        BHONEY: '0x7d91bf5851b3a8bcf8c39a69af2f0f98a4e2202a',
        'HONEY-USDC': '0x675547750f4acdf64ed72e9426293f38d8138ca8',
        'HONEY-WETH': '0xA9480499b1fAeAf225cEb88ADe69de10b7f86c1e',
        'HONEY-WBTC': '0x1d7a0f63a723eff12dfb3a6944daab59840d78c8',
        'iBGT-HONEY': '0x31e6458c83c4184a23c761fdaffb61941665e012',
        'HONEY-STGUSDC': '0x1b602728805ca854e0dfdbbba9060345fb26bc20',
        'WBERA-tHPOT': '0x14e88b348a577209fbf1b68566f1115fe88d5a3a',
        'NECT-HONEY': '0x584084216b8d0193eb26f6e28466535f29f3b20c',
        'YEET-BERA': '0x89daff790313d0cc5cc9971472f0c73a19d9c167',
        'iBGT-WBERA': '0x763f65e5f02371ad6c24bd60bccb0b14e160d49b',
        sNECT: '0x0004f1f316d33cb1a17b3be0de9aeea3909fafd8'
      }
    }
  }
};
