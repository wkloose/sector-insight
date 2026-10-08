import { StockCompareProfile } from "../types"

export interface StockInsight {
  ticker: string
  compositeScore: number
  valueMomentumSignal: string
  valueMomentumValue: number
  institutionalConviction: string
  institutionalConvictionScore: number
  riskAdjustedAttractiveness: number
  alphaGenerationPotential: number
  alphaLabel: string
  marginOfSafety: number
  marginOfSafetyLabel: string
}

export interface ComparativeInsightSummary {
  bestOverall: string
  bestValue: string
  bestMomentum: string
  lowestRisk: string
  highestAlpha: string
  insights: StockInsight[]
  narrativeInsights: string[]
}

function clamp(min: number, max: number, val: number): number {
  return Math.min(max, Math.max(min, val))
}

export function computeStockInsight(stock: StockCompareProfile): StockInsight {
  const fundamentalPillar = clamp(0, 100, stock.fundamental_score)

  const peVal =
    stock.pe <= 5 ? 95 :
    stock.pe <= 10 ? 85 :
    stock.pe <= 15 ? 70 :
    stock.pe <= 20 ? 55 :
    stock.pe <= 30 ? 35 : 15

  const pbvVal =
    stock.pbv <= 1.0 ? 90 :
    stock.pbv <= 1.5 ? 75 :
    stock.pbv <= 2.5 ? 55 :
    stock.pbv <= 4.0 ? 35 : 15

  const roeVal =
    stock.roe >= 25 ? 95 :
    stock.roe >= 20 ? 85 :
    stock.roe >= 15 ? 70 :
    stock.roe >= 10 ? 50 : 30

  const valuationPillar = clamp(0, 100, peVal * 0.4 + pbvVal * 0.3 + roeVal * 0.3)

  const momentumPillar = clamp(
    0,
    100,
    50 + (stock.foreign_z_score * 15) + (stock.change_percent * 5)
  )

  const sentimentPillar = clamp(0, 100, 50 + (stock.sentiment_score * 45))

  const compositeScore = clamp(
    0,
    100,
    Math.round(
      (fundamentalPillar * 0.35) +
      (valuationPillar * 0.25) +
      (momentumPillar * 0.25) +
      (sentimentPillar * 0.15)
    )
  )

  const pePercentile =
    stock.pe < 8 ? 90 :
    stock.pe < 12 ? 70 :
    stock.pe < 18 ? 50 :
    stock.pe < 25 ? 30 : 10

  const pbvPercentile =
    stock.pbv < 1.0 ? 90 :
    stock.pbv < 1.5 ? 70 :
    stock.pbv < 2.5 ? 50 :
    stock.pbv < 4.0 ? 30 : 10

  const valueSignal = (pePercentile + pbvPercentile) / 2
  const momentumSignal = momentumPillar

  let valueMomentumSignal = "NETRAL"
  if (valueSignal > 60 && momentumSignal > 60) {
    valueMomentumSignal = "KONVERGENSI_BULLISH"
  } else if (valueSignal > 60 && momentumSignal < 40) {
    valueMomentumSignal = "DIVERGENSI_POSITIF"
  } else if (valueSignal < 40 && momentumSignal > 60) {
    valueMomentumSignal = "DIVERGENSI_NEGATIF"
  } else if (valueSignal < 40 && momentumSignal < 40) {
    valueMomentumSignal = "KONVERGENSI_BEARISH"
  }

  const valueMomentumValue = clamp(
    -100,
    100,
    Math.round(valueSignal - (100 - momentumSignal))
  )

  const baseConviction = 50 + (stock.foreign_z_score * 20)
  const convAdjustment = (stock.net_foreign_flow > 0 ? 10 : -10) + (stock.sentiment_score * 10)
  const institutionalConvictionScore = clamp(
    0,
    100,
    Math.round(baseConviction + convAdjustment)
  )

  let institutionalConviction = "SANGAT_RENDAH"
  if (institutionalConvictionScore >= 80) {
    institutionalConviction = "SANGAT_TINGGI"
  } else if (institutionalConvictionScore >= 65) {
    institutionalConviction = "TINGGI"
  } else if (institutionalConvictionScore >= 45) {
    institutionalConviction = "MODERAT"
  } else if (institutionalConvictionScore >= 25) {
    institutionalConviction = "RENDAH"
  }

  const qualityScore = stock.fundamental_score
  const valuationDiscount =
    (stock.pe <= 10 ? 30 : stock.pe <= 15 ? 20 : stock.pe <= 25 ? 5 : -15) +
    (stock.pbv <= 1.5 ? 25 : stock.pbv <= 2.5 ? 10 : -10)
  const flowRisk = stock.foreign_z_score < -1.5 ? -20 : stock.foreign_z_score > 1.5 ? 15 : 0
  const sentimentRisk = stock.sentiment_score < -0.3 ? -15 : stock.sentiment_score > 0.3 ? 10 : 0

  const riskAdjustedAttractiveness = clamp(
    0,
    100,
    Math.round(
      qualityScore * 0.5 +
      (50 + valuationDiscount) * 0.3 +
      (50 + flowRisk + sentimentRisk) * 0.2
    )
  )

  const undervaluation = valuationPillar
  const catalystStrength = clamp(0, 100, ((stock.sentiment_score + 1) / 2) * 100)
  const institutionalBacking = institutionalConvictionScore
  const fundamentalMoat = stock.fundamental_score

  const alphaGenerationPotential = clamp(
    0,
    100,
    Math.round(
      undervaluation * 0.30 +
      catalystStrength * 0.20 +
      institutionalBacking * 0.25 +
      fundamentalMoat * 0.25
    )
  )

  let alphaLabel = "Rendah"
  if (alphaGenerationPotential >= 75) {
    alphaLabel = "Sangat Tinggi"
  } else if (alphaGenerationPotential >= 55) {
    alphaLabel = "Tinggi"
  } else if (alphaGenerationPotential >= 35) {
    alphaLabel = "Moderat"
  }

  const qualityMultiplier =
    stock.fundamental_score >= 85 ? 1.3 :
    stock.fundamental_score >= 75 ? 1.15 :
    stock.fundamental_score >= 65 ? 1.0 : 0.85

  const basePBV = stock.roe >= 20 ? 3.0 : stock.roe >= 15 ? 2.2 : stock.roe >= 10 ? 1.6 : 1.0
  const fairPBV = basePBV * qualityMultiplier
  const rawMos = fairPBV > 0 ? ((fairPBV - stock.pbv) / fairPBV) * 100 : 0
  const marginOfSafety = clamp(-50, 50, Math.round(rawMos * 10) / 10)

  let marginOfSafetyLabel = "Fair Value"
  if (marginOfSafety > 10) {
    marginOfSafetyLabel = "Undervalued"
  } else if (marginOfSafety < -10) {
    marginOfSafetyLabel = "Overvalued"
  }

  return {
    ticker: stock.ticker,
    compositeScore,
    valueMomentumSignal,
    valueMomentumValue,
    institutionalConviction,
    institutionalConvictionScore,
    riskAdjustedAttractiveness,
    alphaGenerationPotential,
    alphaLabel,
    marginOfSafety,
    marginOfSafetyLabel,
  }
}

