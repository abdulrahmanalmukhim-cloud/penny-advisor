import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase() || "AAPL";

  try {
    const quote = await yahooFinance.quote(symbol);
    const chart = await yahooFinance.chart(symbol, { interval: "1d", range: "1mo" });

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

    const response = {
      symbol: quote.symbol ?? symbol,
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
        `السهم ${symbol} يتم تحليله عبر بيانات Yahoo Finance. راقب الاتجاه فوق VWAP والـ volume، وتحقق من التقارير والملفات الرسمية قبل اتخاذ قرار تداول.`,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: "تعذر جلب بيانات السهم. تأكد من رمز السهم أو حاول لاحقاً.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
