"use client";

import {
  Box,
  Button,
  chakra,
  Flex,
  GridItem,
  Heading,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PoolData } from ".";
import ManageLiquidityModal from "../ManageLiquidityModal";

interface PoolHeaderProps {
  readonly poolData: PoolData;
}

const LinkUndecorated = chakra(Link, { baseStyle: { _hover: { textDecoration: "none" } } });

export default function PoolHeader({ poolData }: PoolHeaderProps) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    console.log({ router });
  }, [router]);

  return (
    <>
      <Box bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")} p={4}>
        <Flex align="center" wrap="wrap" mb={6}>
          <Heading as="h2" fontWeight="extrabold" fontSize="2xl" wordBreak="break-word" mr={8} py={1}>
            Pools&nbsp;#{poolData.id}&nbsp;:&nbsp;{poolData.token1.name}/{poolData.token2.name}
          </Heading>
          <Flex align="center" wrap="wrap">
            <Button onClick={onOpen} m={2} ml={0} mr={{ md: 4 }}>
              Add/Remove Liquidity
            </Button>
            <Button
              as={LinkUndecorated}
              /* onClick={router.isReady ? () => router.push(`/`) : undefined} */
              m={2}
              ml={0}
            >
              Swap Tokens
            </Button>
          </Flex>
        </Flex>
        <SimpleGrid columns={{ md: 2 }} gap={{ base: 2, md: 4 }} maxW={{ lg: "50%" }}>
          <GridItem>
            <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
              Pool Liquidity
            </Text>
            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
              ${poolData.poolLiquidity.toLocaleString()}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
              My Liquidity
            </Text>
            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold">
              ${poolData.myLiquidity}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")} mb={1}>
              My Bounded Amount
            </Text>
            <Text fontSize={{ base: "lg", sm: "2xl" }} fontWeight="extrabold">
              ${poolData.bounded}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")} mb={1}>
              Swap Fee
            </Text>
            <Text fontSize={{ base: "lg", sm: "2xl" }} fontWeight="extrabold">
              {poolData.swapFee}%
            </Text>
          </GridItem>
        </SimpleGrid>
      </Box>
      <ManageLiquidityModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
