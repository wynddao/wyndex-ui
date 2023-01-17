"use client";

import { Box, Button, Collapse, Flex, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { PoolResponse } from "../../state/clients/types/WyndexPair.types";
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
            {chainData.assets.map((asset, i) => (
              <Flex
                key={i}
                borderRadius="xl"
                bg={"wynd.base.sidebar"}
                bgImage={"/images/Vector2.png"}
                bgRepeat={"no-repeat"}
                bgPos={"right"}
                width="100%"
                py={4}
                px={6}
                minHeight="8.5rem"
              >
                <SimpleGrid columns={{ md: 2 }} gap={8} width="full">
                  <Flex align="center" justify={"center"}>
                    <Box w={20} h={20} p={0.5} mr={4}>
                      <AssetImage
                        asset={
                          //  @ts-ignore
                          asset.info.hasOwnProperty("token") ? asset.info.token : asset.info.native
                        }
                      />
                    </Box>
                    <Box>
                      <Text fontSize="3xl" fontWeight="extrabold"></Text>
                      <Text color={"wynd.gray.500"}>
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
                  <Box fontWeight="bold">
                    <Text color={"wynd.gray.500"}>Total amount</Text>
                    <Text mb={2}>{microamountToAmount(asset.amount, 6)}</Text>
                  </Box>
                </SimpleGrid>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      </Collapse>
    </>
  );
}
