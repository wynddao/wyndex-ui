import { Box, Divider, Flex, Grid, GridItem, Progress, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosHelp } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { LsdEntry } from ".";
import { useCw20UserInfos, useIndexerInfos, useTokenInfo } from "../../../state";
import { useLsdInfos } from "../../../state/hooks/lsd/useLsdInfos";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { getApr, getValidatorAvgCommission } from "../../../utils/chain";
import { formatCurrency } from "../../../utils/currency";
import { getAssetList } from "../../../utils/getAssetList";
import { microamountToAmount, microdenomToDenom } from "../../../utils/tokens";
import AssetImage from "../../Dex/AssetImage";

export const LsdCard = ({ lsdEntry }: { lsdEntry: LsdEntry }) => {
  const lsdContract = lsdEntry.contractAddr;

  // Wallet & LSD Infos
  const { config, exchange_rate, supply, validatorSet } = useLsdInfos(lsdContract);
  const { balance: _balance, refreshBalance } = useCw20UserInfos(config.token_contract);
  const { totalSupply } = useTokenInfo(config.token_contract);
  // Fetch AssetPrices to calculate TVL
  const { assetPrices } = useIndexerInfos({});
  const lsdAssetPrice = assetPrices.find((el) => el.asset === "ujuno")!;

  // Random background image
  const randomIntFromInterval = (min: number, max: number) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const currency = useRecoilValue(currencyAtom);

  const [apy, setAPY] = useState<number | undefined>(undefined);

  const unstakedRatio =
    Number(supply.total_bonded) > 0 && Number(supply.total_unbonding) > 0
      ? Number(supply.total_bonded) / Number(supply.total_unbonding)
      : 1;

  // Calculate JUNO APR
  const fetchData = async () => {
    const { nominalAPR } = await getApr();
    const validatorAvgCommission = await getValidatorAvgCommission(validatorSet);
    const wyndNominalAPY =
      100 *
        (1 +
          (nominalAPR - (nominalAPR * validatorAvgCommission + nominalAPR * Number(config.commission))) /
            365) **
          365 -
      100;
    setAPY(wyndNominalAPY);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      _hover={{
        cursor: "pointer",
        borderColor: "wynd.cyan.500",
      }}
      border="1px solid"
      borderColor={"wynd.neutral.100"}
      position="relative"
      boxShadow="md"
      borderRadius="lg"
    >
      <Link href={`/lsd/${lsdEntry.id}`}>
        <Flex
          borderRadius="lg"
          backgroundColor={"wynd.gray.alpha.10"}
          backgroundImage={
            randomIntFromInterval(1, 2) === 1 ? "url(/trippy_bg_2.png)" : "url(/trippy_bg.png)"
          }
          backgroundPosition="right top"
          bgRepeat="no-repeat"
          p={4}
          flexFlow="column"
          justifyContent="space-between"
        >
          <Flex mt={2} align="center" mb={4}>
            <Flex position="relative" align="center" pr={2}>
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
                <AssetImage asset={lsdEntry.tokenDenom} />
              </Box>
            </Flex>
            <Flex flexDirection="column" justify="center">
              <Text fontSize="xl" fontWeight="extrabold">
                {lsdEntry.chainName}
              </Text>
              <Text fontWeight="bold" color={"wynd.neutral.600"} wordBreak="break-word"></Text>
            </Flex>
            <Box position="relative" ml={4} w={"100%"}>
              <Progress
                height={6}
                width={"100%"}
                bg={"wynd.gray.700"}
                colorScheme={"teal"}
                value={unstakedRatio * 100}
              />
              <Text
                top={0}
                ml={2}
                position="absolute"
                bgGradient="linear(to-l, wynd.green.200, wynd.cyan.200)"
                bgClip="text"
                display="inline-block"
              >
                Unstaked: {unstakedRatio * 100}%
              </Text>
            </Box>
          </Flex>
          <Grid templateColumns={"1fr 1fr"} gap={{ base: 2, md: 4 }}>
            <GridItem>
              <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
                Tokens Staked
              </Text>
              <Flex justifyContent="left" alignItems="center">
                <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
                  {(Number(supply.total_bonded) / 10 ** 6).toFixed(2)} {microdenomToDenom(supply.bond_denom)}
                </Text>
                <Tooltip label="This value is updated once per day.">
                  <span>
                    <IoIosHelp color="yellow" style={{ cursor: "pointer" }} size="30" />
                  </span>
                </Tooltip>
              </Flex>
            </GridItem>
            <GridItem>
              <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
                TVL
              </Text>
              <Flex mt={"2px"} justifyContent="left" alignItems="center">
                <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
                  {formatCurrency(
                    currency,
                    (
                      ((currency === "EUR" ? lsdAssetPrice.priceInEur : lsdAssetPrice.priceInUsd) *
                        Number(exchange_rate) *
                        Number(totalSupply)) /
                      10 ** 6
                    ).toFixed(2),
                  )}
                </Text>
              </Flex>
            </GridItem>
            <GridItem colSpan={2}>
              <Divider borderColor={"wynd.cyan.300"} />
            </GridItem>
          </Grid>
          <Grid templateColumns={"1fr 1fr"} gap={{ base: 2, md: 4 }}>
            <GridItem>
              <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
                MY STAKED TOKENS
              </Text>
              <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="extrabold">
                {microamountToAmount(Number(_balance) / Number(exchange_rate), 6)}{" "}
                {microdenomToDenom(supply.bond_denom)}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="semibold" color={"wynd.neutral.500"} fontSize={{ base: "xs", md: "sm" }}>
                APY
              </Text>
              <Text
                bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
                bgClip="text"
                display="inline-block"
                fontSize={{ base: "md", sm: "lg" }}
                fontWeight="extrabold"
              >
                {apy ? apy.toFixed(2) + "%" : <Spinner color="blue" />}
              </Text>
            </GridItem>
          </Grid>
        </Flex>
      </Link>
    </Box>
  );
};
