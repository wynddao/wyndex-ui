import { Grid, GridItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../../../state";
import { useDaoStakingInfos } from "../../../../state/hooks/useDaoStakingInfos";
import { currencyAtom } from "../../../../state/recoil/atoms/settings";
import { WYND_TOKEN_ADDRESS } from "../../../../utils";
import { secondsToDays } from "../../../../utils/time";
import { microamountToAmount } from "../../../../utils/tokens";
import { getPendingRebonding } from "../../../Dex/Pool/PendingBoundingsTable/util";
import { useTranslation } from "i18next-ssg";
interface RebondingTokensOptions {
  wyndexStake: string;
  walletAddress: string;
}

export const RebondingTokens = (props: RebondingTokensOptions) => {
  const { wyndexStake, walletAddress } = props;
  const { assetPrices } = useIndexerInfos({});
  const currency = useRecoilValue(currencyAtom);
  const { unbondingPeriods } = useDaoStakingInfos();
  const { t } = useTranslation("common");
  const [rebondings, setRebondings] = useState<any[] | undefined>(undefined);
  const [hasAnyRebondings, setHasAnyRebondings] = useState<boolean>(false);

  const wyndexAssetPrice = assetPrices.find((el) => el.asset === WYND_TOKEN_ADDRESS);
  const wyndexPrice =
    currency === "USD" ? wyndexAssetPrice?.priceInUsd ?? 0 : wyndexAssetPrice?.priceInEur ?? 0;

  useEffect(() => {
    const pendingRebonding = unbondingPeriods.map(async (info: any) => {
      return await getPendingRebonding(walletAddress || "", info.unbonding_period, wyndexStake);
    });
    Promise.all(pendingRebonding).then((res) => {
      const hasRebonded = res.find((e) => {
        return e.locked_tokens.length > 0;
      });

      setHasAnyRebondings(hasRebonded ? true : false);
      setRebondings(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, wyndexStake]);

  return (
    <>
      <Grid
        display="grid"
        templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr 2fr" }}
        columnGap={{ base: 2, lg: 4 }}
        fontSize="xs"
        fontWeight="semibold"
        color={"wynd.neutral.900"}
        py={2}
        px={4}
        bg="whiteAlpha.100"
      >
        <GridItem> {t("stake.stakes")}</GridItem>
        <GridItem textAlign="center"> {t("stake.unlocks")}</GridItem>
        <GridItem textAlign="end"> {t("general.info")}</GridItem>
      </Grid>
      {rebondings &&
        rebondings.map(
          (period, x) =>
            period.locked_tokens &&
            period.locked_tokens.length > 0 &&
            period.locked_tokens.map((amount: string[], i: number) => {
              if (new Date().getTime() < Number(amount[0]) / 1000000) {
                return (
                  <Grid
                    key={i}
                    templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr 2fr" }}
                    fontWeight="semibold"
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
                      {microamountToAmount(amount[1], 6)} {"$WYND"} (~
                      {microamountToAmount(Number(amount[1]) * wyndexPrice, 6, 2)}{" "}
                      {currency === "USD" ? "$" : "€"})
                    </GridItem>
                    <GridItem textAlign="end" gap={{ base: "2", lg: "4" }}>
                      <Text fontSize="lg">
                        {new Date(Number(amount[0]) / 1000000).toLocaleDateString()}{" "}
                        {new Date(Number(amount[0]) / 1000000).toLocaleTimeString()}
                      </Text>
                    </GridItem>
                    <GridItem textAlign="end" gap={{ base: "2", lg: "4" }}>
                      <Text fontSize="lg">
                        {t("stake.rebondedDownTo")} {secondsToDays(unbondingPeriods[x].unbonding_period)}{" "}
                        {t("time.days")}
                      </Text>
                    </GridItem>
                  </Grid>
                );
              }
            }),
        )}
    </>
  );
};
