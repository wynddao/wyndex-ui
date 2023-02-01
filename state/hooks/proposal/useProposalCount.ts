import { useRecoilValue } from "recoil";
import { CwProposalSingleSelectors } from "../../recoil";
import { ProposalModule } from "../../types";

export const useProposalCount = ({ address }: ProposalModule) =>
  useRecoilValue(
    CwProposalSingleSelectors.proposalCountSelector({
      contractAddress: address,
    }),
  );
