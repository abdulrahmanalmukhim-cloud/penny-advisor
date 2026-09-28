import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase() || "AAPL";

  if (!/^[A-Z0-9.-]{1,12}$/.test(symbol)) {
    return NextResponse.json({ error: "رمز السهم غير صالح" }, { status: 400 });
  }

  try {
    // جلب البيانات من Yahoo Finance API
    const quoteUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price,summaryDetail`;
    const quoteResponse = await fetch(quoteUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    
    if (!quoteResponse.ok) {
      throw new Error(`Yahoo Finance returned ${quoteResponse.status}`);
    }

    const quoteData = await quoteResponse.json();
    const result = quoteData.quoteSummary?.result?.[0];
    
    if (!result) {
      throw new Error("No quote data returned");
    }

    const price = result.price?.regularMarketPrice?.raw || 0;
    const previousClose = result.price?.regularMarketPreviousClose?.raw || price;
    const volume = result.price?.regularMarketVolume?.raw || 0;
    const currency = result.price?.currency || "USD";
    const marketState = result.price?.marketState || "CLOSED";
    const changePercent = previousClose ? ((price - previousClose) / previousClose) * 100 : 0;
    const avgVolume = result.summaryDetail?.averageDailyVolume3Month?.raw || volume;

    // حساب تقريبي للـ VWAP والدعم والمقاومة من البيانات المتاحة
    const fiftyTwoWeekHigh = result.summaryDetail?.fiftyTwoWeekHigh?.raw || price * 1.2;
    const fiftyTwoWeekLow = result.summaryDetail?.fiftyTwoWeekLow?.raw || price * 0.8;
    
    const vwap = (fiftyTwoWeekHigh + fiftyTwoWeekLow + price) / 3;
    const support = fiftyTwoWeekLow;
    const resistance = fiftyTwoWeekHigh;

    return NextResponse.json(
      {
        symbol,
        price,
        previousClose,
        changePercent,
        volume,
        avgVolume,
        marketState,
        currency,
        vwap,
        support,
        resistance,
        notes: `السهم ${symbol} يتم تحليله عبر بيانات Yahoo Finance. راقب الاتجاه فوق VWAP والـ volume، وتحقق من التقارير والملفات الرسمية قبل اتخاذ قرار تداول.`,
      },
      {
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      {
        error: "تعذر جلب بيانات السهم. تأكد من الرمز أو حاول لاحقاً.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }
}
