"use client";

import { Box, Flex, GridItem, SimpleGrid, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { BondingPeriodInfo } from "../../state/clients/types/WyndexStake.types";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { secondsToDays } from "../../utils/time";

interface UnboundingsGridProps {
  stakeAddress: string;
}

export default function UnboundingsGrid({ stakeAddress }: UnboundingsGridProps) {
  const { infos } = useStakeInfos(stakeAddress);
  const { address: walletAddress } = useWallet();

  return (
    <>
      {!walletAddress && (
        <Box p={4} pt={8}>
          <Flex justify={{ md: "space-between" }} flexDirection={{ base: "column", md: "row" }}>
            <Box maxW={{ md: "md", lg: "2xl" }}>
              <Text fontSize="2xl" fontWeight="bold" mb={2}>
                Liquidity Mining
              </Text>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color={"whiteAlpha.600"}
                mb={{ base: 4, md: 2 }}
              >
                Bond liquidity to various minimum unbonding period to earn liquidity reward and swap fees
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
      <SimpleGrid columns={{ md: 2, lg: 3 }} gap={8} p={4} pb={12}>
        {infos.map(({ unbonding_period }, i) => {
          return (
            <GridItem
              bgImage={"/images/Vector3.png"}
              bgPos="right"
              bgRepeat="no-repeat"
              key={i}
              bgColor={"wynd.base.sidebar"}
              borderRadius="xl"
              py={6}
              px={8}
            >
              <Text fontWeight="bold" fontSize="2xl">
                {secondsToDays(unbonding_period)} Days
              </Text>
              <Text fontWeight="bold" fontSize="xl" color="orange.300">
                20% APR @TODO
              </Text>
            </GridItem>
          );
        })}
      </SimpleGrid>
    </>
  );
}
