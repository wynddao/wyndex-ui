import { Stack } from "@chakra-ui/react";
import AssetBalancesList from "./AssetBalancesList";
import AssetsRecapGallery from "./AssetsRecapGallery";

export default function AssetBalances() {
  return (
    <Stack spacing={8}>
      <AssetsRecapGallery />
      <AssetBalancesList />
    </Stack>
  );
}
