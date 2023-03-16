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
      params: [{ gauge: id, limit: 100 }],
    }),
  );

  const { options: _options } = useRecoilValue(
    WyndGaugeOrchestratorSelectors.listOptionsSelector({
      contractAddress: orchestratorAddress,
      params: [{ gauge: id, startAfter: options[options.length -1][0], limit: 100 }],
    }),
  );

  const optionsMerged = [..._options, ...options];

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
    options: optionsMerged,
    votes,
    gauge,
    refresh_votes,
  };
};
