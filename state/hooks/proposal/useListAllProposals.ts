import { useMemo } from "react";
import { useRecoilValue, waitForAll } from "recoil";
import { Status } from "../../clients/Cw-proposal-single";
import { blockHeightTimestampSafeSelector, CwProposalSingleSelectors } from "../../recoil";
import { ProposalModule } from "../../types";

export const useListAllProposalInfos = (
  { address, prefix }: ProposalModule,
  startAfter: number,
  limit: number,
) => {
  const proposalResponses = useRecoilValue(
    CwProposalSingleSelectors.listAllProposalsSelector({
      contractAddress: address,
      params: [
        {
          startAfter,
          limit,
        },
      ],
    }),
  ).proposals;

  const timestamps = useRecoilValue(
    waitForAll(
      proposalResponses.map(({ proposal: { start_height } }) =>
        blockHeightTimestampSafeSelector(start_height),
      ),
    ),
  );

  const proposalInfos = useMemo(
    () =>
      proposalResponses.map(({ id, proposal: { status, title, votes, expiration } }, index) => ({
        id: `${prefix}${id}`,
        proposalNumber: id,
        timestamp: timestamps[index],
        status,
        title,
        votes,
        // @ts-ignore
        expiration: expiration.at_time ?? 0,
      })),
    [prefix, proposalResponses, timestamps],
  );

  return proposalInfos;
};
