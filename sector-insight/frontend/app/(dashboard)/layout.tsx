import React from "react"
import { Header } from "@/src/shared/layout/Header"
import { Sidebar } from "@/src/shared/layout/Sidebar"
import { Footer } from "@/src/shared/layout/Footer"
import { MobileNav } from "@/src/shared/layout/MobileNav"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full md:pl-60 pt-16 flex flex-col min-h-screen">
          <main className="flex-1 px-4 md:px-margin py-space-md pb-20 md:pb-space-xl">
            {children}
          </main>
          <Footer />
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
