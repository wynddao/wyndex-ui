"use client";

import { Box, Flex, Image, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import { PoolData } from ".";

interface PoolCatalystProps {
  readonly poolData: PoolData;
}

export default function PoolCatalyst({ poolData }: PoolCatalystProps) {
  return (
    <Box p={4} pt={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Pool Catalyst
      </Text>
      <SimpleGrid columns={{ md: 2 }} gap={8}>
        <Box borderRadius="xl" bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")} p={6}>
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
              <Image alt="Token 1 logo" src={poolData.token1.img} />
            </Box>
            <Box>
              <Text fontSize="3xl" fontWeight="extrabold">
                {poolData.token1.percent}%
              </Text>
              <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
                {poolData.token1.name}
              </Text>
            </Box>
          </Flex>
          <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
            Total amount
          </Text>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            {poolData.token1.tokenTotalAmount.toLocaleString()}&nbsp;
            {poolData.token1.name}
          </Text>
          <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
            My amount
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            {poolData.token1.amount.toLocaleString()}&nbsp;
            {poolData.token1.name}
          </Text>
        </Box>
        <Box borderRadius="xl" bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")} p={6}>
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
              <Image alt="Token 2 logo" src={poolData.token2.img} />
            </Box>
            <Box>
              <Text fontSize="3xl" fontWeight="extrabold">
                {poolData.token2.percent}%
              </Text>
              <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
                {poolData.token2.name}
              </Text>
            </Box>
          </Flex>
          <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
            Total amount
          </Text>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            {poolData.token2.tokenTotalAmount.toLocaleString()}&nbsp;
            {poolData.token2.name}
          </Text>
          <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
            My amount
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            {poolData.token2.amount.toLocaleString()}&nbsp;
            {poolData.token2.name}
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
