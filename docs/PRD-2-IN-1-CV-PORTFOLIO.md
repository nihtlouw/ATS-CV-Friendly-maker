# PRD — Plainly: ATS CV Builder & Web Portfolio Generator

**Status:** usulan produk dan arsitektur, belum merupakan implementasi SaaS.  
**Tanggal:** 17 November 2026 · **Versi:** 1.0  
**Audiens:** Product, Design, Engineering, QA, dan Growth.

> Isi sekali, tampil profesional di dua tempat: CV yang mudah dibaca mesin dan portofolio yang menarik bagi manusia.

## Ringkasan keputusan

| Area | Keputusan yang diusulkan |
|---|---|
| Pengguna awal | Fresh graduate dan profesional digital dengan pengalaman 0–7 tahun; developer, desainer, product, marketing, dan operations |
| Pasar/bahasa awal | Indonesia; UI Bahasa Indonesia, konten CV Bahasa Indonesia atau Inggris |
| Nilai utama | Satu profil terstruktur menghasilkan CV berbasis teks dan website portofolio tanpa menyalin ulang konten |
| MVP | Editor terpadu, PDF ATS, impor PDF berbasis teks, skor kesiapan, pencocokan JD, AI dengan persetujuan, tiga tema web, subdomain, publish/unpublish, kontak, analytics dasar |
| Di luar MVP | Ekspor DOCX, custom domain, OCR, kolaborasi tim, otomasi lamaran, impor LinkedIn langsung, dan marketplace template |
| Prinsip privasi | Draft privat; hanya snapshot yang disetujui pengguna yang dipublikasikan |
| Prinsip ATS | Tidak menjanjikan “100% lolos ATS”; skor adalah indikator internal, bukan skor dari sistem perekrut |
| Strategi pengembangan | Pertahankan komponen React yang berguna; bangun layanan SaaS bertahap, bukan menulis ulang seluruh editor |

---

## 1. Product Overview & Value Proposition

### 1.1 Masalah pengguna

- CV, profil profesional, dan website sering menyimpan versi informasi yang berbeda. Pembaruan pengalaman harus dikerjakan berulang.
- Template visual yang bagus belum tentu memiliki urutan teks yang jelas ketika diparsing.
- Pengguna kesulitan menulis kontribusi yang spesifik, berbasis tindakan, dan relevan dengan lowongan.
- Membuat website memerlukan waktu, pengetahuan teknis, hosting, dan pemeliharaan.
- Fresh graduate belum tentu punya pengalaman kerja formal; proyek, organisasi, dan pendidikan perlu diperlakukan sebagai bukti kompetensi yang sah.

### 1.2 Value proposition

**Plainly adalah workspace identitas profesional, bukan sekadar editor dokumen.** Profil terpusat menjadi sumber fakta; renderer CV dan web menggunakan presentasi berbeda atas fakta yang sama.

- **Hemat waktu:** ubah jabatan, proyek, atau skill sekali; kedua preview langsung mengikuti.
- **Dua kebutuhan, dua renderer:** dokumen satu kolom yang konservatif untuk lamaran; website responsif untuk storytelling dan media.
- **Kendali fakta:** AI hanya menyarankan. Pengguna memeriksa perubahan dan tidak diarahkan mengarang metrik atau pengalaman.
- **Kendali publikasi:** menyimpan draft tidak otomatis mengubah website yang sudah publik.
- **Portabilitas:** ekspor data JSON dan hapus akun tersedia, termasuk untuk paket gratis.

### 1.3 Posisi kompetitif

Tabel ini menjelaskan positioning yang dituju, bukan audit fitur atau harga kompetitor terkini.

| Alternatif | Alasan pengguna memilihnya | Diferensiasi yang dituju Plainly |
|---|---|---|
| Canva / editor desain | Kebebasan visual dan kemudahan membuat dokumen | Struktur data semantik, layout ATS terbatas, dan website dari sumber data yang sama |
| LinkedIn | Jejaring profesional dan profil dalam platform | Kendali presentasi, varian CV per lowongan, dan identitas web milik pengguna |
| Notion / page builder | Halaman fleksibel dan cepat dibuat | Alur khusus karier: skor kesiapan, pemetaan JD, ekspor CV, serta sinkronisasi field |
| Resume builder tradisional | Template dan bantuan menulis CV | Portofolio proyek visual yang terhubung ke fakta di CV tanpa duplikasi |

### 1.4 Tujuan dan indikator keberhasilan

Hipotesis berikut divalidasi melalui pilot; bukan klaim performa yang sudah dicapai.

| Indikator | Definisi | Target awal pilot |
|---|---|---|
| Aktivasi 7 hari | Pengguna baru mengunduh PDF dan memublikasikan portofolio dalam 7 hari | ≥30% |
| Time to first value | Median waktu dari mulai onboarding sampai CV pertama siap diunduh, pengguna dengan data siap | ≤15 menit |
| Keandalan ekspor | Job PDF berhasil / seluruh job valid | ≥99% |
| Keandalan publish | Job publish berhasil / seluruh job valid | ≥99% |
| Retensi 30 hari | Pengguna teraktivasi kembali mengedit, mengekspor, atau publish dalam 30 hari | ≥20% |
| Keamanan | Insiden akses profil lintas pemilik pada pengujian otorisasi | 0 |

Jangan mengoptimalkan jumlah klik semata. Ukur keberhasilan menghasilkan artefak, bukan panjang sesi editor. Konversi Pro dan biaya per pengguna aktif dievaluasi setelah aktivasi stabil.

## 2. User Flow & Experience (UX)

### 2.1 Alur end-to-end

