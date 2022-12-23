import { atom } from "recoil";

interface IbcModalState {
  readonly isOpen: boolean;
  readonly chainId?: string | null;
}

export const depositIbcModalAtom = atom<IbcModalState>({
  key: "depositIbcModal",
  default: { isOpen: false },
});

export const withdrawIbcModalAtom = atom<IbcModalState>({
  key: "withdrawIbcModal",
  default: { isOpen: false },
});
