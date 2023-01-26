import { useWallet } from "@cosmos-kit/react";
import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from "recoil";
import { Cw20Selectors } from "../recoil";

interface useCw20UserInfosResponse {
  balance: string;
  refreshBalance: () => void;
}

export const useCw20UserInfos = (cw20Address: string): useCw20UserInfosResponse => {
  const { address: walletAddress } = useWallet();
  const { state: balanceState, contents: balanceResponse } = useRecoilValueLoadable(
    walletAddress
      ? Cw20Selectors.balanceSelector({
          contractAddress: cw20Address,
          params: [{ address: walletAddress }],
        })
      : constSelector({ balance: "0" }),
  );
  const refreshBalance = useRecoilRefresher_UNSTABLE(
    walletAddress
      ? Cw20Selectors.balanceSelector({
          contractAddress: cw20Address,
          params: [{ address: walletAddress }],
        })
      : constSelector({ balance: "0" }),
  );
  return {
    balance: balanceState === "hasValue" ? balanceResponse.balance : "0",
    refreshBalance,
  };
};
