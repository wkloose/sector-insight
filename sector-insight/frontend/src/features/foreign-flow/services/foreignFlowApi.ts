import { API_BASE_URL } from "@/src/shared/lib/constants"
import { ForeignFlowDetail } from "../types/foreignFlow"

export const MOCK_FOREIGN_FLOW_DATA: Record<string, ForeignFlowDetail> = {
  BBRI: {
    ticker: "BBRI",
    bankName: "PT Bank Rakyat Indonesia Tbk",
    yesterdayFlow: -145000000000,
    yesterdayZScore: -2.8,
    yesterdayAnomalyStatus: "Outflow Ekstrem (2.8x σ normal)",
    baselineMean90d: 18400000000,
    standardDeviation: 58200000000,
    totalNetFlow90d: 1420000000000,
    totalNetFlowFormatted: "+Rp 1.42 T",
    anomalyCount90d: 4,
    inflowAnomalyCount: 3,
    outflowAnomalyCount: 1,
    synthesisSentence: "Deviasi -2.80σ pada 24 September mengonfirmasikan aksi ambil untung agresif institusi asing (CS: net-sell masif Rp 89,1 miliar). Indikator moving average foreign flow 90 hari masih terdistribusi moderat.",
    synthesisConfidence: 94.2,
    composition14d: {
      institutionalForeignPercent: 68,
      retailDomesticPercent: 32,
      top3Concentration: 54.8,
      top3Brokers: ["CS (28.4%)", "YU (14.2%)", "AK (12.2%)"],
    },
    anomalies14d: [
      {
        id: "anom-1",
        date: "2026-09-24",
        displayDate: "24 Sep (Kemarin)",
        netFlow: -145000000000,
        netFlowFormatted: "-Rp 145,0 M",
        zScore: -2.8,
        dominantBroker: {
          code: "CS",
          name: "Credit Suisse Sekuritas",
          category: "Asing-Institusional",
          netValue: -89100000000,
        },
        action: "Net Sell",
        isExtreme: true,
      },
      {
        id: "anom-2",
        date: "2026-09-18",
        displayDate: "18 Sep 2026",
        netFlow: 218000000000,
        netFlowFormatted: "+Rp 218,0 M",
        zScore: 3.2,
        dominantBroker: {
          code: "YU",
          name: "CGS International",
          category: "Asing-Institusional",
          netValue: 124500000000,
        },
        action: "Net Buy",
        isExtreme: true,
      },
      {
        id: "anom-3",
        date: "2026-09-12",
        displayDate: "12 Sep 2026",
        netFlow: 185000000000,
        netFlowFormatted: "+Rp 185,0 M",
        zScore: 2.45,
        dominantBroker: {
          code: "AK",
          name: "UBS Sekuritas Indonesia",
          category: "Asing-Institusional",
          netValue: 96000000000,
        },
        action: "Net Buy",
        isExtreme: false,
      },
    ],
    flowPoints: [
      { date: "2026-07-01", displayDate: "01 Jul", netFlow: 25, zScore: 0.2, isAnomaly: false },
      { date: "2026-07-08", displayDate: "08 Jul", netFlow: 120, zScore: 1.8, isAnomaly: false },
      { date: "2026-07-15", displayDate: "15 Jul", netFlow: 190, zScore: 2.9, isAnomaly: true, anomalyType: "inflow", dominantBroker: "ZP" },
      { date: "2026-07-22", displayDate: "22 Jul", netFlow: -40, zScore: -0.8, isAnomaly: false },
      { date: "2026-07-29", displayDate: "29 Jul", netFlow: 15, zScore: 0.1, isAnomaly: false },
      { date: "2026-08-05", displayDate: "05 Agu", netFlow: 60, zScore: 0.8, isAnomaly: false },
      { date: "2026-08-12", displayDate: "12 Agu", netFlow: -20, zScore: -0.5, isAnomaly: false },
      { date: "2026-08-19", displayDate: "19 Agu", netFlow: 30, zScore: 0.3, isAnomaly: false },
      { date: "2026-08-26", displayDate: "26 Agu", netFlow: 45, zScore: 0.5, isAnomaly: false },
      { date: "2026-09-02", displayDate: "02 Sep", netFlow: 10, zScore: 0.1, isAnomaly: false },
      { date: "2026-09-09", displayDate: "09 Sep", netFlow: -35, zScore: -0.7, isAnomaly: false },
      { date: "2026-09-12", displayDate: "12 Sep", netFlow: 185, zScore: 2.45, isAnomaly: true, anomalyType: "inflow", dominantBroker: "AK" },
      { date: "2026-09-18", displayDate: "18 Sep", netFlow: 218, zScore: 3.2, isAnomaly: true, anomalyType: "inflow", dominantBroker: "YU" },
      { date: "2026-09-22", displayDate: "22 Sep", netFlow: 40, zScore: 0.4, isAnomaly: false },
      { date: "2026-09-24", displayDate: "24 Sep", netFlow: -145, zScore: -2.8, isAnomaly: true, anomalyType: "outflow", dominantBroker: "CS" },
    ],
  },
  BBCA: {
    ticker: "BBCA",
    bankName: "PT Bank Central Asia Tbk",
    yesterdayFlow: 185000000000,
    yesterdayZScore: 1.85,
    yesterdayAnomalyStatus: "Akumulasi Institusi Normal (+1.85σ)",
    baselineMean90d: 42000000000,
    standardDeviation: 78000000000,
    totalNetFlow90d: 3820000000000,
    totalNetFlowFormatted: "+Rp 3.82 T",
    anomalyCount90d: 3,
    inflowAnomalyCount: 3,
    outflowAnomalyCount: 0,
    synthesisSentence: "Arus dana asing pada BBCA mencatatkan akumulasi konsisten tanpa sinyal distribusi signifikan. Dominasi broker institusional global (AK & CC) mencerminkan preferensi perlindungan kualitas modal dan CASA 82,4%.",
    synthesisConfidence: 96.5,
    composition14d: {
      institutionalForeignPercent: 78,
      retailDomesticPercent: 22,
      top3Concentration: 62.4,
      top3Brokers: ["AK (26.5%)", "CC (21.2%)", "ZP (14.7%)"],
    },
    anomalies14d: [
      {
        id: "anom-bbca-1",
        date: "2026-09-22",
        displayDate: "22 Sep 2026",
        netFlow: 295000000000,
        netFlowFormatted: "+Rp 295,0 M",
        zScore: 3.24,
        dominantBroker: {
          code: "AK",
          name: "UBS Sekuritas Indonesia",
          category: "Asing-Institusional",
          netValue: 185000000000,
        },
        action: "Net Buy",
        isExtreme: true,
      },
      {
        id: "anom-bbca-2",
        date: "2026-09-15",
        displayDate: "15 Sep 2026",
        netFlow: 210000000000,
        netFlowFormatted: "+Rp 210,0 M",
        zScore: 2.15,
        dominantBroker: {
          code: "CC",
          name: "Mandiri Sekuritas (Foreign Desk)",
          category: "Asing-Institusional",
          netValue: 140000000000,
        },
        action: "Net Buy",
        isExtreme: false,
      },
    ],
    flowPoints: [
      { date: "2026-07-01", displayDate: "01 Jul", netFlow: 45, zScore: 0.1, isAnomaly: false },
      { date: "2026-07-08", displayDate: "08 Jul", netFlow: 110, zScore: 0.9, isAnomaly: false },
      { date: "2026-07-15", displayDate: "15 Jul", netFlow: 85, zScore: 0.6, isAnomaly: false },
      { date: "2026-07-22", displayDate: "22 Jul", netFlow: 140, zScore: 1.3, isAnomaly: false },
      { date: "2026-07-29", displayDate: "29 Jul", netFlow: 95, zScore: 0.7, isAnomaly: false },
      { date: "2026-08-05", displayDate: "05 Agu", netFlow: 160, zScore: 1.5, isAnomaly: false },
      { date: "2026-08-12", displayDate: "12 Agu", netFlow: 50, zScore: 0.1, isAnomaly: false },
      { date: "2026-08-19", displayDate: "19 Agu", netFlow: 175, zScore: 1.7, isAnomaly: false },
      { date: "2026-08-26", displayDate: "26 Agu", netFlow: 120, zScore: 1.0, isAnomaly: false },
      { date: "2026-09-02", displayDate: "02 Sep", netFlow: 140, zScore: 1.3, isAnomaly: false },
      { date: "2026-09-09", displayDate: "09 Sep", netFlow: 90, zScore: 0.6, isAnomaly: false },
      { date: "2026-09-15", displayDate: "15 Sep", netFlow: 210, zScore: 2.15, isAnomaly: true, anomalyType: "inflow", dominantBroker: "CC" },
      { date: "2026-09-18", displayDate: "18 Sep", netFlow: 130, zScore: 1.1, isAnomaly: false },
      { date: "2026-09-22", displayDate: "22 Sep", netFlow: 295, zScore: 3.24, isAnomaly: true, anomalyType: "inflow", dominantBroker: "AK" },
      { date: "2026-09-24", displayDate: "24 Sep", netFlow: 185, zScore: 1.85, isAnomaly: false },
    ],
  },
  BMRI: {
    ticker: "BMRI",
    bankName: "PT Bank Mandiri (Persero) Tbk",
    yesterdayFlow: 125000000000,
    yesterdayZScore: 1.62,
    yesterdayAnomalyStatus: "Akumulasi Institusi Moderat (+1.62σ)",
    baselineMean90d: 28000000000,
    standardDeviation: 62000000000,
    totalNetFlow90d: 2150000000000,
    totalNetFlowFormatted: "+Rp 2.15 T",
    anomalyCount90d: 2,
    inflowAnomalyCount: 2,
    outflowAnomalyCount: 0,
    synthesisSentence: "Pembelian korporasi dan institusi global pada BMRI terjaga solid didorong optimisme pertumbuhan kredit korporasi 11.8% YoY dan perbaikan marjin bunga berkelanjutan.",
    synthesisConfidence: 93.1,
    composition14d: {
      institutionalForeignPercent: 71,
      retailDomesticPercent: 29,
      top3Concentration: 52.1,
      top3Brokers: ["YU (22.1%)", "BK (16.4%)", "KZ (13.6%)"],
    },
    anomalies14d: [
      {
        id: "anom-bmri-1",
        date: "2026-09-20",
        displayDate: "20 Sep 2026",
        netFlow: 175000000000,
        netFlowFormatted: "+Rp 175,0 M",
        zScore: 2.37,
        dominantBroker: {
          code: "YU",
          name: "CGS International",
          category: "Asing-Institusional",
          netValue: 110000000000,
        },
        action: "Net Buy",
        isExtreme: false,
      },
    ],
    flowPoints: [
      { date: "2026-07-01", displayDate: "01 Jul", netFlow: 30, zScore: 0.0, isAnomaly: false },
      { date: "2026-07-08", displayDate: "08 Jul", netFlow: 55, zScore: 0.4, isAnomaly: false },
      { date: "2026-07-15", displayDate: "15 Jul", netFlow: -15, zScore: -0.7, isAnomaly: false },
      { date: "2026-07-22", displayDate: "22 Jul", netFlow: 70, zScore: 0.7, isAnomaly: false },
      { date: "2026-07-29", displayDate: "29 Jul", netFlow: 40, zScore: 0.2, isAnomaly: false },
      { date: "2026-08-05", displayDate: "05 Agu", netFlow: 90, zScore: 1.0, isAnomaly: false },
      { date: "2026-08-12", displayDate: "12 Agu", netFlow: 15, zScore: -0.2, isAnomaly: false },
      { date: "2026-08-19", displayDate: "19 Agu", netFlow: 80, zScore: 0.8, isAnomaly: false },
      { date: "2026-08-26", displayDate: "26 Agu", netFlow: 65, zScore: 0.6, isAnomaly: false },
      { date: "2026-09-02", displayDate: "02 Sep", netFlow: 85, zScore: 0.9, isAnomaly: false },
      { date: "2026-09-09", displayDate: "09 Sep", netFlow: 20, zScore: -0.1, isAnomaly: false },
      { date: "2026-09-15", displayDate: "15 Sep", netFlow: 110, zScore: 1.3, isAnomaly: false },
      { date: "2026-09-20", displayDate: "20 Sep", netFlow: 175, zScore: 2.37, isAnomaly: true, anomalyType: "inflow", dominantBroker: "YU" },
      { date: "2026-09-22", displayDate: "22 Sep", netFlow: 90, zScore: 1.0, isAnomaly: false },
      { date: "2026-09-24", displayDate: "24 Sep", netFlow: 125, zScore: 1.62, isAnomaly: false },
    ],
  },
  BBNI: {
    ticker: "BBNI",
    bankName: "PT Bank Negara Indonesia Tbk",
    yesterdayFlow: 45000000000,
    yesterdayZScore: 0.88,
    yesterdayAnomalyStatus: "Net Inflow Normal (+0.88σ)",
    baselineMean90d: 12000000000,
    standardDeviation: 38000000000,
    totalNetFlow90d: 840000000000,
    totalNetFlowFormatted: "+Rp 840,0 M",
    anomalyCount90d: 1,
    inflowAnomalyCount: 1,
    outflowAnomalyCount: 0,
    synthesisSentence: "Arus dana pada BBNI bergerak stabil dengan akumulasi selektif oleh institusi asing memanfaatkan valuasi PBV 1.18x yang terdiskon terhadap peers KBMI 4.",
    synthesisConfidence: 91.8,
    composition14d: {
      institutionalForeignPercent: 64,
      retailDomesticPercent: 36,
      top3Concentration: 48.7,
      top3Brokers: ["ZP (19.4%)", "AK (15.8%)", "CC (13.5%)"],
    },
    anomalies14d: [
      {
        id: "anom-bbni-1",
        date: "2026-09-16",
        displayDate: "16 Sep 2026",
        netFlow: 112000000000,
        netFlowFormatted: "+Rp 112,0 M",
        zScore: 2.63,
        dominantBroker: {
          code: "ZP",
          name: "Maybank Sekuritas",
          category: "Asing-Institusional",
          netValue: 72000000000,
        },
        action: "Net Buy",
        isExtreme: false,
      },
    ],
    flowPoints: [
      { date: "2026-07-01", displayDate: "01 Jul", netFlow: 10, zScore: -0.1, isAnomaly: false },
      { date: "2026-07-08", displayDate: "08 Jul", netFlow: 25, zScore: 0.3, isAnomaly: false },
      { date: "2026-07-15", displayDate: "15 Jul", netFlow: -10, zScore: -0.6, isAnomaly: false },
      { date: "2026-07-22", displayDate: "22 Jul", netFlow: 35, zScore: 0.6, isAnomaly: false },
      { date: "2026-07-29", displayDate: "29 Jul", netFlow: 15, zScore: 0.1, isAnomaly: false },
      { date: "2026-08-05", displayDate: "05 Agu", netFlow: 40, zScore: 0.7, isAnomaly: false },
      { date: "2026-08-12", displayDate: "12 Agu", netFlow: -5, zScore: -0.4, isAnomaly: false },
      { date: "2026-08-19", displayDate: "19 Agu", netFlow: 30, zScore: 0.5, isAnomaly: false },
      { date: "2026-08-26", displayDate: "26 Agu", netFlow: 20, zScore: 0.2, isAnomaly: false },
      { date: "2026-09-02", displayDate: "02 Sep", netFlow: 50, zScore: 1.0, isAnomaly: false },
      { date: "2026-09-09", displayDate: "09 Sep", netFlow: -15, zScore: -0.7, isAnomaly: false },
      { date: "2026-09-16", displayDate: "16 Sep", netFlow: 112, zScore: 2.63, isAnomaly: true, anomalyType: "inflow", dominantBroker: "ZP" },
      { date: "2026-09-18", displayDate: "18 Sep", netFlow: 35, zScore: 0.6, isAnomaly: false },
      { date: "2026-09-22", displayDate: "22 Sep", netFlow: 28, zScore: 0.4, isAnomaly: false },
      { date: "2026-09-24", displayDate: "24 Sep", netFlow: 45, zScore: 0.88, isAnomaly: false },
    ],
  },
  BRIS: {
    ticker: "BRIS",
    bankName: "PT Bank Syariah Indonesia Tbk",
    yesterdayFlow: -12000000000,
    yesterdayZScore: -0.45,
    yesterdayAnomalyStatus: "Netral Distribusi Ritel (-0.45σ)",
    baselineMean90d: 5500000000,
    standardDeviation: 32000000000,
    totalNetFlow90d: 310000000000,
    totalNetFlowFormatted: "+Rp 310,0 M",
    anomalyCount90d: 1,
    inflowAnomalyCount: 1,
    outflowAnomalyCount: 0,
    synthesisSentence: "Aktivitas transaksi BRIS didominasi oleh partisipasi domestik ritel dan institusi syariah lokal, dengan pergerakan foreign flow relatif netral.",
    synthesisConfidence: 89.4,
    composition14d: {
      institutionalForeignPercent: 42,
      retailDomesticPercent: 58,
      top3Concentration: 41.2,
      top3Brokers: ["PD (18.2%)", "YP (12.5%)", "CC (10.5%)"],
    },
    anomalies14d: [],
    flowPoints: [
      { date: "2026-07-01", displayDate: "01 Jul", netFlow: 5, zScore: 0.0, isAnomaly: false },
      { date: "2026-07-08", displayDate: "08 Jul", netFlow: 12, zScore: 0.2, isAnomaly: false },
      { date: "2026-07-15", displayDate: "15 Jul", netFlow: -8, zScore: -0.4, isAnomaly: false },
      { date: "2026-07-22", displayDate: "22 Jul", netFlow: 15, zScore: 0.3, isAnomaly: false },
      { date: "2026-07-29", displayDate: "29 Jul", netFlow: 8, zScore: 0.1, isAnomaly: false },
      { date: "2026-08-05", displayDate: "05 Agu", netFlow: 22, zScore: 0.5, isAnomaly: false },
      { date: "2026-08-12", displayDate: "12 Agu", netFlow: -14, zScore: -0.6, isAnomaly: false },
      { date: "2026-08-19", displayDate: "19 Agu", netFlow: 18, zScore: 0.4, isAnomaly: false },
      { date: "2026-08-26", displayDate: "26 Agu", netFlow: 10, zScore: 0.1, isAnomaly: false },
      { date: "2026-09-02", displayDate: "02 Sep", netFlow: 25, zScore: 0.6, isAnomaly: false },
      { date: "2026-09-09", displayDate: "09 Sep", netFlow: -6, zScore: -0.3, isAnomaly: false },
      { date: "2026-09-16", displayDate: "16 Sep", netFlow: 35, zScore: 0.9, isAnomaly: false },
      { date: "2026-09-18", displayDate: "18 Sep", netFlow: 14, zScore: 0.3, isAnomaly: false },
      { date: "2026-09-22", displayDate: "22 Sep", netFlow: -4, zScore: -0.2, isAnomaly: false },
      { date: "2026-09-24", displayDate: "24 Sep", netFlow: -12, zScore: -0.45, isAnomaly: false },
    ],
  },
  BBTN: {
    ticker: "BBTN",
    bankName: "PT Bank Tabungan Negara (Persero) Tbk",
    yesterdayFlow: -24000000000,
    yesterdayZScore: -1.35,
    yesterdayAnomalyStatus: "Outflow Moderat (-1.35σ)",
    baselineMean90d: -2500000000,
    standardDeviation: 18000000000,
    totalNetFlow90d: -280000000000,
    totalNetFlowFormatted: "-Rp 280,0 M",
    anomalyCount90d: 2,
    inflowAnomalyCount: 0,
    outflowAnomalyCount: 2,
    synthesisSentence: "Tekanan jual asing pada BBTN bertahan seiring pengetatan likuiditas sektor perbankan (LDR 94.8%) dan beban dana simpanan yang membebani margin laba bersih.",
    synthesisConfidence: 90.6,
    composition14d: {
      institutionalForeignPercent: 48,
      retailDomesticPercent: 52,
      top3Concentration: 44.8,
      top3Brokers: ["ZP (18.6%)", "YP (14.2%)", "PD (12.0%)"],
    },
    anomalies14d: [
      {
        id: "anom-bbtn-1",
        date: "2026-09-14",
        displayDate: "14 Sep 2026",
        netFlow: -58000000000,
        netFlowFormatted: "-Rp 58,0 M",
        zScore: -2.85,
        dominantBroker: {
          code: "ZP",
          name: "Maybank Sekuritas",
          category: "Asing-Institusional",
          netValue: -36000000000,
        },
        action: "Net Sell",
        isExtreme: true,
      },
    ],
    flowPoints: [
      { date: "2026-07-01", displayDate: "01 Jul", netFlow: -8, zScore: -0.3, isAnomaly: false },
      { date: "2026-07-08", displayDate: "08 Jul", netFlow: 5, zScore: 0.4, isAnomaly: false },
      { date: "2026-07-15", displayDate: "15 Jul", netFlow: -12, zScore: -0.5, isAnomaly: false },
      { date: "2026-07-22", displayDate: "22 Jul", netFlow: -4, zScore: -0.1, isAnomaly: false },
      { date: "2026-07-29", displayDate: "29 Jul", netFlow: 8, zScore: 0.6, isAnomaly: false },
      { date: "2026-08-05", displayDate: "05 Agu", netFlow: -15, zScore: -0.7, isAnomaly: false },
      { date: "2026-08-12", displayDate: "12 Agu", netFlow: -20, zScore: -1.0, isAnomaly: false },
      { date: "2026-08-19", displayDate: "19 Agu", netFlow: 2, zScore: 0.2, isAnomaly: false },
      { date: "2026-08-26", displayDate: "26 Agu", netFlow: -9, zScore: -0.4, isAnomaly: false },
      { date: "2026-09-02", displayDate: "02 Sep", netFlow: -18, zScore: -0.9, isAnomaly: false },
      { date: "2026-09-09", displayDate: "09 Sep", netFlow: -5, zScore: -0.1, isAnomaly: false },
      { date: "2026-09-14", displayDate: "14 Sep", netFlow: -58, zScore: -2.85, isAnomaly: true, anomalyType: "outflow", dominantBroker: "ZP" },
      { date: "2026-09-18", displayDate: "18 Sep", netFlow: -10, zScore: -0.4, isAnomaly: false },
      { date: "2026-09-22", displayDate: "22 Sep", netFlow: -15, zScore: -0.7, isAnomaly: false },
      { date: "2026-09-24", displayDate: "24 Sep", netFlow: -24, zScore: -1.35, isAnomaly: false },
    ],
  },
}

