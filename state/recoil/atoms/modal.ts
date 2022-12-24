import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

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

const { persistAtom } = recoilPersist();

export const tosModalAtom = atom<boolean>({
  key: "tosModal",
  default: true,
  effects_UNSTABLE: [persistAtom],
});
