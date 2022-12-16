import { assetListTestnet, assetList } from "@wynddao/asset-list";
export const getAssetList = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT?.includes("dev") ? assetListTestnet : assetList;
};