function createFallbackForeignFlow(ticker: string): ForeignFlowDetail {
  return {
    ticker,
    bankName: `PT Bank ${ticker} Tbk`,
    yesterdayFlow: 15000000000,
    yesterdayZScore: 0.45,
    yesterdayAnomalyStatus: "Normal Buy (+0.45σ)",
    baselineMean90d: 8500000000,
    standardDeviation: 35000000000,
    totalNetFlow90d: 450000000000,
    totalNetFlowFormatted: "+Rp 450,0 M",
    anomalyCount90d: 1,
    inflowAnomalyCount: 1,
    outflowAnomalyCount: 0,
    synthesisSentence: `Pola akumulasi asing pada ${ticker} berada dalam rentang deviasi normal tanpa anomali ekstrem.`,
    synthesisConfidence: 88.0,
    composition14d: {
      institutionalForeignPercent: 55,
      retailDomesticPercent: 45,
      top3Concentration: 42.5,
      top3Brokers: ["ZP (16.2%)", "AK (14.1%)", "CC (12.2%)"],
    },
    anomalies14d: [],
    flowPoints: [
      { date: "2026-07-01", displayDate: "01 Jul", netFlow: 12, zScore: 0.2, isAnomaly: false },
      { date: "2026-07-15", displayDate: "15 Jul", netFlow: 18, zScore: 0.4, isAnomaly: false },
      { date: "2026-08-01", displayDate: "01 Agu", netFlow: -8, zScore: -0.3, isAnomaly: false },
      { date: "2026-08-15", displayDate: "15 Agu", netFlow: 22, zScore: 0.5, isAnomaly: false },
      { date: "2026-09-01", displayDate: "01 Sep", netFlow: 15, zScore: 0.3, isAnomaly: false },
      { date: "2026-09-15", displayDate: "15 Sep", netFlow: 28, zScore: 0.7, isAnomaly: false },
      { date: "2026-09-24", displayDate: "24 Sep", netFlow: 15, zScore: 0.45, isAnomaly: false },
    ],
  }
}

