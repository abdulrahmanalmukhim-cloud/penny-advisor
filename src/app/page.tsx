"use client";

import { useState } from "react";

const cards = [
  ["السعر", "$2.48", "+12.6%", "text-emerald-400"],
  ["الحجم", "4.82M", "RVOL 3.4x", "text-cyan-400"],
  ["VWAP", "$2.31", "فوق المتوسط", "text-emerald-400"],
  ["الـ Float", "18.6M", "متوسط", "text-amber-400"]
];

export default function Home() {
  const [ticker, setTicker] = useState("ABCD");
  const [searched, setSearched] = useState("ABCD");
  const [note, setNote] = useState("");

  function search(event: React.FormEvent) {
    event.preventDefault();
    setSearched(ticker.trim().toUpperCase() || "ABCD");
  }

  return <main className="min-h-screen bg-[#07111f]">
    <header className="border-b border-slate-800 bg-[#0b1728]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <div><p className="text-sm text-cyan-400">PENNY ADVISOR</p><h1 className="text-xl font-bold">مستشارك الشخصي للتداول</h1></div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">بيانات تجريبية</span>
      </div>
    </header>
    <div className="mx-auto max-w-7xl space-y-5 px-5 py-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#0d1b2e] p-5 md:flex-row md:items-center md:justify-between">
        <div><p className="text-sm text-slate-400">السهم المختار</p><h2 className="text-3xl font-bold">{searched} <span className="text-base font-normal text-slate-400">NASDAQ</span></h2></div>
        <form onSubmit={search} className="flex gap-2"><input value={ticker} onChange={e => setTicker(e.target.value)} aria-label="رمز السهم" className="w-36 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 uppercase outline-none focus:border-cyan-400"/><button className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400">تحليل</button></form>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value, detail, color]) => <div key={label} className="rounded-2xl border border-slate-800 bg-[#0d1b2e] p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className={`mt-2 text-sm ${color}`}>{detail}</p></div>)}</section>
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-[#0d1b2e] p-5 lg:col-span-2"><div className="mb-4 flex justify-between"><h3 className="font-bold">حركة السعر</h3><span className="text-sm text-slate-400">آخر 30 جلسة</span></div><div className="flex h-64 items-end gap-2 rounded-xl bg-slate-950/60 p-5">{[35,42,38,48,45,58,52,64,61,72,67,82,76,91,86,96].map((height, i) => <div key={i} className={`flex-1 rounded-t ${i > 11 ? "bg-emerald-400" : "bg-cyan-500/70"}`} style={{ height: `${height}%` }} />)}</div><div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm"><div><p className="text-slate-400">الدعم</p><b>$2.20</b></div><div><p className="text-slate-400">VWAP</p><b className="text-cyan-400">$2.31</b></div><div><p className="text-slate-400">المقاومة</p><b>$2.75</b></div></div></div>
        <div className="rounded-2xl border border-amber-500/30 bg-[#171b25] p-5"><h3 className="font-bold text-amber-300">⚠️ مخاطر SEC والتخفيف</h3><ul className="mt-5 space-y-4 text-sm"><li><span className="text-slate-400">آخر filing:</span><br/>10-Q منذ 18 يوماً</li><li><span className="text-slate-400">أسهم قابلة للتحويل:</span><br/><b className="text-amber-300">تحتاج مراجعة</b></li><li><span className="text-slate-400">تنبيه:</span><br/>تحقق من S-1 و 8-K قبل اتخاذ قرار</li></ul></div>
      </section>
      <section className="grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-emerald-500/30 bg-[#0d211f] p-5"><h3 className="font-bold text-emerald-300">سيناريو الصعود</h3><p className="mt-3 text-sm leading-7 text-slate-300">الثبات فوق VWAP مع استمرار RVOL قد يدعم اختبار مستوى المقاومة التالي. راقب الإغلاق وليس الحركة اللحظية.</p></div><div className="rounded-2xl border border-rose-500/30 bg-[#24151f] p-5"><h3 className="font-bold text-rose-300">سيناريو الفشل</h3><p className="mt-3 text-sm leading-7 text-slate-300">كسر الدعم مع هبوط الحجم قد يبطل السيناريو. حدد نقطة إلغاء واضحة قبل الدخول.</p></div></section>
      <section className="rounded-2xl border border-slate-800 bg-[#0d1b2e] p-5"><h3 className="font-bold">🤖 ملاحظات المستشار</h3><p className="mt-3 text-sm leading-7 text-slate-300">هذه لوحة تحليلية وليست توصية شراء أو بيع. افحص السيولة، السبريد، الأخبار، filings، وخطة المخاطر بنفسك.</p><div className="mt-4 flex gap-2"><input value={note} onChange={e => setNote(e.target.value)} placeholder="اكتب ملاحظة للصفقة..." className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"/><button onClick={() => setNote("")} className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:border-cyan-400">حفظ</button></div></section>
      <footer className="pb-5 text-center text-xs text-slate-500">للاستخدام التعليمي والشخصي فقط — لا يمثل نصيحة مالية أو ضماناً للنتائج.</footer>
    </div>
  </main>;
}
