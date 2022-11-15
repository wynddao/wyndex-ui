"use client";

import { GridItem, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";
import { UnbondingPeriodListData } from ".";
import { handleChangeColorModeValue } from "../../utils/theme";

interface UnboundingsGridProps {
  readonly unbondingPeriodList: readonly UnbondingPeriodListData[];
}

export default function UnboundingsGrid({ unbondingPeriodList }: UnboundingsGridProps) {
  const { colorMode } = useColorMode();

  return (
    <SimpleGrid columns={{ md: 2, lg: 3 }} gap={8} p={4} pb={12}>
      {unbondingPeriodList.map(({ days, apr }, i) => {
        return (
          <GridItem
            key={i}
            bg={handleChangeColorModeValue(colorMode, "blackAlpha.50", "whiteAlpha.50")}
            borderRadius="xl"
            py={6}
            px={8}
          >
            <Text fontWeight="bold" fontSize="2xl">
              {days === "1" ? "a day" : `${days} days`}&nbsp;unbonding
            </Text>
            <Text fontWeight="bold" fontSize="xl" color="orange.300">
              APR {apr}%
            </Text>
          </GridItem>
        );
      })}
    </SimpleGrid>
  );
}