interface BackendDailyFlow {
  id?: number
  ticker: string
  tanggal: string
  net_foreign_inflow: number
}

interface BackendAnomalyBrokerDetail {
  kode_broker: string
  nama_broker: string
  kategori: string
  net_value: number
}

export interface BackendFlowAnomaly {
  id?: number
  ticker: string
  tanggal: string
  net_foreign_inflow: number
  z_score: number
  status_anomali: string
  broker_details?: BackendAnomalyBrokerDetail[]
}

export async function getForeignFlowData(ticker: string): Promise<ForeignFlowDetail> {
  const upper = (ticker || "BBRI").toUpperCase()
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const [flowsRes, anomaliesRes] = await Promise.all([
      fetch(`${baseUrl}/api/v1/foreign-flow/${upper}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/v1/foreign-flow/${upper}/anomalies`, { cache: "no-store" }),
    ])

    const flows: BackendDailyFlow[] = flowsRes.ok ? await flowsRes.json() : []
    const anomalies: BackendFlowAnomaly[] = anomaliesRes.ok ? await anomaliesRes.json() : []

    if (Array.isArray(flows) && flows.length > 0) {
      const mockFallback = MOCK_FOREIGN_FLOW_DATA[upper] || createFallbackForeignFlow(upper)
      const values = flows.map((f) => f.net_foreign_inflow)
      const sum = values.reduce((acc, v) => acc + v, 0)
      const mean = sum / values.length
      const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length
      const stdDev = Math.sqrt(variance) || 1

      const latestFlow = flows[0].net_foreign_inflow
      const latestZScore = stdDev > 0 ? (latestFlow - mean) / stdDev : 0
      const isAnomaly = Math.abs(latestZScore) >= 2.0

      const flowPoints = flows.slice(0, 30).reverse().map((f) => {
        const d = new Date(f.tanggal)
        const displayDate = !isNaN(d.getTime())
          ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
          : f.tanggal
        const z = stdDev > 0 ? (f.net_foreign_inflow - mean) / stdDev : 0
        const isAnom = Math.abs(z) >= 2.0
        return {
          date: f.tanggal,
          displayDate,
          netFlow: Number((f.net_foreign_inflow / 1000000000).toFixed(1)),
          zScore: Number(z.toFixed(2)),
          isAnomaly: isAnom,
          anomalyType: isAnom ? (z < 0 ? ("outflow" as const) : ("inflow" as const)) : undefined,
        }
      })

      const anomalies14d = (Array.isArray(anomalies) && anomalies.length > 0)
        ? anomalies.map((a, idx) => {
            const d = new Date(a.tanggal)
            const displayDate = !isNaN(d.getTime())
              ? d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
              : a.tanggal
            const bestBroker = a.broker_details && a.broker_details.length > 0
              ? a.broker_details.reduce((prev, cur) => Math.abs(cur.net_value) > Math.abs(prev.net_value) ? cur : prev)
              : { kode_broker: "CS", nama_broker: "Institusi Asing", kategori: "Asing-Institusional", net_value: a.net_foreign_inflow }

            return {
              id: `anom-${idx + 1}`,
              date: a.tanggal,
              displayDate,
              netFlow: a.net_foreign_inflow,
              netFlowFormatted: `${a.net_foreign_inflow >= 0 ? "+" : "-"}Rp ${(Math.abs(a.net_foreign_inflow) / 1000000000).toFixed(1)} M`,
              zScore: Number(a.z_score.toFixed(2)),
              dominantBroker: {
                code: bestBroker.kode_broker,
                name: bestBroker.nama_broker,
                category: bestBroker.kategori,
                netValue: bestBroker.net_value,
              },
              action: (a.net_foreign_inflow >= 0 ? "Net Buy" : "Net Sell") as "Net Buy" | "Net Sell",
              isExtreme: Math.abs(a.z_score) >= 2.5,
            }
          })
        : mockFallback.anomalies14d

      const totalT = Math.abs(sum) >= 1e12
        ? `${sum >= 0 ? "+" : "-"}Rp ${(Math.abs(sum) / 1e12).toFixed(2)} T`
        : `${sum >= 0 ? "+" : "-"}Rp ${(Math.abs(sum) / 1e9).toFixed(1)} M`

      return {
        ticker: upper,
        bankName: mockFallback.bankName,
        yesterdayFlow: latestFlow,
        yesterdayZScore: Number(latestZScore.toFixed(2)),
        yesterdayAnomalyStatus: isAnomaly
          ? latestZScore < 0 ? `Outflow Ekstrem (${Math.abs(latestZScore).toFixed(1)}x σ normal)` : `Inflow Ekstrem (${latestZScore.toFixed(1)}x σ normal)`
          : `Normal (${latestZScore >= 0 ? "+" : ""}${latestZScore.toFixed(2)}σ)`,
        baselineMean90d: mean,
        standardDeviation: stdDev,
        totalNetFlow90d: sum,
        totalNetFlowFormatted: totalT,
        anomalyCount90d: anomalies.length || mockFallback.anomalyCount90d,
        inflowAnomalyCount: anomalies.filter((a) => a.z_score > 0).length || mockFallback.inflowAnomalyCount,
        outflowAnomalyCount: anomalies.filter((a) => a.z_score < 0).length || mockFallback.outflowAnomalyCount,
        synthesisSentence: mockFallback.synthesisSentence,
        synthesisConfidence: mockFallback.synthesisConfidence,
        composition14d: mockFallback.composition14d,
        anomalies14d,
        flowPoints,
      }
    }
  } catch (err) {
    console.warn(`Backend foreign flow for ${upper} offline, using fallback mock:`, err)
  }
  return MOCK_FOREIGN_FLOW_DATA[upper] || createFallbackForeignFlow(upper)
}

