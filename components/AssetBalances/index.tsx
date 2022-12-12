"use client";

import { Grid, GridItem, Stack } from "@chakra-ui/react";
import { Asset } from "../../utils/types";
import AssetCw20Balances from "./AssetCw20Balances";
import AssetIbcBalances from "./AssetIbcBalances";
import AssetsRecapGallery from "./AssetsRecapGallery";

export interface AssetWithBalance extends Asset {
  readonly balance: string;
}

export default function AssetBalances() {
  return (
    <Stack spacing={8}>
      <AssetsRecapGallery />
      <Grid templateColumns="repeat(auto-fit, minmax(500px, 1fr))" columnGap={{ base: 4 }}>
        <GridItem colSpan={2}>
          <AssetIbcBalances />
        </GridItem>
        <GridItem>
          <AssetCw20Balances />
        </GridItem>
      </Grid>
    </Stack>
  );
}
