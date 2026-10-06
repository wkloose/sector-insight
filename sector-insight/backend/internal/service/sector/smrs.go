package sector

import "math"

func CalculateSMRS(sentimentScore float64, zForeign float64, priceReturn7D float64) (float64, string) {

	normSentiment := ((sentimentScore + 1.0) / 2.0) * 100.0

	clampedZ := zForeign
	if clampedZ < -3.0 {
		clampedZ = -3.0
	} else if clampedZ > 3.0 {
		clampedZ = 3.0
	}
	normForeign := ((clampedZ + 3.0) / 6.0) * 100.0

	clampedReturn := priceReturn7D
	if clampedReturn < -10.0 {
		clampedReturn = -10.0
	} else if clampedReturn > 10.0 {
		clampedReturn = 10.0
	}
	normPrice := ((clampedReturn + 10.0) / 20.0) * 100.0

	smrs := (0.35 * normSentiment) + (0.40 * normForeign) + (0.25 * normPrice)
	smrs = math.Round(smrs*10) / 10.0

	var status string
	if smrs >= 75.0 {
		status = "LEADING"
	} else if smrs >= 60.0 {
		status = "IMPROVING"
	} else if smrs >= 40.0 {
		status = "NEUTRAL"
	} else if smrs >= 25.0 {
		status = "WEAKENING"
	} else {
		status = "LAGGING"
	}

	return smrs, status
}

