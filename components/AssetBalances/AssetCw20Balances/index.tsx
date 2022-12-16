"use client";

import { Box, Grid, GridItem, Input, Stack, Text } from "@chakra-ui/react";
import { Asset, CW20Asset } from "@wynddao/asset-list";
import { useState } from "react";
import { useIndexerInfos } from "../../../state";
import { getAssetList } from "../../../utils/getAssetList";
import AssetCw20Item from "./AssetCw20Item";

export type AssetCw20WithBalance = CW20Asset & {
  readonly balance: string;
};

export default function AssetCw20Balances() {
  const { cw20Balances } = useIndexerInfos({ fetchIbcBalances: true });
  const [searchText, setSearchText] = useState("");

  const assets: readonly Asset[] = getAssetList().tokens;
  const cw20Assets = assets.filter((asset): asset is CW20Asset => asset.tags === "cw20");

  const assetsWithBalance: AssetCw20WithBalance[] = cw20Assets.map((asset): AssetCw20WithBalance => {
    const balance = cw20Balances.find((balance) => balance.address === asset.token_address)?.balance ?? "0";
    return { ...asset, balance };
  });

  const searchedAssets = assetsWithBalance.filter((asset) =>
    asset.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const sortedAssets = searchedAssets.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

  return (
    <Box bg={"wynd.neutral.100"} p={8}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        CW20 Assets
      </Text>
      <Grid
        position="sticky"
        top={0}
        zIndex={5}
        templateColumns="repeat(2, minmax(12rem, 1fr))"
        columnGap={{ base: 4 }}
        fontSize="sm"
        fontWeight="semibold"
        bg={"wynd.neutral.200"}
        color={"wynd.neutral.800"}
        borderRadius="md"
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
        boxShadow="base"
        py={2}
        px={4}
      >
        <GridItem>
          <Input
            placeholder="Search token"
            value={searchText}
            onChange={({ target }) => setSearchText(target.value)}
          />
        </GridItem>
      </Grid>
      <Grid
        position="sticky"
        top={9}
        zIndex={5}
        display={{ base: "none", xl: "grid" }}
        templateColumns="repeat(2, minmax(12rem, 1fr))"
        columnGap={{ base: 4 }}
        fontSize="sm"
        fontWeight="semibold"
        bg={"wynd.neutral.300"}
        color={"wynd.neutral.900"}
        boxShadow="base"
        py={2}
        px={4}
      >
        <GridItem>Asset</GridItem>
        <GridItem textAlign="end">Balance</GridItem>
      </Grid>
      <Stack
        borderRadius="md"
        borderTopLeftRadius={0}
        borderTopRightRadius={0}
        boxShadow={{ lg: "base" }}
        spacing={{ base: 4, lg: 0 }}
      >
        {sortedAssets.map((assetDetails, i) => (
          <AssetCw20Item key={i} assetDetails={assetDetails} />
        ))}
      </Stack>
    </Box>
  );
}