1. **Mulai tanpa hambatan.** Pengguna boleh mencoba editor tanpa akun. Saat menyimpan ke cloud/publish, tawarkan login email magic link atau OAuth. Data lokal tidak dikirim sebelum pengguna menyetujui migrasi.
2. **Pilih tujuan dan bahasa.** Target posisi, tingkat pengalaman, bahasa konten, serta mulai kosong/contoh/impor. Pertanyaan dapat dilewati.
3. **Impor opsional.** Unggah PDF berbasis teks atau tempel teks CV. Tampilkan hasil ekstraksi per field dengan sorotan bagian ambigu. Pengguna meninjau sebelum data digabung, bukan menimpa profil secara diam-diam.
4. **Lengkapi profil inti.** Identitas, ringkasan, pengalaman, pendidikan, skill, proyek, sertifikasi. Fresh graduate dapat mendahulukan proyek/organisasi. Semua bagian selain informasi minimum bisa disembunyikan.
5. **Tambahkan visual opsional.** Sampul proyek, galeri, warna, tautan demo, deskripsi studi kasus. Langkah ini tidak menghalangi ekspor CV.
6. **Pilih presentasi.** Template CV satu kolom, ukuran A4/Letter, tipografi; tema website minimalis/kreatif/developer. Template tidak menyimpan salinan konten.
7. **Periksa kualitas.** Tinjau struktur, field kosong, tautan, keterbacaan teks, dan kecocokan keyword JD. Penjelasan skor dan perbaikannya dapat diklik.
8. **Bantu penulisan dengan AI.** Pilih bullet atau paste JD; tampilkan usulan berdampingan, alasan perubahan, dan fakta yang perlu dikonfirmasi. Pengguna menerima per perubahan atau membatalkan semuanya.
9. **Unduh.** Generate PDF dari revisi tertentu, tampilkan preview hasil final, lalu unduh. Tidak harus memublikasikan website.
10. **Publish.** Pilih slug, tinjau field publik, pratinjau mobile, konfirmasi indeks mesin pencari, lalu publish snapshot. Tampilkan URL dan status deployment; domain pada dokumen ini hanya contoh.
11. **Pemeliharaan.** Edit → autosave draft → preview berubah → label “Perubahan belum dipublikasikan” → publish ulang. Sediakan unpublish dan pemulihan versi terakhir.

**LinkedIn:** MVP menyediakan field URL dan impor dari PDF yang diunduh pengguna secara sah atau teks yang mereka salin. Jangan melakukan scraping atau menjanjikan impor seluruh riwayat melalui OAuth. Integrasi langsung hanya Phase 2 jika akses API dan izinnya benar-benar tersedia.

**PDF hasil scan:** deteksi halaman tanpa teks dan beri instruksi unggah PDF berbasis teks atau input manual. OCR menjadi fase lanjutan dengan peninjauan hasil wajib.