export async function getForeignFlowSummary(): Promise<BackendFlowAnomaly[]> {
  const baseUrl = API_BASE_URL || "http://localhost:8080"
  try {
    const res = await fetch(`${baseUrl}/api/v1/foreign-flow/summary`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Gagal mengambil ringkasan anomali asing")
    const list: BackendFlowAnomaly[] = await res.json()
    return list
  } catch (err) {
    console.warn("Backend foreign flow summary offline:", err)
    return [
      {
        id: 1,
        ticker: "BBRI",
        tanggal: "2026-09-24",
        net_foreign_inflow: -145000000000,
        z_score: -2.8,
        status_anomali: "ANOMALI_OUTFLOW",
        broker_details: [
          { kode_broker: "CS", nama_broker: "Credit Suisse Sekuritas", kategori: "Asing-Institusional", net_value: -89100000000 },
          { kode_broker: "ZP", nama_broker: "Maybank Sekuritas", kategori: "Asing-Institusional", net_value: -34000000000 },
        ],
      },
      {
        id: 2,
        ticker: "BBCA",
        tanggal: "2026-09-23",
        net_foreign_inflow: 220000000000,
        z_score: 2.45,
        status_anomali: "ANOMALI_INFLOW",
        broker_details: [
          { kode_broker: "AK", nama_broker: "UBS Sekuritas Indonesia", kategori: "Asing-Institusional", net_value: 125000000000 },
        ],
      },
    ]
  }
}

