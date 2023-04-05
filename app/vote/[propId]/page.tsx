import Head from "next/head";
import { useRouter } from "next/router";
import { useSingleProposalInfo } from "../../../state/hooks/proposal/useSingleProposalInfo";
import { ProposalComponent } from "../../../components/Dao/Proposal";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";

const ProposalSingle = () => {
  const router = useRouter();
  const votingModuleAddress = WYND_VOTE_MODULE_ADDRESS;
  const { propId } = router.query;
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

/**
 * Very dirty work around for static export. Let's generate way more pages then actually need
 */

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [...Array(200)].map((_, i) => {
    return {
      params: {
        propId: i.toString(),
      },
    };
  });

  return { paths, fallback: false };
};

export async function getStaticProps(context: GetStaticPropsContext) {
  const { params } = context;
  return {
    props: {
      propId: params?.propId,
    },
  };
}

export default ProposalSingle;
