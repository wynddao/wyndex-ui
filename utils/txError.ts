import { CustomError } from "./customError";

export const txError = new CustomError([
  ["Transaction rejected", "request rejected"],
  ["Cannot transfer tokens locked by a vesting schedule", "still locked by a vesting schedule"],
  ["The operation has exceeded the slippage limit", "exceeds max spread limit"],
  ["Not enough balance", "insufficient funds"],
  ["Not enough gas was provided", "out of gas"],
  ["Too many decimals provided", "error parsing decimal"],
]);
