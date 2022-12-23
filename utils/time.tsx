import { intervalToDuration } from "date-fns";

//TODO: replace that method for date-fns method instead on places where is being used and delete that file.
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
