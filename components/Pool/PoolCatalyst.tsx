"use client";

import { Box, Flex, Image, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";
import { PairInfo, PoolResponse } from "../../state/clients/types/WyndexPair.types";
import { handleChangeColorModeValue } from "../../utils/theme";
import TokenName from "../TokenName";

interface PoolCatalystProps {
  readonly chainData: PoolResponse;
  readonly pairData: PairInfo;
}

export default function PoolCatalyst({ chainData, pairData }: PoolCatalystProps) {
  const { colorMode } = useColorMode();
  return (
    <Box p={4} pt={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Pool Catalyst
      </Text>
      <SimpleGrid columns={{ md: 2 }} gap={8}>
        {chainData.assets.map((asset, i) => (
          <Box
            key={i}
            borderRadius="xl"
            bg={handleChangeColorModeValue(colorMode, "blackAlpha.50", "whiteAlpha.50")}
            p={6}
          >
            <Flex align="center" mb={4}>
              <Box
                w={20}
                h={20}
                bg="whiteAlpha.900"
                borderRadius="full"
                border="1px solid"
                borderColor="orange.300"
                overflow="hidden"
                p={0.5}
                mr={4}
              >
                {/* TODO */}
                <Image alt="Token 1 logo" src="https://via.placeholder.com/300" />
              </Box>
              <Box>
                <Text fontSize="3xl" fontWeight="extrabold"></Text>
                <Text
                  fontWeight="bold"
                  color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
                >
                  {asset.info.hasOwnProperty("token") ? (
                    // @ts-ignore
                    <TokenName address={asset.info.token} />
                  ) : (
                    // @ts-ignore
                    asset.info.native_token
                  )}
                </Text>
              </Box>
            </Flex>
            <Text
              fontWeight="bold"
              color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
            >
              Total amount
            </Text>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              {asset.amount}
            </Text>
            <Text
              fontWeight="bold"
              color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
            >
              My amount
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              TODO
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
