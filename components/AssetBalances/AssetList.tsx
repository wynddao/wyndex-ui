"use client";

import { Grid, GridItem, Stack, useColorMode } from "@chakra-ui/react";
import { AssetWithBalance } from ".";
import { handleChangeColorModeValue } from "../../utils/theme";
import AssetListItem from "./AssetListItem";

interface AssetListProps {
  readonly assetsDetailsData: readonly AssetWithBalance[];
}

export default function AssetList({ assetsDetailsData }: AssetListProps) {
  const { colorMode } = useColorMode();

  return (
    <>
      <Grid
        position="sticky"
        top={9}
        zIndex={5}
        display={{ base: "none", lg: "grid" }}
        templateColumns="repeat(2, minmax(12rem, 1fr)) minmax(6rem, 12rem)"
        columnGap={{ lg: 16 }}
        fontSize="sm"
        fontWeight="semibold"
        bg={handleChangeColorModeValue(colorMode, "gray.100", "gray.700")}
        color={handleChangeColorModeValue(colorMode, "blackAlpha.700", "whiteAlpha.700")}
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
