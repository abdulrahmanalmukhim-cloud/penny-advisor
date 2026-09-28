import yahooFinance from "yahoo-finance2";

export type MarketQuote = {
  symbol: string;
  price: number;
  previousClose: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketState: string;
  currency: string;
  vwap: number;
  support: number;
  resistance: number;
  notes: string;
};

export async function getMarketQuote(symbol: string): Promise<MarketQuote> {
  const clean = symbol.trim().toUpperCase() || "AAPL";

  const quote = await yahooFinance.quote(clean);
  const chart = await yahooFinance.chart(clean, { interval: "1d", range: "1mo" });

  const closes =
    chart.quotes
      ?.map((item) => item.close ?? item.adjclose ?? null)
      .filter((value): value is number => typeof value === "number")
      .slice(-30) ?? [];

  const current = quote.regularMarketPrice ?? 0;
  const previousClose = quote.regularMarketPreviousClose ?? current;
  const changePercent = previousClose ? ((current - previousClose) / previousClose) * 100 : 0;

  const vwap = closes.length ? closes.reduce((total, value) => total + value, 0) / closes.length : current;
  const support = closes.length ? Math.min(...closes) : current * 0.97;
  const resistance = closes.length ? Math.max(...closes) : current * 1.03;

  return {
    symbol: quote.symbol ?? clean,
    price: current,
    previousClose,
    changePercent,
    volume: quote.regularMarketVolume ?? 0,
    avgVolume: quote.averageDailyVolume3Month ?? 0,
    marketState: quote.marketState ?? "CLOSED",
    currency: quote.currency ?? "USD",
    vwap,
    support,
    resistance,
    notes:
      `السهم ${clean} يتم تحليله عبر بيانات Yahoo Finance. راقب الاتجاه فوق VWAP والـ volume، وتحقق من التقارير والملفات الرسمية قبل اتخاذ قرار تداول.`
  };
}
