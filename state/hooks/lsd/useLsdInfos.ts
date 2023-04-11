import { useChain } from "@cosmos-kit/react-lite";
import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { WyndLsdHubSelectors } from "../../recoil";

export const useLsdInfos = (lsdAddress: string) => {
  const { address } = useChain("juno");
  const config = useRecoilValue(
    WyndLsdHubSelectors.configSelector({
      contractAddress: lsdAddress,
      params: [],
    }),
  );

  const claimSelector = address
    ? WyndLsdHubSelectors.claimsSelector({
        contractAddress: lsdAddress,
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
      contractAddress: lsdAddress,
      params: [],
    }),
  );

  const { exchange_rate } = useRecoilValue(
    WyndLsdHubSelectors.exchangeRateSelector({
      contractAddress: lsdAddress,
      params: [],
    }),
  );

  const { supply } = useRecoilValue(
    WyndLsdHubSelectors.supplySelector({
      contractAddress: lsdAddress,
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
