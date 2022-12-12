import { SigningCosmWasmClient as SigningCosmWasmStargateClient } from "@cosmjs/cosmwasm-stargate";
import { atom } from "recoil";

export const signingCosmWasmStargateClientAtom = atom<SigningCosmWasmStargateClient | undefined>({
  key: "signingCosmWasmStargateClient",
  dangerouslyAllowMutability: true,
});
