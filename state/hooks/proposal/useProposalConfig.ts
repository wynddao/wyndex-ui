import { useRecoilValue } from "recoil";
import { CwProposalSingleSelectors } from "../../recoil";

export const useSingleProposalInfo = (proposalModuleAddress: string) => {
  const config = useRecoilValue(
    CwProposalSingleSelectors.configSelector({
      contractAddress: proposalModuleAddress,
    }),
  );
  return {
    config,
  };
};
