import type { Money } from "./types";

const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(currencyCode: string) {
  const key = `sv-SE:${currencyCode}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    formatters.set(key, f);
  }
  return f;
}

export function formatMoney(money: Money | null | undefined): string {
  if (!money) return "";
  const numeric = Number(money.amount);
  return formatterFor(money.currencyCode).format(numeric);
}

export function cx(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}
