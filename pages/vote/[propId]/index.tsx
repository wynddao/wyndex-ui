import Head from "next/head";
import { useRouter } from "next/router";
import { useSingleProposalInfo } from "../../../state/hooks/proposal/useSingleProposalInfo";
import { ProposalComponent } from "../../../components/Dao/Proposal";

const ProposalSingle = () => {
  const router = useRouter();
  const { propId } = router.query;
  const { proposalResponse } = useSingleProposalInfo(
    Number(propId),
    "juno105jclaywm4lxt74z8a3jgtpfr6jzlx5edg6h0sp024gm292ah2usdln48t",
  );

  return (
    <>
      <Head>
        <title>WYND DEX | Proposal {propId}</title>
      </Head>
      <ProposalComponent proposalResponse={proposalResponse} propId={Number(propId)} />
    </>
  );
};

export default ProposalSingle;
