import { Box } from "@chakra-ui/react";
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
