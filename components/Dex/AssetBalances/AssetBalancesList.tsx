import { Box, Grid, GridItem, HStack, Input } from "@chakra-ui/react";
import { Asset } from "@wynddao/asset-list";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { useIndexerInfos } from "../../../state";
import { favAtom } from "../../../state/recoil/atoms/favouriteAssets";
import { getAssetList } from "../../../utils/getAssetList";
import AssetBalanceItem from "./AssetBalanceItem";
import TokenFilter, { TokenFilterOptions } from "./TokenFilter";
import { getAssetId, prepareAssets } from "./utils";
import { useTranslation } from "i18next-ssg";

export default function AssetBalancesList() {
  const { t } = useTranslation("common");
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
    <Box sx={{ mt: "0 !important" }}>
      <HStack
        position="sticky"
        top={0}
        gap={{ base: 4 }}
        flexWrap="wrap"
        alignItems="center"
        fontSize="sm"
        fontWeight="semibold"
        bg={"wynd.base.sidebar"}
        roundedTop="md"
        boxShadow="base"
        zIndex={0.5}
        py={2}
        px={4}
      >
        <TokenFilter setFilterOption={setFilterOption} />
        <GridItem>
          <Input
            placeholder={t("search.searchToken") || ""}
            value={searchText}
            onChange={({ target }) => setSearchText(target.value)}
          />
        </GridItem>
      </HStack>
      <Grid
        display="grid"
        templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 50px 1fr" }}
        columnGap={{ base: 2, lg: 4 }}
        fontSize="xs"
        fontWeight="semibold"
        color={"wynd.neutral.900"}
        py={2}
        px={4}
        bg="wynd.gray.alpha.10"
      >
        <GridItem>
          {" "}
          {t("general.asset")}
          {" / "}
          {t("general.chain")}
        </GridItem>
        <GridItem textAlign="end">{t("general.balance")}</GridItem>
        <GridItem textAlign="end" display={{ base: "none", lg: "block" }}>
          {t("general.actions")}
        </GridItem>
      </Grid>
      {readyAssets.map((asset) => (
        <AssetBalanceItem
          key={getAssetId(asset)}
          asset={asset}
          toggleFav={asset.isFav ? () => removeFav(asset) : () => addFav(asset)}
        />
      ))}
    </Box>
  );
}
