# Sector Insight: Platform Analisis Pasar Modal dan Rotasi Sektor IDX

Sector Insight adalah platform analisis pasar modal Indonesia (Bursa Efek Indonesia / IDX) yang menggabungkan data resmi dari Sectors API, analisis statistik, kecerdasan buatan (NLP), dan interaksi komunitas investor.

Platform ini menggunakan pendekatan analisis dari atas ke bawah (top-down analysis):
1. Memetakan kondisi makro dan perputaran dana di 11 sektor resmi IDX-IC.
2. Memeriksa saham-saham penggerak utama di setiap sektor.
3. Melakukan analisis mendalam pada saham perbankan melalui 4 pilar data: fundamental, arus transaksi broker asing, sentimen berita, dan opini komunitas.

---

## 1. Kesesuaian dengan Dokumen Spesifikasi (PRD)

Seluruh kebutuhan dari 6 dokumen spesifikasi (PRD) telah selesai dikembangkan dan terintegrasi penuh:

| No | Dokumen Spesifikasi | Fitur Utama | Status |
|:---:|:---|:---|:---:|
| 1 | PRD hackaton sector.docx | Pengolahan Sentimen Berita dan Kebijakan Makro (Deduplikasi MD5, pembobotan waktu, pemisahan isu emiten vs kebijakan) | Selesai |
| 2 | PRD hackaton sector (1).docx | Skor Kesehatan Fundamental Perbankan (7 parameter: NIM, LDR, ROE, DPK, Pertumbuhan Kredit, Konsistensi Laba, Dividen) | Selesai |
| 3 | PRD hackaton sector (2).docx | Deteksi Anomali Aliran Dana Asing (Baseline 90 hari, Z-Score, identifikasi kategori broker 14 hari) | Selesai |
| 4 | PRD hackaton sector (3).docx | Forum Diskusi Komunitas dan Peringatan Divergensi (Sistem reputasi karma berbobot, HotRank, deteksi jebakan ritel vs asing) | Selesai |
| 5 | PRD hackaton sector (4).docx | Klasifikasi 11 Sektor IDX-IC dan Skor Rotasi Sektor (Heatmap, SMRS Score, kurasi berita sektoral, top movers) | Selesai |
| 6 | PRD hackaton sector (5).docx | Ringkasan Ramah Pemula Berbasis AI (Mode Pemula vs Mode Pro, indikator lampu status, ringkasan 30 detik, 3 kelebihan vs 3 risiko, kamus istilah) | Selesai |

---

## 2. Arsitektur Sistem

Sistem terdiri dari tiga layanan utama yang saling terhubung:

```mermaid
graph TD
    subgraph Sumber Data
        SEC["Sectors API v2 (Berita, Laporan Keuangan, Foreign Flow, Subsektor, Broker)"]
        COM["Interaksi Komunitas (Postingan Diskusi dan Voting)"]
    end

    subgraph Backend Go (Port 8080)
        SMRS["Mesin Rotasi Sektor (SMRS)"]
        FUND["Analisis Fundamental 7 Parameter"]
        FLOW["Detektor Anomali Foreign Flow (Z-Score)"]
        KARMA["Sistem Kredibilitas Komunitas (Karma)"]
        ALERT["Mesin Peringatan 4 Pilar dan Divergensi"]
    end

    subgraph Layanan AI Python (Port 8000)
        NLP_SENT["Klasifikasi Sentimen Berita"]
        NLP_BRIEF["Pembuat Ringkasan Ramah Pemula"]
    end

    subgraph Frontend Next.js (Port 3000)
        UI_SECTORS["Halaman Sektor dan Heatmap (/sectors)"]
        UI_COMMUNITY["Halaman Forum Komunitas (/community)"]
        UI_STOCK["Halaman Detail Saham: Mode Pemula dan Pro (/stock/[ticker])"]
        UI_DASHBOARD["Dashboard Utama dan Peringatan (/dashboard)"]
    end

    SEC --> SMRS
    SEC --> FUND
    SEC --> FLOW
    SEC --> NLP_SENT
    COM --> KARMA
    NLP_SENT --> SMRS
    NLP_SENT --> ALERT
    FUND --> ALERT
    FLOW --> ALERT
    KARMA --> ALERT
    ALERT --> NLP_BRIEF
    SMRS --> UI_SECTORS
    KARMA --> UI_COMMUNITY
    NLP_BRIEF --> UI_STOCK
    ALERT --> UI_DASHBOARD
```

---

