import { OsmosisTokens } from "../../../utils/assets";
import { getShuffledArr } from "../../../utils/mocking";
import { dataType } from "../AddLiquidity";

const randGenerator = (n: number, sum: number) => {
  const arrReturn = [];
  let fSumTmp = sum;
  let iAcc = 0;
  for (let i = 0; i < n; i++) {
    const iTmp = Math.floor(Math.random() * (fSumTmp / 2));
    arrReturn.push(iTmp);
    fSumTmp -= iTmp;
    iAcc += iTmp;
  }
  arrReturn.push(sum - iAcc);
  return arrReturn;
};

const getDataArray: readonly dataType[] = getShuffledArr([
  ...OsmosisTokens.map(({ name, imgSrc }) => ({
    label: name,
    value: name,
    imgSrc,
    percent: null,
    availableCurrency: Math.floor(Math.random() * 100),
    show: true,
  })),
]).slice(0, 2);

const getPercentArr = randGenerator(1, 100);

export const defaultData = getDataArray.map((data, i) => ({
  ...data,
  percent: getPercentArr[i],
}));

export const defaultInput = getDataArray.map(({ label }) => ({
  id: label,
  value: "0",
}));
