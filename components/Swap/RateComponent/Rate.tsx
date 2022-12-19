import { Flex, Icon, Text } from "@chakra-ui/react";
import { SwapOperation } from "../../../state/clients/types/WyndexMultiHop.types";
import { useSimulateOperationInfos } from "../../../state/hooks/useSimulateOperationInfos";
import { BiTransfer } from "react-icons/bi";

import React from "react";
import { Asset } from "@wynddao/asset-list";
import { microamountToAmount } from "../../../utils/tokens";
import { getDenom } from "../../../utils/assets";

interface IProps {
  fromToken: Asset;
  toToken: Asset;
  expectedAmount: string;
  inputAmount: string;
  slippage: number;
}

const Rate: React.FC<IProps> = ({ fromToken, toToken, expectedAmount, inputAmount, slippage }) => {
  const estimatedSlippage = ((100 - slippage) / 100) * Number(expectedAmount);
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
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Rate</Text>
        <Text>
          {inputAmount} {getDenom(fromToken)} ≈ {microamountToAmount(expectedAmount, toToken.decimals, 6)}{" "}
          {getDenom(toToken)}
        </Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Swap Route</Text>
        <Text display="flex" gap="0.5rem" justifyContent="center" alignItems="center">
          {getDenom(fromToken)}
          <Icon as={BiTransfer} w="1rem" h="1rem" color={"wynd.base.text"} />
          {getDenom(toToken)}
        </Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Swap Fee</Text>
        <Text>@CONTRACT</Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Estimated Slippage</Text>
        <Text>@CONTRACT</Text>
      </Flex>
      <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
        <Text color={"wynd.neutral.500"}>Minimum received amount</Text>
        <Text>{microamountToAmount(estimatedSlippage, toToken.decimals, 6)}</Text>
      </Flex>
    </Flex>
  );
};

export default Rate;
