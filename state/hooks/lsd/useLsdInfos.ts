import { useWallet } from "@cosmos-kit/react";
import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { WyndLsdHubSelectors } from "../../recoil";

export const useLsdInfos = () => {
  const JUNO_LSD_ADDRESS = "juno1ek4ed6yevgx4x0mnce4h58y4p30ay7k35g2vrt0nmnlt6ttsmpmq270tee";
  const { address } = useWallet();
  const config = useRecoilValue(
    WyndLsdHubSelectors.configSelector({
      contractAddress: JUNO_LSD_ADDRESS,
      params: [],
    }),
  );

  const claimSelector = address
    ? WyndLsdHubSelectors.claimsSelector({
        contractAddress: JUNO_LSD_ADDRESS,
        params: [
          {
            address,
          },
        ],
      })
    : constSelector({ claims: [] });

  const { claims } = useRecoilValue(claimSelector);
  const refreshClaims = useRecoilRefresher_UNSTABLE(claimSelector);

  const { validator_set: validatorSet } = useRecoilValue(
    WyndLsdHubSelectors.validatorSetSelector({
      contractAddress: JUNO_LSD_ADDRESS,
      params: [],
    }),
  );

  const { exchange_rate } = useRecoilValue(
    WyndLsdHubSelectors.exchangeRateSelector({
      contractAddress: JUNO_LSD_ADDRESS,
      params: [],
    }),
  );

  const { supply } = useRecoilValue(
    WyndLsdHubSelectors.supplySelector({
      contractAddress: JUNO_LSD_ADDRESS,
      params: [],
    }),
  );

  return {
    config,
    claims,
    validatorSet,
    exchange_rate,
    supply,
    refreshClaims,
  };
};
