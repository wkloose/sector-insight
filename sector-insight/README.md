# Sector Insight: Platform Analisis Pasar Modal dan Rotasi Sektor IDX

Sector Insight adalah platform analitik pasar modal yang dirancang untuk menganalisis data saham di Bursa Efek Indonesia (IDX) menggunakan data resmi dari Sectors API v2, kalkulasi kuantitatif, dan pemrosesan bahasa alami (NLP).

Aplikasi ini mencakup seluruh kebutuhan dari 6 dokumen spesifikasi (PRD):
1. **Fitur 1 (PRD 0)**: Pengolahan sentimen berita dan kebijakan makro (deduplikasi MD5, pembobotan waktu, pemisahan isu emiten vs kebijakan).
2. **Fitur 2 (PRD 1)**: Skor kesehatan fundamental perbankan berdasarkan 7 parameter spesifik (NIM, LDR, pertumbuhan kredit, DPK, ROE, konsistensi laba, dan dividen).
3. **Fitur 3 (PRD 2)**: Pemantauan aliran dana asing, deteksi anomali statistik Z-Score 90 hari, dan pemetaan broker 14 hari.
4. **Fitur 4 (PRD 3)**: Forum diskusi komunitas dengan sistem reputasi karma berbobot, algoritma HotRank, dan peringatan divergensi ritel vs asing.
5. **Fitur 5 (PRD 4)**: Pemetaan 11 sektor resmi IDX-IC dan 33 subsektor, visualisasi heatmap rotasi sektor, dan skor momentum SMRS.
6. **Fitur 6 (PRD 5)**: Ringkasan ramah pemula berbasis AI, indikator lampu status, ringkasan 30 detik, 3 kelebihan vs 3 risiko, dan kamus istilah interaktif.

---

## 1. Struktur Direktori

```
sector-insight/
|-- docker-compose.yml          # Konfigurasi container PostgreSQL, Backend Go, AI Python, dan Frontend
|-- README.md                   # Dokumentasi panduan arsitektur dan eksekusi
|-- verify_scenarios.py         # Skrip otomatis uji validasi 11 endpoint
|
|-- frontend/                   # Antarmuka web pengguna (Next.js 16 + React 19)
|   |-- app/                    # Rute halaman web (/sectors, /community, /stock, /dashboard, /compare, dll.)
|   |-- src/
|   |   |-- features/           # Modul fitur:
|   |   |   |-- beginner-brief/ # Mode Pemula vs Pro, lampu status, 3 kelebihan vs 3 risiko, kamus istilah
|   |   |   |-- community/      # Forum diskusi, voting karma, barometer sentimen, alert divergensi
|   |   |   |-- sectors/        # Heatmap 11 sektor IDX-IC, leaderboard, skor SMRS, drill-down
|   |   |   |-- composite-alert/# Mesin peringatan gabungan 4 pilar
|   |   |   |-- foreign-flow/   # Deteksi anomali arus dana asing dan data broker
|   |   |   `-- fundamental/    # Screener fundamental dan grafik radar perbankan
|   |   `-- shared/             # Komponen antarmuka bersama dan navigasi
|   `-- package.json
|
|-- backend/                    # Server backend utama (Go 1.24)
|   |-- cmd/api/main.go         # Titik masuk server REST API dan penjadwal cron
|   `-- internal/
|       |-- config/             # Pengaturan konfigurasi aplikasi
|       |-- database/           # Koneksi database PostgreSQL dan SQLite fallback
|       |-- model/              # Skema tabel database (11 sektor, komunitas, fundamental, berita)
|       |-- client/             # Klien Sectors API v2 dan klien AI Service
|       |-- jobs/               # Penjadwal tugas otomatis harian
|       |-- service/            # Logika perhitungan SMRS, sistem karma, divergensi, dan fundamental
|       `-- handler/            # Rute endpoint REST API
|
`-- ai-service/                 # Layanan pemrosesan teks NLP (Python FastAPI)
    |-- requirements.txt
    `-- app/                    # Rute API, template prompt, dan modul analisis sentimen
```

---

## 2. Cara Menjalankan Layanan

### Langkah 1: Menjalankan Backend (Go)
```bash
cd backend
go run ./cmd/api/main.go
```
* Server backend berjalan di `http://localhost:8080`.
* Sistem secara otomatis menjalankan migrasi tabel, mengisi data awal (seeding) untuk 11 sektor dan akun komunitas, serta mengaktifkan penjadwal tugas otomatis.

