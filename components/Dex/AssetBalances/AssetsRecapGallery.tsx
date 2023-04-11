"use client";

import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { ExecuteResult } from "cosmwasm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { CustomHooks, useIndexerInfos, useToast } from "../../../state";
import { useDaoStakingInfos } from "../../../state/hooks/useDaoStakingInfos";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { FEE_DENOM, WYND_TOKEN_ADDRESS } from "../../../utils";
import { getAssetInfoDetails, RequestAssetPrice } from "../../../utils/assets";
import { formatCryptoCurrency, formatCurrency } from "../../../utils/currency";
import { microamountToAmount } from "../../../utils/tokens";
import { UnvotedPropCount } from "../../General/Sidebar/UnvotedPropCount";
import { getRewards } from "../Pool/PendingBoundingsTable/util";

export interface AssetsRecap {
  readonly total: string;
  readonly locked: string;
  readonly available: string;
}

export default function AssetsRecapGallery() {
  const { address: walletAddress } = useChain("juno");
  const [totalAvailableRewardValue, setTotalAvailableRewardValue] = useState<{
    priceInJuno: number;
    priceInUsd: number;
    priceInEur: number;
  }>({
    priceInJuno: 0,
    priceInUsd: 0,
    priceInEur: 0,
  });
  const [allStakingAddresses, setAllStakingAddresses] = useState<string[]>([]);
  const { txToast } = useToast();
  const { userFiat, assetPrices, userPools, refreshIbcBalances, refreshCw20Balances } = useIndexerInfos({
    fetchCw20Balances: true,
    fetchPoolData: true,
  });
  const currency = useRecoilValue(currencyAtom);
  const router = useRouter();
  const { walletStakedTokens, claims } = useDaoStakingInfos({
    fetchWalletStakedValue: true,
    fetchClaims: true,
  });

  const claimSum = claims ? claims.reduce((acc, curr) => acc + Number(curr.amount) / 10 ** 6, 0) : 0;

  const junoAssetPrice = assetPrices.find((el) => el.asset === FEE_DENOM);
  const junoPrice = currency === "USD" ? junoAssetPrice?.priceInUsd : junoAssetPrice?.priceInEur;
  const junoPriceFormatted = formatCurrency(currency, String(junoPrice ?? "0"));
  const wyndexAssetPrice = assetPrices.find((el) => el.asset === WYND_TOKEN_ADDRESS);
  const wyndexPrice = currency === "USD" ? wyndexAssetPrice?.priceInUsd : wyndexAssetPrice?.priceInEur;
  const wyndexPriceFormatted = formatCurrency(currency, String(wyndexPrice ?? "0"));
  const claimPrice = Number(wyndexPrice) * claimSum;
  const stakedWyndPrice = Number(wyndexPrice) * Number(microamountToAmount(walletStakedTokens || 0, 6));

  const doWithdrawAll = CustomHooks.useCustomWithdrawAllRewards({
    sender: walletAddress || "",
  });

  const withdrawAll = async () => {
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doWithdrawAll({
        stakingAddresses: allStakingAddresses,
      });

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      getData();
      refreshIbcBalances();
      refreshCw20Balances();
      return result;
    });
  };

  const getData = async () => {
    let _totalAvailableRewardValue = {
      priceInJuno: 0,
      priceInUsd: 0,
      priceInEur: 0,
    };

    const _allStakingAddresses = userPools.map((pool: any) => pool.value.pair_info.staking_addr);
    setAllStakingAddresses(_allStakingAddresses);
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
        _totalAvailableRewardValue.priceInEur +=
          Number(assetPrice.priceInEur) * (Number(reward.amount) / 10 ** assetInfo.decimals);
        _totalAvailableRewardValue.priceInUsd +=
          Number(assetPrice.priceInUsd) * (Number(reward.amount) / 10 ** assetInfo.decimals);
        _totalAvailableRewardValue.priceInJuno +=
          Number(assetPrice.priceInJuno) * (Number(reward.amount) / 10 ** assetInfo.decimals);
      });
      setTotalAvailableRewardValue(_totalAvailableRewardValue);
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  return (
    <Box bg="url(/bg_castle_png.png)" bgPosition="center" py={12} bgSize="70%" bgRepeat="no-repeat">
      <Box rounded="lg" bgPosition="top" bgSize="cover" maxW="1920px" margin="auto">
        <Grid
          gap={8}
          p={3}
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
        >
          <Flex
            bg="rgba(0, 0, 0, 0.7)"
            flexDir="column"
            padding={3}
            borderRadius="xl"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontWeight="semibold" opacity={0.7}>
              Total Assets
            </Text>
            <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
              {walletAddress
                ? formatCurrency(
                    currency,
                    `${
                      (currency === "USD" ? userFiat.availableBalance.usd : userFiat.availableBalance.eur) +
                      (currency === "USD" ? userFiat.lockedBalance.usd : userFiat.lockedBalance.eur) +
                      claimPrice +
                      stakedWyndPrice
                    }`,
                  )
                : "-"}
            </Text>
          </Flex>
          <Flex
            bg="rgba(0, 0, 0, 0.7)"
            flexDir="column"
            padding={3}
            borderRadius="xl"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontWeight="semibold" opacity={0.7}>
              Locked Assets
            </Text>
            <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
              {walletAddress
                ? formatCurrency(
                    currency,
                    `${
                      (currency === "USD" ? userFiat.lockedBalance.usd : userFiat.lockedBalance.eur) +
                      stakedWyndPrice
                    }`,
                  )
                : "-"}
            </Text>
          </Flex>
          <Flex
            bg="rgba(0, 0, 0, 0.7)"
            flexDir="column"
            padding={3}
            borderRadius="xl"
            justifyContent="center"
            alignItems="center"
          >
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
          </Flex>
          <Flex
            bg="rgba(0, 0, 0, 0.7)"
            flexDir="column"
            padding={3}
            borderRadius="xl"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontWeight="semibold" opacity={0.7}>
              Staked WYND
            </Text>
            <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
              {walletAddress
                ? formatCryptoCurrency.format(Number(microamountToAmount(Number(walletStakedTokens) || 0, 6)))
                : "-"}
            </Text>
          </Flex>
          <Flex
            bg="rgba(0, 0, 0, 0.7)"
            flexDir="column"
            padding={3}
            borderRadius="xl"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontWeight="semibold" opacity={0.7}>
              Total Rewards
            </Text>
            <Flex alignItems="center" justifyContent="center">
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
              {walletAddress && (
                <Button variant="ghost" _hover={{ bg: "none" }} onClick={() => withdrawAll()}>
                  Claim all!
                </Button>
              )}
            </Flex>
          </Flex>
          <Flex
            bg="rgba(0, 0, 0, 0.7)"
            flexDir="column"
            padding={3}
            borderRadius="xl"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontWeight="semibold" opacity={0.7}>
              New Proposals
            </Text>

            {walletAddress ? (
              <Flex justifyContent="center" alignItems="center">
                <UnvotedPropCount dashboard={true} />{" "}
                <Button variant="ghost" _hover={{ bg: "none" }} onClick={() => router.push("/vote")}>
                  Vote!
                </Button>
              </Flex>
            ) : (
              "-"
            )}
          </Flex>
          <Flex
            bg="rgba(0, 0, 0, 0.7)"
            flexDir="column"
            padding={3}
            borderRadius="xl"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontWeight="semibold" opacity={0.7}>
              WYND Price
            </Text>
            <Text
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="extrabold"
              bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
              bgClip="text"
            >
              ≈{wyndexPriceFormatted}
            </Text>
          </Flex>
          <Flex
            bg="rgba(0, 0, 0, 0.7)"
            flexDir="column"
            padding={3}
            borderRadius="xl"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontWeight="semibold" opacity={0.7}>
              Juno Price
            </Text>
            <Text
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="extrabold"
              bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
              bgClip="text"
            >
              ≈{junoPriceFormatted}
            </Text>
          </Flex>
        </Grid>
      </Box>
    </Box>
  );
}
