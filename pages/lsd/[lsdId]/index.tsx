import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import { Box } from "@chakra-ui/react";
import { LsdSingle } from "../../../components/Lsd/Single";

const ProposalSingle = () => {
  const router = useRouter();
  const { lsdId } = router.query;

  return (
    <>
      <Head>
        <title>WYND | Liquid Staking Derivatives - JUNO</title>
      </Head>
      <Box p="4">
        <LsdSingle id={lsdId?.toString() || ""} />
      </Box>
    </>
  );
};

/**
 * Very dirty work around for static export. Let's generate way more pages then actually need
 */

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [...Array(25)].map((_, i) => {
    return {
      params: {
        lsdId: i.toString(),
      },
    };
  });

  return { paths, fallback: false };
};

export async function getStaticProps(context: GetStaticPropsContext) {
  const { params } = context;
  return {
    props: {
      lsdId: params?.lsdId,
    },
  };
}

export default ProposalSingle;
