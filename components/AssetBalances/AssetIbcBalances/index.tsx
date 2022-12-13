"use client";

import { Box, Grid, GridItem, Input, Stack, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { AssetWithBalance } from "..";
import { getAssets, getIbcBalances } from "../../../utils";
import AssetIbcItem from "./AssetIbcItem";

export default function AssetIbcBalances() {
  const { address, getCosmWasmClient } = useWallet();

  const [assets, setAssets] = useState<readonly AssetWithBalance[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    (async function updateAssets() {
      const client = await getCosmWasmClient();
      if (!client || !address) return;

      const assets = await getAssets();
      const ibcBalances = await getIbcBalances(address);
      const ibcAssets = assets.filter((asset) => asset.tokenType !== "cw20");

      const assetsWithBalance: AssetWithBalance[] = ibcAssets.map((asset): AssetWithBalance => {
        const balance = ibcBalances.find((coin) => coin.denom === asset.denom)?.amount ?? "0";
        return { ...asset, balance };
      });

      setAssets(assetsWithBalance);
    })();
  }, [address, getCosmWasmClient]);

  const searchedAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchText.toLowerCase()),
  );

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
        {searchedAssets.map((assetDetails, i) => (
          <AssetIbcItem key={i} assetDetails={assetDetails} />
        ))}
      </Stack>
    </Box>
  );
}
