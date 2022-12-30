"use client";

import { Badge, Box, Button, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { AssetIbcWithBalance } from ".";
import { depositIbcModalAtom, withdrawIbcModalAtom } from "../../../state/recoil/atoms/modal";
import { microamountToAmount } from "../../../utils/tokens";

interface AssetIbcItemProps {
  readonly assetDetails: AssetIbcWithBalance;
}

export default function AssetIbcItem({
  assetDetails: { name, logoURI, balance, decimals, tags, chain_id },
}: AssetIbcItemProps) {
  const setDepositIbcModalOpen = useSetRecoilState(depositIbcModalAtom);
  const setWithdrawIbcModalOpen = useSetRecoilState(withdrawIbcModalAtom);

  return (
    <Grid
      templateColumns={{
        base: "1fr 1fr",
        xl: "repeat(3, minmax(12rem, 1fr))",
      }}
      columnGap={{ base: 4 }}
      fontWeight="semibold"
      alignItems="center"
      _odd={{
        bg: {
          lg: "wynd.base.subBg",
        },
      }}
      _notLast={{
        borderBottom: "1px solid",
        borderBottomColor: "wynd.gray.100",
      }}
      p={4}
    >
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Flex justify={{ base: "center", md: "start" }} align="center">
          <Box
            w={{ base: 14, lg: 16 }}
            h={{ base: 14, lg: 16 }}
            minW={{ base: 14, lg: 16 }}
            minH={{ base: 14, lg: 16 }}
            maxW={{ base: 14, lg: 16 }}
            maxH={{ base: 14, lg: 16 }}
            bg={"whiteAlpha.500"}
            border="1px solid"
            borderColor={"wynd.neutral.900"}
            borderRadius="full"
            mr={4}
            overflow="hidden"
          >
            <Image alt={`${name} logo`} src={logoURI} width="100%" />
          </Box>
          <Text fontSize="lg" mr={4}>
            {name}
          </Text>
          <Badge>{tags}</Badge>
        </Flex>
      </GridItem>
      <GridItem
        colSpan={{ base: 2, md: 1 }}
        display="flex"
        alignItems={{ base: "center", md: "end" }}
        py={{ base: 2, md: 0 }}
        pr={{ base: 4, lg: 0 }}
        pl={{ base: 4, lg: 0 }}
      >
        <Text display={{ base: "block", md: "none" }}>IBC Balance</Text>
        <Box w="full" textAlign="end">
          <Text fontSize="lg" mb={0.5}>
            {microamountToAmount(balance, decimals)}
          </Text>
        </Box>
      </GridItem>
      <GridItem
        colSpan={{ base: 2, md: 1 }}
        display="flex"
        alignItems={{ base: "center", md: "end" }}
        justifyContent="flex-end"
        py={{ base: 2, md: 0 }}
        pr={{ base: 4, lg: 0 }}
        pl={{ base: 4, lg: 0 }}
      >
        {tags === "ibc" ? (
          <Flex flexDirection="row" justifyContent="flex-end" gap={2} flexWrap="wrap">
            <Button
              fontSize="sm"
              bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
              _hover={{
                bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
                ":disabled": {
                  bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                  cursor: "initial",
                },
              }}
              _disabled={{
                bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                cursor: "initial",
              }}
              onClick={() => setDepositIbcModalOpen({ isOpen: true, chainId: chain_id })}
            >
              IBC Deposit
            </Button>
            <Button
              fontSize="sm"
              _hover={{
                ":disabled": {
                  bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                  cursor: "initial",
                },
              }}
              _disabled={{
                bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                cursor: "initial",
              }}
              disabled={balance === "0"}
              onClick={() => setWithdrawIbcModalOpen({ isOpen: true, chainId: chain_id })}
            >
              IBC Withdraw
            </Button>
          </Flex>
        ) : (
          <Text>—</Text>
        )}
      </GridItem>
    </Grid>
  );
}
