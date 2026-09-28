import { getMarketQuote } from "@/lib/market";

export async function getQuoteData(symbol: string) {
  return getMarketQuote(symbol);
}
