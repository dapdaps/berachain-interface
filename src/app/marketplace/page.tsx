// import MarketPlaceView from '@/sections/marketplace';
import AddLiquidity from '@/sections/liquidity/remove-liquidity-modal';

const MarketPlace = () => {
  return (
    <AddLiquidity
      dex='bex'
      token0={{
        address: 'native',
        isNative: true,
        chainId: 80084,
        symbol: 'BERA',
        decimals: 18,
        name: 'BERA',
        icon: '/assets/tokens/bera.svg'
      }}
      token1={{
        address: '0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03',
        chainId: 80084,
        symbol: 'HONEY',
        decimals: 18,
        name: 'HONEY',
        icon: '/images/dapps/honey.png'
      }}
    />
  );
};

export default MarketPlace;
