// @ts-nocheck
import { constSelector, useRecoilValue } from "recoil";
import { Cw20Selectors } from "../../../state";
import { PairInfo } from "../../../state/clients/types/WyndexFactory.types";
import { getNativeTokenBalance } from "../../../utils/wallet";



export const useAvailableTokens = (pairData: PairInfo, walletAddress: string) : (string | undefined)[] => {
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
            balance: undefined,
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
            balance: undefined,
          }),
    ),
  ];

  return balance.map((el) => el?.balance);
};
