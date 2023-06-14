"use client";
import { Image, ImageProps } from "@chakra-ui/react";
import { CW20Asset, IBCAsset } from "@wynddao/asset-list";
import { useIndexerInfos } from "../../state";
import { AssetInfo } from "../../state/clients/types/WyndexPair.types";

interface AssetImageOptions extends Omit<ImageProps, "alt" | "src"> {
  asset: AssetInfo | string;
}

export default function AssetImage(props: AssetImageOptions) {
  const { asset } = props;
  const { permlessAssets } = useIndexerInfos({});
  let type: string;
  let address: string;

  // Check if native or not
  if (typeof asset === "string") {
    // Check if cw20 Token
    if (asset.startsWith("juno1")) {
      type = "cw20";
      address = asset;
    } else if (asset.toUpperCase().startsWith("IBC/")) {
      type = "ibc";
      address = asset;
    } else {
      type = "native";
      address = asset;
    }
  } else {
    if (asset.hasOwnProperty("token")) {
      type = "cw20";
      // @ts-ignore
      address = asset.token;
    } else {
      // @ts-ignore
      address = asset.native;
      // @ts-ignore
      if (asset.native.toUpperCase().startWith("IBC/")) {
        type = "ibc";
      } else {
        type = "native";
      }
    }
  }

  let image: string | undefined;

  switch (type) {
    case "ibc":
      image = permlessAssets.find((el) => (el as IBCAsset).juno_denom === address)?.logoURI;
      break;
    case "native":
      image = permlessAssets.find((el) => el.denom === address)?.logoURI;
      break;
    case "cw20":
    default:
      image = permlessAssets.find((el) => (el as CW20Asset).token_address === address)?.logoURI;
  }

  // Fallback image
  if (!image) {
    image = "https://raw.githubusercontent.com/cosmorama/wynd-assets-list/main/images/WYND.svg";
  }

  return <Image src={image} alt={address} {...props} />;
}
