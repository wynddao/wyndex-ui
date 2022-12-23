"use client";

import { Box, Button, Collapse, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { PairInfo, PoolResponse } from "../../state/clients/types/WyndexPair.types";
import { getNativeIbcTokenDenom } from "../../utils/assets";
import { microamountToAmount, microdenomToDenom } from "../../utils/tokens";
import AssetImage from "../AssetImage";
import TokenName from "../TokenName";

interface PoolCatalystProps {
  readonly chainData: PoolResponse;
}

export default function PoolCatalyst({ chainData }: PoolCatalystProps) {
  const [show, setShow] = useState<boolean>(true);

  return (
    <>
      <Flex alignItems="center" mt={4} justifyContent="center">
        <Button variant="ghost" onClick={() => setShow(!show)}>
          {!show ? (
            <>
              <IoChevronDown /> Show
            </>
          ) : (
            <>
              <IoChevronUp /> Hide{" "}
            </>
          )}{" "}
          liquidity pool assets
        </Button>
      </Flex>
      <Collapse in={show}>
        <Box pt={6}>
          <SimpleGrid columns={{ md: 2 }} gap={8}>
            {chainData.assets.map((asset, i) => (
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
                  <Box alignItems="center" display="flex" justifyContent="center">
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
                          {asset.info.hasOwnProperty("token") ? (
                            // @ts-ignore
                            <TokenName address={asset.info.token} />
                          ) : (
                            // @ts-ignore
                            microdenomToDenom(getNativeIbcTokenDenom(asset.info.native))
                          )}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color={"wynd.neutral.600"}>
                      Total amount
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      {microamountToAmount(asset.amount, 6)}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Collapse>
    </>
  );
}
