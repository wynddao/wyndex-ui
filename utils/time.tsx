import { intervalToDuration } from "date-fns";

export function secondsToDays(seconds: number): number {
  const epoch = new Date(0);
  const secondsAfterEpoch = new Date(seconds * 1000);
  return (
    intervalToDuration({
      start: epoch,
      end: secondsAfterEpoch,
    }).days ?? 0
  );
}
