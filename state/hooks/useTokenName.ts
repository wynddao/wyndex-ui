import { useRecoilValue } from "recoil";
import { Cw20Selectors } from "../recoil";

export interface UseTokenNameResponse {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
}

export const useTokenInfo = (tokenAddress: string): UseTokenNameResponse => {
  const tokenInfo = useRecoilValue(
    Cw20Selectors.tokenInfoSelector({
      contractAddress: tokenAddress,
      params: [],
    }),
  );

  return {
    tokenName: tokenInfo.name,
    tokenSymbol: tokenInfo.symbol,
    tokenDecimals: tokenInfo.decimals,
  };
};
