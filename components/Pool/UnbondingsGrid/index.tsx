"use client";

import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useStakeInfos } from "../../../state/hooks/useStakeInfos";
import UnbondingsItem from "./UnbondingsItem";

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
              <Text fontSize="lg" fontWeight="semibold" color={"whiteAlpha.600"} mb={{ base: 4, md: 2 }}>
                Bond liquidity to various minimum unbonding period to earn liquidity reward and swap fees
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
      <SimpleGrid columns={{ md: 2, lg: 3 }} gap={8} p={4} pb={12}>
        {infos.map(({ unbonding_period }, i) => {
          return <UnbondingsItem key={i} unbonding_period={unbonding_period} />;
        })}
      </SimpleGrid>
    </>
  );
}
