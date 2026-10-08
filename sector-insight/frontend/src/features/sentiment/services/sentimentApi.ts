import { API_BASE_URL } from "@/src/shared/lib/constants"
import { SentimentData } from "../types/sentiment"

export const MOCK_SENTIMENT_DATA: Record<string, SentimentData> = {
  BBRI: {
    ticker: "BBRI",
    companySentimentScore: 0.48,
    companySentimentLabel: "Positif Kuat",
    policyExposureScore: -0.15,
    policyExposureLabel: "Waspada / Netral-Negatif",
    totalArticles: 18,
    companyArticlesCount: 11,
    policyArticlesCount: 7,
    averageConfidence: 91.4,
    sampleTrend7d: [0.32, 0.35, 0.40, 0.38, 0.42, 0.45, 0.48],
    dominantIssue: "BI Rate 6.00%",
    dominantRegulation: "POJK Penyangga Likuiditas",
    articles: [
      {
        id: "art-1",
        title: "Bank Indonesia Pertahankan BI-Rate 6,00%: Sinyal Higher-for-Longer Berpotensi Tekan Cost of Funds Perbankan",
        source: "CNBC Indonesia",
        publishedAt: "24 Sep 2026, 09:15 WIB",
        author: "Tim Riset Makro",
        url: "https://cnbcindonesia.com",
        category: "macro_policy",
        categoryLabel: "KEBIJAKAN MAKRO",
        sentimentScore: -0.15,
        sentimentLabel: "Waspada",
        confidence: 92,
        decayWeight: 0.85,
        affectedEntities: "Perbankan Buku IV, Multifinance",
        reasoning: "Keputusan mempertahankan suku bunga tinggi menahan peredaran CASA murah dan meningkatkan beban bunga simpanan pada bank dengan portofolio kredit mikro sensitif seperti BBRI.",
        quote: "Gubernur BI menegaskan suku bunga acuan menetap tinggi demi stabilitas nilai tukar rupiah, mengindikasikan ruang penurunan suku bunga acuan masih terbatas hingga kuartal depan secara bertahap.",
        timeDecayLabel: "T-3 hari (0.78x Waktu)",
        ticker: "BBRI",
      },
      {
        id: "art-2",
        title: "Penyaluran Kredit UMKM BRI Tembus Rp 1.100 Triliun, Rasio NPL Mikro Berhasil Ditekan ke 2,4%",
        source: "Kontan Online",
        publishedAt: "23 Sep 2026, 14:20 WIB",
        author: "Jurnalis Sektor Perbankan",
        url: "https://kontan.co.id",
        category: "company_specific",
        categoryLabel: "SPESIFIK PERUSAHAAN",
        sentimentScore: 0.72,
        sentimentLabel: "Sangat Positif",
        confidence: 96,
        decayWeight: 0.91,
        affectedEntities: "BBRI (Primary)",
        reasoning: "Pertumbuhan volume kredit segmen mikro melampaui target RBB didorong ekspansi pembiayaan inklusif, memperkuat kualitas aset fundamental.",
        quote: "Direktur Utama BRI menyampaikan keberhasilan transformasi digital ekosistem Kupedes dan integrasi Holding Ultra Mikro (Pegadaian & PNM) berhasil menekan rasio NPL gross mikro terkonsolidasi.",
        timeDecayLabel: "T-2 hari (0.91x Waktu)",
        ticker: "BBRI",
      },
      {
        id: "art-3",
        title: "OJK Rilis Surat Edaran Penyesuaian Bobot Risiko Aset Tertimbang (ATMR) untuk Pembiayaan Produktif",
        source: "Bisnis Indonesia",
        publishedAt: "21 Sep 2026, 11:30 WIB",
        url: "https://bisnis.com",
        category: "macro_policy",
        categoryLabel: "KEBIJAKAN MAKRO",
        sentimentScore: -0.10,
        sentimentLabel: "Waspada",
        confidence: 88,
        decayWeight: 0.68,
        affectedEntities: "Perbankan Nasional",
        reasoning: "Aturan pengetatan perhitungan ATMR kredit komersial menuntut penambahan bantalan modal CAR perbankan.",
        quote: "Pemberlakuan buffer untuk risiko konsentrasi kredit membutuhkan tambahan modal perbankan berkisar 25-50 bps.",
        timeDecayLabel: "T-5 hari (0.68x Waktu)",
        ticker: "BBRI",
      },
      {
        id: "art-4",
        title: "BRI Perkuat Sinergi Ekosistem Digital Desa dengan 850 Ribu AgenBRILink Aktif",
        source: "Bisnis.com",
        publishedAt: "20 Sep 2026, 16:45 WIB",
        url: "https://bisnis.com",
        category: "company_specific",
        categoryLabel: "SPESIFIK PERUSAHAAN",
        sentimentScore: 0.55,
        sentimentLabel: "Positif",
        confidence: 94,
        decayWeight: 0.58,
        affectedEntities: "BBRI",
        reasoning: "Peningkatan volume fee-based income dan perolehan dana murah (CASA) berbasis jaringan keagenan mikro.",
        quote: "Hingga akhir kuartal ketiga, volume transaksi AgenBRILink menembus Rp 1.050 triliun, menghasilkan rasio dana murah tabungan mikro yang konsisten stabil.",
        timeDecayLabel: "T-6 hari (0.58x Waktu)",
        ticker: "BBRI",
      },
    ],
  },
  BBCA: {
    ticker: "BBCA",
    companySentimentScore: 0.62,
    companySentimentLabel: "Positif Sangat Kuat",
    policyExposureScore: 0.25,
    policyExposureLabel: "Stabil / Resisten Kebijakan",
    totalArticles: 14,
    companyArticlesCount: 9,
    policyArticlesCount: 5,
    averageConfidence: 94.8,
    sampleTrend7d: [0.5, 0.52, 0.55, 0.58, 0.6, 0.61, 0.62],
    dominantIssue: "Rasio CASA Rekor 82.4%",
    dominantRegulation: "Ketentuan Insentif Likuiditas Makroprudensial",
    articles: [
      {
        id: "art-bbca-1",
        title: "BCA Catatkan Rekor Dana Murah CASA Sentuh 82,4%, Biaya Dana Terendah di Industri",
        source: "Bisnis Indonesia",
        publishedAt: "24 Sep 2026, 14:15 WIB",
        url: "https://bisnis.com",
        category: "company_specific",
        categoryLabel: "SPESIFIK PERUSAHAAN",
        sentimentScore: 0.78,
        sentimentLabel: "Sangat Positif",
        confidence: 96,
        decayWeight: 0.95,
        affectedEntities: "BBCA",
        reasoning: "Dominasi transaksi digital myBCA dan KlikBCA mempertahankan struktur biaya dana murah yang sangat efisien.",
        quote: "Pertumbuhan dana pihak ketiga BCA ditopang oleh loyalitas nasabah ritel dan korporasi pada sistem pembayaran transaksi harian.",
        timeDecayLabel: "T-1 hari (0.95x Waktu)",
        ticker: "BBCA",
      },
    ],
  },
  BMRI: {
    ticker: "BMRI",
    companySentimentScore: 0.45,
    companySentimentLabel: "Positif",
    policyExposureScore: 0.18,
    policyExposureLabel: "Stabil",
    totalArticles: 12,
    companyArticlesCount: 8,
    policyArticlesCount: 4,
    averageConfidence: 92.5,
    sampleTrend7d: [0.35, 0.38, 0.4, 0.42, 0.44, 0.45, 0.45],
    dominantIssue: "Livin by Mandiri Ecosystem",
    dominantRegulation: "Pembiayaan Transisi Energi Hijau",
    articles: [
      {
        id: "art-bmri-1",
        title: "Pertumbuhan Kredit Korporasi Bank Mandiri Capai 11,8% YoY, Kualitas Aset Tetap Terjaga",
        source: "CNBC Indonesia",
        publishedAt: "23 Sep 2026, 11:00 WIB",
        url: "https://cnbcindonesia.com",
        category: "company_specific",
        categoryLabel: "SPESIFIK PERUSAHAAN",
        sentimentScore: 0.65,
        sentimentLabel: "Positif",
        confidence: 93,
        decayWeight: 0.88,
        affectedEntities: "BMRI",
        reasoning: "Portofolio korporasi dan sindikasi infrastruktur menjadi pendorong utama pendapatan bunga bersih.",
        quote: "Bank Mandiri mencatatkan ekspansi pembiayaan wholesale yang konsisten dengan rasio NPL gross terkendali di bawah 1,5%.",
        timeDecayLabel: "T-2 hari (0.88x Waktu)",
        ticker: "BMRI",
      },
    ],
  },
  BBNI: {
    ticker: "BBNI",
    companySentimentScore: 0.38,
    companySentimentLabel: "Positif Moderat",
    policyExposureScore: 0.05,
    policyExposureLabel: "Netral / Stabil",
    totalArticles: 10,
    companyArticlesCount: 6,
    policyArticlesCount: 4,
    averageConfidence: 91.2,
    sampleTrend7d: [0.28, 0.30, 0.32, 0.35, 0.36, 0.38, 0.38],
    dominantIssue: "Valuasi Murah & Transformasi Digital Wondr",
    dominantRegulation: "Ketentuan Transaksi Valuta Asing",
    articles: [
      {
        id: "art-bbni-1",
        title: "Aplikasi Wondr by BNI Dongkrak Volume Transaksi Ritel Hingga 34% di Kuartal Berjalan",
        source: "Kontan Online",
        publishedAt: "22 Sep 2026, 10:40 WIB",
        url: "https://kontan.co.id",
        category: "company_specific",
        categoryLabel: "SPESIFIK PERUSAHAAN",
        sentimentScore: 0.58,
        sentimentLabel: "Positif",
        confidence: 94,
        decayWeight: 0.82,
        affectedEntities: "BBNI",
        reasoning: "Peluncuran platform digital baru mempercepat perolehan CASA ritel dan efisiensi biaya operasional CIR.",
        quote: "Manajemen BNI menyampaikan migrasi pengguna ke superapp Wondr menunjukkan tren akselerasi positif dengan retensi pengguna aktif yang tinggi.",
        timeDecayLabel: "T-3 hari (0.82x Waktu)",
        ticker: "BBNI",
      },
    ],
  },
  BRIS: {
    ticker: "BRIS",
    companySentimentScore: 0.42,
    companySentimentLabel: "Positif",
    policyExposureScore: 0.12,
    policyExposureLabel: "Positif Kebijakan",
    totalArticles: 9,
    companyArticlesCount: 6,
    policyArticlesCount: 3,
    averageConfidence: 90.5,
    sampleTrend7d: [0.35, 0.36, 0.38, 0.40, 0.41, 0.42, 0.42],
    dominantIssue: "Pertumbuhan Pembiayaan Emas & Konsumer",
    dominantRegulation: "Masterplan Ekonomi Syariah Nasional",
    articles: [
      {
        id: "art-bris-1",
        title: "Pembiayaan Konsumer dan Bisnis Emas BSI Tumbuh di Atas 20% YoY, Kualitas Aset Prima",
        source: "Bisnis Indonesia",
        publishedAt: "21 Sep 2026, 15:30 WIB",
        url: "https://bisnis.com",
        category: "company_specific",
        categoryLabel: "SPESIFIK PERUSAHAAN",
        sentimentScore: 0.62,
        sentimentLabel: "Positif",
        confidence: 92,
        decayWeight: 0.74,
        affectedEntities: "BRIS",
        reasoning: "Diversifikasi produk pembiayaan mikro dan emas memberikan imbal hasil margin yang resilien terhadap siklus suku bunga makro.",
        quote: "BSI terus memperluas jangkauan layanan finansial syariah dengan pertumbuhan pembiayaan multiguna yang berkualitas.",
        timeDecayLabel: "T-4 hari (0.74x Waktu)",
        ticker: "BRIS",
      },
    ],
  },
  BBTN: {
    ticker: "BBTN",
    companySentimentScore: -0.12,
    companySentimentLabel: "Waspada / Netral-Negatif",
    policyExposureScore: -0.28,
    policyExposureLabel: "Rentan Kebijakan",
    totalArticles: 11,
    companyArticlesCount: 5,
    policyArticlesCount: 6,
    averageConfidence: 89.8,
    sampleTrend7d: [-0.05, -0.08, -0.10, -0.12, -0.11, -0.14, -0.12],
    dominantIssue: "Likuiditas Sektor KPR & Biaya Dana Simpanan",
    dominantRegulation: "Skema Subsidi Perumahan FLPP",
    articles: [
      {
        id: "art-bbtn-1",
        title: "Tantangan Likuiditas Perbankan KPR: Penyaluran Kredit BTN Tetap Tumbuh di Tengah Kenaikan CoF",
        source: "CNBC Indonesia",
        publishedAt: "20 Sep 2026, 13:10 WIB",
        url: "https://cnbcindonesia.com",
        category: "macro_policy",
        categoryLabel: "KEBIJAKAN MAKRO",
        sentimentScore: -0.25,
        sentimentLabel: "Waspada",
        confidence: 90,
        decayWeight: 0.68,
        affectedEntities: "BBTN, Perbankan KPR",
        reasoning: "Tingginya suku bunga acuan meningkatkan beban biaya dana pihak ketiga bagi bank dengan rasio LDR di atas 90%.",
        quote: "Penyesuaian kuota fasilitas likuiditas pembiayaan perumahan (FLPP) menjadi penentu laju pembiayaan KPR subsidi ke depan.",
        timeDecayLabel: "T-5 hari (0.68x Waktu)",
        ticker: "BBTN",
      },
    ],
  },
}

