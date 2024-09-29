import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import bendConfig from '@/configs/lending/dapps/bend';

interface NetworkConfig {
  config: object; 
  CONTRACT_ABI?: {
    wrappedTokenGatewayV3ABI: string;
    erc20Abi: string;
    aavePoolV3ABI: string;
    variableDebtTokenABI: string;
  };
}

interface AaveStore {
  config: object | null;
  network: any;
  fetchConfig: (chainId: number) => Promise<void>;
}

const useAaveConfig = create<AaveStore>()(
  // persist(
  //   (set) => ({
  //     config: null,
  //     network: null,
  //     fetchConfig: async (chainId: number) => {
  //       const network: NetworkConfig | undefined = bendConfig.networks[chainId as keyof typeof bendConfig.networks];
  //       const { CONTRACT_ABI } = network || {};
  //       if (!CONTRACT_ABI) return;

  //       try {
  //         const [
  //           wrappedTokenGatewayV3ABI,
  //           erc20Abi,
  //           aavePoolV3ABI,
  //           variableDebtTokenABI
  //         ] = await Promise.all([
  //           fetch(CONTRACT_ABI.wrappedTokenGatewayV3ABI).then((res) => res.json()),
  //           fetch(CONTRACT_ABI.erc20Abi).then((res) => res.json()),
  //           fetch(CONTRACT_ABI.aavePoolV3ABI).then((res) => res.json()),
  //           fetch(CONTRACT_ABI.variableDebtTokenABI).then((res) => res.json())
  //         ]);

  //         const constants = {
  //           FIXED_LIQUIDATION_VALUE: '1.0',
  //           MAX_UINT_256: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  //           AAVE_API_BASE_URL: 'https://aave-data-service-7a85eea3aebe.herokuapp.com'
  //         };

  //         const finalConfig = {
  //           ...network.config,
  //           ...constants,
  //           erc20Abi,
  //           aavePoolV3ABI,
  //           variableDebtTokenABI,
  //           wrappedTokenGatewayV3ABI
  //         };
  //         set({ config: finalConfig, network });
  //       } catch (error) {
  //         console.error('Error fetching AAVE3 config:', error);
  //       }
  //     },
  //   }),
  //   {
  //     name: 'aave-config',
  //     version: 0.1,
  //     storage: createJSONStorage(() => localStorage),
  //   }
  // )
  (set) => ({
    config: null,
    network: null,
    fetchConfig: async (chainId: number) => {
      const network: NetworkConfig | undefined = bendConfig.networks[chainId as keyof typeof bendConfig.networks];
      const { CONTRACT_ABI } = network || {};
      if (!CONTRACT_ABI) return;

      try {
        const [
          wrappedTokenGatewayV3ABI,
          erc20Abi,
          aavePoolV3ABI,
          variableDebtTokenABI
        ] = await Promise.all([
          fetch(CONTRACT_ABI.wrappedTokenGatewayV3ABI).then((res) => res.json()),
          fetch(CONTRACT_ABI.erc20Abi).then((res) => res.json()),
          fetch(CONTRACT_ABI.aavePoolV3ABI).then((res) => res.json()),
          fetch(CONTRACT_ABI.variableDebtTokenABI).then((res) => res.json())
        ]);

        const constants = {
          FIXED_LIQUIDATION_VALUE: '1.0',
          MAX_UINT_256: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          AAVE_API_BASE_URL: 'https://aave-data-service-7a85eea3aebe.herokuapp.com'
        };

        const finalConfig = {
          ...network.config,
          ...constants,
          erc20Abi,
          aavePoolV3ABI,
          variableDebtTokenABI,
          wrappedTokenGatewayV3ABI
        };
        set({ config: finalConfig, network });
      } catch (error) {
        console.error('Error fetching AAVE3 config:', error);
      }
    },
  }),
);

export default useAaveConfig;
