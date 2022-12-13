"use client";

import { Box, Grid, GridItem, Input, Stack, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { AssetWithBalance } from "..";
import { getAssets, getCw20Balances } from "../../../utils";
import AssetCw20Item from "./AssetCw20Item";

export default function AssetCw20Balances() {
  const { address, getCosmWasmClient } = useWallet();

  const [assets, setAssets] = useState<readonly AssetWithBalance[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    (async function updateAssets() {
      const client = await getCosmWasmClient();
      if (!client || !address) return;

      const assets = await getAssets();
      const cw20Balances = await getCw20Balances(address);
      const cw20Assets = assets.filter((asset) => asset.tokenType === "cw20");

      const assetsWithBalance: AssetWithBalance[] = cw20Assets.map((asset): AssetWithBalance => {
        const balance = cw20Balances.find((coin) => coin.denom === asset.denom)?.amount ?? "0";
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
        {searchedAssets.map((assetDetails, i) => (
          <AssetCw20Item key={i} assetDetails={assetDetails} />
        ))}
      </Stack>
    </Box>
  );
}
