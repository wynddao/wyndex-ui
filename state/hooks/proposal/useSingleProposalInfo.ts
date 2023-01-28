import { useWallet } from "@cosmos-kit/react";
import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { CwProposalSingleSelectors } from "../../recoil";

export const useSingleProposalInfo = (proposalId: number, address: string) => {
  const { address: walletAddress } = useWallet();
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

  const walletVote = useRecoilValue(
    walletAddress
      ? CwProposalSingleSelectors.getVoteSelector({
          contractAddress: address,
          params: [{ proposalId, voter: walletAddress }],
        })
      : constSelector(undefined),
  )?.vote?.vote;

  const refreshData = useRecoilRefresher_UNSTABLE(
    CwProposalSingleSelectors.proposalSelector({
      contractAddress: address,
      params: [
        {
          proposalId,
        },
      ],
    }),
  );

  return {
    proposalResponse,
    walletVote,
    refreshData,
  };
};
