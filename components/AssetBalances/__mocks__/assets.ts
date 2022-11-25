import { assets, chains } from "chain-registry";
import { ShowBalanceAssetsDetailsType } from "..";
import { TokenType } from "../../../utils/experimentalTokenList";
import { getShuffledArr } from "../../../utils/mocking";

const chainInfo = chains
  .filter(({ status }) => status === "live")
  .map(({ pretty_name, chain_name, chain_id, apis }) => ({
    label: pretty_name,
    value: chain_id,
    chainName: chain_name,
    address: (chain_name + Buffer.from(apis?.rest?.[0].address || "", "utf-8").toString("base64")).slice(
      0,
      32,
    ),
  }));
const chainList = chainInfo.map((chains) => ({
  label: chains.label,
  value: chains.value,
  chainName: chains.chainName,
  icon: assets
    .filter(({ chain_name }) => chains.chainName === chain_name)[0]
    ?.assets.filter(({ name }) => name === chains.label)[0]?.logo_URIs,
  address: chains.address,
}));

export const assetsDetailsData: readonly ShowBalanceAssetsDetailsType[] = chainList.map(
  ({ label, icon, address }) => ({
    name: label,
    denom: "u" + label.toLowerCase(),
    type: label.toLowerCase().charAt(0) < "m" ? TokenType.Native : TokenType.Cw20,
    contractAddress: label.toLowerCase().charAt(0) < "m" ? undefined : address,
    imgSrc: icon?.png || icon?.jpeg || icon?.svg || "",
    amount: (
      parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) / 100000000
    ).toFixed(4),
  }),
);

export const assetsTotalData = {
  total:
    "$" +
    (
      parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) / 100000000
    ).toFixed(2),
  availableAsset:
    "$" +
    (
      parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) / 100000000
    ).toFixed(2),
  bondedAssets:
    "$" +
    (
      parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) / 100000000
    ).toFixed(2),
  stakedAssets:
    "$" +
    (
      parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) / 100000000
    ).toFixed(2),
};