## 3. Penjelasan Fitur Utama

### A. Peta Rotasi Sektor dan Heatmap 11 Sektor (PRD 4)
* **Heatmap 11 Sektor IDX-IC**: Menampilkan peta visual kekuatan seluruh sektor resmi di Bursa Efek Indonesia (Energi, Bahan Baku, Keuangan, Teknologi, Infrastruktur, dll.).
* **Sector Rotation and Momentum Score (SMRS)**:
  Skor gabungan berskala 0 hingga 100 yang dihitung dari:
  * Sentimen berita sektor (bobot 35%)
  * Akumulasi aliran dana asing pada emiten utama sektor (bobot 40%)
  * Kinerja pergerakan harga saham sektor (bobot 25%)
* Status sektor dikelompokkan menjadi 5 fase rotasi: Leading (memimpin pasar), Improving (menguat), Neutral (stabil), Weakening (mulai melemah), dan Lagging (tertekan).
* **Halaman Detail Sektor**: Memuat grafik riwayat tren skor 30 hari, daftar subsektor resmi, berita industri terfilter, dan saham penggerak utama (top movers) seperti ADRO, PTBA, ANTM, GOTO, TLKM, dan ASII.

### B. Skor Kesehatan Fundamental Perbankan (PRD 1)
* Penilaian kesehatan finansial bank menggunakan 7 rasio utama:
  1. Margin Bunga Bersih (NIM proxy) - bobot 20%
  2. Rasio Penyaluran Kredit terhadap Simpanan (LDR ideal 80-92%) - bobot 15%
  3. Pertumbuhan Kredit tahunan (YoY) - bobot 15%
  4. Pertumbuhan Dana Pihak Ketiga (DPK YoY) - bobot 10%
  5. Imbal Hasil Ekuitas (ROE) - bobot 15%
  6. Konsistensi Pertumbuhan Laba 8 kuartal terakhir - bobot 15%
  7. Riwayat Pembagian Dividen - bobot 10%
* Menggunakan pemeringkatan persentil relatif terhadap kelompok bank sejenis, dilengkapi grafik radar interaktif untuk membandingkan beberapa bank sekaligus.

### C. Pemantauan Arus Dana Asing dan Anomali Z-Score (PRD 2)
* Mengukur aktivitas beli dan jual investor asing harian selama 90 hari terakhir.
* Menghitung nilai Z-Score statistik untuk mendeteksi transaksi yang tidak wajar:
  * Nilai Z-Score di atas +2.0 atau di bawah -2.0 ditandai sebagai transaksi anomali.
  * Nilai Z-Score di atas +3.0 atau di bawah -3.0 ditandai sebagai anomali ekstrem.
* Menampilkan daftar broker dominan pada hari transaksi anomali (dalam rentang 14 hari) berdasarkan kategori institusi asing atau ritel domestik.

### D. Forum Komunitas dan Peringatan Divergensi Ritel vs Asing (PRD 3)
* **Sistem Voting Berbobot Kredibilitas**: Suara upvote dan downvote diberi bobot berdasarkan rekam jejak pengguna untuk mengurangi spam dan upaya manipulasi opini saham (pom-pom).
* **Pengurutan Diskusi Terhangat (HotRank)**: Menggunakan algoritma gravitasi waktu agar diskusi yang berkualitas dan relevan tetap berada di posisi atas.
* **Deteksi Kontradiksi Pasar (Divergensi)**:
  * **Euphoria Trap**: Memberi peringatan ketika komunitas ritel sangat optimis, padahal investor institusi asing sedang melakukan aksi jual dalam jumlah besar.
  * **Capitulation Reversal**: Menandai peluang ketika komunitas ritel panik menjual, sementara investor institusi asing mulai menampung saham secara bertahap.

### E. Ringkasan Saham Ramah Pemula Berbasis AI (PRD 5)
* **Pilihan Tampilan (Mode Pemula vs Mode Pro)**: Pengguna dapat berpindah kapan saja antara tampilan ringkas ramah pemula dan tampilan data teknis lengkap.
* **Indikator Lampu Status**: Menampilkan status kesehatan saham secara visual (Hijau untuk sehat, Kuning untuk waspada, Merah untuk perhatian).
* **3 Kelebihan Utama vs 3 Risiko Terbesar**: Menyajikan analisis berimbang dalam bahasa yang lugas tanpa istilah akuntansi yang membingungkan.
* **Kamus Istilah Interaktif**: Menampilkan penjelasan dan analogi sehari-hari saat kursor diarahkan ke istilah teknis seperti NIM, LDR, ROE, dan CASA.

