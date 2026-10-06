package community

import (
	"errors"
	"math"
	"sort"
	"strings"
	"time"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

type PostDTO struct {
	ID            uint      `json:"id"`
	UserID        uint      `json:"user_id"`
	Username      string    `json:"username"`
	UserBadge     string    `json:"user_badge"`
	UserKarma     int       `json:"user_karma"`
	Ticker        string    `json:"ticker"`
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	SentimentTag  string    `json:"sentiment_tag"`
	Upvotes       int       `json:"upvotes"`
	Downvotes     int       `json:"downvotes"`
	WeightedScore float64   `json:"weighted_score"`
	HotRank       float64   `json:"hot_rank"`
	CommentCount  int       `json:"comment_count"`
	CreatedAt     time.Time `json:"created_at"`
}

type CrowdSentimentDTO struct {
	Ticker           string   `json:"ticker"`
	SentimentScore   float64  `json:"sentiment_score"`
	BullishPercent   float64  `json:"bullish_percent"`
	BearishPercent   float64  `json:"bearish_percent"`
	TotalPosts       int      `json:"total_posts"`
	DiscussionZScore float64  `json:"discussion_velocity_zscore"`
	DivergenceStatus string   `json:"divergence_status"`
	TopBullishArgs   []string `json:"top_bullish_arguments"`
	TopBearishArgs   []string `json:"top_bearish_arguments"`
	UpdatedAt        string   `json:"updated_at"`
}

func GetPosts(ticker string, sortOrder string, limit int) ([]PostDTO, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	query := database.DB.Preload("User")
	if ticker != "" {
		query = query.Where("ticker = ?", strings.ToUpper(ticker))
	}

	var posts []model.CommunityPost
	if err := query.Find(&posts).Error; err != nil {
		return nil, err
	}

	dtos := []PostDTO{}
	for _, p := range posts {
		username := "anon"
		badge := "Member"
		karma := 0
		if p.User.ID != 0 {
			username = p.User.Username
			badge = p.User.Badge
			karma = p.User.KarmaPoints
		}

		hotRank := CalculateHotRank(p.WeightedScore, p.CreatedAt)
		dtos = append(dtos, PostDTO{
			ID:            p.ID,
			UserID:        p.UserID,
			Username:      username,
			UserBadge:     badge,
			UserKarma:     karma,
			Ticker:        p.Ticker,
			Title:         p.Title,
			Content:       p.Content,
			SentimentTag:  p.SentimentTag,
			Upvotes:       p.Upvotes,
			Downvotes:     p.Downvotes,
			WeightedScore: p.WeightedScore,
			HotRank:       hotRank,
			CommentCount:  p.CommentCount,
			CreatedAt:     p.CreatedAt,
		})
	}

	switch strings.ToLower(sortOrder) {
	case "top":
		sort.Slice(dtos, func(i, j int) bool {
			return dtos[i].WeightedScore > dtos[j].WeightedScore
		})
	case "new":
		sort.Slice(dtos, func(i, j int) bool {
			return dtos[i].CreatedAt.After(dtos[j].CreatedAt)
		})
	case "controversial":
		sort.Slice(dtos, func(i, j int) bool {

			ratioI := float64(dtos[i].Downvotes) / float64(dtos[i].Upvotes+1)
			ratioJ := float64(dtos[j].Downvotes) / float64(dtos[j].Upvotes+1)
			return ratioI > ratioJ
		})
	default:
		sort.Slice(dtos, func(i, j int) bool {
			return dtos[i].HotRank > dtos[j].HotRank
		})
	}

	if len(dtos) > limit {
		dtos = dtos[:limit]
	}

	return dtos, nil
}

func CreatePost(username string, ticker string, title string, content string, sentimentTag string) (*PostDTO, error) {
	if ticker == "" || title == "" || content == "" {
		return nil, errors.New("ticker, title, and content are required")
	}

	upperTag := strings.ToUpper(sentimentTag)
	if upperTag != "BULLISH" && upperTag != "BEARISH" && upperTag != "NEUTRAL" {
		upperTag = "NEUTRAL"
	}

	var user model.CommunityUser
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		user = model.CommunityUser{
			Username:        username,
			Badge:           "Member",
			KarmaPoints:     10,
			TotalUpvotes:    0,
			CredibilityRate: 0.5,
			CreatedAt:       time.Now(),
		}
		database.DB.Create(&user)
	}

	post := model.CommunityPost{
		UserID:        user.ID,
		Ticker:        strings.ToUpper(ticker),
		Title:         title,
		Content:       content,
		SentimentTag:  upperTag,
		Upvotes:       1,
		Downvotes:     0,
		WeightedScore: user.CredibilityRate,
		CommentCount:  0,
		CreatedAt:     time.Now(),
	}

	if err := database.DB.Create(&post).Error; err != nil {
		return nil, err
	}

	go CalculateCrowdSentimentAggregates(post.Ticker)

	return &PostDTO{
		ID:            post.ID,
		UserID:        user.ID,
		Username:      user.Username,
		UserBadge:     user.Badge,
		UserKarma:     user.KarmaPoints,
		Ticker:        post.Ticker,
		Title:         post.Title,
		Content:       post.Content,
		SentimentTag:  post.SentimentTag,
		Upvotes:       post.Upvotes,
		Downvotes:     post.Downvotes,
		WeightedScore: post.WeightedScore,
		HotRank:       CalculateHotRank(post.WeightedScore, post.CreatedAt),
		CommentCount:  0,
		CreatedAt:     post.CreatedAt,
	}, nil
}

