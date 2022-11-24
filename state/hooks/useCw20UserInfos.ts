import { useWallet } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { Cw20Selectors } from "../recoil";

interface useCw20UserInfosOptions {
  walletAddress: string;
  cw20Address: string;
}

interface useCw20UserInfosResponse {
  balance: string;
}

export const useCw20UserInfos = ({ cw20Address }: useCw20UserInfosOptions): useCw20UserInfosResponse => {
  const { address: walletAddress } = useWallet();
  const balance = useRecoilValue(
    Cw20Selectors.balanceSelector({
      contractAddress: cw20Address,
      params: [
        {
          address: walletAddress || "",
        },
      ],
    }),
  ).balance;
  return {
    balance,
  };
};