### F. Pengolahan Sentimen Berita dan Kebijakan Makro (PRD 0)
* Menghilangkan berita duplikat secara otomatis menggunakan kode unik MD5.
* Memisahkan berita korporasi yang spesifik ke satu perusahaan dari berita regulasi makro (kebijakan Bank Indonesia dan aturan OJK).
* Menampilkan artikel dengan kekuatan sinyal sentimen tertinggi sebagai rujukan verifikasi data.

---

## 4. Struktur Direktori

```
Sector/
|-- PRD_IMPLEMENTATION_TRACKER.md     # Tabel pelacakan seluruh 53 butir pekerjaan
|-- README.md                          # Dokumentasi utama proyek
|-- PRD hackaton sector*.docx          # Berkas spesifikasi resmi PRD
|
`-- sector-insight/
    |-- verify_scenarios.py            # Skrip pengujian otomatis 11 endpoint
    |-- docker-compose.yml             # Konfigurasi container
    |
    |-- backend/                       # Server utama (Go 1.24)
    |   |-- cmd/api/main.go            # Titik masuk aplikasi dan penjadwal tugas
    |   `-- internal/
    |       |-- client/                # Klien Sectors API dan AI Service
    |       |-- database/              # Koneksi database PostgreSQL dan SQLite
    |       |-- handler/               # Handler endpoint REST API
    |       |-- jobs/                  # Penjadwal tugas otomatis (cron scheduler)
    |       |-- model/                 # Definisi tabel database
    |       `-- service/               # Logika perhitungan SMRS, fundamental, komunitas
    |
    |-- ai-service/                    # Layanan NLP (Python FastAPI)
    |   |-- requirements.txt
    |   `-- app/                       # Rute API dan template analisis teks
    |
    `-- frontend/                      # Antarmuka web (Next.js 16)
        |-- app/                       # Rute halaman web (/sectors, /community, /stock, dll.)
        `-- src/
            |-- features/              # Modul antarmuka per fitur
            `-- shared/                # Komponen bersama dan tata letak dasar
```

---

## 5. Cara Menjalankan Aplikasi

Pastikan sistem telah terpasang Go 1.24, Node.js 18+, dan Python 3.10+.

### Langkah 1: Menjalankan Backend (Go)
```bash
cd sector-insight/backend
go run ./cmd/api/main.go
```
* Layanan akan berjalan di `http://localhost:8080`.
* Sistem otomatis menyiapkan tabel database, mengisi data awal untuk 11 sektor dan komunitas, serta mengaktifkan penjadwal tugas harian.

### Langkah 2: Menjalankan Layanan AI (Python FastAPI)
```bash
cd sector-insight/ai-service
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
* Layanan berjalan di `http://localhost:8000`.

### Langkah 3: Menjalankan Antarmuka Web (Next.js)
```bash
cd sector-insight/frontend
npm run dev -- -p 3000
```
* Buka browser dan akses `http://localhost:3000`.

---

## 6. Pengujian dan Verifikasi Otomatis

Proyek ini menyediakan skrip verifikasi otomatis `verify_scenarios.py` untuk menguji kesiapan seluruh endpoint API yang mencakup keenam dokumen PRD:

```bash
cd sector-insight
.\ai-service\venv\Scripts\python.exe verify_scenarios.py
```

