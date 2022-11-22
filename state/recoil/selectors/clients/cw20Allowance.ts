import { selectorFamily } from "recoil";
import { Cw20Client } from "../../../clients/Cw20Allowance.client";
import { signingCosmWasmClientAtom } from "../../atoms";

export type ExecuteClientParams = {
  sender: string;
};
export const executeClient = selectorFamily<Cw20Client | undefined, ExecuteClientParams>({
  key: "cw20ExecuteClient",
  get:
    ({ sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmClientAtom);
      if (!client) return;
      //@ts-ignore
      return new Cw20Client(client, sender);
    },
  dangerouslyAllowMutability: true,
});
