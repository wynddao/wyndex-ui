import { useRecoilValue } from "recoil";

import { WyndGaugeAdapterSelectors } from "../../recoil";

export const useGaugeConfigs = (adapterAddress: string) => {
  const config = useRecoilValue(
    WyndGaugeAdapterSelectors.configSelector({
      contractAddress: adapterAddress,
      params: [],
    }),
  );

  const allOptions = useRecoilValue(
    WyndGaugeAdapterSelectors.allOptionsSelector({
      contractAddress: adapterAddress,
      params: [],
    }),
  );
  return {
    config,
    allOptions,
  };
};
