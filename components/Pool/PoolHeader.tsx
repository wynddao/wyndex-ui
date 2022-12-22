"use client";

import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
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
import { useCw20UserInfos, useIndexerInfos } from "../../state";
import { useUserStakeInfos } from "../../state/hooks/useUserStakeInfos";
import { formatCurrency } from "../../utils/currency";
interface PoolHeaderProps {
  readonly chainData: PoolResponse;
  readonly pairData: PairInfo;
  readonly walletAddress: string;
  readonly totalInFiat: number;
}

interface PoolHeaderUserProps {
  chainData: PoolResponse;
  pairData: PairInfo;
  totalFiatShares: any;
  walletAddress: string;
}

function PoolHeaderUserInfo({ chainData, pairData, totalFiatShares, walletAddress }: PoolHeaderUserProps) {
  const wyndexStake = pairData.staking_addr;
  //@ts-ignore
  const { allStakes } = useUserStakeInfos(wyndexStake, walletAddress);

  const { balance: lpBalance } = useCw20UserInfos(pairData.liquidity_token);

  // TODO Add currently unstaking amounts
  const allStakesSum = allStakes.reduce((acc: number, obj) => {
    return acc + Number(obj.stake);
  }, 0);

  const totalTokens = allStakesSum + Number(lpBalance);
  const myShare = totalTokens / Number(chainData.total_share);
  const myFiatShare = myShare * totalFiatShares;
  return <span>{formatCurrency.format(myFiatShare)}</span>;
}

export default function PoolHeader({ chainData, pairData, walletAddress, totalInFiat }: PoolHeaderProps) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const pairNames = pairData.asset_infos.map((assetInfo, index) => {
    if (assetInfo.hasOwnProperty("native")) {
      // @ts-ignore
      return <span key={index}>{microdenomToDenom(assetInfo.native)}</span>;
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
              <span>{formatCurrency.format(totalInFiat)} </span>
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
              My Shares:
            </Text>

            {walletAddress ? (
              <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
                <PoolHeaderUserInfo
                  chainData={chainData}
                  pairData={pairData}
                  totalFiatShares={totalInFiat}
                  walletAddress={walletAddress}
                />
              </Text>
            ) : (
              <Text fontSize={{ base: "xl", sm: "xl" }} fontWeight="extrabold" wordBreak="break-word">
                <span>Not connected</span>
              </Text>
            )}
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
      <ManageLiquidityModal
        walletAddress={walletAddress}
        poolData={chainData}
        data={pairData}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
