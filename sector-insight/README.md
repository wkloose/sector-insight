# Sector Intel: Platform Analisis Pasar Modal dan Rotasi Sektor IDX

Sector Intel adalah platform analitik pasar modal yang dirancang untuk menganalisis data saham di Bursa Efek Indonesia (IDX) menggunakan data resmi dari Sectors API v2, kalkulasi kuantitatif, dan pemrosesan bahasa alami (NLP).

Aplikasi ini mencakup seluruh kebutuhan dari 6 dokumen spesifikasi (PRD) dan fitur inovasi komparasi analitis:
1. **Fitur 1 (PRD 0)**: Pengolahan sentimen berita dan kebijakan makro (deduplikasi MD5, pembobotan waktu, pemisahan isu emiten vs kebijakan).
2. **Fitur 2 (PRD 1)**: Skor kesehatan fundamental perbankan berdasarkan 7 parameter spesifik (NIM, LDR, pertumbuhan kredit, DPK, ROE, konsistensi laba, dan dividen).
3. **Fitur 3 (PRD 2)**: Pemantauan aliran dana asing, deteksi anomali statistik Z-Score 90 hari, dan pemetaan broker 14 hari.
4. **Fitur 4 (PRD 3)**: Forum diskusi komunitas dengan sistem reputasi karma berbobot, algoritma HotRank, dan peringatan divergensi ritel vs asing.
5. **Fitur 5 (PRD 4)**: Pemetaan 11 sektor resmi IDX-IC dan 33 subsektor, visualisasi heatmap rotasi sektor, dan skor momentum SMRS.
6. **Fitur 6 (PRD 5)**: Ringkasan ramah pemula berbasis AI, indikator lampu status, ringkasan 30 detik, 3 kelebihan vs 3 risiko, dan kamus istilah interaktif.
7. **Fitur Inovasi (Komparasi Saham Multi-Pilar)**: Komparasi saham head-to-head 2-3 emiten dengan 6 Model Kuantitatif Berwawasan Baru (CIS, Value-Momentum Convergence, ICL, RAAR, AGP, MoS), radar perbandingan, dan laporan rekomendasi alokasi portofolio.

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
|   |   |-- entities/           # Entitas domain (stock, broker)
|   |   |-- features/           # Modul fitur:
|   |   |   |-- compare/        # Modul komparasi saham head-to-head & insight engine:
|   |   |   |   |-- components/ # StockComparisonHub, InsightDashboard, ComparisonVerdictReport, StockSelectorModal
|   |   |   |   |-- lib/        # insightEngine.ts (Kalkulasi 6 model kuantitatif: CIS, Convergence, ICL, RAAR, AGP, MoS)
|   |   |   |   `-- types/      # Tipe data profil komparasi saham dan metrik analitis
|   |   |   |-- beginner-brief/ # Mode Pemula vs Pro, lampu status, 3 kelebihan vs 3 risiko, kamus istilah
|   |   |   |-- community/      # Forum diskusi, voting karma, barometer sentimen, alert divergensi
|   |   |   |-- sectors/        # Heatmap 11 sektor IDX-IC, leaderboard, skor SMRS, drill-down
|   |   |   |-- composite-alert/# Mesin peringatan gabungan 4 pilar
|   |   |   |-- foreign-flow/   # Deteksi anomali arus dana asing, aliran 11 sektor, dan data broker
|   |   |   `-- fundamental/    # Screener fundamental dan grafik radar perbankan
|   |   `-- shared/             # Komponen antarmuka bersama, UI tokens, dan navigasi
|   `-- package.json
|
|-- backend/                    # Server backend utama (Go 1.24)
|   |-- cmd/api/main.go         # Titik masuk server REST API dan penjadwal cron
|   |-- sector_insight.db       # Database SQLite lokal terintegrasi (pre-populated)
|   `-- internal/
|       |-- config/             # Pengaturan konfigurasi aplikasi
|       |-- database/           # Koneksi database PostgreSQL dan SQLite fallback
|       |-- model/              # Skema tabel database (11 sektor, komunitas, fundamental, berita, quotes)
|       |-- client/
|       |   |-- sectors/        # Klien resmi Sectors API v2
|       |   |-- ai/             # Klien komunikasi ke AI Service
|       |   `-- idx/            # Semesta 941 saham IDX & provider metadata resmi
|       |-- jobs/               # Penjadwal tugas otomatis harian
|       |-- service/            # Logika perhitungan SMRS, foreign flow, fundamental, komunitas
|       `-- handler/            # Rute endpoint REST API (market, foreignflow, sectors, dll.)
|
`-- ai-service/                 # Layanan NLP & Komparasi Kuantitatif (Python FastAPI)
    |-- requirements.txt
    `-- app/
        |-- api/routes.py       # Endpoint analisis sentimen dan komparasi saham (/compare-stocks)
        |-- models/schemas.py   # Skema request & response komparasi multi-pilar
        `-- services/
            |-- analyzer.py     # Layanan pemrosesan teks NLP
            `-- prompts.py      # Template prompt analitis komparasi 6 model kuantitatif
```

---

## 2. Cara Menjalankan Layanan

Tersedia dua metode untuk menjalankan seluruh layanan sistem:

### Metode 1: Menggunakan Docker Compose (Satu Perintah - Direkomendasikan)

