"use client";

import { Box, Flex, Image, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useState } from "react";
import { useCw20UserInfos } from "../../state";
import { PairInfo, PoolResponse } from "../../state/clients/types/WyndexPair.types";
import { useUserStakeInfos } from "../../state/hooks/useUserStakeInfos";
import TokenName from "../TokenName";

interface PoolCatalystProps {
  readonly chainData: PoolResponse;
  readonly pairData: PairInfo;
}

export default function PoolCatalyst({ chainData, pairData }: PoolCatalystProps) {
  const { colorMode } = useColorMode();
  const { address: walletAddress } = useWallet();
  const [rebondings, setRebondings] = useState<any[] | undefined>(undefined);

  // TODO: Query is missing for stake contract address
  const wyndexStake = "juno1yt7m620jnug2hkzp0hwwud3sjdcq3hw7l8cs5yqyqulrntnmmkes9dwung";

  //@ts-ignore
  const { allStakes } = useUserStakeInfos(wyndexStake, walletAddress);
  const { balance: lpBalance, refreshBalance } = useCw20UserInfos(pairData.liquidity_token);

  // TODO Add currently unstaking amounts
  const allStakesSum = allStakes.reduce((acc, obj) => {
    return acc + Number(obj.stake);
  }, 0);

  // calculating users share with all locked tokens and available tokens
  // by the total share of the LP token
  const totalTokens = allStakesSum + Number(lpBalance);
  const myShare = totalTokens / Number(chainData.total_share);

  return (
    <Box p={4} pt={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Pool Catalyst
      </Text>
      <SimpleGrid columns={{ md: 2 }} gap={8}>
        {chainData.assets.map((asset, i) => (
          <Box key={i} borderRadius="xl" bg={"wynd.base.sidebar"} p={6}>
            <Flex align="center" mb={4}>
              <Box
                w={20}
                h={20}
                bg="whiteAlpha.900"
                borderRadius="full"
                border="1px solid"
                borderColor="orange.300"
                overflow="hidden"
                p={0.5}
                mr={4}
              >
                {/* TODO */}
                <Image alt="Token 1 logo" src="https://via.placeholder.com/300" />
              </Box>
              <Box>
                <Text fontSize="3xl" fontWeight="extrabold"></Text>
                <Text fontWeight="bold" color={"wynd.neutral.600"}>
                  {asset.info.hasOwnProperty("token") ? (
                    // @ts-ignore
                    <TokenName address={asset.info.token} />
                  ) : (
                    // @ts-ignore
                    asset.info.native_token
                  )}
                </Text>
              </Box>
            </Flex>
            <Text fontWeight="bold" color={"wynd.neutral.600"}>
              Total amount
            </Text>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              {asset.amount}
            </Text>
            <Text fontWeight="bold" color={"wynd.neutral.600"}>
              My amount
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              {(myShare * Number(asset.amount)).toFixed(3)}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
