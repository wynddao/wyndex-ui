import { Box, GridItem, ScaleFade, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AnnualizedReward } from "../../../state/clients/types/WyndexStake.types";
import { secondsToDays } from "../../../utils/time";
import { getApr } from "../util/apr";

export default function UnbondingsItem({
  unbonding_period,
  apr,
}: {
  unbonding_period: number;
  apr: {
    unbonding_period: number;
    apr: number;
  }[];
}) {
  return (
    <GridItem pos="relative">
      <Box
        bgImage={"/images/Vector3.png"}
        bgPos="right"
        bgRepeat="no-repeat"
        bgColor={"wynd.base.sidebar"}
        borderRadius="xl"
        py={6}
        px={8}
      >
        <Text fontWeight="bold" fontSize="2xl">
          {secondsToDays(unbonding_period)} Days
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          {getApr(apr, unbonding_period)}
        </Text>
      </Box>
    </GridItem>
  );
}
