import { Grid, GridItem, Text } from "@chakra-ui/react";
import { useGaugeOrchestrator } from "../../../state";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { GaugeItem } from "./GaugeItem";
import { GaugesHeader } from "./GaugesHeader";

export const Gauges = () => {
  const { gauges } = useGaugeOrchestrator();

  return (
    <>
      <GaugesHeader gauges={gauges} />
      <BorderedBox bgImageActive={false}>
        <Grid
          display="grid"
          templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr 1fr 2fr 1fr" }}
          columnGap={{ base: 2, lg: 4 }}
          fontSize="xs"
          fontWeight="semibold"
          color={"wynd.neutral.900"}
          py={2}
          px={4}
          bg="whiteAlpha.100"
        >
          <GridItem>Gauge ID</GridItem>
          <GridItem textAlign="start">Rewards per Epoch </GridItem>
          <GridItem textAlign="start">Epoch</GridItem>
          <GridItem textAlign="start" display={{ base: "none", lg: "block" }}>
            Title
          </GridItem>
          <GridItem textAlign="end" display={{ base: "none", lg: "block" }}>
            Next Epoch
          </GridItem>
        </Grid>
        {gauges.map((gauge, i) => (
          <GaugeItem gauge={gauge} key={i} />
        ))}
      </BorderedBox>
    </>
  );
};
