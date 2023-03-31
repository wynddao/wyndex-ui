import { useRecoilValue } from "recoil";
import { MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { SimulateSwapOperationsResponse, SwapOperation } from "../clients/types/WyndexMultiHop.types";
import { WyndexMultiHopSelectors } from "../recoil";

interface UseSimulateSwapResponse {
  simulatedSwap: SimulateSwapOperationsResponse;
}

export const useSimulateSwap = (
  offerAmount: string,
  operations: SwapOperation[],
): UseSimulateSwapResponse => {
  try {
    const simulatedSwap = useRecoilValue(
      WyndexMultiHopSelectors.simulateSwapOperationsSelector({
        contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
        params: [{ offerAmount, operations, referral: false }],
      }),
    );
    return { simulatedSwap };
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
