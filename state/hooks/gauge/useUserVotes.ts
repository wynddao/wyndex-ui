import { constSelector, useRecoilValue } from "recoil";
import { DAO_GAUGE_ADDRESS } from "../../../utils";

import { WyndGaugeOrchestratorSelectors } from "../../recoil";

export const useUserVotes = (gaugeId: number, walletAddress: string) => {
  const { vote } = useRecoilValue(
    walletAddress.length > 0
      ? WyndGaugeOrchestratorSelectors.voteSelector({
          contractAddress: DAO_GAUGE_ADDRESS,
          params: [
            {
              gauge: gaugeId,
              voter: walletAddress,
            },
          ],
        })
      : constSelector({ vote: null }),
  );

  return {
    vote,
  };
};
