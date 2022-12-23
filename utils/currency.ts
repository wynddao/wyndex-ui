export const formatCurrency = (currency: string, amount: string) => {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(Number(amount));
};

export const formatCurrencyStatic = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});