### 2.2 Dashboard editor terpadu

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ Plainly  / Profil utama    Tersimpan • 10.42        Unduh PDF   Publish    │
├─────────────┬────────────────────────┬────────────────────────────────────┤
│ Profil      │ Form bagian terpilih   │ [ ATS CV ] [ Web Portfolio ]       │
│ Pengalaman  │                        │                                    │
│ Pendidikan  │ Field teks bersama     │ Preview dari revision yang sama    │
│ Proyek      │ Badge: CV + Web        │ CV: halaman A4 / Letter             │
│ Skill       │                        │ Web: desktop / mobile               │
│ Media web   │ Field khusus visual    │                                    │
│ Desain      │ Badge: Web saja        │ Peringatan overflow / field publik │
│ Skor & JD   │                        │                                    │
├─────────────┴────────────────────────┴────────────────────────────────────┤
│ Draft revisi 12 · Website publik revisi 10 · 2 perubahan belum dipublish  │
└───────────────────────────────────────────────────────────────────────────┘
```

- Pada mobile, form dan preview menjadi tab terpisah; navigasi bagian memakai sheet/dropdown. Aksi utama tidak menutupi input.
- Pisahkan **Konten bersama**, **Media & cerita web**, dan **Desain output**. Jangan menyediakan dua form untuk nama atau jabatan yang sama.
- Gunakan badge “CV + Web”, “CV saja”, “Web saja”, dan “Privat” di dekat field. Nilai default aman: nomor telepon tidak dipublikasikan.
- Proyek memiliki ringkasan singkat untuk CV dan detail studi kasus untuk web. Keduanya memiliki tujuan berbeda, bukan duplikasi seluruh proyek.
- Preferensi visibilitas per output diperbolehkan; menyembunyikan bukan menghapus data.
- Preview segera diperbarui dari state lokal; autosave server debounced sekitar 800 ms. Status harus membedakan “Menyimpan”, “Tersimpan di cloud”, “Offline”, dan “Gagal disimpan”.
- Gunakan optimistic concurrency: konflik revisi membuka pilihan tinjau/gabung, bukan last-write-wins tanpa peringatan.
- Target aksesibilitas WCAG 2.2 AA: label form, navigasi keyboard, fokus terlihat, kontras memadai, error terhubung ke field, dan dukungan reduced motion. Pencapaian perlu diaudit, bukan diasumsikan.

## 3. Daftar Fitur: MVP & Phase 2

### 3.1 Scope prioritas

| Area | MVP — must have | Phase 2 |
|---|---|---|
| Akun & profil | Login, draft cloud, ekspor JSON, hapus akun, migrasi lokal dengan persetujuan | Beberapa bahasa profil, kolaborasi mentor/tim |
| Input | Form inti, proyek/organisasi, paste teks, impor PDF teks dengan review | OCR, impor DOCX, integrasi resmi LinkedIn bila tersedia |
| CV | 2 template satu kolom, A4/Letter, urutan bagian, preview PDF final, PDF berbasis teks | DOCX semantik, varian layout tambahan yang lulus pengujian |
| Analisis ATS | Skor kesiapan berbasis aturan transparan, pemeriksaan kelengkapan dan bullet | Evaluasi tambahan berdasar korpus dokumen uji |
| Job matching | Paste JD, keyword matched/missing, pemisahan skor JD dari skor struktur | Perbandingan beberapa lowongan dan histori lamaran |
| AI | Rewrite bullet, usulan penyesuaian JD, review diff, kuota dan persetujuan | Terjemahan terkontrol, coaching dan varian CV tersimpan |
| Web generator | Tema minimalis, kreatif, developer-style; responsif; hero, pengalaman, proyek, kontak | Blog, blok tambahan, integrasi eksternal terkurasi |
| Hosting | Satu slug unik/subdomain, publish/unpublish, snapshot, HTTPS | Custom domain dan redirect slug lama |
| Analytics | Page views dan klik CTA agregat harian; definisi dan filter bot dijelaskan | Referrer agregat dan event proyek lanjutan |
| Kontak | Form relay email, validasi, honeypot, rate limit, tidak membeberkan email pemilik | Proteksi spam tambahan, integrasi CRM |
| SEO | Title/meta description, canonical, Open Graph, robots, sitemap URL publik yang opt-in | Pengaturan SEO lanjutan per proyek |
| Monetisasi | Entitlement Free/Pro, checkout hosted, webhook tervalidasi, kuota | Paket kampus/bootcamp dan penagihan tim |

### 3.2 Skor ATS dan pencocokan JD

Dua indikator harus ditampilkan terpisah agar pengguna tidak menyamakan struktur dokumen dengan peluang diterima.

- **Skor kesiapan internal (0–100):** struktur/kelengkapan 30, keterbacaan format 25, kualitas bullet 25, kebersihan/konsistensi data 20. Setiap aturan memiliki ID, bobot, alasan, dan versi. Bobot dapat dikalibrasi setelah uji pengguna; tidak diterjemahkan menjadi probabilitas lolos.
- **Kecocokan JD:** proporsi istilah relevan yang muncul pada teks CV yang benar-benar diekspor; normalisasi huruf, alias skill terkurasi, dan bahasa yang didukung. Hindari menghitung kata umum sebagai skill. Tanpa JD tampilkan “Belum dianalisis”, bukan 0%.
- Jangan menilai berdasarkan foto, gender, usia, alamat lengkap, atau atribut terlindungi. Tidak semua profesi membutuhkan angka; bullet tanpa metrik tidak otomatis dianggap buruk.
- Keyword yang belum dimiliki pengguna ditandai sebagai gap, bukan otomatis disisipkan sebagai klaim kompetensi.
- Rule engine yang ada di repo menjadi baseline. Perubahan formula harus diuji dan diberi versi; hasil lama tidak boleh dianggap sebanding tanpa versi.

### 3.3 Smart Assistant: perilaku wajib

- Input: satu bagian profil atau teks CV yang dipilih, bahasa target, dan JD opsional. Jangan mengirim seluruh profil/media jika tidak diperlukan.
- Output JSON tervalidasi: usulan teks, sumber field, alasan, dan pertanyaan klarifikasi.
- Pertahankan nama perusahaan, tanggal, jabatan, dan metrik kecuali pengguna meminta koreksi faktual secara eksplisit.
- Jangan mengarang hasil seperti “menaikkan penjualan 40%”. Jika dampak belum diketahui, tanyakan kepada pengguna tanpa memasukkan placeholder ke CV final.
- JD dan teks impor adalah data tidak tepercaya, bukan instruksi sistem. AI tidak diberi tool akses akun/publish.
- Pengguna harus menyetujui perubahan. Aksi “Sesuaikan CV” membuat draft varian berbasis profil dan patch, tidak mengganti profil inti atau website publik secara otomatis.
- Kegagalan AI tidak boleh memblokir edit, ekspor, atau publish manual.

### 3.4 Batas rilis

DOCX tetap merupakan target produk, tetapi **bukan janji MVP**. Jika menjadi syarat peluncuran, tambahkan pekerjaan generator dan QA khusus; jangan mengekspor HTML lalu mengganti ekstensinya menjadi `.docx`. MVP tidak mencakup job board, pengiriman lamaran otomatis, marketplace, maupun HTML/JavaScript bebas dari pengguna.

## 4. Arsitektur Sistem & Struktur Data

### 4.1 Single Source of Truth

Prinsipnya: **satu sumber fakta, banyak proyeksi dan snapshot**, bukan satu dokumen publik yang selalu berubah setiap ketikan.

- `Profile` menyimpan fakta dan revisi terkini.
- `CVVariant` menyimpan referensi revisi dasar, pilihan bagian, serta patch teks yang disetujui. Tidak otomatis ditulis balik ke profil inti.
- `CVSettings` dan `PortfolioSettings` hanya menyimpan presentasi serta kebijakan visibilitas.
- `Publication` menyimpan snapshot publik yang sudah disaring, versi template, dan revisi asal. Tidak memuat metadata privat.
- `Artifact` PDF/DOCX mengacu pada revisi tertentu dan versi renderer agar dapat direproduksi.

Contoh berikut adalah JSON konseptual, bukan schema produksi atau kredensial. Semua nama/domain adalah contoh.

```json
{
  "schemaVersion": 1,
  "id": "profile-demo-01",
  "ownerId": "user-demo-01",
  "revision": 12,
  "locale": "id-ID",
  "basics": {
    "name": "Nadia Putri",
    "headline": "Frontend Developer",
    "email": "nadia@example.com",
    "phone": "+62 812 0000 0000",
    "location": "Bekasi, Indonesia",
    "summary": "Frontend developer yang membangun antarmuka web aksesibel.",
    "links": [{ "kind": "github", "url": "https://github.com/example" }]
  },
  "experience": [
    {
      "id": "exp-01",
      "role": "Frontend Developer",
      "organization": "Studio Contoh",
      "startDate": "2024-07",
      "endDate": null,
      "bullets": [
        { "id": "bullet-01", "text": "Membangun komponen formulir yang digunakan pada tiga alur onboarding." }
      ]
    }
  ],
  "education": [
    { "id": "edu-01", "institution": "Universitas Contoh", "qualification": "S1 Informatika", "graduationDate": "2024-06" }
  ],
  "skills": [{ "id": "skill-01", "name": "React", "category": "Frontend" }],
  "projects": [
    {
      "id": "project-01",
      "name": "Aplikasi Pencatatan Keuangan",
      "summary": "Mengembangkan dashboard anggaran dengan React dan PostgreSQL.",
      "technologies": ["React", "PostgreSQL"],
      "links": [{ "label": "Demo", "url": "https://example.com/demo" }],
      "caseStudy": {
        "problem": "Pengguna sulit melacak pengeluaran bulanan.",
        "approach": "Menyederhanakan input transaksi dan kategori.",
        "outcome": "Prototipe selesai diuji secara internal."
      },
      "media": [{ "assetId": "asset-01", "alt": "Dashboard ringkasan anggaran" }],
      "visibility": { "cv": true, "web": true }
    }
  ],
  "cvSettings": {
    "templateId": "ats-classic-v1",
    "paper": "a4",
    "sectionOrder": ["summary", "skills", "experience", "projects", "education"],
    "showEmail": true,
    "showPhone": true,
    "projectTextSource": "summary"
  },
  "portfolioSettings": {
    "themeId": "minimal-v1",
    "slug": "nadia-putri",
    "seo": { "title": "Nadia Putri — Frontend Developer", "indexable": false },
    "publicFields": {
      "name": true,
      "headline": true,
      "location": true,
      "email": false,
      "phone": false
    },
    "contactFormEnabled": true
  },
  "publication": {
    "status": "published",
    "publishedRevision": 10,
    "snapshotId": "snapshot-10",
    "url": "https://nadia-putri.app.example"
  }
}
```

**Proyeksi:** CV membaca ringkasan proyek dan fakta pengalaman menjadi heading/paragraf/bullet; web membaca fakta yang sama ditambah `caseStudy` dan `media`. Email untuk relay kontak tidak masuk ke HTML atau payload halaman publik bila `publicFields.email` bernilai false. Field lain juga harus masuk allowlist publik eksplisit; contoh kebijakan di atas bukan daftar lengkap untuk implementasi.

### 4.2 Model relasional produksi

| Entitas | Fungsi / constraint penting |
|---|---|
| `users`, `profiles` | Pemilik profil; payload JSONB tervalidasi, schema version, revision integer, timestamps |
| `profile_revisions` | Snapshot privat berjangka untuk pemulihan dan artefak; owner dan profile FK |
| `cv_variants` | Base revision + patch tervalidasi + settings; tidak mengubah sumber fakta diam-diam |
| `assets` | Owner, storage key, MIME terverifikasi, ukuran, dimensi, status scan; bukan URL unggahan arbitrer |
| `sites` | Profile FK, slug lowercase unik atomik, reserved-name guard, status, active publication FK |
| `publications` | Snapshot publik tersaring immutable, template version, revision, status job |
| `artifacts` | Profile/revision, renderer version, jenis, storage key, expiry, status |
| `ai_jobs`, `usage_ledger` | Idempotency key, kuota reserved/settled/refunded, model, token/cost; hindari isi PII di log |
| `subscriptions` | Provider customer/subscription ID, entitlement server-side, status dan periode |
| `analytics_daily` | Publication/site, tanggal, tipe event, jumlah agregat; minimalkan data pengunjung |
| `contact_messages` | Penerima, status relay, metadata antispam minimum, expiry; akses hanya pemilik/admin berizin |

JSONB mempercepat evolusi profil; auth, slug, billing, status, dan relasi penting tetap memakai kolom/constraint relasional. Semua endpoint privat memeriksa ownership dan RLS sebagai lapisan tambahan. Gunakan schema validation dan migrasi eksplisit, bukan cast JSON langsung ke TypeScript.

### 4.3 Komponen dan aliran data

```text
Browser editor React
  ├─ edit → validasi → autosave + expectedRevision → API → PostgreSQL
  ├─ preview CV/Web lokal dari state yang sama (belum publik)
  ├─ ekspor → API → queue → worker PDF → private object storage → signed URL
  ├─ AI → API → reserve quota → provider → validate → review diff → apply
  └─ publish → API → validate → public snapshot → activate pointer → invalidate cache

