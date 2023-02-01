import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useGaugeConfigs, useIndexerInfos } from "../../../state";
import { AssetInfoValidated } from "../../../state/clients/types/WyndexFactory.types";
import { GaugeResponse } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { PairsResponse } from "../../../state/recoil/selectors/clients/indexer";
import { getAssetByDenom } from "../../../utils/assets";
import AssetImage from "../../Dex/AssetImage";
import TokenName from "../../Dex/TokenName";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { GaugeHeader } from "./GaugeHeader";
import { Vote } from "./Vote";

interface PoolWithAddresses {
  assets: AssetInfoValidated[];
  lp: string;
  pair: string;
  staking: string;
}

export const Gauge = ({
  options,
  gauge,
  refreshVotes,
}: {
  options: [string, string][];
  gauge: GaugeResponse;
  refreshVotes: () => void;
}) => {
  const { config, allOptions: _all } = useGaugeConfigs(gauge.adapter);
  const { pools, pairs } = useIndexerInfos({ fetchPoolData: true });

  const poolsWithStakingAddress: PoolWithAddresses[] = pairs.map((pair: PairsResponse) => {
    return {
      ...pair,
      assets: [...pools[pair.pair]],
    };
  });

  return (
    <>
      <GaugeHeader gauge={gauge} />
      <Grid gap={6} mt={8} templateColumns={"1fr 1fr"}>
        <BorderedBox>
          <Text fontSize="2xl">Current Votes For Next Epoch</Text>
          <Text mb={4} fontSize="sm">
            (Starting {new Date(gauge.next_epoch * 1000).toLocaleDateString()})
          </Text>
          {poolsWithStakingAddress.map((pool, i) => (
            <Grid
              templateColumns={"2fr 3fr 1fr"}
              py={2}
              key={i}
              borderBottom="solid 1px white"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex align="center">
                <Flex position="relative" align="center" pr={{ base: 5, sm: 7 }}>
                  <Box
                    w={{ base: 6, md: 7, lg: 8 }}
                    h={{ base: 6, md: 7, lg: 8 }}
                    bg="whiteAlpha.900"
                    borderRadius="full"
                    border="1px solid"
                    borderColor={"wynd.cyan.100"}
                    overflow="hidden"
                    p={0.5}
                  >
                    {/* @ts-ignore */}
                    <AssetImage asset={(pool.assets[0].token || pool.assets[0].native) as string} />
                  </Box>
                  <Box
                    position="absolute"
                    left={{ base: 4, sm: 5 }}
                    w={{ base: 6, md: 7, lg: 8 }}
                    h={{ base: 6, md: 7, lg: 8 }}
                    bg="whiteAlpha.900"
                    borderRadius="full"
                    border="1px solid"
                    borderColor={"wynd.cyan.100"}
                    overflow="hidden"
                    p={0.5}
                  >
                    {/* @ts-ignore */}
                    <AssetImage asset={(pool.assets[1].token || pool.assets[1].native) as string} />
                  </Box>
                </Flex>
                {pool.assets[0].hasOwnProperty("native") ? (
                  <span>
                    {/* @ts-ignore */}
                    {`${getAssetByDenom(pool.assets[0].native)?.symbol}`}
                  </span>
                ) : (
                  // @ts-ignore
                  <TokenName symbol={true} address={pool.assets[0].token} />
                )}
                {" / "}
                {pool.assets[1].hasOwnProperty("native") ? (
                  <span>
                    {/* @ts-ignore */}
                    {`${getAssetByDenom(pool.assets[1].native)?.symbol}`}
                  </span>
                ) : (
                  // @ts-ignore
                  <TokenName symbol={true} address={pool.assets[1].token} />
                )}
              </Flex>
              <Flex align="center">1000$ per epoch</Flex>
              <Flex align="center">10%</Flex>
            </Grid>
          ))}
        </BorderedBox>
        <BorderedBox>
          <Text mb={4} fontSize="2xl">
            Place Your Votes
          </Text>
        </BorderedBox>
      </Grid>
    </>
  );
};
