/* eslint-disable react-hooks/rules-of-hooks */
import { constSelector, useRecoilValue } from "recoil";
import { MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { SimulateSwapOperationsResponse, SwapOperation } from "../clients/types/WyndexMultiHop.types";
import { AssetInfo } from "../clients/types/WyndexPair.types";
import { WyndexMultiHopSelectors, WyndexPairSelectors } from "../recoil";

interface UseSimulateSwapResponse {
  simulatedSwap: SimulateSwapOperationsResponse;
}

export const useSimulateSwap = (
  offerAmount: string,
  operations: SwapOperation[],
): UseSimulateSwapResponse => {
  const isWyJunoSwap =
    // @ts-ignore
    operations[0].wyndex_swap.ask_asset_info.token ===
      "juno1naunqzk6jseqeqhq43nm6kdneraws2rkmteprjzppw6j9xcrurxqx0ld9e" ||
    // @ts-ignore
    operations[0].wyndex_swap.offer_asset_info.token ===
      "juno1naunqzk6jseqeqhq43nm6kdneraws2rkmteprjzppw6j9xcrurxqx0ld9e";
  let simulatedSwapWyndexPair;
  try {
    simulatedSwapWyndexPair = useRecoilValue(
      isWyJunoSwap
        ? WyndexPairSelectors.simulationSelector({
            contractAddress: "juno1f9c60hyvzys5h7q0y4e995n8r9cchgpy8p3k4kw3sqsmut95ankq0chfv0",
            params: [
              {
                askAssetInfo: operations[0].wyndex_swap.ask_asset_info as AssetInfo,
                offerAsset: { info: operations[0].wyndex_swap.offer_asset_info, amount: offerAmount },
                referral: false,
              },
            ],
          })
        : constSelector({ return_amount: "0", commission_amount: "0", spread_amount: "0" }),
    );
  } catch (err) {
    simulatedSwapWyndexPair = { return_amount: "0", commission_amount: "0", spread_amount: "0" };
  }

  try {
    const simulatedSwap = useRecoilValue(
      !isWyJunoSwap
        ? WyndexMultiHopSelectors.simulateSwapOperationsSelector({
            contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
            params: [{ offerAmount, operations, referral: false }],
          })
        : constSelector({
            amount: simulatedSwapWyndexPair.return_amount,
            commission_amounts: [
              {
                amount: simulatedSwapWyndexPair.commission_amount,
                info: operations[0].wyndex_swap.offer_asset_info,
              },
            ],
            referral_amount: {
              amount: "0",
              info: operations[0].wyndex_swap.offer_asset_info,
            },
            spread: "0",
            spread_amounts: [
              {
                amount: "0",
                info: operations[0].wyndex_swap.offer_asset_info,
              },
            ],
          }),
    );

    return {
      simulatedSwap,
    };
  } catch (err) {
    return {
      simulatedSwap: {
        amount: "0",
        commission_amounts: [],
        referral_amount: { amount: "0", info: { native: "" } },
        spread: "",
        spread_amounts: [],
      },
    };
  }
};
