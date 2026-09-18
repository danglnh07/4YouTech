import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "4YouTech — Dịch vụ IT & Design cho dự án của bạn",
  description: "Portfolio cá nhân, giao diện ứng dụng, hồ sơ hệ thống và nhận diện thương hiệu theo yêu cầu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${inter.variable} ${jetBrainsMono.variable}`}>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
