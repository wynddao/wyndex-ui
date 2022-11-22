"use client";

import { Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";
import { Pair } from "../../utils/types";
import BoundingsTable from "./BoundingsTable";
import UnboundingsGrid from "./UnboundingsGrid";

export default function LiquidityMining({ poolData }: { poolData: Pair }) {
  return (
    <Box>
      <Box p={4} pt={8}>
        <Flex justify={{ md: "space-between" }} flexDirection={{ base: "column", md: "row" }}>
          <Box maxW={{ md: "md", lg: "2xl" }}>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              Liquidity Mining
            </Text>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
              mb={{ base: 4, md: 2 }}
            >
              Bond liquidity to various minimum unbonding period to earn liquidity reward and swap fees
            </Text>
          </Box>
          <Flex flexDirection="column" align={{ md: "end" }}>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
              mb={2}
            >
              Available LP tokens
            </Text>
            <Text fontSize="2xl" fontWeight="bold" align={{ md: "end" }} mb={2}>
              $0
            </Text>
            <Button>Start Earning</Button>
          </Flex>
        </Flex>
      </Box>
      <UnboundingsGrid unbondingPeriodList={poolData.unbondingPeriods} />
      <BoundingsTable unbondingPeriodList={poolData.unbondingPeriods} />
    </Box>
  );
}