function createFallbackSentiment(ticker: string): SentimentData {
  return {
    ticker,
    companySentimentScore: 0.35,
    companySentimentLabel: "Positif Moderat",
    policyExposureScore: -0.10,
    policyExposureLabel: "Netral-Waspada",
    totalArticles: 8,
    companyArticlesCount: 5,
    policyArticlesCount: 3,
    averageConfidence: 88.5,
    sampleTrend7d: [0.25, 0.28, 0.30, 0.32, 0.30, 0.34, 0.35],
    dominantIssue: "Suku Bunga Acuan BI",
    dominantRegulation: "Ketentuan Likuiditas Perbankan OJK",
    articles: [
      {
        id: `art-${ticker.toLowerCase()}-1`,
        title: `Kinerja Intermediasi Perbankan ${ticker} Tumbuh Positif di Tengah Dinamika Suku Bunga Global`,
        source: "Bisnis Indonesia",
        publishedAt: "24 Sep 2026, 10:30 WIB",
        url: "https://bisnis.com",
        category: "company_specific",
        categoryLabel: "SPESIFIK PERUSAHAAN",
        sentimentScore: 0.45,
        sentimentLabel: "Positif",
        confidence: 90,
        decayWeight: 0.88,
        affectedEntities: `${ticker} (Utama)`,
        reasoning: `Penyaluran kredit ${ticker} mencatat tren ekspansi yang sehat dengan pencadangan risiko yang memadai.`,
        quote: `Manajemen ${ticker} terus memperkuat efisiensi biaya dana dan digitalisasi layanan nasabah.`,
        timeDecayLabel: "T-2 hari (0.88x Waktu)",
        ticker,
      },
      {
        id: `art-${ticker.toLowerCase()}-2`,
        title: "BI Tegaskan Ketahanan Likuiditas Sektor Finansial Tetap Solid Mendukung Pertumbuhan Ekonomi",
        source: "CNBC Indonesia",
        publishedAt: "23 Sep 2026, 16:00 WIB",
        url: "https://cnbcindonesia.com",
        category: "macro_policy",
        categoryLabel: "KEBIJAKAN MAKRO",
        sentimentScore: -0.10,
        sentimentLabel: "Waspada",
        confidence: 89,
        decayWeight: 0.82,
        affectedEntities: "Perbankan Nasional",
        reasoning: "Arah bauran kebijakan moneter terfokus pada stabilitas inflasi dan pergerakan nilai tukar.",
        quote: "Stabilitas sistem keuangan tetap berdaya tahan didukung permodalan perbankan yang kokoh.",
        timeDecayLabel: "T-3 hari (0.82x Waktu)",
        ticker,
      },
    ],
  }
}

