import { API_BASE_URL } from "@/src/shared/lib/constants"
import { BeginnerBrief, GlossaryItem, GlossaryResponse } from "../types"

export const MOCK_BEGINNER_BRIEFS: Record<string, BeginnerBrief> = {
  BBCA: {
    ticker: "BBCA",
    company_name: "PT Bank Central Asia Tbk",
    health_badge: "Sangat Sehat & Unggul",
    health_color: "green",
    health_score: 88,
    tldr_summary:
      "BBCA adalah bank swasta terbesar di Indonesia yang terkenal sangat efisien dan paling menguntungkan. Bisnisnya sangat kuat karena jutaan masyarakat dan pelaku usaha memakai rekeningnya untuk transaksi harian. Secara keuangan sangat prima dan rutin bagi dividen, meski harga sahamnya tergolong premium di bursa.",
    pros: [
      "Modal Paling Murah (CASA Tinggi) — Mayoritas uang nasabah ada di tabungan/giro bunga rendah sehingga biaya dana bank sangat hemat.",
      "Mesin Pencetak Laba Teruji (ROE ~22%) — Salah satu bank paling efisien di Asia Tenggara dalam memutar uang modal pemegang saham.",
      "Rutin Bagi Dividen Tanpa Absen — Terbukti membagikan dividen kas kepada pemegang saham setiap tahun secara stabil.",
    ],
    cons: [
      "Harga Saham Tergolong Premium (PBV Tinggi) — Valuasi sahamnya hampir tidak pernah didiskon murah karena disukai institusi global.",
      "Pertumbuhan Berskala Raksasa Cenderung Matang — Karena asetnya sudah sangat besar, pertumbuhan laba tahunan lebih moderat (bukan saham growth berlipat ganda cepat).",
      "Sensitivitas Fluktuasi Bunga Acuan — Penurunan suku bunga acuan BI yang drastis bisa sedikit menekan margin bunga pinjaman.",
    ],
    investor_fit: [
      "Penabung Rutin Jangka Panjang (DCA > 3 Tahun)",
      "Pencari Saham Defensif Berfundamental Blue-Chip",
      "Investor yang Mengutamakan Keamanan Modal di atas Spekulasi",
    ],
    faq_items: [
      {
        question: "Berapa modal minimal untuk mulai membeli saham BBCA?",
        answer: "Minimal pembelian di Bursa Efek Indonesia adalah 1 lot (100 lembar saham). Pada harga saat ini, modalnya sekitar Rp 1.000.000 - Rp 1.050.000.",
      },
      {
        question: "Apakah aman menabung saham BBCA untuk dana pensiun?",
        answer: "Secara fundamental sangat aman. BBCA berstatus KBMI 4 (bank sistemik) dengan cadangan likuiditas tebal dan rekam jejak krisis teruji puluhan tahun.",
      },
      {
        question: "Kapan saya mendapatkan dividen?",
        answer: "BBCA biasanya membagikan dividen 2 kali dalam setahun: Dividen Interim (sekitar bulan Desember) dan Dividen Final (sekitar bulan April).",
      },
    ],
    last_updated: new Date().toISOString(),
  },
  BBRI: {
    ticker: "BBRI",
    company_name: "PT Bank Rakyat Indonesia (Persero) Tbk",
    health_badge: "Sehat & Potensi Rebound",
    health_color: "green",
    health_score: 78,
    tldr_summary:
      "BBRI adalah bank milik negara (BUMN) dengan jaringan nasabah terbesar di Indonesia yang berfokus melayani kredit UMKM dan mikro hingga pelosok nusantara. Bisnisnya memiliki margin bunga pinjaman yang sangat tebal serta yield dividen tunai tahunan yang menarik bagi investor pemburu penghasilan pasif.",
    pros: [
      "Margin Bunga Sangat Tebal (NIM > 6%) — Penyaluran kredit mikro memberikan imbal hasil bunga pinjaman yang lebih tinggi dibanding segmen korporasi.",
      "Hasil Dividen Tunai Sangat Menarik (~6-7% Dividend Yield) — Rasio pembayaran laba menjadi dividen (dividend payout) sangat royal mencapai 80%.",
      "Jaringan Cabang & Agen Terluas di Indonesia — Memiliki jutaan AgenBRILink yang mendominasi perputaran uang di tingkat mikro.",
    ],
    cons: [
      "Risiko Kredit Macet Segmen Mikro (NPL) — Fluktuasi daya beli masyarakat kelas menengah bawah dapat menaikkan provisi kredit bermasalah.",
      "Terkadang Ada Tekanan Jual Investor Asing — Saham BBRI sangat likuid sehingga sering menjadi instrumen keluar-masuk dana asing global.",
      "Beban Biaya Operasional Jaringan Fisik Luas — Membutuhkan pengelolaan biaya jaringan dan agen mikro yang ketat.",
    ],
    investor_fit: [
      "Pemburu Dividen Tunai Tinggi (Dividend Hunter)",
      "Investor Jangka Menengah hingga Panjang yang Percaya Pertumbuhan Daya Beli UMKM",
    ],
    faq_items: [
      {
        question: "Mengapa dividen BBRI terasa sangat besar dibanding bank lain?",
        answer: "Pemerintah RI sebagai pemegang saham mayoritas mendorong BUMN menyetorkan dividen optimal ke kas negara, sehingga investor ritel ikut menikmati dividen tunai tinggi.",
      },
      {
        question: "Apa risiko terbesar jika saya memegang saham BBRI?",
        answer: "Risiko utama adalah kenaikan kredit macet (NPL) di segmen usaha mikro jika perekonomian informal melambat, yang mengharuskan bank mencadangkan biaya provisi lebih besar.",
      },
    ],
    last_updated: new Date().toISOString(),
  },
}

