import { Box } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Gauge } from "../../../components/Dao/Gauge";
import { useGaugeAdapter, useGaugeConfigs } from "../../../state";

export default function Page() {
  const router = useRouter();
  const { gaugeId } = router.query;
  const { options, gauge, refresh_votes } = useGaugeAdapter(Number(gaugeId));

  return (
    <>
      <Head>
        <title>WYND | DAO - Gauge #{gauge.id}</title>
      </Head>
      <Box p="4">
        <Gauge options={options} gauge={gauge} refreshVotes={refresh_votes} />
      </Box>
    </>
  );
}

/**
 * Very dirty work around for static export. Let's generate way more pages then actually need
 */

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [...Array(30)].map((_, i) => {
    return {
      params: {
        gaugeId: i.toString(),
      },
    };
  });

  return { paths, fallback: false };
};

export async function getStaticProps(context: GetStaticPropsContext) {
  const { params } = context;
  return {
    props: {
      gaugeId: params?.gaugeId,
    },
  };
}
