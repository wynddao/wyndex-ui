import { selectorFamily } from "recoil";
import { CustomClient } from "../../../clients/Custom.client";
import { signingCosmWasmClientAtom } from "../../atoms";

export type ExecuteClientParams = {
  sender: string;
};
export const executeClient = selectorFamily<CustomClient | undefined, ExecuteClientParams>({
  key: "cw20ExecuteClient",
  get:
    ({ sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmClientAtom);
      if (!client) return;
      //@ts-ignore
      return new CustomClient(client, sender);
    },
  dangerouslyAllowMutability: true,
});
