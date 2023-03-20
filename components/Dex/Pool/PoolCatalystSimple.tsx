"use client";

import { Box, Button, Collapse, Flex, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { PoolResponse } from "../../../state/clients/types/WyndexPair.types";
import { getAssetInfoDetails } from "../../../utils/assets";
import { microamountToAmount } from "../../../utils/tokens";
import AssetImage from "../AssetImage";
import { useTranslation } from "i18next-ssg";
interface PoolCatalystProps {
  readonly chainData: PoolResponse;
}

export default function PoolCatalyst({ chainData }: PoolCatalystProps) {
  const [show, setShow] = useState<boolean>(true);
  const { t } = useTranslation("common");
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
            {t("pool.liquidityPoolAssets")}
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
                        {t("pool.totalAmount")}
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        {microamountToAmount(asset.amount, tokenInfo.decimals)}
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
