"use client";

import { Grid, GridItem, Stack } from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { favAtom } from "../../state/recoil/atoms/favouriteAssets";
import AssetIbcBalances from "./AssetIbcBalances";
import AssetsRecapGallery from "./AssetsRecapGallery";

export default function AssetBalances() {
  const [favouriteAssets, setFavouriteAssets] = useRecoilState(favAtom);

  const addAssetToFavs = (asset: Asset) => {
    let newList = [...favouriteAssets];
    newList.push(asset);
    setFavouriteAssets(newList);
  };

  const removeAssetFromFavs = (asset: Asset) => {
    let newList = [...favouriteAssets];
    const index = newList.findIndex((el) => el.name == asset.name);
    if (index > -1) {
      newList.splice(index, 1);
    }
    setFavouriteAssets(newList);
  };

  return (
    <Stack spacing={8}>
      <AssetsRecapGallery />
      <Grid templateColumns="repeat(auto-fit, minmax(500px, 1fr))" columnGap={{ base: 4 }}>
        <GridItem colSpan={2}>
          <AssetIbcBalances
            favList={favouriteAssets}
            removeFav={removeAssetFromFavs}
            addFav={addAssetToFavs}
          />
        </GridItem>
      </Grid>
    </Stack>
  );
}
