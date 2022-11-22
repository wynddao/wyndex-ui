"use client";

import { Box, Divider, Flex, Grid, GridItem, Image, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";

import { handleChangeColorModeValue } from "../../utils/theme";
import { Pair } from "../../utils/types";

interface PoolsCardProps {
  readonly poolsData: readonly Pair[];
}

export default function PoolsCard({ poolsData }: PoolsCardProps) {
  const { colorMode } = useColorMode();

  return (
    <SimpleGrid columns={{ sm: 2, lg: 4 }} gap={4} mb={8}>
      {poolsData.map(({ id, apr, fee, tokens }, index) => {
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
                  >
                    <Image src={tokens[0].img} alt={tokens[0].name} />
                  </Box>
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
                  >
                    <Image src={tokens[1].img} alt={tokens[1].name} />
                  </Box>
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
                    APR
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold" wordBreak="break-word">
                    {apr * 100} %
                  </Text>
                </GridItem>
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
                  >
                    Fee
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
                    {fee * 100} %
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
                    Liquidity
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
                    {tokens[0].liquidity?.amount} {tokens[0].denom} <br />
                    {tokens[1].liquidity?.amount} {tokens[1].denom}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text
                    fontWeight="semibold"
                    color={handleChangeColorModeValue(colorMode, "blackAlpha.600", "whiteAlpha.600")}
                  >
                    Shares
                  </Text>
                  {tokens[0].liquidity && tokens[1].liquidity && (
                    <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
                      {tokens[0].liquidity?.shares * 100} %<br />
                      {tokens[1].liquidity?.shares * 100} %
                    </Text>
                  )}
                </GridItem>
              </Grid>
            </Box>
          </Link>
        );
      })}
    </SimpleGrid>
  );
}
