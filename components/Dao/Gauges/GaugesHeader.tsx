"use client";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { assetList } from "@wynddao/asset-list";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../state";
import { GaugeResponse } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { gaugesDailyRewardsAtom } from "../../../state/recoil/atoms/gauges";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { getAssetPrice } from "../../../utils/assets";
import { formatCurrency } from "../../../utils/currency";

interface DailyRewards {
  eur: number;
  usd: number;
}

export const GaugesHeader = ({ gauges }: { gauges: GaugeResponse[] }) => {
  const [gaugesDailyRewards, setGaugesDailyRewards] = useRecoilState(gaugesDailyRewardsAtom);
  const [dailyRewards, setDailyRewards] = useState<DailyRewards>({ eur: 0, usd: 0 });
  const { assetPrices } = useIndexerInfos({});
  const currency = useRecoilValue(currencyAtom);

  useEffect(() => {
    let dailyReward = { usd: 0, eur: 0 };
    gaugesDailyRewards.map((rew) => {
      const assetPrice = assetPrices.find((asset) => asset.asset === rew.asset);
      const assetInfo = assetList.tokens.find(
        (asset) =>
          asset.denom === rew.asset || asset.juno_denom === rew.asset || asset.token_address === rew.asset,
      );

      dailyReward.eur += (rew.amount / 10 ** (assetInfo?.decimals || 1)) * (assetPrice?.priceInEur || 0);
      dailyReward.usd += (rew.amount / 10 ** (assetInfo?.decimals || 1)) * (assetPrice?.priceInUsd || 0);
    });
    setDailyRewards(dailyReward);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gaugesDailyRewards]);

  return (
    <>
      <Box bg="url(/castle2.png)" rounded="lg" mb={4} bgPosition="0 -120px" bgSize="cover">
        <Box bg="rgba(16, 11, 22,0.8)" py={8} w="full" h="full">
          <Grid textAlign="center" templateColumns={"1fr 1fr 1fr"} px={8} py={4}>
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                Gauges Active
              </Text>
              <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
                {gauges.length}
              </Text>
            </Box>
            <Box py={{ md: 2 }}>
              <Heading fontSize={{ base: "3xl", md: "6xl" }} fontWeight="extrabold">
                Gauges
              </Heading>
            </Box>
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                Total Rewards Per Day
              </Text>
              <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
                {formatCurrency(
                  currency,
                  currency === "EUR" ? dailyRewards.eur.toString() : dailyRewards.usd.toString(),
                )}
              </Text>
            </Box>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