Pengunjung → DNS wildcard + TLS → host resolver → active public snapshot → SSR/ISR + CDN
Form kontak → API server-side → antispam/rate limit → queue email relay
Event analytics → endpoint terbatasi → agregasi → dashboard pemilik
```

API dan frontend menggunakan origin yang sama atau proxy relatif. Secret AI, storage, pembayaran, dan email hanya di server. Layanan dibangun sebagai modular monolith dengan satu worker terpisah; microservices belum diperlukan.

### 4.4 Mekanisme PDF ATS

1. API menerima `profileId`, revision, settings, dan idempotency key; verifikasi ownership dan limit.
2. Proyeksikan konten menjadi model CV semantik. Buang media web, komentar AI, dan field yang disembunyikan.
3. Render HTML/CSS cetak terkontrol melalui Playwright/Chromium di worker. Gunakan teks nyata dalam DOM, font lokal yang dapat di-embed, heading standar, urutan satu kolom, dan tautan teks. Jangan memakai screenshot/canvas sebagai isi PDF.
4. Tentukan ukuran halaman, margin, font, line-height, dan aturan page-break. Heading tidak boleh menggantung sendirian; pengalaman panjang boleh berlanjut antarhalaman tanpa terpotong. Jangan mengecilkan font secara ekstrem demi satu halaman.
5. Tunggu font siap; batasi waktu render; blokir network eksternal yang tidak diperlukan. Tidak menerima HTML pengguna mentah.
6. Simpan artefak privat; unduh melalui signed URL kedaluwarsa. Preview final menampilkan file hasil renderer yang sama, bukan perkiraan HTML saja.
7. QA mengekstrak teks menggunakan Poppler `pdftotext` atau parser ekuivalen. Assert nama, kontak, heading, bullet, Unicode, urutan baca, serta tidak ada teks hilang/berulang. Pengujian ini meningkatkan keandalan, bukan membuktikan kompatibilitas setiap ATS.

Target awal: p95 PDF ≤15 detik untuk dokumen sampai 3 halaman pada beban pilot yang disepakati. Tampilkan status antrean, retry terkontrol, dan tautan hasil tanpa memblokir editor.

**DOCX Phase 2:** library `docx` menghasilkan paragraf, heading, bullet, serta hyperlink asli dari model CV yang sama. Validasi di Word dan LibreOffice; pagination tidak dijanjikan identik dengan PDF.

### 4.5 Rendering dan publikasi website

- MVP menggunakan SSR/ISR dengan cache CDN per **host + publication ID**. Tidak perlu build/deploy satu aplikasi terpisah per pengguna.
- `*.app.example` adalah contoh hostname: gunakan domain sungguhan milik produk, wildcard DNS menuju platform hosting, dan wildcard TLS yang benar-benar didukung penyedia.
- Resolver memvalidasi host terhadap base domain terkonfigurasi, menormalisasi slug, lalu mencari site aktif. Jangan mempercayai header host/forwarded host tanpa konfigurasi proxy tepercaya.
- Slug dibatasi, misalnya 3–40 karakter `a-z`, `0-9`, dan tanda hubung di tengah. Cadangkan `www`, `api`, `admin`, `app`, `support`, serta nama terlarang lain. Unique constraint menangani race condition.
- Draft dan preview membutuhkan autentikasi/token singkat, `noindex`, dan `Cache-Control: private, no-store`. Robots bukan pengganti otorisasi.
- Publish membuat snapshot tersaring dahulu, lalu mengaktifkan pointer secara atomik. Jika gagal, versi publik lama tetap tampil. Draft selanjutnya tidak mengubah versi publik.
- Unpublish menonaktifkan pointer dan membersihkan cache HTML/data/media publik terkait; target propagasi ≤60 detik. Jelaskan bahwa salinan mesin pencari atau pihak ketiga tidak dapat ditarik seketika.
- Pilih SEO indexable secara eksplisit. Sitemap hanya memuat publikasi aktif yang opt-in, canonical berasal dari host terverifikasi, media memiliki alt text.
- Pisahkan domain cookie aplikasi dari domain konten pengguna, gunakan cookie host-only, CSP ketat, dan larang script/HTML pengguna. Media draft privat; asset publik adalah turunan yang disetujui, bukan membuka bucket privat.

## 5. Rekomendasi Tech Stack

### 5.1 Pilihan default

| Lapisan | Rekomendasi | Alasan dan trade-off |
|---|---|---|
| Frontend/editor | React + TypeScript; reuse komponen Vite saat transisi | Mengurangi risiko rewrite dan mempertahankan perilaku editor yang sudah ada |
| SaaS & web publik | Next.js App Router sebagai target runtime server | SSR/ISR, metadata, routing host, dan API satu ekosistem; perlu migrasi terukur dari SPA |
| Form dan kontrak | React Hook Form + Zod | Validasi klien/server berbagi schema; server tetap otoritatif |
| Backend | Route handlers/server modules Next.js + worker Node.js terpisah | Modular monolith cukup untuk fase awal, worker mengisolasi Chromium dan job lambat |
| Database & auth | PostgreSQL + Supabase Auth/Storage/RLS | Operasional awal ringkas; migration SQL dan aturan tenancy wajib diuji |
| Media/artefak | Object storage privat + CDN turunan publik | Signed URL, lifecycle deletion, pemisahan draft/publik |
| PDF | Playwright Chromium di container worker | CSS print dan reuse model preview; lebih berat sehingga bukan proses request serverless singkat |
| DOCX | `docx` pada Phase 2 | Dokumen OOXML asli, bukan konversi gambar |
| Queue | PostgreSQL-backed queue seperti pg-boss | Tidak memerlukan Redis pada MVP; atur concurrency, retry/backoff, dead-letter dan idempotensi |
| Hosting | Vercel untuk Next.js; container platform untuk worker; managed Postgres | Validasi wildcard DNS/TLS, batas paket, region dan biaya sebelum memilih kontrak; bukan asumsi fitur gratis |
| AI | Adapter provider server-side untuk API model kecil yang mendukung structured output | Pilih model dengan benchmark Bahasa Indonesia/Inggris dan biaya aktual; provider bisa diganti tanpa mengubah UI |
| Email | Provider transactional melalui API + verifikasi domain | Relay kontak dan login; reputasi pengiriman dan antispam perlu dimonitor |
| Billing | Hosted checkout provider yang mendukung entitas bisnis dan pasar Indonesia | Pilih provider setelah validasi legal, settlement, webhook, recurring, dan pajak; jangan mengasumsikan semua tersedia |
| Pengujian | Vitest, React Testing Library, Playwright, parser PDF | Unit score/schema, integrasi tenancy/job, E2E ekspor/publish dan aksesibilitas |
| Observabilitas | Structured logs teredaksi, error tracking, metrik queue/cost/uptime | Jangan log isi CV, JD, prompt lengkap, signed URL, atau pesan kontak secara default |

Model AI, harga layanan, dan kemampuan paket hosting berubah; lakukan verifikasi dokumentasi serta proof-of-concept sebelum procurement. Rekomendasi ini adalah keputusan desain, bukan hasil perbandingan harga terbaru.

### 5.2 Batas API konseptual

| Endpoint | Kontrak utama |
|---|---|
| `GET /api/profiles/:id` | Hanya pemilik; mengembalikan revision |
| `PATCH /api/profiles/:id` | Patch tervalidasi + expectedRevision; 409 jika konflik |
| `POST /api/imports` | Upload milik pengguna; batas ukuran/tipe; output draft mapping, bukan langsung overwrite |
| `POST /api/exports` | Revision + format; 202/job ID; cek entitlement dan idempotensi |
| `GET /api/jobs/:id` | Status hanya untuk pemilik; signed URL jika ekspor siap |
| `POST /api/ai/suggestions` | Field terpilih/JD + persetujuan; quota reservation dan output schema |
| `POST /api/sites/:id/publish` | Expected revision; job idempotent; aktifkan snapshot setelah validasi |
| `POST /api/sites/:id/unpublish` | Nonaktifkan snapshot dan invalidasi cache; hanya pemilik |
| `POST /api/contact/:siteId` | Hanya site aktif; limit, validasi, antispam, relay tanpa email publik |
| `GET /api/sites/:id/analytics` | Agregat milik pemilik saja |
| `POST /api/billing/webhook` | Verifikasi signature, replay protection dan event idempotent |

### 5.3 Hubungan dengan repository saat ini

Hasil inspeksi kode pada tanggal dokumen ini:

| Kondisi repo | Implikasi |
|---|---|
| React 19, TypeScript, Vite, Tailwind; source di `app/src` | Reuse editor, komponen desain, dan state; tidak mengubah stack tanpa alasan |
| `app/src/types.ts` memiliki `Resume`, `Design`, `AppState`, `CvProfile` | Tambahkan schema version dan proyek; adaptasikan field lama melalui migrasi, bukan hapus data pengguna |
| `App.tsx` memakai localStorage untuk state dan beberapa profil | Ini penyimpanan perangkat, bukan akun/cloud/tenant isolation |
| `app/src/lib/ats.ts` menyediakan analisis berbasis aturan dan keyword | Bukan AI API dan bukan sertifikasi ATS; pertahankan penjelasan aturan |
| Jalur ekspor memanggil `window.print()` | Ekspor melalui dialog browser; bukan worker PDF, live preview PDF final, atau DOCX |
| Vite memakai base `/ATS-CV-Friendly-maker/`, root `index.html` merupakan artefak build | Hosting statis saat ini tidak menyediakan API privat, auth server, atau wildcard SaaS; rencana deployment baru harus terpisah dan eksplisit |

Tidak ada fitur SaaS baru yang dianggap selesai hanya karena tercantum di PRD ini. Dokumen ini tidak mengubah perilaku aplikasi atau artefak build.

## 6. Model Bisnis & Monetisasi

### 6.1 Paket awal yang diusulkan

Harga dan kuota berikut merupakan hipotesis eksperimen, bukan harga final atau komitmen layanan.

| Fitur | Free | Pro — hipotesis Rp59.000/bulan |
|---|---|---|
| Profil utama | 1 | 1 dengan histori lebih panjang |
| CV ATS PDF | Template dasar, tanpa watermark pada dokumen; fair-use rate limit | Semua template yang telah diuji + prioritas antrean |
| Website | 1 subdomain dengan branding kecil Plainly | 1 website tanpa branding, tema lanjutan |
| Proyek/media | 3 proyek, total 25 MB | 20 proyek, total 500 MB |
| Skor dan keyword JD | Rule-based gratis dengan rate limit antispam | Sama; tidak memanipulasi skor demi upsell |
| AI | 5 kredit/bulan | 100 kredit/bulan |
| Analytics | Agregat 7 hari | Agregat 90 hari |
| Kontak | Relay dasar dengan batas antispam | Batas lebih tinggi yang tetap terukur |
| Varian CV tersimpan | 1 | Hingga 10 |
| Ekspor data/hapus akun | Tersedia | Tersedia |
| DOCX / custom domain | Tidak termasuk MVP | Kandidat manfaat Pro Phase 2; jangan dijual sebelum tersedia |

- Definisikan 1 kredit sebagai 1 rewrite singkat dalam batas input; tailoring JD dapat berbiaya 3 kredit. Tampilkan biaya sebelum konfirmasi.
- Kuota ditegakkan di server secara atomik. Job gagal dikembalikan sesuai kebijakan; retry dengan idempotency key tidak menagih dua kali.
- Pengguna gratis tetap mendapat hasil inti yang layak. Konversi ditopang penghematan waktu, presentasi, dan kebutuhan berulang, bukan watermark yang merusak CV.
- Trial Pro bersifat opt-in; biaya berulang, tanggal tagih, pajak, pembatalan, dan refund dijelaskan sebelum checkout.
- Downgrade tidak menghapus konten mendadak. Batasi penambahan baru, beri masa transisi untuk fitur premium, dan selalu izinkan ekspor data.
- Paket tahunan dan kampus diuji setelah kualitas serta unit economics stabil.

### 6.2 Unit economics dan pembatas biaya

Hitung contribution margin per pengguna berbayar:

`Pendapatan bersih − biaya AI − PDF/compute − storage/egress − email − biaya pembayaran − alokasi support`.

Target awal biaya variabel di bawah 25% pendapatan bersih adalah guardrail bisnis untuk divalidasi, bukan proyeksi terjamin. Catat biaya per job dan per pengguna aktif. Batasi input JD, output token, concurrency, penyimpanan, email kontak, serta ekspor per menit. Terapkan alert budget harian dan circuit breaker; fungsi inti tetap berjalan ketika AI dihentikan sementara. Jangan berbagi cache prompt pribadi antar pengguna.

## 7. Tantangan Teknis & Mitigasi Risiko

| Risiko | Dampak | Mitigasi | Bukti / pemilik |
|---|---|---|---|
| PDF berubah antar font/browser atau teks terpotong | CV tidak terbaca/terparse | Renderer server dan font dipin versinya, print CSS, uji teks + visual golden multi-halaman | QA + engineer PDF; korpus fixture lulus sebelum rilis |
| Klaim “lolos ATS” berlebihan | Kepercayaan rusak | Label skor internal, jelaskan formula dan keterbatasan, uji parser yang tersedia tanpa menjanjikan semua ATS | Product + QA; copy audit |
| Kebocoran data antar tenant / cache | PII terbuka | Ownership di API, RLS, cache key host+publication, DTO allowlist publik, draft private/no-store | Backend/security; tes dua akun + dua host |
| Race slug dan wildcard domain/TLS | Site salah tenant atau tidak bisa dibuka | Unique constraint, reserved slug, host allowlist, verifikasi DNS/TLS staging | Infra; tes concurrent claim dan invalid host |
| Custom domain Phase 2: takeover / sertifikat | Domain menunjuk akun salah | TXT ownership challenge, verifikasi CNAME, status machine, revalidasi dan cleanup saat domain dilepas | Infra; domain lifecycle tests |
| AI mengarang atau mengikuti instruksi JD | Informasi CV palsu | Batasi konteks/tools, structured output, cek fakta tetap, diff dan persetujuan pengguna | AI engineer + Product; adversarial fixtures |
| Biaya AI/export disalahgunakan | Margin negatif / layanan tidak tersedia | Atomic quotas, token cap, rate limit, queue, timeout, per-user budget, circuit breaker | Backend + Finance; load/billing tests |
| Snapshot tertinggal setelah edit/unpublish | Data lama masih terlihat | Publish eksplisit, invalidasi cache, TTL terbatas, active-pointer check, uji propagation | Backend; uji unpublish ≤60 detik |
| Impor PDF salah atau file berbahaya | Data rusak / worker diserang | Limit awal 10 MB/20 halaman, MIME/magic-byte check, sandbox worker, timeouts, scan, review mapping | Backend + QA; malicious/scan fixtures |
| Upload XSS/SSRF | Pengambilalihan akun / akses jaringan internal | Tanpa HTML/script/SVG mentah pada MVP, re-encode raster, hapus EXIF, blok private-network fetch dan remote URL tak perlu | Security; upload/URL tests |
| Kontak dipakai spam/phishing | Reputasi email dan biaya rusak | Rate limit per sumber/site, honeypot, verifikasi pemilik, abuse reporting dan suspend | Backend + Operations |
| Analytics melanggar privasi / angka menyesatkan | Risiko regulasi / keputusan salah | Agregat tanpa cookie sebagai default, minimisasi IP/log, filter bot best-effort, label “views” bukan orang unik | Product + Privacy |
| Migrasi localStorage / konflik perangkat | Kehilangan data | Backup JSON lokal sebelum migrasi, schema migration, revision check, retry dan recovery UX | Frontend; fixture schema lama dan offline |

### 7.1 Privasi, keamanan, dan operasional

- Tinjau pemenuhan UU PDP dan kewajiban lintas wilayah bersama penasihat yang kompeten sebelum peluncuran. Jangan menyatakan patuh hanya karena memakai vendor tertentu.
- Jelaskan data yang diproses, tujuan, vendor AI/email/storage, lokasi pemrosesan, retensi, dan hak pengguna. Persetujuan AI terpisah dari publikasi website.
- Default usulan: file impor mentah dihapus ≤24 jam setelah parsing; artefak ekspor privat kedaluwarsa setelah 7 hari; pesan kontak dihapus setelah 30 hari; histori revisi sesuai paket dengan batas terdokumentasi. Semua periode perlu disetujui dalam kebijakan privasi sebelum produksi.
- Hapus akun: unpublish dan cabut akses segera; hapus data aktif ≤30 hari, backup mengikuti siklus kedaluwarsa maksimal 90 hari yang terdokumentasi. Data transaksi yang wajib disimpan dipisahkan dan dibatasi sesuai kewajiban legal.
- Log keamanan mentah dibatasi retensinya, akses administratif diaudit, secrets dikelola di environment server/secret manager. Kunci publik frontend tidak menggantikan RLS.
- Backup database harian; usulan target RPO 24 jam/RTO 8 jam divalidasi melalui latihan restore. Database dan object storage memerlukan strategi pemulihan terpisah.
- Sediakan report abuse, takedown, contact support, dan runbook incident response termasuk notifikasi pihak terdampak sesuai kewajiban yang berlaku.

## 8. Rencana Eksekusi untuk Tim Developer

### 8.1 Asumsi tim dan tahapan

Estimasi **10–12 minggu** untuk pilot terbatas, bukan janji delivery. Asumsi: 2 full-stack engineer berpengalaman, 1 designer/product paruh waktu, dan QA paruh waktu; tanpa DOCX/custom domain/OCR. Procurement, legal, dan revisi hasil pilot dapat memperpanjang waktu. Jika kapasitas lebih kecil, kurangi tema/analytics sebelum mengurangi keamanan dan integritas ekspor.

| Tahap | Estimasi | Deliverable / exit gate |
|---|---|---|
| Discovery & baseline | Minggu 1 | Wawancara 8–12 calon pengguna, audit editor, fixture CV ID/EN, prototype dua preview; scope disetujui |
| Fondasi data & auth | Minggu 2–3 | Schema version, proyek, auth, DB/RLS, migrasi lokal opt-in, autosave/revision conflict; uji tenancy lulus |
| Rendering CV & impor | Minggu 4–5 | Worker/queue, PDF teks, final preview, parsing PDF dan review; korpus fixture lulus |
| Web generator & publish | Minggu 6–7 | Tiga tema berbagi data, snapshot, wildcard staging, publish/unpublish dan privasi; uji cache dua host lulus |
| AI, kontak, analytics | Minggu 8–9 | Diff assistant, quota ledger, relay antispam dan agregasi event; kegagalan tidak memblokir core flow |
| Billing & hardening | Minggu 10 | Hosted checkout, webhook replay tests, entitlement, observabilitas dan runbook |
| Pilot & perbaikan | Minggu 11–12 | UAT, aksesibilitas, load/restore test, review biaya, bug kritis nol; keputusan go/no-go |

### 8.2 Backlog awal (urutan dependensi)

1. **P0 — Kontrak data:** Zod schema v1, migrasi `Resume` lama, stable ID, ISO year-month dengan formatter lokal, proyek dan visibilitas.
2. **P0 — Identitas & tenancy:** auth, owner checks, RLS, private storage, negative tests lintas pengguna.
3. **P0 — Persistensi aman:** autosave revisioned, konflik, retry offline, data export/delete, migrasi lokal opt-in.
4. **P0 — Proyeksi renderer:** pure functions `toCvViewModel` dan `toPublicPortfolio` dengan allowlist; snapshot tests membuktikan field privat tidak bocor.
5. **P0 — Ekspor:** queue, worker, signed artifact, fixture Unicode/tautan/bullet/pagination, final preview.
6. **P0 — Publish:** slug, host resolver, template version, atomic pointer, cache isolation, unpublish.
7. **P1 — Import & assistant:** mapping review, prompt/data isolation, fact-preserving diff, quota reservation/refund.
8. **P1 — Growth & operasional:** kontak, analytics agregat, SEO, billing, monitoring dan abuse handling.

### 8.3 Struktur folder target konseptual

Struktur berikut adalah usulan saat runtime SaaS diperkenalkan; bukan instruksi merombak repo sekaligus.

```text
apps/
  web/                    # editor, auth, dashboard, API, SSR portfolio
  worker/                 # ekspor, impor, email, cleanup
