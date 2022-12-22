export const getApr = (
  apr: {
    unbonding_period: number;
    apr: number;
  }[],
  unbonding_duration: number,
): string => {
  let thisApr = apr.find((el) => el.unbonding_period == unbonding_duration)?.apr;
  let res = "-";

  if (thisApr) {
    res = (thisApr * 100).toFixed(2) + " %";
  } else {
    res = "-";
  }

  return res;
};
