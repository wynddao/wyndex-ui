import { Grid, GridItem, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useGaugeConfigs } from "../../../state";
import { GaugeResponse } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { DailyReward, gaugesDailyRewardsAtom } from "../../../state/recoil/atoms/gauges";
import { expirationAtTimeToSecondsFromNow, secondsToDays, secondsToWdhms } from "../../../utils/time";
import { microamountToAmount } from "../../../utils/tokens";
import TokenName from "../../Dex/TokenName";

export const GaugeItem = ({ gauge }: { gauge: GaugeResponse }) => {
  const router = useRouter();
  const { config } = useGaugeConfigs(gauge.adapter);

  const handleRowClick = (gaugeId: number) => {
    router.push(`/gauges/${gaugeId}`);
  };

  const [gaugesDailyRewards, setGaugesDailyRewards] = useRecoilState(gaugesDailyRewardsAtom);

  const getDailyAmount = () => {
    const dailyMultiplier = 86400 / gauge.epoch_size;
    return dailyMultiplier * Number(config?.rewards_asset?.amount);
  };

  useEffect(() => {
    const dailyReward: DailyReward = {
      gaugeId: gauge.id,
      amount: getDailyAmount(),
      asset: config.rewards_asset.info.hasOwnProperty("token")
        ? // @ts-ignore
          config.rewards_asset.info.token
        : // @ts-ignore
          config.rewards_asset.info.native,
    };
  
    setGaugesDailyRewards([...gaugesDailyRewards.filter(el => el.asset !== dailyReward.asset), dailyReward]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid
      templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr 1fr 2fr 1fr" }}
      fontWeight="semibold"
      _hover={{
        bgColor: "wynd.base.sidebar",
        cursor: "pointer",
      }}
      onClick={() => handleRowClick(gauge.id)}
      alignItems="center"
      backgroundImage={"url(/images/Vector2Bg.png)"}
      backgroundAttachment="fixed"
      backgroundPosition="bottom"
      borderBottom="1px solid var(--chakra-colors-chakra-border-color)"
      py="4"
      px="2"
      gap="4"
    >
      <GridItem display="flex" alignItems="center" gap={{ base: "2", lg: "4" }}>
        <Text fontSize="lg"># {gauge.id}</Text>
      </GridItem>
      <GridItem textAlign="start" gap={{ base: "2", lg: "4" }}>
        <Text fontSize="lg">
          {" "}
          {microamountToAmount(config?.rewards_asset?.amount, 6)}{" "}
          {config.rewards_asset.info.hasOwnProperty("token") ? (
            // @ts-ignore
            <TokenName symbol={true} address={config.rewards_asset.info.token} />
          ) : (
            <span>
            </span>
          )}
        </Text>
      </GridItem>
      <GridItem textAlign="start" gap={{ base: "2", lg: "4" }}>
        <Text fontSize="lg">{secondsToDays(gauge.epoch_size)} Days</Text>
      </GridItem>
      <GridItem textAlign="start" gap={{ base: "2", lg: "4" }}>
        <Text fontSize="lg">{gauge.title}</Text>
      </GridItem>
      <GridItem textAlign="end" gap={{ base: "2", lg: "4" }}>
        in {secondsToWdhms(gauge.next_epoch - Date.now() / 1000)}
        <br />
      </GridItem>
    </Grid>
  );
};
