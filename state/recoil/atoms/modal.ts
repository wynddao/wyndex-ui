import { atom } from "recoil";

export const depositIbcModalOpenAtom = atom<boolean>({
  key: "depositIbcModalOpen",
  default: false,
});

export const withdrawIbcModalOpenAtom = atom<boolean>({
  key: "withdrawIbcModalOpen",
  default: false,
});
