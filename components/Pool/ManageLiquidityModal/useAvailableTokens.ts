// @ts-nocheck
import { constSelector, useRecoilValue } from "recoil";
import { Cw20Selectors } from "../../../state";
import { PairInfo } from "../../../state/clients/types/WyndexFactory.types";
import { getNativeTokenBalance } from "../../../utils/wallet";

export const useAvailableTokens = (pairData: PairInfo, walletAddress: string) => {
  const balance = [
    useRecoilValue(
      pairData.asset_infos[0].hasOwnProperty("token")
        ? Cw20Selectors.balanceSelector({
            contractAddress: pairData.asset_infos[0].token,
            params: [
              {
                address: walletAddress || "",
              },
            ],
          })
        : constSelector({
            balance: getNativeTokenBalance(walletAddress || "", pairData.asset_infos[0].native_token),
          }),
    ),
    useRecoilValue(
      pairData.asset_infos[1].hasOwnProperty("token")
        ? Cw20Selectors.balanceSelector({
            contractAddress: pairData.asset_infos[1].token,
            params: [
              {
                address: walletAddress || "",
              },
            ],
          })
        : constSelector({
            balance: getNativeTokenBalance(walletAddress || "", pairData.asset_infos[1].native_token),
          }),
    ),
  ];

  return balance.map((el) => el?.balance);
};
