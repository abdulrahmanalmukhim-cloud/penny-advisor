"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type QuoteData = {
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

const formatMoney = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value || 0);

const formatPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

export default function Home() {
  const [ticker, setTicker] = useState("PLTR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<QuoteData | null>(null);

  const loadQuote = async (symbol: string) => {
    const value = symbol.trim() || "PLTR";
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/quote?symbol=${encodeURIComponent(value)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "تعذر جلب البيانات");
      }

      setQuote(data as QuoteData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuote("PLTR");
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    loadQuote(ticker);
  };

  const cards = useMemo(() => {
    if (!quote) {
      return [];
    }

    return [
      ["السعر", formatMoney(quote.price, quote.currency), formatPercent(quote.changePercent), quote.changePercent >= 0 ? "text-emerald-400" : "text-red-400"],
      ["الحجم", formatNumber(quote.volume), `متوسط ${formatNumber(quote.avgVolume)}`, "text-cyan-400"],
      ["VWAP", formatMoney(quote.vwap, quote.currency), "متوسط مرجح", quote.vwap >= quote.price ? "text-emerald-400" : "text-amber-400"],
      ["الدعم/المقاومة", `${formatMoney(quote.support, quote.currency)} / ${formatMoney(quote.resistance, quote.currency)}`, "مستويات رئيسية", "text-yellow-400"],
    ];
  }, [quote]);

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="border-b border-slate-800 bg-[#0b1728]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div>
            <p className="text-sm text-cyan-400">PENNY ADVISOR</p>
            <h1 className="text-xl font-bold">مستشارك الشخصي للتداول</h1>
          </div>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
            {quote ? quote.marketState : "بيانات حية"}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-5 px-5 py-6">
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#0d1b2e] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">السهم المختار</p>
            <h2 className="text-3xl font-bold">
              {quote?.symbol || ticker.toUpperCase()} 
              <span className="text-base font-normal text-slate-400">{quote?.currency || "USD"}</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              aria-label="رمز السهم"
              className="w-36 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 uppercase outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "جارٍ..." : "تحليل"}
            </button>
          </form>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</div>
        ) : null}

        {quote ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map(([label, value, detail, color]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-[#0d1b2e] p-5">
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-2 text-2xl font-bold">{value}</p>
                  <p className={`mt-2 text-sm ${color}`}>{detail}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-[#0d1b2e] p-5 lg:col-span-2">
                <div className="mb-4 flex justify-between">
                  <h3 className="font-bold">حركة السعر</h3>
                  <span className="text-sm text-slate-400">آخر جلسة</span>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-4">
                  <div className="grid grid-cols-6 gap-2">
                    {[30, 40, 35, 48, 64, 52, 70, 68, 76, 74, 88, 92].map((height, index) => (
                      <div key={index} className="flex items-end justify-center">
                        <div
                          className={`w-full rounded-t ${index >= 6 ? "bg-emerald-400" : "bg-cyan-500"}`}
                          style={{ height: `${height}px` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <p className="text-slate-400">الدعم</p>
                    <b>{formatMoney(quote.support, quote.currency)}</b>
                  </div>
                  <div>
                    <p className="text-slate-400">VWAP</p>
                    <b className="text-cyan-400">{formatMoney(quote.vwap, quote.currency)}</b>
                  </div>
                  <div>
                    <p className="text-slate-400">المقاومة</p>
                    <b>{formatMoney(quote.resistance, quote.currency)}</b>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-[#171b25] p-5">
                <h3 className="font-bold text-amber-300">⚠️ مخاطر SEC والتخفيف</h3>
                <ul className="mt-5 space-y-4 text-sm text-slate-200">
                  <li>
                    <span className="text-slate-400">آخر filing:</span>
                    <br />
                    مراجعة مستندات الشركة قبل الدخول
                  </li>
                  <li>
                    <span className="text-slate-400">التخفيف:</span>
                    <br />
                    <b className="text-amber-300">يجب التحقق من الأسهم القابلة للتحويل</b>
                  </li>
                  <li>
                    <span className="text-slate-400">تنبيه:</span>
                    <br />
                    لا تعتمد على سعر اللحظة فقط، راقب الأخبار والفيلنجات
                  </li>
                </ul>
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/30 bg-[#0d211f] p-5">
                <h3 className="font-bold text-emerald-300">سيناريو الصعود</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  إذا بقي السعر فوق VWAP مع حجم قوي، فهذا يدعم الاتجاه الصاعد. راقب التماسك فوق الدعم الرئيسي.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/30 bg-[#24151f] p-5">
                <h3 className="font-bold text-rose-300">سيناريو الفشل</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  إذا انكسرت مستويات الدعم مع انخفاض الحجم، فقد يفشل الاتجاه. يجب وضع نقطة إلغاء واضحة.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-[#0d1b2e] p-5">
              <h3 className="font-bold">🤖 ملاحظات المستشار</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {quote.notes}
              </p>
            </section>
          </>
        ) : null}

        <footer className="pb-5 text-center text-xs text-slate-500">
          للعرض التعليمي فقط — لا يمثل نصيحة مالية أو ضماناً للنتائج.
        </footer>
      </div>
    </main>
  );
}
