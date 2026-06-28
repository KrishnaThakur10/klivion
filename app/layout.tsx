import type { Metadata } from "next"
import "./globals.css"
import Script from "next/script"
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Klivion — Proposals & Invoices for Freelancers",
  description: "Create professional proposals and get paid faster.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased ">
        <GoogleTagManager gtmId="G-GEEERHMDH7" />
        {children}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Analytics />
      </body>
    </html>
  )
}