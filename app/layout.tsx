import type { Metadata } from "next";
import { M_PLUS_1, M_PLUS_1_Code, Noto_Sans_SC } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const mPlus1 = M_PLUS_1({
  variable: "--font-m-plus-1",
  subsets: ["latin"],
});

const mPlus1Code = M_PLUS_1_Code({
  variable: "--font-m-plus-1-code",
  subsets: ["latin"],
});

const notoSansSc = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amia — 日々の記録",
  description: "言語と日常のあいだにある、小さな記録。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${mPlus1.variable} ${mPlus1Code.variable} ${notoSansSc.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-base-100 text-base-content">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
