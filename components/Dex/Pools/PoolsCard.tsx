import { Box, Divider, Flex, Grid, GridItem, Text, useBreakpointValue } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { useCw20UserInfos, usePairInfos, usePoolInfos } from "../../../state";
import { useStakeInfos } from "../../../state/hooks/useStakeInfos";
import { useUserStakeInfos } from "../../../state/hooks/useUserStakeInfos";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { getAssetInfoDetails, getAssetPrice, getNativeIbcTokenDenom } from "../../../utils/assets";
import { formatCurrency } from "../../../utils/currency";
import { microamountToAmount, microdenomToDenom } from "../../../utils/tokens";
import AssetImage from "../AssetImage";
import Carousel from "../Carousel";
import TokenName from "../TokenName";
import MaxApr from "./MaxApr";

interface PoolsCardProps {
  readonly poolsData: readonly any[];
  readonly allPools: any[];
  readonly assetPrices: any[];
}

export default function PoolsCard({ poolsData, allPools, assetPrices }: PoolsCardProps) {
  const slides = useBreakpointValue({ base: 1, lg: 2, xl: 3, "2xl": 4, "4xl": 6 }) || 1;

  return (
    <Carousel numOfSlides={slides}>
      {poolsData.map((pool, index) => (
        <PoolCard key={index} allPools={allPools} assetPrices={assetPrices} pool={pool} />
      ))}
    </Carousel>
  );
}

interface PoolCardProps {
  readonly allPools: any[];
  readonly assetPrices: any[];
  readonly pool: any;
}

function PoolCard({ allPools, assetPrices, pool }: PoolCardProps) {
  const currency = useRecoilValue(currencyAtom);
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

  const { pool: chainData } = usePoolInfos(pool.address);
  const assetInfo = [chainData.assets[0].info, chainData.assets[1].info];
  const { pair: pairData } = usePairInfos(assetInfo);
  const wyndexStake = pairData.staking_addr;
  const { address: walletAddress } = useChain("juno");
  const { allStakes } = useUserStakeInfos(wyndexStake, walletAddress || "");

  // Calculate total share in USD
  const totalFiatShares =
    Number(microamountToAmount(chainData.assets[0].amount, tokenInfo1.decimals)) *
      (currency === "USD" ? tokenPrice1.priceInUsd : tokenPrice1.priceInEur) +
    Number(microamountToAmount(chainData.assets[1].amount, tokenInfo2.decimals)) *
      (currency === "USD" ? tokenPrice2.priceInUsd : tokenPrice2.priceInEur);
  const { balance: lpBalance } = useCw20UserInfos(pairData.liquidity_token);

  //  Add currently unstaking amounts
  const { pendingUnstaking } = useStakeInfos(pairData.staking_addr, true);

  const unstakesSum = pendingUnstaking.reduce((acc, obj) => {
    return acc + Number(obj.amount);
  }, 0);

  const allStakesSum = allStakes.reduce((acc: number, obj) => {
    return acc + Number(obj.stake);
  }, 0);

  const totalTokens = unstakesSum + allStakesSum + Number(lpBalance);
  const myShare = totalTokens / Number(chainData.total_share);
  const myFiatShare = myShare * totalFiatShares;

  return myFiatShare > 0.01 ? (
    <Link href={`/pools/${pool.address}`}>
      <Flex
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
        minHeight="20rem"
        flexFlow="column"
        justifyContent="space-between"
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
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
              APR
            </Text>
            <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold" wordBreak="break-word">
              <MaxApr poolAddress={pool.address} assetPrices={assetPrices} />
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
              TVL
            </Text>
            <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
              {tvl}
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Divider borderColor={"wynd.cyan.300"} />
          </GridItem>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
              Total Liquidity
            </Text>

            <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
              {microamountToAmount(token1.amount, tokenInfo1.decimals, 0)} {tokenInfo1.symbol}
              <br />
              {microamountToAmount(token2.amount, tokenInfo2.decimals, 0)} {tokenInfo2.symbol}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
              My Shares
            </Text>
            <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
              {formatCurrency(currency, `${myFiatShare}`)}
            </Text>
          </GridItem>
        </Grid>
      </Flex>
    </Link>
  ) : null;
}
