import { NextRequest, NextResponse } from "next/server";
import { getMarketQuote } from "@/lib/market";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase() || "AAPL";

  if (!/^[A-Z0-9.-]{1,12}$/.test(symbol)) {
    return NextResponse.json({ error: "رمز السهم غير صالح" }, { status: 400 });
  }

  try {
    const data = await getMarketQuote(symbol);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "تعذر جلب بيانات السهم. تأكد من الرمز وحاول لاحقاً.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }
}
