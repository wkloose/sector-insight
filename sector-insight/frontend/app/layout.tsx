import type { Metadata } from "next"
import localFont from "next/font/local"
import "material-symbols/outlined.css"
import "./globals.css"

const inter = localFont({
  src: [
    {
      path: "../public/assets/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
})

const jetbrainsMono = localFont({
  src: [
    {
      path: "../public/assets/fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/JetBrainsMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
})

export const metadata: Metadata = {
  title: {
    default: "Sectors.Intel — Financial Sector Intelligence Dashboard",
    template: "%s | Sectors.Intel",
  },
  description: "Financial Sector Intelligence Dashboard untuk pemantauan sektor perbankan Indonesia (IDX) berbasis Fundamental, Arus Modal Asing, dan Sentimen Berita.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-surface text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  )
}

