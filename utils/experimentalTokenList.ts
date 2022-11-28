export enum TokenType {
  Native,
  Cw20,
}

export type TokenInfo = {
  name: string;
  imgSrc: string;
  type: TokenType;
  denom: string;
  contractAddress?: string;
};

export const experimentalTokenList: TokenInfo[] = [
  {
    name: "WYND",
    imgSrc: "https://app.wynddao.com/image.png",
    type: TokenType.Cw20,
    contractAddress: "juno1q56cfjewxp2f0pqtrpyx78j55zfxnz4z27y6fayew0wqw9m2t87sjfgf54",
    denom: "uwynd",
  },
  {
    name: "JUNOX",
    imgSrc: "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fjuno.svg&w=64&q=75",
    type: TokenType.Native,
    denom: "ujunox",
  },
];
