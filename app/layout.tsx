import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Proposely",
  description: "Proposals and invoices for freelancers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen bg-background antialiased`}>
        {children}
      </body>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"strategy="lazyOnload"/>
    </html>
    
    
  )
}