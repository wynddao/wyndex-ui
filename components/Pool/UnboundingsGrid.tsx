"use client";

import { GridItem, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";
import { BondingPeriodInfo } from "../../state/clients/types/WyndexStake.types";
import { secondsToDays } from "../../utils/time";

interface UnboundingsGridProps {
  readonly infos: readonly BondingPeriodInfo[];
}

export default function UnboundingsGrid({ infos }: UnboundingsGridProps) {
  const { colorMode } = useColorMode();

  return (
    <SimpleGrid columns={{ md: 2, lg: 3 }} gap={8} p={4} pb={12}>
      {infos.map(({ unbonding_period }, i) => {
        return (
          <GridItem key={i} bg={"wynd.neutral.100"} borderRadius="xl" py={6} px={8}>
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
  );
}
