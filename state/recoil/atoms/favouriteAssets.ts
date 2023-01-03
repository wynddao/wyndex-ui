import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const favAtom = atom<string[]>({
  key: "favAssets",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
