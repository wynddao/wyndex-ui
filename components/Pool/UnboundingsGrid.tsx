"use client";

import { GridItem, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";
import { BondingPeriodInfo } from "../../state/clients/types/WyndexStake.types";
import { handleChangeColorModeValue } from "../../utils/theme";
import { convertSeconds } from "../../utils/time";

interface UnboundingsGridProps {
  readonly infos: readonly BondingPeriodInfo[];
}

export default function UnboundingsGrid({ infos }: UnboundingsGridProps) {
  const { colorMode } = useColorMode();

  return (
    <SimpleGrid columns={{ md: 2, lg: 3 }} gap={8} p={4} pb={12}>
      {infos.map(({ unbonding_period }, i) => {
        return (
          <GridItem
            key={i}
            bg={handleChangeColorModeValue(colorMode, "blackAlpha.50", "whiteAlpha.50")}
            borderRadius="xl"
            py={6}
            px={8}
          >
            <Text fontWeight="bold" fontSize="2xl">
              {convertSeconds(unbonding_period).days} Days
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
