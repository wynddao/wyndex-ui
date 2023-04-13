import { useChain } from "@cosmos-kit/react-lite";
import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { Cw20Selectors } from "../recoil";
interface useCw20UserInfosResponse {
  balance: string;
  refreshBalance: () => void;
}

export const useCw20UserInfos = (cw20Address: string): useCw20UserInfosResponse => {
  const { address: walletAddress } = useChain("juno");
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
  const refreshBalance = useRecoilRefresher_UNSTABLE(
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
  );
  return {
    balance,
    refreshBalance,
  };
};
