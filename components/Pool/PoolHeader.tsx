"use client";

import {
  Box,
  Button,
  chakra,
  Flex,
  GridItem,
  Heading,
  Link,
  Show,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { PairInfo, PoolResponse } from "../../state/clients/types/WyndexPair.types";
import TokenName from "../TokenName";
import ManageLiquidityModal from "./ManageLiquidityModal";
import druid from "./assets/druid.png";
import Image from "next/image";
import { microdenomToDenom } from "../../utils/tokens";

interface PoolHeaderProps {
  readonly chainData: PoolResponse;
  readonly pairData: PairInfo;
  readonly walletAddress: string;
}

const LinkUndecorated = chakra(Link, { baseStyle: { _hover: { textDecoration: "none" } } });

export default function PoolHeader({ chainData, pairData, walletAddress }: PoolHeaderProps) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const pairNames = pairData.asset_infos.map((assetInfo, index) => {
    if (assetInfo.hasOwnProperty("native_token")) {
      // @ts-ignore
      return <span key={index}>{microdenomToDenom(assetInfo.native_token)}</span>;
    } else {
      // @ts-ignore
      return <TokenName key={index} address={assetInfo.token} />;
    }
  });

  return (
    <>
      <Box
        bg={"wynd.base.sidebar"}
        bgImage="url('/images/Vector.png')"
        bgPosition="right"
        bgRepeat="no-repeat"
        p={4}
        position="relative"
        overflow="hidden"
      >
        <Flex align="center" wrap="wrap" mb={6}>
          <Heading as="h2" fontWeight="extrabold" fontSize="2xl" wordBreak="break-word" mr={8} py={1}>
            Pool: {pairNames[0]} / {pairNames[1]}
          </Heading>
          <Flex align="center" wrap="wrap">
            <Button onClick={onOpen} m={2} ml={0} mr={{ md: 4 }}>
              Add/Remove Liquidity
            </Button>
          </Flex>
        </Flex>

        <SimpleGrid columns={{ md: 2 }} gap={{ base: 2, md: 4 }} maxW={{ lg: "50%" }}>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"}>
              Pool Liquidity
            </Text>
            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
              <span>23M USDC</span>
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"}>
              Swap Fee
            </Text>
            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
              <span>0.2%</span>
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"} mb={1}>
              My Bounded Amount
            </Text>
            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
              <span>23M USDC</span>
            </Text>
          </GridItem>
        </SimpleGrid>
        <Show breakpoint="(min-width: 1077px)">
          <Image
            src={druid}
            alt="Wynd druid"
            height={600}
            style={{ position: "absolute", right: 0, bottom: -320 }}
          />
        </Show>
      </Box>
      <ManageLiquidityModal walletAddress={walletAddress} poolData={chainData} data={pairData} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
