import { Coin } from "cosmwasm";

export function microamountToAmount(amount: number | string, decimals: number, fixed?: number): string {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  amount = amount / Math.pow(10, decimals);
  if (fixed) {
    return isNaN(amount) ? "0" : String(amount.toFixed(fixed));
  }
  return isNaN(amount) ? "0" : String(amount);
}

export function amountToMicroamount(amount: number | string, decimals: number): string {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  // Need to round. Example: `8.029409 * Math.pow(10, 6)`.
  amount = Math.round(amount * Math.pow(10, decimals));
  return isNaN(amount) ? "0" : String(amount);
}

export function microdenomToDenom(denom: string): string {
  return denom.substring(1).toUpperCase();
}

export function denomToMicrodenom(denom: string): string {
  return denom ? "u" + denom.toUpperCase() : "";
}

export function microcoinToCoin(coin: Coin, decimals: number): Coin {
  return { denom: microdenomToDenom(coin.denom), amount: microamountToAmount(coin.amount, decimals) };
}

export function coinToMicrocoin(coin: Coin, decimals: number): Coin {
  return { denom: denomToMicrodenom(coin.denom), amount: amountToMicroamount(coin.amount, decimals) };
}