packages/
  contracts/              # Zod schemas, API DTO, migrasi
  domain/                 # aturan profil, entitlement, ATS dan projections
  renderers/              # model CV, print HTML, tema web
  ui/                     # komponen editor bersama
infra/
  migrations/             # SQL, RLS, indeks, queue
  runbooks/               # deploy, restore, incident, unpublish
tests/                    # pengujian lintas aplikasi
  fixtures/               # CV sintetis ID/EN; tidak mengandung PII nyata
  e2e/
docs/
```

Mulai dengan modul di aplikasi yang ada jika monorepo belum memberi manfaat. Ekstraksi package mengikuti kebutuhan worker dan reuse renderer, bukan semata preferensi struktur.

### 8.4 Acceptance criteria rilis MVP

- [ ] Mengubah nama/pengalaman pada satu form memperbarui kedua preview tanpa entri ulang; web publik tetap pada revisi lama sampai publish.
- [ ] Draft yang tersimpan dapat dipulihkan setelah refresh/login ulang; konflik dua perangkat menghasilkan respons konflik dan UX pemulihan.
- [ ] Migrasi profil lokal lama tidak membuang pengalaman/pendidikan/desain; pengguna dapat menolak upload dan mengunduh backup.
- [ ] PDF 1–3 halaman, nama Indonesia/non-ASCII, bullet panjang, dan tautan dapat diekstrak; urutan teks benar dan tidak ada clipping pada fixture yang disepakati.
- [ ] Hasil preview PDF final sama dengan artefak yang diunduh untuk revision/render version yang sama.
- [ ] AI tidak mengubah fakta yang dikunci, tidak otomatis publish, dan pengguna bisa menolak seluruh patch; JD berbahaya tidak memicu tool/action.
- [ ] Nomor telepon/email yang disetel privat tidak muncul di HTML, JSON, metadata, image metadata, atau endpoint publik.
- [ ] Klaim slug serentak hanya memiliki satu pemenang; host palsu dan slug reserved ditolak.
- [ ] Pengguna A tidak dapat membaca/mengubah job, file, profil, atau analytics pengguna B; cache dua host tidak tertukar.
- [ ] Unpublish menonaktifkan halaman/data publik dalam batas target, termasuk saat cache hangat; perilaku media dan salinan eksternal dijelaskan.
- [ ] Kontak mematuhi limit dan tidak mengekspos email penerima; analytics membedakan page view dari unique person.
- [ ] Webhook berulang tidak menggandakan langganan/kuota; retry job tidak menggandakan biaya; signature tidak valid ditolak.
- [ ] Core flow dapat diselesaikan dengan keyboard dan pada lebar layar 360 px; temuan aksesibilitas kritis diperbaiki.
- [ ] SLO pilot diuji pada asumsi beban tertulis (awal: 50 editor aktif dan 5 job ekspor bersamaan), bukan disimpulkan dari tes satu pengguna.
- [ ] Restore backup, penghapusan akun, batas retensi, monitoring anggaran, dan runbook insiden diuji sebelum akses publik luas.

### 8.5 Keputusan yang harus dikonfirmasi sebelum pembangunan

1. Domain produk, provider hosting wildcard/TLS, region data, dan anggaran pilot.
2. Apakah LinkedIn manual/PDF dan DOCX Phase 2 diterima sebagai batas MVP?
3. Penyedia AI, kebijakan retensi input vendor, izin penggunaan data, dan benchmark ID/EN.
4. Provider billing/email yang tersedia untuk badan usaha dan pasar target.
5. Kebijakan retensi final, persetujuan publikasi, abuse/takedown, serta pengelola support.
6. Hasil uji willingness-to-pay untuk harga Pro dan kredit; harga tidak dimasukkan ke kontrak sebelum validasi.

**Definition of done:** fitur bukan hanya terlihat di UI, tetapi memiliki kontrak tervalidasi, otorisasi, test otomatis, penanganan gagal, telemetry teredaksi, dokumentasi operasional, serta penerimaan Product/QA. PRD ini menjadi acuan keputusan dan backlog; tidak menyatakan semua fitur telah dibuat.
