"use client";;
import { Box, Button, Collapse, Flex, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { useCw20UserInfos } from "../../../state";
import { PairInfo, PoolResponse } from "../../../state/clients/types/WyndexPair.types";
import { useStakeInfos } from "../../../state/hooks/useStakeInfos";
import { useUserStakeInfos } from "../../../state/hooks/useUserStakeInfos";
import { getAssetInfoDetails } from "../../../utils/assets";
import { microamountToAmount } from "../../../utils/tokens";
import AssetImage from "../AssetImage";

interface PoolCatalystProps {
  readonly chainData: PoolResponse;
  readonly pairData: PairInfo;
}

export default function PoolCatalyst({ chainData, pairData }: PoolCatalystProps) {
  const { address: walletAddress } = useChain("juno");
  const wyndexStake = pairData.staking_addr;

  const [show, setShow] = useState<boolean>(true);

  //@ts-ignore
  const { allStakes } = useUserStakeInfos(wyndexStake, walletAddress);
  const { balance: lpBalance } = useCw20UserInfos(pairData.liquidity_token);

  //  Add currently unstaking amounts
  const { pendingUnstaking } = useStakeInfos(pairData.staking_addr, true);

  const unstakesSum = pendingUnstaking.reduce((acc, obj) => {
    return acc + Number(obj.amount);
  }, 0);

  const allStakesSum = allStakes.reduce((acc, obj) => {
    return acc + Number(obj.stake);
  }, 0);

  // calculating users share with all locked tokens and available tokens
  // by the total share of the LP token
  const totalTokens = unstakesSum + allStakesSum + Number(lpBalance);
  const myShare = totalTokens / Number(chainData.total_share);

  return (
    <>
      <Flex alignItems="center" mt={4} justifyContent="center">
        <Button variant="ghost" onClick={() => setShow(!show)}>
          <Text display="flex" justifyContent="center" alignItems="center" gap="0.5rem">
            <Icon
              as={IoChevronDown}
              transform={!show ? "rotate(0deg)" : "rotate(180deg)"}
              transition="all linear 0.2s"
              m="0 0 4px 0"
            />
            {show ? "Hide " : "Show "}
            liquidity pool assets
          </Text>
        </Button>
      </Flex>
      <Collapse in={show}>
        <Box pt={6}>
          <SimpleGrid columns={{ md: 2 }} gap={8}>
            {chainData.assets.map((asset, i) => {
              const tokenInfo = getAssetInfoDetails(asset.info);
              return (
                <Box
                  key={i}
                  borderRadius="xl"
                  bg={"wynd.base.sidebar"}
                  bgImage={"/images/Vector2.png"}
                  bgRepeat={"no-repeat"}
                  bgPos={"right"}
                  p={6}
                >
                  <SimpleGrid columns={{ md: 2 }} gap={8}>
                    <Flex align="center" justify={"center"}>
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
                        <AssetImage
                          asset={
                            //  @ts-ignore
                            asset.info.hasOwnProperty("token") ? asset.info.token : asset.info.native
                          }
                        />
                      </Box>
                      <Box>
                        <Text fontSize="3xl" fontWeight="extrabold"></Text>
                        <Text fontWeight="bold" color={"wynd.neutral.600"}>
                          {tokenInfo.symbol}
                        </Text>
                      </Box>
                    </Flex>
                    <Box>
                      <Text fontWeight="bold" color={"wynd.neutral.600"}>
                        Total amount
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        {microamountToAmount(asset.amount, tokenInfo.decimals)}
                      </Text>
                      <Text fontWeight="bold" color={"wynd.neutral.600"}>
                        My amount
                      </Text>
                      <Text fontSize="xl" fontWeight="bold">
                        {"≈ "}
                        {microamountToAmount(myShare * Number(asset.amount), tokenInfo.decimals, 6)}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Collapse>
    </>
  );
}
