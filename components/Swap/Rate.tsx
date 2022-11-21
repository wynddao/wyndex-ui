import { Box, Divider, Flex, Skeleton, Stack, Text, useColorMode } from "@chakra-ui/react";
import { SwapOperation } from "../../state/clients/types/WyndexMultiHop.types";
import { useSimulateOperationInfos } from "../../state/hooks/useSimulateOperationInfos";
import { handleChangeColorModeValue } from "../../utils/theme";
import { TokenInfo } from "../../utils/experimentalTokenList";

export default function Rate({
  fromItem,
  toItem,
  tokenInputValue,
  operations,
  amount,
}: {
  fromItem: TokenInfo | undefined;
  toItem: TokenInfo | undefined;
  tokenInputValue: string;
  operations: SwapOperation[];
  amount: string;
}) {
  const { colorMode } = useColorMode();
  // const { simulatedOperation } = useSimulateOperationInfos("1", operations);
  const simulatedOperation = 0.5;
  return (
    <Box
      bg={handleChangeColorModeValue(colorMode, "gray.50", "whiteAlpha.200")}
      borderRadius="xl"
      boxShadow={handleChangeColorModeValue(colorMode, "0 0 2px gray", "0 0 2px white")}
      p={6}
    >
      <Flex
        justify="space-between"
        align="start"
        fontWeight="bold"
        fontSize={{ md: "lg" }}
        color={handleChangeColorModeValue(colorMode, "blackAlpha.700", "whiteAlpha.700")}
        mb={1}
      >
        <Text flex={1} mr={2}>
          Rate
        </Text>
        {fromItem && toItem ? (
          <Stack as="span" isInline wrap="wrap" maxW={{ base: 56, sm: "initial" }} justify="end">
            <Text>
              {tokenInputValue}&ensp;{fromItem.name}
            </Text>
            <Text>=</Text>
            <Text>
              {Number(tokenInputValue) * Number(simulatedOperation)} &ensp;{toItem.name}
            </Text>
          </Stack>
        ) : (
          <Skeleton w={{ base: 32, sm: 48 }} h={{ base: 6, sm: 8 }} />
        )}
      </Flex>
      <Flex
        justify="space-between"
        fontWeight="bold"
        fontSize={{ md: "lg" }}
        color={handleChangeColorModeValue(colorMode, "blackAlpha.700", "whiteAlpha.700")}
      >
        <Text>Swap Fee</Text>
        <Text>0.3%</Text>
      </Flex>
      <Divider
        borderColor={handleChangeColorModeValue(colorMode, "blackAlpha.400", "whiteAlpha.600")}
        my={{ base: 4, md: 6 }}
      />
      <Flex
        justify="space-between"
        fontWeight="bold"
        fontSize={{ md: "lg" }}
        color={handleChangeColorModeValue(colorMode, "blackAlpha.800", "whiteAlpha.900")}
      >
        <Text>Estimated Slippage</Text>
        <Text>&lt;&nbsp;0.001%</Text>
      </Flex>
    </Box>
  );
}
