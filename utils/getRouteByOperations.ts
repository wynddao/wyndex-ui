import { SwapOperation } from "../state/clients/types/WyndexMultiHop.types";
import { getAssetByTokenAddr } from "./assets";

export const getRouteByOperations = (operations: SwapOperation[]) => {
  return operations
    .map(({ wyndex_swap }) => {
      const from = Object.values(wyndex_swap.ask_asset_info)[0];
      const to = Object.values(wyndex_swap.offer_asset_info)[0];
      return {
        from: wyndex_swap.ask_asset_info.hasOwnProperty("token") ? getAssetByTokenAddr(from)?.denom : from,
        to: wyndex_swap.offer_asset_info.hasOwnProperty("token") ? getAssetByTokenAddr(to)?.denom : to,
      };
    })
    .reverse();
};
