import { ROUTES } from "./routes"

export interface NavItem {
  readonly title: string
  readonly href: string
  readonly icon: string
  readonly pathKey: string
  readonly badge?: string
}

export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  {
    title: "Dashboard Utama",
    href: ROUTES.DASHBOARD,
    icon: "space_dashboard",
    pathKey: "dashboard-utama",
  },
  {
    title: "Screener Fundamental",
    href: ROUTES.SCREENER,
    icon: "table_chart",
    pathKey: "screener-fundamental",
  },
  {
    title: "Detail Saham",
    href: ROUTES.STOCK_DETAIL("BBCA"),
    icon: "query_stats",
    pathKey: "detail-saham",
  },
  {
    title: "Aktivitas Asing",
    href: ROUTES.FOREIGN_ACTIVITY_HUB,
    icon: "swap_horiz",
    pathKey: "aktivitas-asing",
  },
  {
    title: "Transparansi Berita",
    href: ROUTES.ARTICLES_HUB,
    icon: "feed",
    pathKey: "transparansi-berita",
  },
  {
    title: "Feed Sinyal Gabungan",
    href: ROUTES.SIGNALS,
    icon: "rss_feed",
    pathKey: "feed-sinyal-gabungan",
  },
  {
    title: "Perbandingan Sektor",
    href: ROUTES.COMPARE,
    icon: "compare_arrows",
    pathKey: "perbandingan-sektor",
  },
  {
    title: "Sektor Hub & Rotasi",
    href: ROUTES.SECTORS,
    icon: "hub",
    pathKey: "sektor-hub",
  },
  {
    title: "Kelola Watchlist",
    href: ROUTES.WATCHLIST,
    icon: "bookmark",
    pathKey: "kelola-watchlist",
  },
  {
    title: "Komunitas Intel",
    href: ROUTES.COMMUNITY,
    icon: "groups",
    pathKey: "komunitas-intel",
  },
  {
    title: "Metodologi Skor",
    href: ROUTES.METHODOLOGY,
    icon: "analytics",
    pathKey: "metodologi-skor",
  },
]

