import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../state";
import { useDaoStakingInfos } from "../../../state/hooks/useDaoStakingInfos";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { WYND_TOKEN_ADDRESS } from "../../../utils";
import { formatCurrency } from "../../../utils/currency";
import { secondsToDays } from "../../../utils/time";
import { microamountToAmount } from "../../../utils/tokens";
import { useTranslation } from "i18next-ssg";

export const StakeHeader = ({
  totalStaked: totalStakedWynd,
  treasuryBalance: treasuryBalanceWynd,
}: {
  totalStaked: string | undefined;
  treasuryBalance: string;
}) => {
  const { unbondingPeriods: bondingInfos } = useDaoStakingInfos();
  const { assetPrices } = useIndexerInfos({});
  const currency = useRecoilValue(currencyAtom);
  const { t } = useTranslation("common");

  const wyndexAssetPrice = assetPrices.find((el) => el.asset === WYND_TOKEN_ADDRESS);
  const wyndexPrice =
    currency === "USD" ? wyndexAssetPrice?.priceInUsd ?? 0 : wyndexAssetPrice?.priceInEur ?? 0;

  const treasuryBalanceFiat = Number(treasuryBalanceWynd) * wyndexPrice;
  const treasuryBalanceWyndFormatted = Number(
    microamountToAmount(treasuryBalanceWynd || 0, 6),
  ).toLocaleString(undefined, { maximumFractionDigits: 0 });

  const totalStakedFiat = Number(totalStakedWynd) * wyndexPrice;
  const totalStakedWyndFormatted = Number(microamountToAmount(totalStakedWynd || 0, 6)).toLocaleString(
    undefined,
    { maximumFractionDigits: 0 },
  );

  return (
    <Box bg="url(/moonforest.png)" rounded="lg" bgPosition="center" bgSize="cover">
      <Flex
        bg="rgba(16, 11, 22,0.8)"
        w="full"
        h="full"
        px={{ base: "4", md: "8" }}
        py={{ base: "6", md: "12" }}
        flexFlow="column"
        gap="10"
        roundedTop="lg"
      >
        <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
          {t("stake.stake")}
        </Heading>
        <Flex gap={6} justifyContent={"space-around"} flexFlow={{ base: "column", md: "row" }}>
          <Box py={{ md: 2 }} textAlign={{ base: "center", md: "left" }}>
            <Text fontWeight="semibold" color="wynd.gray.500">
              {t("stake.daoTreasury")}
            </Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
              {treasuryBalanceWyndFormatted} {"$WYND"}{" "}
              <Text fontSize="sm">
                {"≈"} ({formatCurrency(currency, microamountToAmount(treasuryBalanceFiat, 6))})
              </Text>
            </Text>
          </Box>
          <Box py={{ md: 2 }} textAlign={{ base: "center", md: "right" }}>
            <Text fontWeight="semibold" color="wynd.gray.500">
              {t("stake.totalStaked")}
            </Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
              {totalStakedWyndFormatted} {"$WYND"}{" "}
              <Text fontSize="sm">
                {"≈"} ({formatCurrency(currency, microamountToAmount(totalStakedFiat, 6))})
              </Text>
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex
        bg="rgba(16, 11, 22,0.9)"
        gap={6}
        px={3}
        py={2}
        justifyContent={"space-around"}
        borderBottomRadius="lg"
        flexWrap="wrap"
      >
        {bondingInfos &&
          bondingInfos.length > 0 &&
          bondingInfos.map(({ unbonding_period, apy }: { unbonding_period: number; apy: number }) => {
            return (
              <Box key={unbonding_period}>
                <Text
                  fontWeight="semibold"
                  color="wynd.gray.500"
                  fontSize="xs"
                  textTransform="uppercase"
                  textAlign="center"
                >
                  APR {secondsToDays(unbonding_period)} {t("time.days")}
                </Text>
                <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
                  {(apy * 100).toFixed(2)} %
                </Text>
              </Box>
            );
          })}
      </Flex>
    </Box>
  );
};
