import { Box, Divider, Flex, Icon, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SwapOperation } from "../../../state/clients/types/WyndexMultiHop.types";
import { useSimulateOperationInfos } from "../../../state/hooks/useSimulateOperationInfos";
import { BiTransfer } from "react-icons/bi";

import React from "react";
import { CW20Asset, IBCAsset, Asset } from "@wynddao/asset-list";

interface IProps {
  fromToken: Asset | IBCAsset | CW20Asset;
  toToken: Asset | IBCAsset | CW20Asset;
  tokenInputValue: string;
  operations: SwapOperation[];
}

const Rate: React.FC<IProps> = ({ fromToken, toToken, tokenInputValue, operations }) => {
  const { simulatedOperation } = useSimulateOperationInfos("1000000", operations);
  return (
    <Flex
      bg="whiteAlpha.100"
      backdropFilter="blur(5px)"
      borderRadius="xl"
      p={6}
      maxW={{ lg: "600px" }}
      minW={{ lg: "600px" }}
      margin={{ lg: "0 auto" }}
      border="0"
      flexFlow="column"
      gap="1rem"
      alignItems="center"
    >
      <Flex
        w="full"
        justify="space-between"
        fontWeight="bold"
        fontSize={{ md: "lg" }}
        color={"wynd.gray.800"}
      >
        <Text color={"wynd.neutral.500"}>Rate</Text>
        <Text>
          1 {fromToken.denom.slice(1)} ≈ 0.222 {toToken.denom.slice(1)}
        </Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ md: "lg" }}>
        <Text color={"wynd.neutral.500"}>Swap Route</Text>
        <Text display="flex" gap="0.5rem" justifyContent="center" alignItems="center">
          {fromToken.name}
          <Icon as={BiTransfer} w="1rem" h="1rem" color={"wynd.base.text"} />
          {toToken.name}
        </Text>
      </Flex>
      <Flex
        w="full"
        justify="space-between"
        fontWeight="bold"
        fontSize={{ md: "lg" }}
        color={"wynd.gray.800"}
      >
        <Text color={"wynd.neutral.500"}>Swap Fee</Text>
        <Text>@TODO</Text>
      </Flex>
      <Flex
        w="full"
        justify="space-between"
        fontWeight="bold"
        fontSize={{ md: "lg" }}
        color={"wynd.alpha.900"}
      >
        <Text color={"wynd.neutral.500"}>Estimated Slippage</Text>
        <Text>@TODO</Text>
      </Flex>
    </Flex>
  );
};

export default Rate;
