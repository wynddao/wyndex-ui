import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";

import { WyndGaugeOrchestratorSelectors } from "../../recoil";

export const useGaugeAdapter = (id: number) => {
  const orchestratorAddress = process.env.NEXT_PUBLIC_GAUGE_ADDRESS as string;

  const { votes } = useRecoilValue(
    WyndGaugeOrchestratorSelectors.listVotesSelector({
      contractAddress: orchestratorAddress,
      params: [
        {
          gauge: id,
        },
      ],
    }),
  );

  const { options } = useRecoilValue(
    WyndGaugeOrchestratorSelectors.listOptionsSelector({
      contractAddress: orchestratorAddress,
      params: [{ gauge: id }],
    }),
  );

  const gauge = useRecoilValue(
    WyndGaugeOrchestratorSelectors.gaugeSelector({
      contractAddress: orchestratorAddress,
      params: [{ id }],
    }),
  );

  const refresh_votes = useRecoilRefresher_UNSTABLE(
    WyndGaugeOrchestratorSelectors.listVotesSelector({
      contractAddress: orchestratorAddress,
      params: [
        {
          gauge: id,
        },
      ],
    }),
  );

  return {
    options,
    votes,
    gauge,
    refresh_votes,
  };
};
