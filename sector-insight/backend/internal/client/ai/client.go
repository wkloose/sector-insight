package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewClient(baseURL string) *Client {
	return &Client{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

type ArticleAnalysisRequest struct {
	ArticleID uint   `json:"article_id"`
	Title     string `json:"title"`
	Snippet   string `json:"snippet"`
	Ticker    string `json:"ticker"`
}

type ArticleAnalysisResult struct {
	ArticleID        uint     `json:"article_id"`
	Category         string   `json:"category"`
	AffectedEntities []string `json:"affected_entities"`
	SentimentScore   float64  `json:"sentiment_score"`
	Confidence       float64  `json:"confidence"`
	Reasoning        string   `json:"reasoning"`
}

type BatchAnalysisRequest struct {
	Articles []ArticleAnalysisRequest `json:"articles"`
}

type BatchAnalysisResponse struct {
	Results []ArticleAnalysisResult `json:"results"`
}

func (c *Client) AnalyzeArticlesBatch(articles []ArticleAnalysisRequest) (*BatchAnalysisResponse, error) {
	payload, err := json.Marshal(BatchAnalysisRequest{Articles: articles})
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/api/v1/analyze-batch", c.BaseURL)
	resp, err := c.HTTPClient.Post(url, "application/json", bytes.NewBuffer(payload))
	if err != nil {
		return nil, fmt.Errorf("failed to call ai service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("ai service returned non-200 code: %d", resp.StatusCode)
	}

	var result BatchAnalysisResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode ai service response: %w", err)
	}

	return &result, nil
}

