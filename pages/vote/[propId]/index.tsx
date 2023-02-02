import Head from "next/head";
import { useRouter } from "next/router";
import { useSingleProposalInfo } from "../../../state/hooks/proposal/useSingleProposalInfo";
import { ProposalComponent } from "../../../components/Dao/Proposal";
import { GetStaticPaths, GetStaticPropsContext } from "next";

const ProposalSingle = () => {
  const router = useRouter();
  const votingModuleAddress = "juno105jclaywm4lxt74z8a3jgtpfr6jzlx5edg6h0sp024gm292ah2usdln48t"; //!TODO FETCHING IT FROM CHAIN
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
