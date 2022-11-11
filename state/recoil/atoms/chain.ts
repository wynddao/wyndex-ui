import { SigningCosmWasmClient } from "cosmwasm";
import { SigningCosmWasmClient as SigningCosmWasmStargateClient } from "@cosmjs/cosmwasm-stargate";
import { atom } from "recoil";

export const signingCosmWasmClientAtom = atom<SigningCosmWasmClient | undefined>({
  key: "signingCosmWasmClient",
  dangerouslyAllowMutability: true,
});

export const signingCosmWasmStargateClientAtom = atom<SigningCosmWasmStargateClient | undefined>({
  key: "signingCosmWasmStargateClient",
  dangerouslyAllowMutability: true,
});

export const myAddressAtom = atom<number | null>({
  key: "myAddress",
  default: null,
});