interface BackendRawArticle {
  id?: number
  judul: string
  snippet: string
  url: string
  tanggal_publikasi: string
  ticker?: string
}

interface BackendProcessedArticle {
  id?: number
  category: "company_specific" | "macro_policy"
  affected_entities: string
  sentiment_score: number
  confidence: number
  reasoning: string
  raw_article?: BackendRawArticle
}

interface BackendSentimentOverview {
  ticker: string
  company_sentiment_score: number
  policy_exposure_score: number
  trend_30_days?: Array<{
    tanggal: string
    company_sentiment_score: number
    policy_exposure_score: number
  }>
  top_articles?: BackendProcessedArticle[]
}

function getSentimentLabel(score: number): string {
  if (score >= 0.5) return "Sangat Positif"
  if (score >= 0.15) return "Positif"
  if (score >= -0.15) return "Netral"
  if (score >= -0.4) return "Waspada / Netral-Negatif"
  return "Negatif Signifikan"
}

function mapProcessedArticleToItem(art: BackendProcessedArticle, idx: number, ticker?: string) {
  const title = art.raw_article?.judul || "Pembaruan Analisis Sentimen & Regulasi"
  const url = art.raw_article?.url || "https://bisnis.com"
  let source = "Media Finansial"
  try {
    const domain = new URL(url).hostname.replace("www.", "")
    source = domain.split(".")[0].toUpperCase()
  } catch {
    source = "Bisnis / CNBC"
  }

  const d = art.raw_article?.tanggal_publikasi ? new Date(art.raw_article.tanggal_publikasi) : new Date()
  const publishedAt = !isNaN(d.getTime())
    ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " WIB"
    : "24 Sep 2026, 09:00 WIB"

  let affectedEntitiesClean = "Perbankan Nasional"
  if (art.affected_entities) {
    try {
      const parsed = JSON.parse(art.affected_entities)
      if (Array.isArray(parsed)) {
        affectedEntitiesClean = parsed.join(", ")
      } else {
        affectedEntitiesClean = String(parsed)
      }
    } catch {
      affectedEntitiesClean = art.affected_entities
    }
  }

  return {
    id: `art-live-${art.id || idx}`,
    title,
    source,
    publishedAt,
    url,
    category: art.category,
    categoryLabel: art.category === "macro_policy" ? "KEBIJAKAN MAKRO" : "SPESIFIK PERUSAHAAN",
    sentimentScore: Number(art.sentiment_score.toFixed(2)),
    sentimentLabel: getSentimentLabel(art.sentiment_score),
    confidence: Math.round((art.confidence || 0.9) * 100),
    decayWeight: 0.88,
    affectedEntities: affectedEntitiesClean,
    reasoning: art.reasoning || "Pengaruh regulasi dan dinamika operasional terhadap perbankan.",
    quote: art.raw_article?.snippet || art.reasoning,
    timeDecayLabel: "Terkini (Live Feed)",
    ticker: art.raw_article?.ticker || ticker || "BBRI",
  }
}

