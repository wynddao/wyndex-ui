import { useWallet } from "@cosmos-kit/react";
import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { DAO_STAKING_ADDRESS } from "../../../utils";
import { CwProposalSingleSelectors, WyndDaoStakeSelectors } from "../../recoil";

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

  const walletStakedPowerAtHeight = useRecoilValue(
    walletAddress
      ? WyndDaoStakeSelectors.votingPowerAtHeightSelector({
          contractAddress: DAO_STAKING_ADDRESS,
          params: [{ address: walletAddress, height: proposalResponse.start_height }],
        })
      : constSelector(undefined),
  )?.power;

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
    walletStakedPowerAtHeight,
    refreshData,
  };
};
