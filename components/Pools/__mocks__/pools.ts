import { PoolsData } from "../../../components/Pools/PoolsCard";
import { OsmosisTokens } from "../../../utils/assets";
import { getShuffledArr } from "../../../utils/mocking";

const getRandomId = getShuffledArr([...Array(500)].map((v, i) => (v = i + 1))).slice(0, 4);

const poolOptionTokens = OsmosisTokens.map(({ name, imgSrc }) => ({
  name: name,
  imgSrc: imgSrc,
}));

const poolOptionToken1 = getShuffledArr([...poolOptionTokens]);
const poolOptionToken2 = getShuffledArr([...poolOptionTokens]).filter((v, i) => v !== poolOptionToken1[i]);

const getRandomPoolLiquidity = (numElements: number) =>
  [...Array(numElements)].fill(undefined).map((_) => {
    return parseInt(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", ""));
  });

const getRandomMyLiquidity = (numElements: number) =>
  [...Array(numElements)].fill(undefined).map((_) => {
    return parseInt(
      getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().slice(0, 5).replaceAll(",", ""),
    );
  });

const getRandomAPR = (numElements: number) =>
  [...Array(numElements)].fill(undefined).map((_) => {
    return (
      parseInt(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().slice(0, 7).replaceAll(",", "")) /
      100
    );
  });

export const getDefaultData = (numElements: number): readonly PoolsData[] =>
  [...Array(numElements)].fill(undefined).map((_, i) => ({
    id: getRandomId[i],
    token1: poolOptionToken1[i],
    token2: poolOptionToken2[i],
    poolLiquidity: getRandomPoolLiquidity(numElements)[i],
    myLiquidity: getRandomMyLiquidity(numElements)[i],
    myBoundedAmount: getRandomMyLiquidity(numElements)[i],
    apr: getRandomAPR(numElements)[i],
    longestDaysUnbonding: Math.random() < 0.5,
  }));
