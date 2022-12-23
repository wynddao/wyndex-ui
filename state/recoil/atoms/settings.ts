import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
export type Currency = "EUR" | "USD";

export const currencyAtom = atom<Currency>({
  key: "currency",
  default: "USD",
  effects_UNSTABLE: [persistAtom],
});
