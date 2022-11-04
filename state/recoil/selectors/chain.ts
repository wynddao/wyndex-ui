import { selector } from "recoil";
import { cosmWasmClientRouter, CHAIN_RPC_ENDPOINT } from "../../../utils";

export const cosmWasmClientSelector = selector({
  key: "cosmWasmClient",
  get: () => cosmWasmClientRouter.connect(CHAIN_RPC_ENDPOINT),
});