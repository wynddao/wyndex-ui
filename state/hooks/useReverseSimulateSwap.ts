import { useRecoilValue } from "recoil";
import { MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { SimulateSwapOperationsResponse, SwapOperation } from "../clients/types/WyndexMultiHop.types";
import { WyndexMultiHopSelectors } from "../recoil";

interface UseReverseSimulateSwapResponse {
  reverseSimulatedSwap: SimulateSwapOperationsResponse;
}

export const useReverseSimulateSwap = (
  askAmount: string,
  operations: SwapOperation[],
): UseReverseSimulateSwapResponse => {
  try {
    const reverseSimulatedSwap = useRecoilValue(
      WyndexMultiHopSelectors.simulateReverseSwapOperationsSelector({
        contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
        params: [{ askAmount, operations, referral: false }],
      }),
    );

    return { reverseSimulatedSwap };
  } catch (err) {
    return {
      reverseSimulatedSwap: {
        amount: "0",
        commission_amounts: [],
        referral_amount: { amount: "0", info: { native: "" } },
        spread: "",
        spread_amounts: [],
      },
    };
  }
};
