"use client";

import { Box, Grid, GridItem, Heading, Input, Select, Text, useColorMode } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { getAssets, getAssetsRecap, getBalances } from "../../utils";
import { handleChangeColorModeValue } from "../../utils/theme";
import { Asset } from "../../utils/types";
import AssetList from "./AssetList";

export interface AssetsRecap {
  readonly total: string;
  readonly locked: string;
  readonly available: string;
}

export interface AssetWithBalance extends Asset {
  readonly balance: string;
  readonly ibcBalance: string;
}

type TokensToShow = "show-all" | "show-native" | "show-cw20";

export default function AssetBalances() {
  const { colorMode } = useColorMode();
  const { address, getCosmWasmClient } = useWallet();

  const [assetsRecap, setAssetsRecap] = useState<AssetsRecap>();
  const [assets, setAssets] = useState<readonly AssetWithBalance[]>([]);
  const [searchText, setSearchText] = useState("");
  const [tokensToShow, setTokensToShow] = useState<TokensToShow>("show-all");

  useEffect(() => {
    (async function updateAssetsRecap() {
      if (!address) return;

      const assetsRecap = await getAssetsRecap(address);
      setAssetsRecap(assetsRecap);
    })();
  }, [address, getCosmWasmClient]);

  useEffect(() => {
    (async function updateAssets() {
      const client = await getCosmWasmClient();
      if (!client || !address) return;

      const assets = await getAssets();
      const balances = await getBalances(address);

      const assetsWithBalance: AssetWithBalance[] = assets.map((asset) => {
        const balance = balances.find((coin) => coin.denom === asset.denom)?.amount ?? "0";
        const ibcBalance = balances.find((coin) => coin.denom === "ibc/" + asset.denom)?.amount ?? "0";
        return { ...asset, balance, ibcBalance };
      });

      setAssets(assetsWithBalance);
    })();
  }, [address, getCosmWasmClient]);

  return (
    <Box>
      <Heading p={8} pb={0}>
        My Assets
      </Heading>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        }}
        maxW="4xl"
        gap={6}
        px={8}
        py={4}
      >
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Total Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {assetsRecap?.total || "—"}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Locked Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {assetsRecap?.locked || "—"}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Available Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {assetsRecap?.available || "—"}
          </Text>
        </Box>
      </Grid>
      <Box bg={handleChangeColorModeValue(colorMode, "blackAlpha.50", "whiteAlpha.50")} p={8}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Assets
        </Text>
        <Grid
          position="sticky"
          top={0}
          zIndex={5}
          display={{ base: "none", lg: "grid" }}
          templateColumns="repeat(4, minmax(12rem, 1fr))"
          columnGap={{ lg: 16 }}
          fontSize="sm"
          fontWeight="semibold"
          bg={handleChangeColorModeValue(colorMode, "gray.100", "gray.700")}
          color={handleChangeColorModeValue(colorMode, "blackAlpha.700", "whiteAlpha.700")}
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
          <GridItem textAlign="end" pr={28}>
            <Select
              value={tokensToShow}
              onChange={({ target }) => setTokensToShow(target.value as TokensToShow)}
            >
              <option value="show-all">Show all</option>
              <option value="show-native">Show native</option>
              <option value="show-cw20">Show CW20</option>
            </Select>
          </GridItem>
        </Grid>
        <AssetList
          assetsDetailsData={assets
            .filter(
              (asset) =>
                tokensToShow === "show-all" ||
                (tokensToShow === "show-native" && asset.tokenType === "native") ||
                (tokensToShow === "show-cw20" && asset.tokenType === "cw20"),
            )
            .filter((asset) => asset.name.toLowerCase().includes(searchText.toLowerCase()))}
        />
      </Box>
    </Box>
  );
}
