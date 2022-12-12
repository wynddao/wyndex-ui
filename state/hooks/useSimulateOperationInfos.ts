import { useRecoilValue } from "recoil";
import { MULTI_HOP_CONTRACT_ADDRESS } from "../../utils";
import { SwapOperation } from "../clients/types/WyndexMultiHop.types";
import { WyndexMultiHopSelectors } from "../recoil";

interface UseSimulateOperationInfosResponse {
  simulatedOperation: string;
}

export const useSimulateOperationInfos = (
  offerAmount: string,
  operations: SwapOperation[],
): UseSimulateOperationInfosResponse => {
  const simulatedOperation = useRecoilValue(
    WyndexMultiHopSelectors.simulateSwapOperationsSelector({
      contractAddress: MULTI_HOP_CONTRACT_ADDRESS,
      params: [{ offerAmount, operations, referral: false }],
    }),
  ).amount;

  return {
    simulatedOperation,
  };
};