export function computeComparativeInsights(stocks: StockCompareProfile[]): ComparativeInsightSummary {
  if (!stocks || stocks.length === 0) {
    return {
      bestOverall: "",
      bestValue: "",
      bestMomentum: "",
      lowestRisk: "",
      highestAlpha: "",
      insights: [],
      narrativeInsights: [],
    }
  }

  const insights = stocks.map((s) => computeStockInsight(s))

  const momentumScores = stocks.map((s) =>
    clamp(0, 100, 50 + (s.foreign_z_score * 15) + (s.change_percent * 5))
  )

  let bestOverallIdx = 0
  let bestValueIdx = 0
  let bestMomentumIdx = 0
  let lowestRiskIdx = 0
  let highestAlphaIdx = 0

  for (let i = 1; i < stocks.length; i++) {
    if (insights[i].compositeScore > insights[bestOverallIdx].compositeScore) {
      bestOverallIdx = i
    }
    if (insights[i].riskAdjustedAttractiveness > insights[bestValueIdx].riskAdjustedAttractiveness) {
      bestValueIdx = i
    }
    if (momentumScores[i] > momentumScores[bestMomentumIdx]) {
      bestMomentumIdx = i
    }
    const curr = stocks[i]
    const lowest = stocks[lowestRiskIdx]
    if (
      curr.fundamental_score > lowest.fundamental_score ||
      (curr.fundamental_score === lowest.fundamental_score && curr.pe < lowest.pe)
    ) {
      lowestRiskIdx = i
    }
    if (insights[i].alphaGenerationPotential > insights[highestAlphaIdx].alphaGenerationPotential) {
      highestAlphaIdx = i
    }
  }

  const bestOverall = stocks[bestOverallIdx].ticker
  const bestValue = stocks[bestValueIdx].ticker
  const bestMomentum = stocks[bestMomentumIdx].ticker
  const lowestRisk = stocks[lowestRiskIdx].ticker
  const highestAlpha = stocks[highestAlphaIdx].ticker

  const narrativeInsights: string[] = []

  const winnerInsight = insights[bestOverallIdx]
  narrativeInsights.push(
    `${bestOverall} memimpin komparasi dengan skor CIS ${winnerInsight.compositeScore}/100, menunjukkan keselarasan prima antara pilar fundamental dan daya tarik valuasi.`
  )

  const divergentStock = insights.find(
    (ins) => ins.valueMomentumSignal === "DIVERGENSI_NEGATIF" || ins.valueMomentumSignal === "KONVERGENSI_BEARISH"
  )
  const convergentStock = insights.find((ins) => ins.valueMomentumSignal === "KONVERGENSI_BULLISH")
  const opportunityStock = insights.find((ins) => ins.valueMomentumSignal === "DIVERGENSI_POSITIF")

  if (divergentStock) {
    narrativeInsights.push(
      `Divergensi terdeteksi pada ${divergentStock.ticker}: valuasi premium namun momentum asing menurun — sinyal kewaspadaan potensi koreksi.`
    )
  } else if (convergentStock) {
    narrativeInsights.push(
      `Konvergensi bullish terkonfirmasi pada ${convergentStock.ticker}: kombinasi valuasi atraktif dan akselerasi momentum foreign flow.`
    )
  } else if (opportunityStock) {
    narrativeInsights.push(
      `Peluang divergensi positif terlihat pada ${opportunityStock.ticker}: valuasi terdiskon kuat meski momentum pasar masih menunggu katalis.`
    )
  } else {
    narrativeInsights.push(
      `Sinyal value-momentum berada pada fase konsolidasi netral bagi seluruh emiten yang dikomparasikan.`
    )
  }

  let highestMosIdx = 0
  for (let i = 1; i < insights.length; i++) {
    if (insights[i].marginOfSafety > insights[highestMosIdx].marginOfSafety) {
      highestMosIdx = i
    }
  }
  const topMos = insights[highestMosIdx]
  const mosPrefix = topMos.marginOfSafety > 0 ? "+" : ""
  narrativeInsights.push(
    `Margin of Safety terbaik ada pada ${topMos.ticker} (${mosPrefix}${topMos.marginOfSafety}%), memberikan bantalan proteksi valuasi kategori ${topMos.marginOfSafetyLabel}.`
  )

  const alphaInsight = insights[highestAlphaIdx]
  narrativeInsights.push(
    `Potensi Alpha Generation tertinggi diraih ${highestAlpha} (${alphaInsight.alphaGenerationPotential}%, ${alphaInsight.alphaLabel}) ditopang kombinasi undervaluation dan katalis sentimen.`
  )

  let highestIclIdx = 0
  for (let i = 1; i < insights.length; i++) {
    if (insights[i].institutionalConvictionScore > insights[highestIclIdx].institutionalConvictionScore) {
      highestIclIdx = i
    }
  }
  const topIcl = insights[highestIclIdx]
  const formattedIcl = topIcl.institutionalConviction.replace("_", " ")
  narrativeInsights.push(
    `Tingkat keyakinan institusi asing paling kokoh pada ${topIcl.ticker} (${topIcl.institutionalConvictionScore}/100 - ${formattedIcl}), menjadi penopang stabilitas harga.`
  )

  return {
    bestOverall,
    bestValue,
    bestMomentum,
    lowestRisk,
    highestAlpha,
    insights,
    narrativeInsights,
  }
}
