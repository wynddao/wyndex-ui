import { atom } from "recoil";

export interface TxModalState {
  height: number | undefined;
  txHash: string | undefined;
  active: boolean;
  loading: boolean;
  error: string | undefined;
}

export const txModalAtom = atom<TxModalState>({
  key: "txModal",
  dangerouslyAllowMutability: true,
  default: {
    height: undefined,
    txHash: undefined,
    active: false,
    loading: false,
    error: undefined,
  },
});
