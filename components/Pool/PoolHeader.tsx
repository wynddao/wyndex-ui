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
  useDisclosure,
} from "@chakra-ui/react";
import { usePairInfos, usePoolInfos } from "../../state";
import { AssetInfo } from "../../state/clients/types/WyndexMultiHop.types";
import { PairInfo, PoolResponse } from "../../state/clients/types/WyndexPair.types";
import { getAssetInfo } from "../../utils/assets";
import TokenName from "../TokenName";
import ManageLiquidityModal from "./ManageLiquidityModal";

interface PoolHeaderProps {
  readonly chainData: PoolResponse;
  readonly pairData: PairInfo;
}

const LinkUndecorated = chakra(Link, { baseStyle: { _hover: { textDecoration: "none" } } });

export default function PoolHeader({ chainData, pairData }: PoolHeaderProps) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const pairNames = pairData.asset_infos.map((assetInfo, index) => {
    if (assetInfo.hasOwnProperty("native_token")) {
      // @ts-ignore
      return <span key={index}>{assetInfo.native_token}</span>;
    } else {
      // @ts-ignore
      return <TokenName key={index} address={assetInfo.token} />;
    }
  });

  return (
    <>
      <Box bg={"whiteAlpha.50"} p={4}>
        <Flex align="center" wrap="wrap" mb={6}>
          <Heading as="h2" fontWeight="extrabold" fontSize="2xl" wordBreak="break-word" mr={8} py={1}>
            Pool: {pairNames[0]} / {pairNames[1]}
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
            <Text fontWeight="bold" color={"whiteAlpha.600"}>
              Pool Address
            </Text>
            <Text fontSize={{ base: "sm", sm: "sm" }} fontWeight="extrabold" wordBreak="break-word">
              {pairData.contract_addr}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"}>
              Pool Liquidity
            </Text>
            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
              <span style={{ color: "red" }}>@TODO</span>
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"}>
              Liquidity Token Address
            </Text>
            <Text fontSize={{ base: "sm", sm: "sm" }} fontWeight="extrabold">
              {pairData.liquidity_token}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"} mb={1}>
              My Bounded Amount
            </Text>
            <Text fontSize={{ base: "lg", sm: "2xl" }} fontWeight="extrabold">
              <span style={{ color: "red" }}>@TODO</span>
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"} mb={1}>
              Swap Fee
            </Text>
            <Text fontSize={{ base: "lg", sm: "2xl" }} fontWeight="extrabold">
              @TODO
            </Text>
          </GridItem>
        </SimpleGrid>
      </Box>
      <ManageLiquidityModal data={pairData} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
