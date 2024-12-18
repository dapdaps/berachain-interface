import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RpcState = {
  visible: boolean;
  alert: boolean;
  selected: any;
  ping: Partial<Record<any, number>>;
};

type RpcStore = RpcState & {
  setVisible: (visible: boolean) => void;
  setAlert: (alert: boolean) => void;
  setSelected: (rpc: any) => void;
  setPing: (ping: Partial<Record<any, number>>) => void;
  set: (state: Partial<RpcState>) => void;
};

export const useRpcStore = create(
  persist<RpcStore>(
    (set) => ({
      visible: false,
      alert: false,
      selected: "default",
      ping: {},
      setVisible: (visible: boolean) => {
        set({ visible });
      },
      setSelected: (rpc: any) => {
        set({ selected: rpc });
      },
      setAlert: (alert: boolean) => {
        set({ alert });
      },
      setPing: (ping) => {
        set((prev) => ({
          ...prev,
          ping: {
            ...prev.ping,
            ...ping
          }
        }));
      },
      set: (state) => {
        set((prev) => ({ ...prev, ...state }));
      }
    }),
    {
      name: "_DAPDAP_RPC_STORAGE",
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        ({ selected: state.selected, ping: state.ping } as any)
    }
  )
);
