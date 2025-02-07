import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useChainsStore = create(
  persist(
    (set, get: any) => ({
      chains: [
        {
          id: 21,
          chain_id: 80094,
          priority: 0,
          name: "Berachain Mainnet",
          technology: "",
          description: "",
          sub_description: "",
          native_currency: "",
          tbd_token: "Y",
          logo: "https://s3.amazonaws.com/dapdap.main/images/bera-chainicon.png",
          rpc: '["https://rpc.berachain.com"]',
          block_explorer: "https://berascan.com/",
          milestones: "",
          tag: "berachain",
          deepdive: false,
          show: true
        }
      ],
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_chains",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
