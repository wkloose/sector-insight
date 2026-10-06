package community

import (
	"math"
	"time"

	"sector-insight/backend/internal/database"
	"sector-insight/backend/internal/model"
)

func CalculateUserCredibility(user model.CommunityUser, highQualityPosts int) float64 {
	var ratioUpvotes float64 = 0.5
	if user.TotalUpvotes > 0 {
		ratioUpvotes = math.Min(1.0, float64(user.TotalUpvotes)/float64(user.TotalUpvotes+10))
	}

	qualityFactor := math.Min(1.0, float64(highQualityPosts)/10.0)
	score := 0.2 + (0.5 * ratioUpvotes) + (0.3 * qualityFactor)
	if score > 1.0 {
		score = 1.0
	}
	if score < 0.1 {
		score = 0.1
	}
	return score
}

func CalculateEffectiveScore(postID uint) float64 {
	var votes []model.CommunityVote
	database.DB.Where("post_id = ?", postID).Find(&votes)

	var weightedSum float64 = 0
	var downvoteCount float64 = 0

	for _, v := range votes {
		weightedSum += v.VoteWeight * float64(v.Direction)
		if v.Direction < 0 {
			downvoteCount++
		}
	}

	effectiveScore := weightedSum - (downvoteCount * 1.15)
	return effectiveScore
}

func CalculateHotRank(effectiveScore float64, createdAt time.Time) float64 {
	ageHours := time.Since(createdAt).Hours()
	if ageHours < 0 {
		ageHours = 0
	}
	numerator := effectiveScore - 1.0
	denominator := math.Pow(ageHours+2.0, 1.5)
	if denominator <= 0 {
		return numerator
	}
	return numerator / denominator
}

