import { ExecuteInstruction } from "@cosmjs/cosmwasm-stargate";
import { Asset, CW20Asset } from "@wynddao/asset-list";
import { ExecuteResult } from "cosmwasm";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { signingCosmWasmStargateClientAtom } from "../recoil";

interface SwapParams {
  address: string;
  multihop_msg: Record<string, unknown>;
  asset: Asset;
  amount: string;
}

interface SwapHook {
  swap: ({ address, multihop_msg, asset, amount }: SwapParams) => Promise<ExecuteResult>;
}

export const useSwap = (): SwapHook => {
  const client = useRecoilValue(signingCosmWasmStargateClientAtom);
  const swap = useCallback(
    ({ address, multihop_msg, asset, amount }: SwapParams) => {
      if (!client) throw new Error("CosmWasm Client was not instantiated");
      const msgs: ExecuteInstruction[] = [];

      console.log(multihop_msg);

      if (asset.tags.includes("cw20")) {
        const msg: ExecuteInstruction = {
          contractAddress: (asset as CW20Asset).token_address,
          msg: {
            increase_allowance: {
              amount,
              spender: MULTI_HOP_CONTRACT_ADDRESS,
            },
          },
          funds: [],
        };
        msgs.push(msg);
      }

      const msg: ExecuteInstruction = {
        contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
        msg: { execute_swap_operations: { ...multihop_msg } },
        funds: asset.tags.includes("cw20") ? [] : [{ amount, denom: asset.denom }],
      };

      msgs.push(msg);

      console.log(JSON.stringify(msgs));

      return client.executeMultiple(address, msgs, "auto", undefined);
    },
    [client],
  );

  return { swap };
};
