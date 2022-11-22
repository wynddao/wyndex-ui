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
import { usePairInfos, usePoolInfos } from "../../state";
import { AssetInfo } from "../../state/clients/types/WyndexMultiHop.types";
import { PairInfo, PoolResponse } from "../../state/clients/types/WyndexPair.types";
import { getAssetInfo } from "../../utils/assets";
import { Pair } from "../../utils/types";
import ManageLiquidityModal from "../ManageLiquidityModal";

interface PoolHeaderProps {
  readonly poolData: Pair;
  readonly chainData: PoolResponse;
  readonly pairData: PairInfo
}

const LinkUndecorated = chakra(Link, { baseStyle: { _hover: { textDecoration: "none" } } });

export default function PoolHeader({ poolData, chainData, pairData }: PoolHeaderProps) {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")} p={4}>
        <Flex align="center" wrap="wrap" mb={6}>
          <Heading as="h2" fontWeight="extrabold" fontSize="2xl" wordBreak="break-word" mr={8} py={1}>
            Pools&nbsp;#{poolData.id}&nbsp;:&nbsp;{poolData.tokens[0].name}/{poolData.tokens[1].name} <br />
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
              Pool Address
            </Text>
            <Text fontSize={{ base: "sm", sm: "sm" }} fontWeight="extrabold" wordBreak="break-word">
              {pairData.contract_addr}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
              Pool Liquidity
            </Text>
            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
              <span style={{ color: "red" }}>@TODO</span>
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>
              Liquidity Token Address
            </Text>
            <Text fontSize={{ base: "sm", sm: "sm" }} fontWeight="extrabold">
              {pairData.liquidity_token}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")} mb={1}>
              My Bounded Amount
            </Text>
            <Text fontSize={{ base: "lg", sm: "2xl" }} fontWeight="extrabold">
              <span style={{ color: "red" }}>@TODO</span>
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")} mb={1}>
              Swap Fee
            </Text>
            <Text fontSize={{ base: "lg", sm: "2xl" }} fontWeight="extrabold">
              {poolData.fee * 100} %
            </Text>
          </GridItem>
        </SimpleGrid>
      </Box>
      <ManageLiquidityModal isOpen={isOpen} onClose={onClose} poolData={poolData} />
    </>
  );
}
