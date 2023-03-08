import { Box } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { LSDGauge } from "../../../components/Dao/LSDGauge";
import { PoolGauge } from "../../../components/Dao/PoolGauge";
import { useGaugeAdapter, useGaugeConfigs } from "../../../state";

export default function Page() {
  const router = useRouter();
  const { gaugeId } = router.query;
  const { options, gauge, refresh_votes } = useGaugeAdapter(Number(gaugeId));
  const { config } = useGaugeConfigs(gauge.adapter);
  const isRewardGauge = config.hasOwnProperty("rewards_asset");

  return (
    <>
      <Head>
        <title>WYND | DAO - Gauge #{gauge.id}</title>
      </Head>
      <Box p="4">
        {/* Pools Incentives Gauge */}
        {isRewardGauge && <PoolGauge options={options} gauge={gauge} refreshVotes={refresh_votes} />}

        {/* LSD Gauge */}
        {!isRewardGauge && <LSDGauge options={options} gauge={gauge} refreshVotes={refresh_votes} />}
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
