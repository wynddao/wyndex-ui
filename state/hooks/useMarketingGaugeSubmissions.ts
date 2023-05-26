import { useRecoilValue } from "recoil";
import { AllSubmissionsResponse } from "../clients/types/WyndexGaugeAdapter.types";
import { GaugeResponse } from "../clients/types/WyndexGaugeOrchestrator.types";
import { WyndGaugeAdapterSelectors } from "../recoil";

interface UseMarketingGaugeSubmissionsResponse {
  submissions: AllSubmissionsResponse;
}

export const useMarketingGaugeSubmissions = (gauge: GaugeResponse): UseMarketingGaugeSubmissionsResponse => {
  const submissions = useRecoilValue(
    WyndGaugeAdapterSelectors.allSubmissionsSelector({
      contractAddress: gauge.adapter,
      params: [],
    }),
  );
  return {
    submissions,
  };
};
