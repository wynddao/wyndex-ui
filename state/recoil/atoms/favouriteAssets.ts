import { Asset } from "@wynddao/asset-list";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const favAtom = atom<Asset[]>({
  key: "fav",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