func VotePost(postID uint, username string, direction int) (float64, error) {
	if direction != 1 && direction != -1 && direction != 0 {
		return 0, errors.New("invalid vote direction: must be 1 (up), -1 (down), or 0 (cancel)")
	}

	var post model.CommunityPost
	if err := database.DB.First(&post, postID).Error; err != nil {
		return 0, errors.New("post not found")
	}

	var voter model.CommunityUser
	if err := database.DB.Where("username = ?", username).First(&voter).Error; err != nil {
		voter = model.CommunityUser{
			Username:        username,
			Badge:           "Member",
			CredibilityRate: 0.5,
			CreatedAt:       time.Now(),
		}
		database.DB.Create(&voter)
	}

	var existingVote model.CommunityVote
	err := database.DB.Where("post_id = ? AND user_id = ?", postID, voter.ID).First(&existingVote).Error

	if direction == 0 {

		if err == nil {
			database.DB.Delete(&existingVote)
		}
	} else {
		weight := voter.CredibilityRate
		if weight <= 0 {
			weight = 0.5
		}

		if err == nil {

			existingVote.Direction = direction
			existingVote.VoteWeight = weight
			database.DB.Save(&existingVote)
		} else {

			newVote := model.CommunityVote{
				PostID:     postID,
				UserID:     voter.ID,
				Direction:  direction,
				VoteWeight: weight,
				CreatedAt:  time.Now(),
			}
			database.DB.Create(&newVote)
		}
	}

	var allVotes []model.CommunityVote
	database.DB.Where("post_id = ?", postID).Find(&allVotes)

	up := 0
	down := 0
	var weightedSum float64 = 0

	for _, v := range allVotes {
		if v.Direction > 0 {
			up++
		} else if v.Direction < 0 {
			down++
		}
		weightedSum += v.VoteWeight * float64(v.Direction)
	}

	effective := weightedSum - (float64(down) * 1.15)
	post.Upvotes = up
	post.Downvotes = down
	post.WeightedScore = effective
	database.DB.Save(&post)

	var author model.CommunityUser
	if err := database.DB.First(&author, post.UserID).Error; err == nil {
		author.KarmaPoints += direction * 5
		if author.KarmaPoints < 0 {
			author.KarmaPoints = 0
		}
		database.DB.Save(&author)
	}

	return effective, nil
}

func GetTickerSentiment(ticker string) (*CrowdSentimentDTO, error) {
	upperTicker := strings.ToUpper(ticker)
	crowd, err := CalculateCrowdSentimentAggregates(upperTicker)
	if err != nil {
		return nil, err
	}

	topBullish := []string{
		"CASA tabungan murah sangat tebal menopang profitabilitas jangka panjang",
		"Hasil dividen tunai tahunan konsisten dan atraktif",
		"Pertumbuhan penyaluran kredit tetap solid di atas rata-rata industri",
	}
	topBearish := []string{
		"Sentimen suku bunga BI-Rate yang bertahan di level tinggi",
		"Tekanan jual dan distribusi dari broker institusi asing",
		"Kekhawatiran kenaikan rasio kredit bermasalah (NPL) segmen tertentu",
	}

	if upperTicker == "BBCA" {
		topBullish = []string{
			"Mesin pencetak laba paling efisien dengan ROE 22%+",
			"Dominasi rekening transaksi harian perbankan nasional",
			"Kualitas aset teruji dan rasio kecukupan likuiditas prima",
		}
		topBearish = []string{
			"Valuasi PBV premium jarang sekali terkoreksi dalam",
			"Pertumbuhan aset raksasa bergerak lebih matang",
			"Sensitivitas siklus pelonggaran suku bunga global",
		}
	}

	return &CrowdSentimentDTO{
		Ticker:           upperTicker,
		SentimentScore:   crowd.SentimentScore,
		BullishPercent:   crowd.BullishPercent,
		BearishPercent:   math.Round((100.0-crowd.BullishPercent)*10) / 10,
		TotalPosts:       crowd.TotalPosts,
		DiscussionZScore: crowd.DiscussionZScore,
		DivergenceStatus: crowd.DivergenceStatus,
		TopBullishArgs:   topBullish,
		TopBearishArgs:   topBearish,
		UpdatedAt:        crowd.Tanggal.Format(time.RFC3339),
	}, nil
}

