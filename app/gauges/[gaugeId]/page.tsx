"use client";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { LSDGauge } from "../../../components/Dao/LSDGauge";
import { PoolGauge } from "../../../components/Dao/PoolGauge";
import { MarketingGauge } from "../../../components/Dao/MarketingGauge";
import { useGaugeAdapter, useGaugeConfigs } from "../../../state";

interface GaugePageProps {
  readonly params: {
    readonly gaugeId: string;
  };
}

export default function Page({ params }: GaugePageProps) {
  const { gaugeId } = params;
  const { options, gauge, refresh_votes } = useGaugeAdapter(Number(gaugeId));

  return (
    <>
      <Head>
        <title>WYND | DAO - Gauge #{gauge.id}</title>
      </Head>
      <Box p="4">
        {/* Marketing Gauge */}
        {gauge.id === 2 && <MarketingGauge options={options} gauge={gauge} refreshVotes={refresh_votes} />}

        {/* Pools Incentives Gauge */}
        {gauge.id === 0 && <PoolGauge options={options} gauge={gauge} refreshVotes={refresh_votes} />}

        {/* LSD Gauge */}
        {gauge.id === 1 && <LSDGauge options={options} gauge={gauge} refreshVotes={refresh_votes} />}
      </Box>
    </>
  );
}