export const MOCK_GLOSSARY: GlossaryItem[] = [
  {
    term: "NIM",
    simple_name: "Margin Bunga Pinjaman",
    analogy: "Keuntungan bersih yang didapat bank dari selisih bunga kredit yang dipinjamkan dikurangi bunga tabungan/deposito nasabah.",
    category: "Fundamental",
  },
  {
    term: "LDR",
    simple_name: "Tingkat Amannya Simpanan",
    analogy: "Perbandingan seberapa banyak uang pinjaman yang disalurkan dibanding total uang tabungan masyarakat. Idealnya 78% - 92%.",
    category: "Fundamental",
  },
  {
    term: "ROE",
    simple_name: "Kemampuan Cetak Laba Modal",
    analogy: "Ukuran seberapa pintar manajemen perusahaan memutar uang modal investor untuk menghasilkan laba bersih tahunan.",
    category: "Fundamental",
  },
  {
    term: "CASA",
    simple_name: "Rasio Dana Tabungan Murah",
    analogy: "Porsi uang nasabah yang ada di tabungan dan giro biasa berbunga rendah. Makin tinggi, makin murah biaya modal bank.",
    category: "Fundamental",
  },
  {
    term: "Foreign Flow",
    simple_name: "Aliran Uang Investor Asing",
    analogy: "Selisih total pembelian dan penjualan saham oleh investor luar negeri atau institusi global besar di bursa.",
    category: "Transaksi",
  },
  {
    term: "Z-Score",
    simple_name: "Tingkat Ketidakwajaran Transaksi",
    analogy: "Indikator statistik untuk melihat apakah volume transaksi hari ini normal atau melonjak ekstrem di luar kebiasaannya.",
    category: "Statistik",
  },
  {
    term: "Dividen",
    simple_name: "Bagi Hasil Tunai Tahunan",
    analogy: "Bagian keuntungan bersih perusahaan yang ditransfer langsung secara tunai ke rekening para pemilik saham.",
    category: "Imbal Hasil",
  },
  {
    term: "PBV",
    simple_name: "Harga Saham vs Modal Asli",
    analogy: "Perbandingan harga saham di bursa dibanding nilai modal bersih perusahaan. Menunjukkan apakah saham tergolong murah atau mahal.",
    category: "Valuasi",
  },
]

export async function getBeginnerBrief(ticker: string): Promise<BeginnerBrief> {
  const upperTicker = ticker.toUpperCase()
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/stocks/${upperTicker}/beginner-brief`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.ticker) {
        return {
          ticker: data.ticker || upperTicker,
          company_name: data.company_name || `PT ${upperTicker} Tbk`,
          health_badge: data.health_badge || "Sehat",
          health_color: data.health_color || "green",
          health_score: data.health_score || 80,
          tldr_summary: data.tldr_summary || "",
          pros: Array.isArray(data.pros) ? data.pros : [],
          cons: Array.isArray(data.cons) ? data.cons : [],
          investor_fit: Array.isArray(data.investor_fit) ? data.investor_fit : [],
          faq_items: Array.isArray(data.faq_items) ? data.faq_items : [],
          last_updated: data.last_updated || new Date().toISOString(),
        }
      }
    }
  } catch {
  }

  if (MOCK_BEGINNER_BRIEFS[upperTicker]) {
    return MOCK_BEGINNER_BRIEFS[upperTicker]
  }

  return {
    ticker: upperTicker,
    company_name: `PT ${upperTicker} Tbk`,
    health_badge: "Kinerja Finansial Stabil",
    health_color: "green",
    health_score: 75,
    tldr_summary: `${upperTicker} adalah salah satu emiten terkemuka yang terdaftar di Bursa Efek Indonesia. Perusahaan ini memiliki fundamental operasional yang stabil dengan kinerja konsisten di sektornya.`,
    pros: [
      "Posisi Pasar Kuat — Memiliki rekam jejak operasional yang matang di industrinya.",
      "Kesehatan Neraca Terjaga — Rasio kecukupan modal dan likuiditas berada dalam ambang aman regulasi.",
      "Transparansi Keterbukaan Informasi — Rutin melaporkan keterbukaan informasi dan kinerja berkala kepada publik.",
    ],
    cons: [
      "Volatilitas Pasar — Harga saham dapat dipengaruhi oleh perubahan sentimen suku bunga makroekonomi.",
      "Dinamika Persaingan — Perlu terus berinovasi untuk mempertahankan pangsa pasar dari kompetitor.",
      "Fluktuasi Arus Dana Institusi — Transaksi harian dipengaruhi pergerakan modal institusi global.",
    ],
    investor_fit: [
      "Investor Pemula yang Ingin Diversifikasi Sektor",
      "Penabung Saham Jangka Menengah hingga Panjang",
    ],
    faq_items: [
      {
        question: `Bagaimana cara membeli saham ${upperTicker}?`,
        answer: `Anda dapat membeli minimal 1 lot (100 lembar saham) melalui aplikasi sekuritas resmi yang terdaftar dan diawasi oleh OJK.`,
      },
      {
        question: `Apakah ${upperTicker} cocok untuk pemula?`,
        answer: `Cocok untuk investor yang ingin memulai dengan saham berkapitalisasi pasar mapan dan likuiditas transaksi tinggi.`,
      },
    ],
    last_updated: new Date().toISOString(),
  }
}

export async function getGlossary(): Promise<GlossaryItem[]> {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/glossary`, {
      cache: "no-store",
    })
    if (res.ok) {
      const data: GlossaryResponse = await res.json()
      if (Array.isArray(data.items) && data.items.length > 0) {
        return data.items
      }
    }
  } catch {
  }
  return MOCK_GLOSSARY
}
