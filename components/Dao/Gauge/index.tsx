import { Grid } from "@chakra-ui/react";
import { useGaugeConfigs } from "../../../state";
import { GaugeResponse } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { GaugeHeader } from "./GaugeHeader";
import { Vote } from "./Vote";

export const Gauge = ({
  options,
  gauge,
  refreshVotes,
}: {
  options: [string, string][];
  gauge: GaugeResponse;
  refreshVotes: () => void;
}) => {
  const { config, allOptions: _all } = useGaugeConfigs(gauge.adapter);

  return (
    <>
      <GaugeHeader gauge={gauge} />
      <Grid gap={6} mt={8} templateColumns={"1fr 1fr"}>
        <BorderedBox>a</BorderedBox>
        <BorderedBox>a</BorderedBox>
      </Grid>
    </>
  );
};
