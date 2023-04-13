import { Box } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { LSDGauge } from "../../../components/Dao/LSDGauge";
import { PoolGauge } from "../../../components/Dao/PoolGauge";
import { CharityGauge } from "../../../components/Dao/CharityGauge";
import { useGaugeAdapter, useGaugeConfigs } from "../../../state";

export default function Page() {
  const router = useRouter();
  const { gaugeId } = router.query;
  
  /*
  const { options, gauge, refresh_votes } = useGaugeAdapter(Number(gaugeId));
  const { config } = useGaugeConfigs(gauge.adapter);
  */

  
  const options = [
    ["1", "232323"],
    ["2", "342343"],
  ];

  const gauge = {
    id: 2,
    adapter: "juno1test",
    epoch_size: 2419200,
    next_epoch: 1683654614,
    max_options_selected: 20,
    is_stopped: false,
    title: "WYND | DAO",
    description: "WYND | DAO",
  };

  const refresh_votes = () => {};

  return (
    <>
      <Head>
        <title>WYND | DAO - Gauge #{gauge.id}</title>
      </Head>
      <Box p="4">
   
        {/* Charity Gauge */}
        <CharityGauge options={options} gauge={gauge} refreshVotes={refresh_votes} />
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
