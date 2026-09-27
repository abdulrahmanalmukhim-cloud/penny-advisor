import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Penny Advisor | مستشارك الشخصي",
  description: "لوحة تحليل شخصية لأسهم البيني ستوك"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
