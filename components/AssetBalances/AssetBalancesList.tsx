import { Box, Grid, GridItem, HStack, Input, Stack } from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { useIndexerInfos } from "../../state";
import { favAtom } from "../../state/recoil/atoms/favouriteAssets";
import { getAssetList } from "../../utils/getAssetList";
import AssetBalanceItem from "./AssetBalanceItem";
import TokenFilter, { TokenFilterOptions } from "./TokenFilter";
import { getAssetId, prepareAssets } from "./utils";

export default function AssetBalancesList() {
  const { ibcBalances, cw20Balances } = useIndexerInfos({ fetchIbcBalances: true, fetchCw20Balances: true });
  const [favAssets, setFavAssets] = useRecoilState(favAtom);

  const addFav = (asset: Asset) =>
    setFavAssets((favs) => {
      const id = getAssetId(asset);
      const favsWithoutDuplicates = favs.filter((fav) => fav !== id);
      return [...favsWithoutDuplicates, id];
    });
  const removeFav = (asset: Asset) => setFavAssets((favs) => favs.filter((fav) => fav !== getAssetId(asset)));

  const [filterOption, setFilterOption] = useState<TokenFilterOptions>("All");
  const [searchText, setSearchText] = useState("");

  const assets: readonly Asset[] = getAssetList().tokens;
  const readyAssets = prepareAssets(assets, ibcBalances, cw20Balances, favAssets, filterOption, searchText);

  return (
    <Box p={8} pt={0}>
      <HStack
        position="sticky"
        top={0}
        zIndex={5}
        gap={{ base: 4 }}
        flexWrap="wrap"
        alignItems="center"
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
        <TokenFilter setFilterOption={setFilterOption} />
        <GridItem>
          <Input
            placeholder="Search token"
            value={searchText}
            onChange={({ target }) => setSearchText(target.value)}
          />
        </GridItem>
      </HStack>
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
        <GridItem textAlign="end">Balance</GridItem>
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
        {readyAssets.map((asset) => (
          <AssetBalanceItem
            key={getAssetId(asset)}
            asset={asset}
            toggleFav={asset.isFav ? () => removeFav(asset) : () => addFav(asset)}
          />
        ))}
      </Stack>
    </Box>
  );
}
