import { PoolData, UnbondingPeriodListData } from "..";
import { OsmosisTokens } from "../../../utils/assets";
import { getShuffledArr } from "../../../utils/mocking";

const poolOptionTokens = OsmosisTokens.map(({ name, imgSrc }) => ({
  name: name,
  img: imgSrc,
}));

const poolOptionToken1 = getShuffledArr([...poolOptionTokens])[0];
const poolOptionToken2 = getShuffledArr([...poolOptionTokens]).filter(
  ({ name }) => name !== poolOptionToken1.name,
)[0];

const getRandomTotalAmount = [...Array(2)].map((_) =>
  (parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) / 5000).toFixed(
    2,
  ),
);

const getRandomMyLiquidity = parseInt(
  getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().slice(0, 5).replaceAll(",", ""),
);
const randomAmountValue = parseInt(
  getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().slice(0, 4).replaceAll(",", ""),
);
const getRandomMyAmount = [...Array(2)].map((_, i) => {
  if (i !== 0 && getRandomMyLiquidity < randomAmountValue) return randomAmountValue - getRandomMyLiquidity;
  if (i !== 0 && getRandomMyLiquidity > randomAmountValue) return getRandomMyLiquidity - randomAmountValue;
  return randomAmountValue;
});

const getRandomPercent = parseInt(
  getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().slice(0, 3).replaceAll(",", ""),
);
const getRandomPoolLiquidity = parseInt(
  getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", ""),
);
const getRandomSwapFee = parseFloat((Math.random() * 11).toFixed(2));

const daysArr = ["1", "7", "14"];
const getRandomAPR = getShuffledArr(
  [...Array(3)].map((_) => {
    const randomAPR =
      parseInt(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().slice(0, 7).replaceAll(",", "")) /
      100;
    return randomAPR;
  }),
).sort(function (a, b) {
  return a - b;
});

export const getDefaultPoolData = (poolAddress: string): PoolData => ({
  id: poolAddress,
  token1: {
    name: poolOptionToken1.name,
    img: poolOptionToken1.img,
    tokenTotalAmount: parseFloat(getRandomTotalAmount[0]),
    amount: getRandomMyAmount[0],
    percent: getRandomPercent,
  },
  token2: {
    name: poolOptionToken2.name,
    img: poolOptionToken2.img,
    tokenTotalAmount: parseFloat(getRandomTotalAmount[1]),
    amount: getRandomMyAmount[1],
    percent: 100 - getRandomPercent,
  },
  poolLiquidity: getRandomPoolLiquidity,
  swapFee: getRandomSwapFee,
  myLiquidity: getRandomMyLiquidity,
  bounded: getRandomMyLiquidity,
});

export const defaultUnbondingList: readonly UnbondingPeriodListData[] = [...Array(3)].map((_, i) => ({
  days: daysArr[i],
  apr: getRandomAPR[i],
  amount: 0,
}));
