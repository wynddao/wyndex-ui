export const getApr = (
  apr: {
    unbonding_period: number;
    apr: number | string;
  }[],
  unbonding_duration: number,
): string => {
  let thisApr = apr.find((el) => el.unbonding_period == unbonding_duration)?.apr;
  let res = "-";

  if (thisApr) {
    res = thisApr.toString();
  } else {
    res = "-";
  }

  return res;
};