Pastikan [Docker Desktop](https://www.docker.com/products/docker-desktop/) aktif di perangkat Anda.

1. Dari direktori ini (`sector-insight`), jalankan:
   ```bash
   docker-compose up --build
   ```
2. Docker akan otomatis menyalakan 4 container:
   * **PostgreSQL Database**: Port `5432`
   * **Backend Go**: Port `8080` (`http://localhost:8080`)
   * **Layanan AI Python**: Port `8000` (`http://localhost:8000`)
   * **Frontend Next.js**: Port `3000` (`http://localhost:3000`)
3. Buka browser pada alamat `http://localhost:3000`.

---

### Metode 2: Menjalankan Secara Manual (Tanpa Docker)

Pastikan telah terpasang **Go 1.24+**, **Python 3.10+**, dan **Node.js 18+ & npm**.

#### Langkah 1: Menjalankan Backend (Go - Port 8080)
```bash
cd backend
go run ./cmd/api/main.go
```
* Server backend berjalan di `http://localhost:8080`.
* **Koneksi Database Otomatis**: Jika PostgreSQL lokal tidak aktif, backend otomatis melakukan fallback ke database SQLite lokal terintegrasi (`sector_insight.db`) yang telah memuat 941 saham IDX dan data historis siap pakai.

#### Langkah 2: Menjalankan Layanan AI (Python FastAPI - Port 8000)
```bash
cd ai-service

# Buat virtual environment & install dependensi:
# Windows (PowerShell):
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS:
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Layanan AI berjalan di `http://localhost:8000`.

#### Langkah 3: Menjalankan Antarmuka Web (Next.js - Port 3000)
```bash
cd frontend
npm install
npm run dev -- -p 3000
```
* Buka browser pada alamat `http://localhost:3000`.

---

### Panduan Mendapatkan API Key (Opsional - Mode Data Live)

> **Catatan**: Aplikasi dapat langsung dijalankan tanpa API Key karena seluruh data telah terisi di SQLite bawaan (`sector_insight.db`). Pengisian API Key bersifat opsional untuk mengaktifkan pembaruan data live.

1. **Sectors API Key**:
   * Kunjungi: **[https://sectors.app/](https://sectors.app/)**
   * Buat key di: **[https://sectors.app/api-keys](https://sectors.app/api-keys)**
   * Masukkan ke file `backend/.env`: `SECTORS_API_KEY=sectors_live_xxxx...`
2. **Google Gemini API Key (Gratis)**:
   * Kunjungi: **[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
   * Klik **Create API Key**
   * Masukkan ke file `ai-service/.env`: `GEMINI_API_KEY=AIzaSyxxxx...`
3. **Frontend (Opsional)**:
   * Masukkan ke file `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8080`

---

## 3. Pengujian Sistem Secara Otomatis

Untuk memverifikasi bahwa seluruh endpoint API dari keenam dokumen PRD berfungsi dengan baik, jalankan skrip berikut:
```bash
.\ai-service\venv\Scripts\python.exe verify_scenarios.py
```
Skrip ini akan memvalidasi 11 skenario pengujian utama dengan balikan status HTTP 200 dan data yang lengkap.

---

## 4. Daftar Endpoint REST API

### Komparasi Saham & Model Kuantitatif
* `POST /api/v1/compare-stocks` : Analisis komparasi 2-3 emiten dengan 6 model analitis kuantitatif (*CIS*, *Convergence*, *ICL*, *RAAR*, *AGP*, *MoS*).
* `GET /api/v1/compare/profile` : Data profil perbandingan saham multi-pilar (fundamental, flow, sentimen).
* `POST /api/v1/compare/ai` : Orkestrasi perbandingan emiten terstruktur.

### Pasar & Semesta Saham IDX
* `GET /api/v1/market/summary` : Ringkasan kondisi pasar IDX, IHSG real-time, dan status pasar.
* `GET /api/v1/stocks/quotes` : Daftar harga dan pergerakan emiten teraktif.
* `GET /api/v1/stocks/universe` : Semesta 941 saham resmi Bursa Efek Indonesia.
* `GET /api/v1/stocks/sectors` : Daftar 11 sektor IDX dan jumlah emiten masing-masing.

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
* `GET /api/v1/foreign-flow/market` : Ringkasan perputaran arus dana asing 11 sektor nasional.
* `GET /api/v1/foreign-flow/stocks` : Peringkat akumulasi & distribusi dana asing seluruh saham IDX.
* `GET /api/v1/foreign-flow/{ticker}` : Data historis aliran dana asing 90 hari dan penanda hari anomali.
* `GET /api/v1/foreign-flow/{ticker}/anomalies` : Riwayat transaksi anomali beserta broker dominan (rentang 14 hari).
* `GET /api/v1/foreign-flow/summary` : Ringkasan saham yang saat ini berstatus transaksi anomali.

### Sentimen Berita dan Kebijakan (PRD 0)
* `GET /api/v1/sentiment/{ticker}` : Skor sentimen perusahaan, dampak kebijakan makro, dan artikel rujukan utama.
* `GET /api/v1/sentiment/{ticker}/articles` : Daftar lengkap artikel berita pendukung untuk verifikasi.

### Peringatan Gabungan 4 Pilar
* `GET /api/v1/composite-alert/{ticker}` : Sintesis gabungan dari data fundamental, berita, arus asing, dan komunitas.
* `GET /api/v1/composite-alert/summary` : Ringkasan status saham untuk kartu pantauan utama pada dashboard.
