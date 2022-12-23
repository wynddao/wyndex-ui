import { useRecoilValue } from "recoil";
import { MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { SimulateSwapOperationsResponse, SwapOperation } from "../clients/types/WyndexMultiHop.types";
import { WyndexMultiHopSelectors } from "../recoil";

interface UseSimulateOperationInfosResponse {
  simulatedOperation: SimulateSwapOperationsResponse;
}

export const useSimulateOperationInfos = (
  offerAmount: string,
  operations: SwapOperation[],
): UseSimulateOperationInfosResponse => {
  try {
    const simulatedOperation = useRecoilValue(
      WyndexMultiHopSelectors.simulateSwapOperationsSelector({
        contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
        params: [{ offerAmount, operations, referral: false }],
      }),
    );

    return {
      simulatedOperation,
    };
  } catch (err) {
    return {
      simulatedOperation: {
        amount: "0",
        commission_amounts: [],
        referral_amount: { amount: "0", info: { native: "" } },
        spread: "",
        spread_amounts: [],
      },
    };
  }
};
