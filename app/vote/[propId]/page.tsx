"use client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSingleProposalInfo } from "../../../state/hooks/proposal/useSingleProposalInfo";
import { ProposalComponent } from "../../../components/Dao/Proposal";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";

interface ProposalPageProps {
  readonly params: {
    readonly propId: string;
  };
}

const ProposalSingle = ({ params }: ProposalPageProps) => {
  const votingModuleAddress = WYND_VOTE_MODULE_ADDRESS;
  const { propId } = params;
  const { proposalResponse, walletVote, refreshData, walletStakedPowerAtHeight } = useSingleProposalInfo(
    Number(propId),
    votingModuleAddress,
  );

  return (
    <>
      <Head>
        <title>WYND | DAO - Proposal {propId}</title>
      </Head>
      <ProposalComponent
        proposalResponse={proposalResponse}
        propId={Number(propId)}
        votingModuleAddress={votingModuleAddress}
        walletVote={walletVote}
        refreshData={refreshData}
        walletStakedPowerAtHeight={Number(walletStakedPowerAtHeight)}
      />
    </>
  );
};

export default ProposalSingle;
