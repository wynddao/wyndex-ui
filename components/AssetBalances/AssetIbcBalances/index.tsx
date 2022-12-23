"use client";

import { Box, Grid, GridItem, Input, Stack, Text } from "@chakra-ui/react";
import { Asset, IBCAsset } from "@wynddao/asset-list";
import { useState } from "react";
import { useIndexerInfos } from "../../../state";
import { getAssetList } from "../../../utils/getAssetList";
import AssetIbcItem from "./AssetIbcItem";

export type AssetIbcWithBalance = IBCAsset & {
  readonly balance: string;
};

export default function AssetIbcBalances() {
  const { ibcBalances } = useIndexerInfos({ fetchIbcBalances: true });
  const [searchText, setSearchText] = useState("");

  const assets: readonly Asset[] = getAssetList().tokens;
  const ibcAssets = assets.filter((asset): asset is IBCAsset => asset.tags !== "cw20");

  const assetsWithBalance: AssetIbcWithBalance[] = ibcAssets.map((asset): AssetIbcWithBalance => {
    const balance =
      ibcBalances.find((coin) => coin.denom === asset.juno_denom || coin.denom === asset.denom)?.amount ??
      "0";
    return { ...asset, balance };
  });
  const searchedAssets = assetsWithBalance.filter((asset) =>
    asset.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const sortedAssets = searchedAssets.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

  return (
    <Box p={8} pt={0}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        IBC Assets
      </Text>
      <Grid
        position="sticky"
        top={0}
        zIndex={5}
        templateColumns="repeat(3, minmax(12rem, 1fr))"
        columnGap={{ base: 4 }}
        fontSize="sm"
        fontWeight="semibold"
        bg={"wynd.base.sidebar"}
        borderRadius="md"
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
        borderColor="wynd.base.sidebar"
        borderWidth="medium"
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
        templateColumns="repeat(3, minmax(12rem, 1fr))"
        columnGap={{ base: 4 }}
        fontSize="sm"
        fontWeight="semibold"
        color={"wynd.neutral.900"}
        borderColor="wynd.base.sidebar"
        borderWidth="1px"
        boxShadow="base"
        py={2}
        px={4}
      >
        <GridItem>Asset / Chain</GridItem>
        <GridItem textAlign="end">IBC Balance</GridItem>
        <GridItem textAlign="end">Actions</GridItem>
      </Grid>
      <Stack
        borderRadius="md"
        borderTopLeftRadius={0}
        borderTopRightRadius={0}
        boxShadow={{ lg: "base" }}
        spacing={{ base: 4, lg: 0 }}
        borderColor="wynd.base.sidebar"
        borderWidth="1px"
      >
        {sortedAssets.map((assetDetails, i) => (
          <AssetIbcItem key={i} assetDetails={assetDetails} />
        ))}
      </Stack>
    </Box>
  );
}
