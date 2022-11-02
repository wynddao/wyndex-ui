import { atom } from "recoil";

export const myAddressAtom = atom<string | null>({
  key: "myAddress",
  default: null,
});
