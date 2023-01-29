import { nextMonday, previousMonday } from "date-fns";

export const getMultiplier = () => {
  const nextMondayNineAM = nextMonday(new Date().setHours(9, 30, 0));
  const lastMondayNineAM = previousMonday(new Date().setHours(9, 30, 0));
  const now = new Date();
  const totalDateDifference = nextMondayNineAM.getTime() - lastMondayNineAM.getTime();
  const currentDateDifference = totalDateDifference - (nextMondayNineAM.getTime() - now.getTime());
  return 1 + (6 / totalDateDifference) * currentDateDifference;
};
