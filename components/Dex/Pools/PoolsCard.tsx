"use client";
import { Box, Divider, Flex, Grid, GridItem, Text, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { getAssetInfoDetails, getAssetPrice, getNativeIbcTokenDenom } from "../../../utils/assets";
import { formatCurrency, formatCurrencyStatic } from "../../../utils/currency";
import { microamountToAmount, microdenomToDenom } from "../../../utils/tokens";
import AssetImage from "../AssetImage";
import TokenName from "../TokenName";
import MaxApr from "./MaxApr";
import { useRecoilValue } from "recoil";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import MyShares from "./MyShares";
import Carousel from "../Carousel";
import { Asset } from "@wynddao/asset-list";

interface PoolsCardProps {
  readonly poolsData: readonly any[];
  readonly allPools: any[];
  readonly assetPrices: any[];
}

function PoolCard({
  index,
  pool,
  tokens,
  tvl,
}: {
  index: number;
  pool: any;
  tokens: [Asset & { amount: string }, Asset & { amount: string }];
  tvl: string;
}) {
  const [token1, token2] = tokens;

  return (
    <Link key={index} href={`/pools/${pool.address}`}>
      <Box
        borderRadius="lg"
        border="1px solid"
        borderColor={"wynd.neutral.100"}
        boxShadow="md"
        _hover={{
          cursor: "pointer",
          borderColor: "wynd.cyan.500",
        }}
        backgroundColor={"wynd.gray.alpha.10"}
        backgroundImage={"url(/images/Vector2Bg.png)"}
        backgroundPosition="right"
        p={4}
      >
        <Flex align="center" mb={4}>
          <Flex position="relative" align="center" pr={{ base: 10, sm: 14 }}>
            <Box
              w={{ base: 12, md: 14, lg: 16 }}
              h={{ base: 12, md: 14, lg: 16 }}
              bg="whiteAlpha.900"
              borderRadius="full"
              border="1px solid"
              borderColor={"wynd.cyan.100"}
              overflow="hidden"
              p={0.5}
            >
              <AssetImage
                asset={
                  pool.value.pair_info.asset_infos[0].hasOwnProperty("token")
                    ? //  @ts-ignore
                      pool.value.pair_info.asset_infos[0].token
                    : //  @ts-ignore
                      pool.value.pair_info.asset_infos[0].native
                }
              />
            </Box>
            <Box
              position="absolute"
              left={{ base: 8, sm: 10 }}
              w={{ base: 12, md: 14, lg: 16 }}
              h={{ base: 12, md: 14, lg: 16 }}
              bg="whiteAlpha.900"
              borderRadius="full"
              border="1px solid"
              borderColor={"wynd.cyan.100"}
              overflow="hidden"
              p={0.5}
            >
              <AssetImage
                asset={
                  pool.value.pair_info.asset_infos[1].hasOwnProperty("token")
                    ? //  @ts-ignore
                      pool.value.pair_info.asset_infos[1].token
                    : //  @ts-ignore
                      pool.value.pair_info.asset_infos[1].native
                }
              />
            </Box>
          </Flex>
          <Flex flexDirection="column" justify="center">
            <Text fontSize="xl" fontWeight="extrabold">
              {pool.value.pair_info.asset_infos.map((assetInfo: any, index: number) => {
                const divider = index === 0 ? " / " : null;

                if (assetInfo.hasOwnProperty("native")) {
                  return (
                    <span key={index}>
                      {microdenomToDenom(getNativeIbcTokenDenom(assetInfo.native))}
                      {divider}
                    </span>
                  );
                } else {
                  return (
                    <span key={index}>
                      <TokenName symbol={true} address={assetInfo.token} />
                      {divider}
                    </span>
                  );
                }
              })}
            </Text>
            <Text fontWeight="bold" color={"wynd.neutral.600"} wordBreak="break-word"></Text>
          </Flex>
        </Flex>
        <Grid templateColumns={"1fr 1fr"} gap={{ base: 2, md: 4 }}>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "sm", md: "md" }}>
              APR
            </Text>
            <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold" wordBreak="break-word">
              <MaxApr poolAddress={pool.address} />
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "sm", md: "md" }}>
              TVL
            </Text>
            <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
              {tvl}
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Divider borderColor={"wynd.cyan.300"} />
          </GridItem>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "sm", md: "md" }}>
              Total Liquidity
            </Text>

            <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
              {microamountToAmount(token1.amount, token1.decimals, 0)} {token1.symbol}
              <br />
              {microamountToAmount(token2.amount, token2.decimals, 0)} {token2.symbol}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "sm", md: "md" }}>
              My Shares
            </Text>
            <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
              <MyShares poolAddress={pool.address} />
            </Text>
          </GridItem>
        </Grid>
      </Box>
    </Link>
  );
}

export default function PoolsCard({ poolsData, allPools, assetPrices }: PoolsCardProps) {
  const currency = useRecoilValue(currencyAtom);
  const items = poolsData.map((pool, index) => {
    const [token1, token2] = allPools[pool.address];
    const tokenPrice1 = getAssetPrice(token1, assetPrices);
    const tokenPrice2 = getAssetPrice(token2, assetPrices);
    const tokenInfo1 = getAssetInfoDetails(token1);
    const tokenInfo2 = getAssetInfoDetails(token2);

    const tvl = formatCurrency(
      currency,
      Number(
        (currency === "USD" ? tokenPrice1.priceInUsd : tokenPrice1.priceInEur) *
          Number(microamountToAmount(token1.amount, tokenInfo1.decimals)) +
          (currency === "USD" ? tokenPrice2.priceInUsd : tokenPrice2.priceInEur) *
            Number(microamountToAmount(token2.amount, tokenInfo2.decimals)),
      ).toString(),
    );

    return (
      <div key={index}>
        <PoolCard
          tvl={tvl}
          pool={pool}
          tokens={[
            { ...tokenInfo1, amount: token1.amount },
            { ...tokenInfo2, amount: token2.amount },
          ]}
          index={index}
        />
      </div>
    );
  });

  const slides =
    useBreakpointValue({
      base: 1,
      lg: 2,
      xl: 3,
      "2xl": 4,
    }) || 1;

  return <Carousel numOfSlides={slides}>{items}</Carousel>;
}