import requests
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = "http://localhost:8080"

def test_endpoint(name, url, expected_keys=None):
    print(f"\n[TESTING] {name} -> {url}")
    try:
        r = requests.get(url, timeout=5)
        print(f"  HTTP Status: {r.status_code}")
        if r.status_code != 200:
            print(f"  ❌ FAILED with status {r.status_code}: {r.text[:200]}")
            return False

        data = r.json()
        if expected_keys:
            if isinstance(data, list) and len(data) > 0:
                item = data[0]
            elif isinstance(data, dict):
                item = data
            else:
                item = {}
            for k in expected_keys:
                if k not in item:
                    print(f"  ⚠️ Warning: expected key '{k}' not found in response")
        print(f"  ✅ SUCCESS: Valid JSON payload received ({len(str(data))} bytes)")
        return True
    except Exception as e:
        print(f"  ❌ CONNECTION ERROR: {e}")
        return False

def main():
    print("=" * 80)
    print("SECTOR INSIGHT: 5-PILLAR & PRD 0 s.d 5 FULL INTEGRATION VERIFICATION")
    print("=" * 80)

    results = []

    results.append(test_endpoint(
        "1. Composite Alert 4-Pillar Summary",
        f"{BASE_URL}/api/v1/composite-alert/summary",
        ["ticker", "overall_status", "crowd_sentiment", "divergence_status"]
    ))

    results.append(test_endpoint(
        "2. Fundamental 7-Axis Screener",
        f"{BASE_URL}/api/v1/fundamental-score",
        ["ticker", "skor_akhir", "health_status"]
    ))

    results.append(test_endpoint(
        "3. Foreign Flow Summary (Z-Score & Anomalies)",
        f"{BASE_URL}/api/v1/foreign-flow/summary",
        ["ticker", "net_foreign_inflow", "z_score"]
    ))

    results.append(test_endpoint(
        "4. News Sentiment & Policy Exposure",
        f"{BASE_URL}/api/v1/sentiment/BBRI",
        ["ticker", "company_sentiment_score", "policy_exposure_score"]
    ))

    results.append(test_endpoint(
        "5. AI Beginner Stock Brief (TL;DR, Traffic Light, 3 Pros vs 3 Cons)",
        f"{BASE_URL}/api/v1/stocks/BBCA/beginner-brief",
        ["ticker", "health_badge", "health_score", "tldr_summary", "pros", "cons", "investor_fit"]
    ))

    results.append(test_endpoint(
        "6. Financial Demystification Glossary",
        f"{BASE_URL}/api/v1/glossary",
        ["items", "total"]
    ))

    results.append(test_endpoint(
        "7. Community Sentiment & Barometer",
        f"{BASE_URL}/api/v1/community/BBRI/sentiment",
        ["ticker", "sentiment_score", "bullish_percent", "divergence_status"]
    ))

    results.append(test_endpoint(
        "8. Retail vs Foreign Divergence Alerts",
        f"{BASE_URL}/api/v1/community/alerts",
        ["alerts", "total"]
    ))

    results.append(test_endpoint(
        "9. Community Feed with Weighted Karma & HotRank",
        f"{BASE_URL}/api/v1/community/posts?ticker=BBRI&sort=hot",
        ["title", "weighted_score", "sentiment_tag"]
    ))

    results.append(test_endpoint(
        "10. 11 IDX-IC Sector Ranking (SMRS Momentum Leaderboard)",
        f"{BASE_URL}/api/v1/sectors/ranking",
        ["sector_slug", "smrs_score", "status", "price_return_7d"]
    ))

    results.append(test_endpoint(
        "11. Sector Rotation Surge & Smart Money Exit Alerts",
        f"{BASE_URL}/api/v1/sectors/alerts",
        ["alerts", "total"]
    ))

    print("\n" + "=" * 80)
    passed = sum(1 for r in results if r)
    total = len(results)
    print(f"VERIFICATION SUMMARY: {passed}/{total} ENDPOINTS PASSED")
    print("=" * 80)

if __name__ == "__main__":
    main()

