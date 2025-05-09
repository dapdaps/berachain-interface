import { create } from 'zustand';

type PriceState = {
  price: { [key: string]: string };
  beraTownPrice: { [key: string]: string };
};

type PriceStore = PriceState & {
  set: (update: PriceState) => void;
};

export const usePriceStore = create<PriceStore>((set) => ({
  price: {},
  beraTownPrice: {},
  set: (params) => set(() => ({ ...params })),
}));
