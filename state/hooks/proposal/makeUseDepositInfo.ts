import { useRecoilValue } from "recoil";
import { CheckedDepositInfo } from "../../clients/Cw-proposal-single";

import { CwProposalSingleSelectors } from "../../recoil";
import { ProposalModule } from "../../types";

export const makeUseDepositInfo =
  ({ address }: ProposalModule) =>
  (): CheckedDepositInfo | undefined =>
    useRecoilValue(
      CwProposalSingleSelectors.configSelector({
        contractAddress: address,
      }),
    ).deposit_info ?? undefined;