### Langkah 2: Menjalankan Antarmuka Web (Next.js)
```bash
cd frontend
npm install
npm run dev -- -p 3000
```
* Buka browser pada alamat `http://localhost:3000`.

### Langkah 3: Menjalankan Layanan AI (Python FastAPI)
```bash
cd ai-service
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
* Layanan AI berjalan di `http://localhost:8000`.

---

## 3. Pengujian Sistem Secara Otomatis

Untuk memverifikasi bahwa seluruh endpoint API dari keenam dokumen PRD berfungsi dengan baik, jalankan skrip berikut:
```bash
.\ai-service\venv\Scripts\python.exe verify_scenarios.py
```
Skrip ini akan memvalidasi 11 skenario pengujian utama dengan balikan status HTTP 200 dan data yang lengkap.

---

## 4. Daftar Endpoint REST API

### Sektor dan Rotasi Dana (PRD 4)
* `GET /api/v1/sectors` : Master 11 sektor resmi IDX-IC dan daftar subsektornya.
* `GET /api/v1/sectors/ranking` : Peringkat momentum SMRS seluruh sektor dari yang tertinggi.
* `GET /api/v1/sectors/alerts` : Notifikasi peringatan perpindahan modal antar sektor.
* `GET /api/v1/sectors/{slug}/overview` : Ringkasan sektor, katalis pasar, dan riwayat skor 30 hari.
* `GET /api/v1/sectors/{slug}/news` : Berita industri yang difilter per sektor dan subsektor.

### Komunitas dan Peringatan Divergensi (PRD 3)
* `GET /api/v1/community/posts?ticker={ticker}&sort={hot|top|new|controversial}` : Daftar postingan diskusi dengan filter peringkat HotRank.
* `POST /api/v1/community/posts` : Menambahkan postingan analisis baru (Bullish, Bearish, atau Netral).
* `POST /api/v1/community/posts/{id}/vote` : Memberikan upvote atau downvote berbobot reputasi akun.
* `GET /api/v1/community/{ticker}/sentiment` : Skor konsensus komunitas (CSS), persentase bullish, dan Z-Score volume diskusi.
* `GET /api/v1/community/alerts` : Peringatan benturan arah transaksi ritel vs asing (Euphoria Trap dan Capitulation Reversal).

### Ringkasan Ramah Pemula Berbasis AI (PRD 5)
* `GET /api/v1/stocks/{ticker}/beginner-brief` : Ringkasan 30 detik, indikator lampu status kesehatan, 3 kelebihan vs 3 risiko, dan pertanyaan umum pemula.
* `GET /api/v1/glossary` : Daftar istilah teknis keuangan yang dijelaskan dengan analogi sehari-hari.

### Skor Fundamental Perbankan (PRD 1)
* `GET /api/v1/fundamental-score` : Peringkat kesehatan finansial saham perbankan (skala 0-100).
* `GET /api/v1/fundamental-score/{ticker}` : Rincian nilai dari 7 parameter rasio keuangan bank.

### Aliran Dana Asing (PRD 2)
* `GET /api/v1/foreign-flow/{ticker}` : Data historis aliran dana asing 90 hari dan penanda hari anomali.
* `GET /api/v1/foreign-flow/{ticker}/anomalies` : Riwayat transaksi anomali beserta broker dominan (rentang 14 hari).
* `GET /api/v1/foreign-flow/summary` : Ringkasan saham yang saat ini berstatus transaksi anomali.

### Sentimen Berita dan Kebijakan (PRD 0)
* `GET /api/v1/sentiment/{ticker}` : Skor sentimen perusahaan, dampak kebijakan makro, dan artikel rujukan utama.
* `GET /api/v1/sentiment/{ticker}/articles` : Daftar lengkap artikel berita pendukung untuk verifikasi.

### Peringatan Gabungan 4 Pilar
* `GET /api/v1/composite-alert/{ticker}` : Sintesis gabungan dari data fundamental, berita, arus asing, dan komunitas.
* `GET /api/v1/composite-alert/summary` : Ringkasan status saham untuk kartu pantauan utama pada dashboard.
