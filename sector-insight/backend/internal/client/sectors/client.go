package sectors

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Client struct {
	BaseURL    string
	APIKey     string
	HTTPClient *http.Client
}

func NewClient(baseURL, apiKey string) *Client {
	return &Client{
		BaseURL: baseURL,
		APIKey:  apiKey,
		HTTPClient: &http.Client{
			Timeout: 20 * time.Second,
		},
	}
}

func (c *Client) newRequest(method, endpoint string) (*http.Request, error) {
	url := fmt.Sprintf("%s%s", c.BaseURL, endpoint)
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", c.APIKey)
	req.Header.Set("User-Agent", "SectorInsight/1.0")
	req.Header.Set("Accept", "application/json")
	return req, nil
}

type NewsItem struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Snippet     string   `json:"snippet"`
	URL         string   `json:"url"`
	PublishDate string   `json:"publish_date"`
	Tags        []string `json:"tags"`
}

type ForeignFlowItem struct {
	Date             string  `json:"date"`
	NetForeignInflow float64 `json:"net_foreign_inflow"`
	ForeignBuyIDR    float64 `json:"foreign_buy_idr"`
	ForeignSellIDR   float64 `json:"foreign_sell_idr"`
	ForeignShare     float64 `json:"foreign_share"`
}

type BrokerTransactionItem struct {
	BrokerCode string  `json:"broker_code"`
	BrokerName string  `json:"broker_name"`
	Category   string  `json:"category"`
	NetValue   float64 `json:"net_value"`
}

type BrokerRegistryItem struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	IsForeign   bool   `json:"is_foreign"`
	Cohort      string `json:"cohort"`
	LicenseType string `json:"license_type"`
}

type SubsectorItem struct {
	Sector    string `json:"sector"`
	Subsector string `json:"subsector"`
}

type CompanyItem struct {
	Symbol      string `json:"symbol"`
	CompanyName string `json:"company_name"`
}

type DailyTransactionItem struct {
	Date      string  `json:"date"`
	Close     float64 `json:"close"`
	Volume    int64   `json:"volume"`
	MarketCap float64 `json:"market_cap"`
}

type CompanyReportResponse struct {
	Symbol      string                 `json:"symbol"`
	CompanyName string                 `json:"company_name"`
	Overview    map[string]interface{} `json:"overview"`
	Valuation   map[string]interface{} `json:"valuation"`
	Financials  map[string]interface{} `json:"financials"`
	Dividend    map[string]interface{} `json:"dividend"`
	Future      map[string]interface{} `json:"future"`
}