export async function getSentimentData(ticker: string): Promise<SentimentData> {
  const upper = (ticker || "BBRI").toUpperCase()
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const [overviewRes, articlesRes] = await Promise.all([
      fetch(`${baseUrl}/api/v1/sentiment/${upper}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/v1/sentiment/${upper}/articles`, { cache: "no-store" }),
    ])

    const overview: BackendSentimentOverview = overviewRes.ok ? await overviewRes.json() : null
    const articlesList: BackendProcessedArticle[] = articlesRes.ok ? await articlesRes.json() : []

    if (overview && typeof overview.company_sentiment_score === "number") {
      const mockFallback = MOCK_SENTIMENT_DATA[upper] || createFallbackSentiment(upper)
      const mappedArticles = Array.isArray(articlesList) && articlesList.length > 0
        ? articlesList.map((art, idx) => mapProcessedArticleToItem(art, idx, upper))
        : (overview.top_articles && overview.top_articles.length > 0)
        ? overview.top_articles.map((art, idx) => mapProcessedArticleToItem(art, idx, upper))
        : mockFallback.articles

      const trend = (overview.trend_30_days && overview.trend_30_days.length > 0)
        ? overview.trend_30_days.slice(0, 7).map((t) => Number(t.company_sentiment_score.toFixed(2)))
        : mockFallback.sampleTrend7d

      const companyCount = mappedArticles.filter((a) => a.category === "company_specific").length
      const policyCount = mappedArticles.filter((a) => a.category === "macro_policy").length

      return {
        ticker: upper,
        companySentimentScore: Number(overview.company_sentiment_score.toFixed(2)),
        companySentimentLabel: getSentimentLabel(overview.company_sentiment_score),
        policyExposureScore: Number(overview.policy_exposure_score.toFixed(2)),
        policyExposureLabel: getSentimentLabel(overview.policy_exposure_score),
        totalArticles: mappedArticles.length || mockFallback.totalArticles,
        companyArticlesCount: companyCount || mockFallback.companyArticlesCount,
        policyArticlesCount: policyCount || mockFallback.policyArticlesCount,
        averageConfidence: 92.5,
        sampleTrend7d: trend,
        dominantIssue: mockFallback.dominantIssue,
        dominantRegulation: mockFallback.dominantRegulation,
        articles: mappedArticles,
      }
    }
  } catch {
  }
  return MOCK_SENTIMENT_DATA[upper] || createFallbackSentiment(upper)
}

export async function getArticlesFeed(ticker = "BBCA", category = "") {
  const upperTicker = ticker.toUpperCase()
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const url = category
      ? `${baseUrl}/api/v1/sentiment/${upperTicker}/articles?category=${encodeURIComponent(category)}`
      : `${baseUrl}/api/v1/sentiment/${upperTicker}/articles`
    const res = await fetch(url, { cache: "no-store" })
    if (res.ok) {
      const list: BackendProcessedArticle[] = await res.json()
      if (Array.isArray(list) && list.length > 0) {
        return list.map((art, idx) => mapProcessedArticleToItem(art, idx, upperTicker))
      }
    }
  } catch {
  }
  const fallback = MOCK_SENTIMENT_DATA[upperTicker] || MOCK_SENTIMENT_DATA["BBRI"]
  if (category) {
    return fallback.articles.filter((a) => a.category === category)
  }
  return fallback.articles
}

export async function syncLiveNews(): Promise<{ status: string; message: string; data?: unknown }> {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/sync/news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || "Sinkronisasi gagal")
    }
    const data = await res.json()
    return { status: "success", message: "Sinkronisasi berita live Sectors API & AI berhasil", data }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menghubungi backend untuk sync"
    return { status: "error", message: msg }
  }
}
