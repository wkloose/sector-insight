package main

import (
	"fmt"
	"log"

	"sector-insight/backend/internal/client/ai"
)

func main() {
	fmt.Println("================================================================")
	fmt.Println("  TESTING GO BACKEND -> PYTHON AI SERVICE INTEGRATION")
	fmt.Println("================================================================")

	aiClient := ai.NewClient("http://localhost:8000")

	articles := []ai.ArticleAnalysisRequest{
		{
			ArticleID: 101,
			Ticker:    "BBRI",
			Title:     "Laba Bersih BRI Tembus Rp 60,4 Triliun Ditopang Penyaluran Kredit UMKM",
			Snippet:   "PT Bank Rakyat Indonesia (Persero) Tbk kembali mencatatkan rekor laba bersih dengan rasio kredit macet (NPL) yang terjaga stabil.",
		},
		{
			ArticleID: 102,
			Ticker:    "SECTOR",
			Title:     "Rapat Dewan Gubernur Bank Indonesia Pertahankan BI-Rate di Level 6,00%",
			Snippet:   "Bank Indonesia memproyeksikan stabilitas moneter dan likuiditas perbankan tetap memadai untuk mendukung pertumbuhan ekonomi nasional.",
		},
	}

	fmt.Printf("[GO BACKEND] Sending %d financial articles to Python AI Service...\n", len(articles))
	resp, err := aiClient.AnalyzeArticlesBatch(articles)
	if err != nil {
		log.Fatalf("[ERROR] Failed calling Python AI service: %v", err)
	}

	fmt.Println("\n[SUCCESS] Response received from Python AI Service:")
	for _, res := range resp.Results {
		fmt.Println("----------------------------------------------------------------")
		fmt.Printf("Article ID        : %d\n", res.ArticleID)
		fmt.Printf("Category          : %s\n", res.Category)
		fmt.Printf("Affected Entities : %v\n", res.AffectedEntities)
		fmt.Printf("Sentiment Score   : %.2f\n", res.SentimentScore)
		fmt.Printf("Confidence        : %.2f\n", res.Confidence)
		fmt.Printf("Reasoning         : %s\n", res.Reasoning)
	}
	fmt.Println("================================================================")
}

