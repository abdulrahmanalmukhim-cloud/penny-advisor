import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase() || "AAPL";

  if (!/^[A-Z0-9.-]{1,12}$/.test(symbol)) {
    return NextResponse.json({ error: "رمز السهم غير صالح" }, { status: 400 });
  }

  try {
    // استخدام Alpha Vantage API (مجاني وموثوق)
    const apiKey = "demo"; // نسخة تجريبية
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
    
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const quote = data["Global Quote"] || {};

    if (!quote["05. price"]) {
      throw new Error("No price data available");
    }

    const price = parseFloat(quote["05. price"]) || 0;
    const previousClose = parseFloat(quote["08. previous close"]) || price;
    const open = parseFloat(quote["02. open"]) || price;
    const high = parseFloat(quote["03. high"]) || price;
    const low = parseFloat(quote["04. low"]) || price;
    const volume = parseInt(quote["06. volume"] || "0", 10) || 0;
    const changePercent = parseFloat(quote["10. change percent"]?.replace("%", "") || "0") || 0;

    // حسابات تقريبية
    const vwap = (open + high + low + price) / 4;
    const support = low;
    const resistance = high;
    const avgVolume = volume;

    return NextResponse.json(
      {
        symbol: quote["01. symbol"] || symbol,
        price,
        previousClose,
        changePercent,
        volume,
        avgVolume,
        marketState: "OPEN",
        currency: "USD",
        vwap,
        support,
        resistance,
        notes: `بيانات ${symbol} محدثة. السعر ${price} USD. التغير ${changePercent}%. راقب الدعم عند ${support} والمقاومة عند ${resistance}.`,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      {
        error: "تعذر جلب البيانات حالياً",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }
}
