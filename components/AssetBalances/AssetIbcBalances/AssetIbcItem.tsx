"use client";

import { Box, Button, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { AssetWithBalance } from "..";
import { depositIbcModalAtom, withdrawIbcModalAtom } from "../../../state/recoil/atoms/modal";

interface AssetIbcItemProps {
  readonly assetDetails: AssetWithBalance;
}

export default function AssetIbcItem({ assetDetails: { name, img, balance, denom } }: AssetIbcItemProps) {
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
      bg={{
        base: "wynd.neutral.300",
        lg: "wynd.neutral.300",
      }}
      border={{ base: "1px solid", lg: "none" }}
      borderColor={"wynd.neutral.200"}
      borderRadius={{ base: "lg", lg: "none" }}
      _odd={{
        bg: {
          lg: "wynd.neutral.200",
        },
      }}
      _notLast={{
        borderBottom: "1px solid",
        borderBottomColor: "wynd.neutral.200",
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
            <Image alt={`${name} logo`} src={img} width="100%" />
          </Box>
          <Text fontSize="lg" mr={4}>
            {name}
          </Text>
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
            {balance}
          </Text>
          <Text fontSize="lg" opacity={0.7}>
            {denom}
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
        <Flex flexDirection="row" justifyContent="flex-end" gap={2} flexWrap="wrap">
          <Button fontSize="sm" onClick={() => setDepositIbcModalOpen({ isOpen: true, asset: name })}>
            IBC Deposit
          </Button>
          <Button fontSize="sm" onClick={() => setWithdrawIbcModalOpen({ isOpen: true, asset: name })}>
            IBC Withdraw
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
}
