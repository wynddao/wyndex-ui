import { useWallet } from "@cosmos-kit/react";
import { constSelector, useRecoilValue } from "recoil";
import { Cw20Selectors } from "../recoil";
interface useCw20UserInfosResponse {
  balance: string;
}

export const useCw20UserInfos = (cw20Address: string): useCw20UserInfosResponse => {
  const { address: walletAddress } = useWallet();
  const balance = useRecoilValue(
    walletAddress
      ? Cw20Selectors.balanceSelector({
          contractAddress: cw20Address,
          params: [
            {
              address: walletAddress || "",
            },
          ],
        })
      : constSelector({ balance: "0" }),
  ).balance;
  return {
    balance,
  };
};
