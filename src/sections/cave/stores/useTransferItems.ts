import { create } from 'zustand';

type TransferItemsState = {
  transferItemsVisible: boolean;
  transferItem?: any;
  transferItems: any[];
  transferSelectedItems: any[];
  transferAddress?: string;
};

type TransferItemsStore = TransferItemsState & {
  setTransferItemsVisible: (visible: boolean) => void;
  setTransferItem: (item: any) => void;
  setTransferItems: (items: any[]) => void;
  setTransferSelectedItems: (items: any[]) => void;
  setTransferAddress: (address: string) => void;
};

export const useTransferItemsStore = create<TransferItemsStore>((set) => ({
  transferItemsVisible: false,
  transferItem: void 0,
  transferItems: [],
  transferSelectedItems: [],
  transferAddress: void 0,
  setTransferItemsVisible: (visible) => set(() => ({ transferItemsVisible: visible })),
  setTransferItem: (item) => set(() => ({ transferItem: item })),
  setTransferItems: (items) => set(() => ({ transferItems: items })),
  setTransferSelectedItems: (items) => set(() => ({ transferSelectedItems: items })),
  setTransferAddress: (address) => set(() => ({ transferAddress: address })),
}));
