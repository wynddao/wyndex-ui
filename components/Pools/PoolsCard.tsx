"use client";

import { Box, Divider, Flex, Grid, GridItem, Image, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { PairInfo } from "../../state/clients/types/WyndexPair.types";

import { handleChangeColorModeValue } from "../../utils/theme";

interface PoolsCardProps {
  readonly poolsData: readonly PairInfo[];
}

export default function PoolsCard({ poolsData }: PoolsCardProps) {
  const { colorMode } = useColorMode();

  return (
    <SimpleGrid columns={{ sm: 2, lg: 4 }} gap={4} mb={8}>
      {poolsData.map(({ asset_infos, contract_addr, liquidity_token, pair_type }, index) => {
        return (
          <Link key={index} href={`/pools/${index}`}>
            <Box
              borderRadius="lg"
              border="1px solid"
              borderColor={handleChangeColorModeValue(colorMode, "primary.500", "primary.300")}
              boxShadow="md"
              _hover={{
                cursor: "pointer",
                borderColor: handleChangeColorModeValue(colorMode, "primary.500", "primary.300"),
              }}
              bg={handleChangeColorModeValue(colorMode, "blackAlpha.50", "whiteAlpha.50")}
              p={4}
            >
              <Flex align="center" mb={4}>
                <Flex position="relative" align="center" pr={{ base: 10, sm: 14 }}>
                  <Box
                    w={{ base: 12, md: 14, lg: 16 }}
                    h={{ base: 12, md: 14, lg: 16 }}
                    bg="whiteAlpha.900"
                    borderRadius="full"
                    border="1px solid"
                    borderColor={handleChangeColorModeValue(colorMode, "primary.100", "primary.900")}
                    overflow="hidden"
                    p={0.5}
                  ></Box>
                  <Box
                    position="absolute"
                    left={{ base: 8, sm: 10 }}
                    w={{ base: 12, md: 14, lg: 16 }}
                    h={{ base: 12, md: 14, lg: 16 }}
                    bg="whiteAlpha.900"
                    borderRadius="full"
                    border="1px solid"
                    borderColor={handleChangeColorModeValue(colorMode, "primary.100", "primary.900")}
                    overflow="hidden"
                    p={0.5}
                  ></Box>
                </Flex>
                <Flex flexDirection="column" justify="center">
                  <Text fontSize="xl" fontWeight="extrabold">
                    Pools #{index}
                  </Text>
                  <Text
                    fontWeight="bold"
                    color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
                    wordBreak="break-word"
                  ></Text>
                </Flex>
              </Flex>
              <Grid templateColumns={{ lg: "1fr 1fr" }} gap={{ base: 2, md: 4 }}>
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
                  >
                    Pool Liquidity Token
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold" wordBreak="break-word">
                    {liquidity_token}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
                  >
                    Contract:
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
                    {contract_addr}
                  </Text>
                </GridItem>
                <GridItem colSpan={{ lg: 2 }}>
                  <Divider
                    borderColor={handleChangeColorModeValue(colorMode, "primary.300", "primary.100")}
                  />
                </GridItem>
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
                  >
                    My Liquidity
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold"></Text>
                </GridItem>
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
                  >
                    My Bounded Amount
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold"></Text>
                </GridItem>
              </Grid>
            </Box>
          </Link>
        );
      })}
    </SimpleGrid>
  );
}
