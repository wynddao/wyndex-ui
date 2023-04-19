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
  // const { options, gauge, refresh_votes } = useGaugeAdapter(Number(gaugeId));
  const options = [
    ["juno1zwskvpcpvplxacxef2ez5w9rpxcdkd54hj78x4", "2343"],
    ["juno1zwskvpcpvplxacxef2ez5w9rpxcdkd54hj78x3", "2343"],
    ["juno1zwskvpcpvplxacxef2ez5w9rpxcdkd54hj78x5", "2343"],
  ];
  const gauge = {
    id: 0,
    title: "marketing gauge",
    adapter: "juno1yttw3554tmjfq0elmtk5samsa9wzgj7hvadey4tugayhhq4rmlsqqvu4gy",
    epoch_size: 3600,
    min_percent_selected: null,
    max_options_selected: 30,
    is_stopped: false,
    next_epoch: 1681822327,
  };

  const refresh_votes = () => {};
  return (
    <>
      <Head>
        <title>WYND | DAO - Gauge #{gauge.id}</title>
      </Head>
      <Box p="4">
        {/* Marketing Gauge */}
        {gauge.id === 0 && <MarketingGauge options={options} gauge={gauge} refreshVotes={refresh_votes} />}

        {/* Pools Incentives Gauge */}
        {gauge.id === 1 && <PoolGauge options={options} gauge={gauge} refreshVotes={refresh_votes} />}

        {/* LSD Gauge */}
        {gauge.id === 2 && <LSDGauge options={options} gauge={gauge} refreshVotes={refresh_votes} />}
      </Box>
    </>
  );
}
