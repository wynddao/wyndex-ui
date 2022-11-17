import { useRecoilValue } from "recoil";
import { FACTORY_CONTRACT_ADDRESS } from "../../utils";
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
      contractAddress: FACTORY_CONTRACT_ADDRESS,
      params: [{ offerAmount, operations }],
    }),
  ).amount;

  return {
    simulatedOperation,
  };
};
