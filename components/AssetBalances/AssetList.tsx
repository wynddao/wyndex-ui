"use client";

import { Grid, GridItem, Stack } from "@chakra-ui/react";
import { AssetWithBalance } from ".";
import AssetListItem from "./AssetListItem";

interface AssetListProps {
  readonly assetsDetailsData: readonly AssetWithBalance[];
}

export default function AssetList({ assetsDetailsData }: AssetListProps) {
  return (
    <>
      <Grid
        position="sticky"
        top={9}
        zIndex={5}
        display={{ base: "none", xl: "grid" }}
        templateColumns="repeat(4, minmax(12rem, 1fr))"
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
        <GridItem textAlign="end">Balance</GridItem>
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
        {assetsDetailsData.map((assetDetails, i) => (
          <AssetListItem key={i} assetDetails={assetDetails} />
        ))}
      </Stack>
    </>
  );
}
