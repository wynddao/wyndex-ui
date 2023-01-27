import { useRecoilValue } from "recoil";
import { CwProposalSingleSelectors } from "../../recoil";

export const useSingleProposalInfo = (proposalId: number, address: string) => {
  const proposalResponse = useRecoilValue(
    CwProposalSingleSelectors.proposalSelector({
      contractAddress: address,
      params: [
        {
          proposalId,
        },
      ],
    }),
  ).proposal;

  return {
    proposalResponse,
  };
};