Hasil pengujian sistem:
```text
================================================================================
SECTOR INSIGHT: 5-PILLAR & PRD 0 s.d 5 FULL INTEGRATION VERIFICATION
================================================================================

[TESTING] 1. Composite Alert 4-Pillar Summary -> http://localhost:8080/api/v1/composite-alert/summary
  HTTP Status: 200 | SUCCESS
[TESTING] 2. Fundamental 7-Axis Screener -> http://localhost:8080/api/v1/fundamental-score
  HTTP Status: 200 | SUCCESS
[TESTING] 3. Foreign Flow Summary (Z-Score & Anomalies) -> http://localhost:8080/api/v1/foreign-flow/summary
  HTTP Status: 200 | SUCCESS
[TESTING] 4. News Sentiment & Policy Exposure -> http://localhost:8080/api/v1/sentiment/BBRI
  HTTP Status: 200 | SUCCESS
[TESTING] 5. AI Beginner Stock Brief (TL;DR, Traffic Light) -> http://localhost:8080/api/v1/stocks/BBCA/beginner-brief
  HTTP Status: 200 | SUCCESS
[TESTING] 6. Financial Demystification Glossary -> http://localhost:8080/api/v1/glossary
  HTTP Status: 200 | SUCCESS
[TESTING] 7. Community Sentiment & Barometer -> http://localhost:8080/api/v1/community/BBRI/sentiment
  HTTP Status: 200 | SUCCESS
[TESTING] 8. Retail vs Foreign Divergence Alerts -> http://localhost:8080/api/v1/community/alerts
  HTTP Status: 200 | SUCCESS
[TESTING] 9. Community Feed with Weighted Karma & HotRank -> http://localhost:8080/api/v1/community/posts?ticker=BBRI&sort=hot
  HTTP Status: 200 | SUCCESS
[TESTING] 10. 11 IDX-IC Sector Ranking (SMRS Leaderboard) -> http://localhost:8080/api/v1/sectors/ranking
  HTTP Status: 200 | SUCCESS
[TESTING] 11. Sector Rotation Surge & Smart Money Exit Alerts -> http://localhost:8080/api/v1/sectors/alerts
  HTTP Status: 200 | SUCCESS

================================================================================
VERIFICATION SUMMARY: 11/11 ENDPOINTS PASSED (100% SUCCESS)
================================================================================
```

---

## 7. Ringkasan Endpoint API

| Modul | Metode | Alamat Endpoint | Keterangan |
| :--- | :---: | :--- | :--- |
| **Sektor (PRD 4)** | GET | `/api/v1/sectors` | Daftar 11 sektor resmi IDX-IC dan subsektor |
| | GET | `/api/v1/sectors/ranking` | Peringkat momentum SMRS seluruh sektor |
| | GET | `/api/v1/sectors/alerts` | Peringatan rotasi modal antar sektor |
| | GET | `/api/v1/sectors/{slug}/overview` | Ringkasan sektor dan riwayat skor 30 hari |
| | GET | `/api/v1/sectors/{slug}/news` | Berita yang difilter khusus sektor terkait |
| **Komunitas (PRD 3)** | GET | `/api/v1/community/posts` | Daftar postingan diskusi dengan filter peringkat |
| | POST | `/api/v1/community/posts` | Menambahkan postingan analisis baru |
| | POST | `/api/v1/community/posts/{id}/vote` | Memberikan upvote atau downvote berbobot |
| | GET | `/api/v1/community/{ticker}/sentiment` | Rasio bullish vs bearish dan skor konsensus ritel |
| | GET | `/api/v1/community/alerts` | Peringatan perbedaan arah transaksi ritel vs asing |
| **Pemula (PRD 5)** | GET | `/api/v1/stocks/{ticker}/beginner-brief` | Ringkasan 30 detik, lampu status, dan 3 pro vs 3 kontra |
| | GET | `/api/v1/glossary` | Daftar kamus istilah keuangan dengan analogi awam |
| **Fundamental (PRD 1)** | GET | `/api/v1/fundamental-score` | Peringkat kesehatan fundamental saham perbankan |
| | GET | `/api/v1/fundamental-score/{ticker}` | Rincian nilai dari 7 parameter fundamental |
| **Foreign Flow (PRD 2)** | GET | `/api/v1/foreign-flow/{ticker}` | Data historis arus dana asing 90 hari |
| | GET | `/api/v1/foreign-flow/summary` | Daftar saham yang mengalami transaksi anomali |
| **Sentimen (PRD 0)** | GET | `/api/v1/sentiment/{ticker}` | Nilai sentimen perusahaan dan dampak kebijakan makro |
| **Peringatan 4 Pilar** | GET | `/api/v1/composite-alert/summary` | Ringkasan status gabungan 4 pilar seluruh saham |

---

## 8. Ketentuan dan Batasan Sistem

Aplikasi ini dibangun dengan mengikuti ketentuan kepatuhan pasar modal dan aturan kompetisi:
* **Tujuan Informasi dan Edukasi**: Seluruh skor, label status, dan peringatan disajikan sebagai bahan pertimbangan analisis dan edukasi, bukan merupakan ajakan membeli atau menjual instrumen investasi tertentu.
* **Tanpa Eksekusi Otomatis**: Sistem tidak menyediakan fitur jual beli saham otomatis untuk mematuhi regulasi bursa.
* **Berdasarkan Data Riil**: Seluruh ringkasan yang dihasilkan modul AI didasarkan langsung pada data faktual platform tanpa asumsi yang tidak berdasar.
