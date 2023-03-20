import { Grid, GridItem, Text } from "@chakra-ui/react";
import { useGaugeOrchestrator } from "../../../state";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { GaugeItem } from "./GaugeItem";
import { GaugesHeader } from "./GaugesHeader";
import { useTranslation } from "i18next-ssg";
export const Gauges = () => {
  const { gauges } = useGaugeOrchestrator();
  const { t } = useTranslation("common");
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
          <GridItem>{t("gauges.gaugesID")}</GridItem>
          <GridItem textAlign="start">{t("gauges.rewardsPerEoch")}</GridItem>
          <GridItem textAlign="start">{t("time.epoch")}</GridItem>
          <GridItem textAlign="start" display={{ base: "none", lg: "block" }}>
            {t("general.title")}
          </GridItem>
          <GridItem textAlign="end" display={{ base: "none", lg: "block" }}>
            {t("time.nextEpoch")}
          </GridItem>
        </Grid>
        {gauges.map((gauge, i) => (
          <GaugeItem gauge={gauge} key={i} />
        ))}
      </BorderedBox>
    </>
  );
};
