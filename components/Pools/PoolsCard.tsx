"use client";

import { Box, Divider, Flex, Grid, GridItem, Image, SimpleGrid, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { PairInfo } from "../../state/clients/types/WyndexFactory.types";
import { microdenomToDenom } from "../../utils/tokens";
import TokenName from "../TokenName";

interface PoolsCardProps {
  readonly poolsData: readonly PairInfo[];
}

export default function PoolsCard({ poolsData }: PoolsCardProps) {
  console.log(poolsData);
  return (
    <SimpleGrid columns={{ sm: 2, lg: 4 }} gap={4} mb={8}>
      {poolsData.map((pool, index) => {
        return (
          <Link key={index} href={`/pools/${pool.contract_addr}`}>
            <Box
              borderRadius="lg"
              border="1px solid"
              borderColor={"wynd.cyan.500"}
              boxShadow="md"
              _hover={{
                cursor: "pointer",
                borderColor: "wynd.cyan.500",
              }}
              bg={"wynd.neutral.100"}
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
                    borderColor={"wynd.cyan.100"}
                    overflow="hidden"
                    p={0.5}
                  >
                    {/* TODO */}
                    <Image src="" alt="" />
                  </Box>
                  <Box
                    position="absolute"
                    left={{ base: 8, sm: 10 }}
                    w={{ base: 12, md: 14, lg: 16 }}
                    h={{ base: 12, md: 14, lg: 16 }}
                    bg="whiteAlpha.900"
                    borderRadius="full"
                    border="1px solid"
                    borderColor={"wynd.cyan.100"}
                    overflow="hidden"
                    p={0.5}
                  >
                    {/* TODO */}
                    <Image src="" alt="" />
                  </Box>
                </Flex>
                <Flex flexDirection="column" justify="center">
                  <Text fontSize="xl" fontWeight="extrabold">
                    {pool.asset_infos.map((assetInfo, index) => {
                      const divider = index === 0 ? " / " : null;

                      if (assetInfo.hasOwnProperty("native_token")) {
                        return (
                          <span key={index}>
                            {/* @ts-ignore */}
                            {microdenomToDenom(assetInfo.native_token)}
                            {divider}
                          </span>
                        );
                      } else {
                        return (
                          <span key={index}>
                            {/* @ts-ignore */}
                            <TokenName address={assetInfo.token} />
                            {divider}
                          </span>
                        );
                      }
                    })}
                  </Text>
                  <Text fontWeight="bold" color={"wynd.neutral.600"} wordBreak="break-word"></Text>
                </Flex>
              </Flex>
              <Grid templateColumns={{ lg: "1fr 1fr" }} gap={{ base: 2, md: 4 }}>
                <GridItem>
                  <Text fontWeight="semibold" color={"wynd.neutral.600"}>
                    APR
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold" wordBreak="break-word">
                    TODO
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="semibold" color={"wynd.neutral.600"}>
                    Fee
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
                    TODO
                  </Text>
                </GridItem>
                <GridItem colSpan={{ lg: 2 }}>
                  <Divider borderColor={"wynd.cyan.300"} />
                </GridItem>
                <GridItem>
                  <Text fontWeight="semibold" color={"wynd.neutral.600"}>
                    Liquidity
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
                    TODO <br />
                    TODO
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontWeight="semibold" color={"wynd.neutral.600"}>
                    Shares
                  </Text>
                  <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="extrabold">
                    TODO
                    <br />
                    TODO%
                  </Text>
                </GridItem>
              </Grid>
            </Box>
          </Link>
        );
      })}
    </SimpleGrid>
  );
}