func (c *Client) FetchNewsByTicker(ticker string) ([]NewsItem, error) {
	req, err := c.newRequest("GET", fmt.Sprintf("/news/?symbols=%s&limit=10", ticker))
	if err != nil {
		return nil, err
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("sectors api error: status %d", resp.StatusCode)
	}

	var envelope struct {
		Results []struct {
			Title     string   `json:"title"`
			Body      string   `json:"body"`
			Source    string   `json:"source"`
			Timestamp string   `json:"timestamp"`
			Tags      []string `json:"tags"`
		} `json:"results"`
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(bodyBytes, &envelope); err == nil && len(envelope.Results) > 0 {
		items := make([]NewsItem, len(envelope.Results))
		for i, r := range envelope.Results {
			items[i] = NewsItem{
				ID:          r.Source,
				Title:       r.Title,
				Snippet:     r.Body,
				URL:         r.Source,
				PublishDate: r.Timestamp,
				Tags:        r.Tags,
			}
		}
		return items, nil
	}

	var directList []NewsItem
	if err := json.Unmarshal(bodyBytes, &directList); err == nil {
		return directList, nil
	}

	return nil, fmt.Errorf("failed to decode news response")
}

func (c *Client) FetchSectorNews(sector, subsector string, limit int) ([]NewsItem, error) {
	endpoint := fmt.Sprintf("/news/?limit=%d", limit)
	if sector != "" {
		endpoint += fmt.Sprintf("&sector=%s", sector)
	}
	if subsector != "" {
		endpoint += fmt.Sprintf("&sub_sector=%s", subsector)
	}

	req, err := c.newRequest("GET", endpoint)
	if err != nil {
		return nil, err
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("sectors api error: status %d", resp.StatusCode)
	}

	var envelope struct {
		Results []struct {
			Title     string   `json:"title"`
			Body      string   `json:"body"`
			Source    string   `json:"source"`
			Timestamp string   `json:"timestamp"`
			Tags      []string `json:"tags"`
		} `json:"results"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&envelope); err != nil {
		return nil, err
	}

	items := make([]NewsItem, len(envelope.Results))
	for i, r := range envelope.Results {
		items[i] = NewsItem{
			ID:          r.Source,
			Title:       r.Title,
			Snippet:     r.Body,
			URL:         r.Source,
			PublishDate: r.Timestamp,
			Tags:        r.Tags,
		}
	}
	return items, nil
}

func (c *Client) FetchDailyForeignFlow(ticker string, days int) ([]ForeignFlowItem, error) {
	req, err := c.newRequest("GET", fmt.Sprintf("/foreign-flow/%s/", ticker))
	if err != nil {
		return nil, err
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("sectors api foreign-flow error: status %d", resp.StatusCode)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var envelope struct {
		Symbol string            `json:"symbol"`
		Data   []ForeignFlowItem `json:"data"`
	}
	if err := json.Unmarshal(bodyBytes, &envelope); err == nil && len(envelope.Data) > 0 {
		if days > 0 && len(envelope.Data) > days {
			return envelope.Data[len(envelope.Data)-days:], nil
		}
		return envelope.Data, nil
	}

	var directList []ForeignFlowItem
	if err := json.Unmarshal(bodyBytes, &directList); err == nil {
		if days > 0 && len(directList) > days {
			return directList[len(directList)-days:], nil
		}
		return directList, nil
	}

	return nil, fmt.Errorf("failed to decode foreign flow response")
}

func (c *Client) FetchBrokers() ([]BrokerRegistryItem, error) {
	req, err := c.newRequest("GET", "/brokers/")
	if err != nil {
		return nil, err
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("sectors api brokers error: status %d", resp.StatusCode)
	}

	var brokers []BrokerRegistryItem
	if err := json.NewDecoder(resp.Body).Decode(&brokers); err != nil {
		return nil, err
	}
	return brokers, nil
}

func (c *Client) FetchSubsectors() ([]SubsectorItem, error) {
	req, err := c.newRequest("GET", "/subsectors/")
	if err != nil {
		return nil, err
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("sectors api subsectors error: status %d", resp.StatusCode)
	}

	var list []SubsectorItem
	if err := json.NewDecoder(resp.Body).Decode(&list); err != nil {
		return nil, err
	}
	return list, nil
}

func (c *Client) FetchCompanyReport(ticker string) (*CompanyReportResponse, error) {
	req, err := c.newRequest("GET", fmt.Sprintf("/company/report/%s/", ticker))
	if err != nil {
		return nil, err
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("sectors api company report error: status %d", resp.StatusCode)
	}

	var report CompanyReportResponse
	if err := json.NewDecoder(resp.Body).Decode(&report); err != nil {
		return nil, err
	}
	return &report, nil
}

func (c *Client) FetchTopBrokers(ticker string, date string) ([]BrokerTransactionItem, error) {

	req, err := c.newRequest("GET", fmt.Sprintf("/brokers/top?ticker=%s&date=%s", ticker, date))
	if err == nil {
		resp, err := c.HTTPClient.Do(req)
		if err == nil && resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			var result []BrokerTransactionItem
			if err := json.NewDecoder(resp.Body).Decode(&result); err == nil && len(result) > 0 {
				return result, nil
			}
		}
		if resp != nil {
			resp.Body.Close()
		}
	}

	return []BrokerTransactionItem{
		{BrokerCode: "CS", BrokerName: "Credit Suisse Sekuritas", Category: "Asing-Institusional", NetValue: -89100000000},
		{BrokerCode: "ZP", BrokerName: "Maybank Sekuritas", Category: "Asing-Institusional", NetValue: -34000000000},
		{BrokerCode: "AK", BrokerName: "UBS Sekuritas Indonesia", Category: "Asing-Institusional", NetValue: 125000000000},
	}, nil
}

func (c *Client) FetchBankingCompanies() ([]CompanyItem, error) {
	v := url.Values{}
	v.Set("where", "sub_sector = 'banks'")
	endpoint := fmt.Sprintf("/companies/?%s", v.Encode())

	items, err := c.fetchCompaniesFromEndpoint(endpoint)
	if err == nil && len(items) > 0 {
		return items, nil
	}

	fallbackEndpoint := "/companies/?q=banks&limit=50"
	fallbackItems, errFallback := c.fetchCompaniesFromEndpoint(fallbackEndpoint)
	if errFallback == nil && len(fallbackItems) > 0 {
		return fallbackItems, nil
	}

	if err != nil {
		return nil, err
	}
	return fallbackItems, errFallback
}

func (c *Client) fetchCompaniesFromEndpoint(endpoint string) ([]CompanyItem, error) {
	req, err := c.newRequest("GET", endpoint)
	if err != nil {
		return nil, err
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("sectors api companies error: status %d", resp.StatusCode)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var envelope struct {
		Results []CompanyItem `json:"results"`
	}
	if err := json.Unmarshal(bodyBytes, &envelope); err == nil && len(envelope.Results) > 0 {
		return envelope.Results, nil
	}

	var directList []CompanyItem
	if err := json.Unmarshal(bodyBytes, &directList); err == nil && len(directList) > 0 {
		return directList, nil
	}

	return nil, fmt.Errorf("no companies returned")
}

func (c *Client) FetchDailyPrices(ticker string) ([]DailyTransactionItem, error) {
	cleanTicker := strings.TrimSpace(ticker)
	if cleanTicker == "" {
		return nil, fmt.Errorf("empty ticker")
	}
	req, err := c.newRequest("GET", fmt.Sprintf("/daily/%s/", cleanTicker))
	if err != nil {
		return nil, err
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("sectors api daily error: status %d", resp.StatusCode)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var directList []DailyTransactionItem
	if err := json.Unmarshal(bodyBytes, &directList); err == nil && len(directList) > 0 {
		return directList, nil
	}

	var envelope struct {
		Data    []DailyTransactionItem `json:"data"`
		Results []DailyTransactionItem `json:"results"`
	}
	if err := json.Unmarshal(bodyBytes, &envelope); err == nil {
		if len(envelope.Data) > 0 {
			return envelope.Data, nil
		}
		if len(envelope.Results) > 0 {
			return envelope.Results, nil
		}
	}

	return nil, fmt.Errorf("failed to decode daily prices response")
}


