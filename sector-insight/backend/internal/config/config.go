package config

import (
	"bufio"
	"os"
	"strings"
)

type Config struct {
	Port           string
	Env            string
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	DBSSLMode      string
	SectorsAPIKey  string
	SectorsBaseURL string
	AIServiceURL   string
}

func loadDotEnv(paths ...string) {
	for _, path := range paths {
		file, err := os.Open(path)
		if err != nil {
			continue
		}
		defer file.Close()

		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				k := strings.TrimSpace(parts[0])
				v := strings.TrimSpace(parts[1])

				if os.Getenv(k) == "" {
					os.Setenv(k, v)
				}
			}
		}
		break
	}
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func LoadConfig() *Config {
	loadDotEnv(".env", "../.env", "backend/.env")

	return &Config{
		Port:           getEnv("PORT", "8080"),
		Env:            getEnv("ENV", "development"),
		DBHost:         getEnv("DB_HOST", "localhost"),
		DBPort:         getEnv("DB_PORT", "5432"),
		DBUser:         getEnv("DB_USER", "postgres"),
		DBPassword:     getEnv("DB_PASSWORD", "postgres"),
		DBName:         getEnv("DB_NAME", "sector_insight"),
		DBSSLMode:      getEnv("DB_SSLMODE", "disable"),
		SectorsAPIKey:  getEnv("SECTORS_API_KEY", ""),
		SectorsBaseURL: getEnv("SECTORS_BASE_URL", "https://api.sectors.app/v2"),
		AIServiceURL:   getEnv("AI_SERVICE_URL", "http://localhost:8000"),
	}
}

