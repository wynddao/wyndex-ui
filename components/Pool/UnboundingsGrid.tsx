"use client";

import { GridItem, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";
import { handleChangeColorModeValue } from "../../utils/theme";
import { UnbondingPeriod } from "../../utils/types";

interface UnboundingsGridProps {
  readonly unbondingPeriodList: readonly UnbondingPeriod[];
}

export default function UnboundingsGrid({ unbondingPeriodList }: UnboundingsGridProps) {
  const { colorMode } = useColorMode();

  return (
    <SimpleGrid columns={{ md: 2, lg: 3 }} gap={8} p={4} pb={12}>
      {unbondingPeriodList.map(({ duration, apr }, i) => {
        return (
          <GridItem
            key={i}
            bg={handleChangeColorModeValue(colorMode, "blackAlpha.50", "whiteAlpha.50")}
            borderRadius="xl"
            py={6}
            px={8}
          >
            <Text fontWeight="bold" fontSize="2xl">
              {new Date(duration).getMinutes()} Days
            </Text>
            <Text fontWeight="bold" fontSize="xl" color="orange.300">
              APR {apr * 100}%
            </Text>
          </GridItem>
        );
      })}
    </SimpleGrid>
  );
}
