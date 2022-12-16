"use client";

import { Box, Grid, GridItem, Input, Stack, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { Asset, assetList, IBCAsset } from "@wynddao/asset-list";
import { useEffect, useState } from "react";
import { getIbcBalances } from "../../../utils";
import AssetIbcItem from "./AssetIbcItem";

export type AssetIbcWithBalance = IBCAsset & {
  readonly balance: string;
};

export default function AssetIbcBalances() {
  const { address } = useWallet();

  const [assets, setAssets] = useState<readonly AssetIbcWithBalance[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    (async function updateAssets() {
      if (!address) return;

      const assets: readonly Asset[] = assetList.tokens;
      const ibcBalances = await getIbcBalances(address);
      const ibcAssets = assets.filter((asset): asset is IBCAsset => asset.tags !== "cw20");

      const assetsWithBalance: AssetIbcWithBalance[] = ibcAssets.map((asset): AssetIbcWithBalance => {
        const balance = ibcBalances.find((coin) => coin.denom === asset.denom)?.amount ?? "0";
        return { ...asset, balance };
      });

      setAssets(assetsWithBalance);
    })();
  }, [address]);

  const searchedAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  const sortedAssets = searchedAssets.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

  return (
    <Box bg={"wynd.neutral.100"} p={8}>
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
        templateColumns="repeat(3, minmax(12rem, 1fr))"
        columnGap={{ base: 4 }}
        fontSize="sm"
        fontWeight="semibold"
        bg={"wynd.neutral.300"}
        color={"wynd.neutral.900"}
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
      >
        {sortedAssets.map((assetDetails, i) => (
          <AssetIbcItem key={i} assetDetails={assetDetails} />
        ))}
      </Stack>
    </Box>
  );
}
