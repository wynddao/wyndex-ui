import { Box, Button, Grid, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { ExecuteResult } from "cosmwasm";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { CustomHooks, useIndexerInfos, useToast } from "../../state";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { currencyAtom } from "../../state/recoil/atoms/settings";
import { FEE_DENOM, WYND_TOKEN_ADDRESS } from "../../utils";
import { getAssetInfoDetails, RequestAssetPrice } from "../../utils/assets";
import { formatCurrency } from "../../utils/currency";
import { getRewards } from "../Pool/PendingBoundingsTable/util";

export interface AssetsRecap {
  readonly total: string;
  readonly locked: string;
  readonly available: string;
}

export default function AssetsRecapGallery() {
  const { address: walletAddress } = useWallet();
  const { txToast } = useToast();
  const { userFiat, assetPrices, userPools } = useIndexerInfos({
    fetchCw20Balances: true,
    fetchPoolData: true,
  });
  const currency = useRecoilValue(currencyAtom);

  const junoAssetPrice = assetPrices.find((el) => el.asset === FEE_DENOM);
  const junoPrice = currency === "USD" ? junoAssetPrice?.priceInUsd : junoAssetPrice?.priceInEur;
  const junoPriceFormatted = formatCurrency(currency, String(junoPrice ?? "0"));
  const wyndexAssetPrice = assetPrices.find((el) => el.asset === WYND_TOKEN_ADDRESS);
  const wyndexPrice = currency === "USD" ? wyndexAssetPrice?.priceInUsd : wyndexAssetPrice?.priceInEur;
  const wyndexPriceFormatted = formatCurrency(currency, String(wyndexPrice ?? "0"));

  let totalAvailableRewardValue = {
    priceInJuno: 0,
    priceInUsd: 0,
    priceInEur: 0,
  };

  const allStakingAddresses = userPools.map((pool: any) => pool.value.pair_info.staking_addr);

  userPools.map(async (pool: any) => {
    const staking_addr: string = pool.value.pair_info.staking_addr;
    const rewards = await getRewards(walletAddress || "", staking_addr);

    let assetPrice: RequestAssetPrice = {
      asset: "",
      priceInJuno: "0",
      priceInUsd: 0,
      priceInEur: 0,
    };

    rewards.map((reward: any) => {
      if (reward.info.hasOwnProperty("token")) {
        assetPrice = assetPrices.find((price) => price.asset === reward.info.token)!;
      } else {
        assetPrice = assetPrices.find((price) => price.asset === reward.info.native)!;
      }
      const assetInfo = getAssetInfoDetails(reward.info);
      totalAvailableRewardValue.priceInEur +=
        Number(assetPrice.priceInEur) * (Number(reward.amount) / 10 ** assetInfo.decimals);
      totalAvailableRewardValue.priceInUsd +=
        Number(assetPrice.priceInUsd) * (Number(reward.amount) / 10 ** assetInfo.decimals);
      totalAvailableRewardValue.priceInJuno +=
        Number(assetPrice.priceInJuno) * (Number(reward.amount) / 10 ** assetInfo.decimals);
    });
    console.log(rewards)

  });
  const doWithdrawAll = CustomHooks.useCustomWithdrawAllRewards({
    sender: walletAddress || "",
  });

  const withdrawAll = async () => {
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doWithdrawAll({
        stakingAddresses: allStakingAddresses,
      });

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 500));
      return result;
    });
  };

  return (
    <>
      <Heading pt="8">My Assets</Heading>
      <Box bg="url(/castle.jpeg)" rounded="lg" bgPosition="center" bgSize="cover">
        <Box bg="rgba(16, 11, 22,0.8)" w="full" h="full">
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            maxW="4xl"
            gap={6}
            px={8}
            py={4}
          >
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                Total Assets
              </Text>
              <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
                {walletAddress
                  ? formatCurrency(
                      currency,
                      `${
                        (currency === "USD" ? userFiat.availableBalance.usd : userFiat.availableBalance.eur) +
                        (currency === "USD" ? userFiat.lockedBalance.usd : userFiat.lockedBalance.eur)
                      }`,
                    )
                  : "-"}
              </Text>
            </Box>
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                Bonded Assets
              </Text>
              <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
                {walletAddress
                  ? formatCurrency(
                      currency,
                      `${currency === "USD" ? userFiat.lockedBalance.usd : userFiat.lockedBalance.eur}`,
                    )
                  : "-"}
              </Text>
            </Box>
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                Available Assets
              </Text>
              <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
                {walletAddress
                  ? formatCurrency(
                      currency,
                      `${currency === "USD" ? userFiat.availableBalance.usd : userFiat.availableBalance.eur}`,
                    )
                  : "-"}
              </Text>
            </Box>
          </Grid>
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            maxW="4xl"
            gap={6}
            px={8}
            py={4}
          >
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                JUNO Price
              </Text>
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="extrabold"
                bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
                bgClip="text"
              >
                {junoPriceFormatted}
              </Text>
            </Box>
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                WYND Price
              </Text>
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="extrabold"
                bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
                bgClip="text"
              >
                {wyndexPriceFormatted}
              </Text>
            </Box>
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                Total Rewards
              </Text>
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="extrabold"
                bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
                bgClip="text"
              >
                {walletAddress
                  ? formatCurrency(
                      currency,
                      `${
                        currency === "USD"
                          ? totalAvailableRewardValue.priceInUsd
                          : totalAvailableRewardValue.priceInEur
                      }`,
                    )
                  : "-"}
              </Text>
              <Button backgroundColor={"wynd.gray.alpha.20"} onClick={() => withdrawAll()} variant={"ghost"}>
                Claim all!
              </Button>
            </Box>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
