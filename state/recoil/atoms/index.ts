import { atom } from "recoil";

export const myAddressAtom = atom<number | null>({
  key: "myAddress",
  default: null,
});
