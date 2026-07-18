<p align="center">
  <img src="./src/assets/images/mda_vault_banner_1783504906613.jpg" alt="MDA Enterprise Vault Banner" width="100%" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
</p>

# <p align="center">Management Data App (MDA)</p>
### <p align="center">Enterprise Common Data Environment (CDE) Portal & Secure Storage Management</p>

<p align="center">
  <a href="#iso-19650-cde"><img src="https://img.shields.io/badge/Standard-ISO_19650-blue?style=flat-for-the-badge&logo=prospectus" alt="ISO 19650 Standard"></a>
  <a href="#truenas-samba"><img src="https://img.shields.io/badge/Storage-TrueNAS_ZFS-orange?style=flat-for-the-badge&logo=truenas" alt="TrueNAS ZFS"></a>
  <a href="#ransomware-shield"><img src="https://img.shields.io/badge/Security-Ransomware_Shield-red?style=flat-for-the-badge&logo=shield" alt="Ransomware Shield"></a>
  <a href="#security-copyright"><img src="https://img.shields.io/badge/License-Proprietary-gold?style=flat-for-the-badge" alt="License Proprietary"></a>
</p>

---

Sistem Portal **Common Data Environment (CDE)** Terpadu Berstandar **ISO 19650** & Manajemen Data Terdistribusi yang dirancang khusus untuk Kantor Konsultan Konstruksi, Arsitektur, dan Engineering skala Menengah-Atas (*Enterprise-Grade*). 

Aplikasi ini mengintegrasikan alur kerja data proyek secara dinamis dengan infrastruktur penyimpanan berbasis **TrueNAS (Samba Share)** untuk mengamankan, mengontrol, dan mengotomatisasi seluruh siklus dokumen proyek, model 3D (SketchUp/Revit/BIM), serta gambar kerja CAD secara real-time.

---

## 🏗️ Fitur Utama & Keunggulan Sistem

<a id="iso-19650-cde"></a>
### 📁 Common Data Environment (CDE) ISO 19650-2
Sistem mengadopsi standar internasional ISO 19650-2 untuk penataan siklus hidup dokumen konstruksi guna meminimalkan kesalahan koordinasi:

<p align="center">
  <img src="./src/assets/images/mda_cde_workflow_1783504956490.jpg" alt="MDA CDE Workflow Diagram" width="85%" style="border-radius: 6px; border: 1px solid #334155;">
</p>

* **Automated CDE Folder Generator**: Menginisialisasi otomatis 4 direktori kepatuhan utama (**WIP, SHARED, PUBLISHED, ARCHIVED**) langsung di atas dataset penyimpanan yang ditentukan.
* **ISO 19650 Filename Compliance**: Mesin validasi penamaan yang menjamin keunikan berkas berdasarkan kode proyek, originator, volume, level, tipe, role, nomor, kesesuaian, dan revisi.
* **CAD Xref Relative Path Sync**: Portal visual untuk monitoring kepatuhan referensi silang (Xref) file CAD secara relatif, memastikan keandalan dokumen saat dipindahkan antar-server.

<a id="truenas-samba"></a>
### 💾 Integrasi TrueNAS & Samba Share (Role-Based Access Control)
Sistem memetakan dan mengawasi kesehatan akses 3 Samba Share utama:
* **Dataset `/admin`**: Berkas finansial, anggaran, legalitas, dan operasional kantor.
* **Dataset `/projects`**: File desain aktif, gambar kerja, dokumen proyek, dan koordinasi BIM.
* **Dataset `/library`**: Standar material, detail gambar, spesifikasi teknis, dan aset digital.
* **RBAC Enforcement**: Validasi logika sistem yang memisahkan hak akses antara Komputer Admin (Full Access: `/admin`, `/projects`, `/library`) dan Komputer Tim Desainer (Dibatasi: `/projects` dan `/library` saja, folder `/admin` ditolak total).

<a id="ransomware-shield"></a>
### 🛡️ Proteksi Integritas File & Ransomware Shield
* **ZFS Snapshot Automation Guides**: Integrasi petunjuk berkala pembuatan cadangan non-destruktif (*snapshot*) pada ZFS Storage Pool guna mengamankan data dari ancaman infeksi malware/ransomware.
* **SHA-256 Checksum Validator**: Pengujian tanda tangan digital berkas proyek untuk mendeteksi perubahan ilegal di luar otorisasi manajer proyek.

---

<a id="security-copyright"></a>
## 🔒 Proteksi Keamanan Sistem & Hak Cipta

Untuk menjaga kerahasiaan dan hak cipta produk dalam proses distribusi, sistem dilengkapi dengan:
1. **Server-Side Integration Proxy**: Seluruh API utama (termasuk modul pemrosesan data berbasis kecerdasan buatan/AI) dilindungi sepenuhnya di sisi server. Token otentikasi dan API key tidak pernah terekspos ke sisi klien.
2. **Kriptografi Aktivasi Offline**: Sistem memerlukan verifikasi lisensi kriptografis berbasis integrasi sidik jari perangkat keras (*hardware-locked fingerprint alignment*). Seluruh proses modul lisensi dan generator kode disembunyikan sepenuhnya dari distribusi klien publik demi mengeliminasi risiko dekompilasi, bypass lisensi, dan pembongkaran kode (*reverse engineering*).

---

## 🛠️ Panduan Instalasi & Deployment (TrueNAS SCALE)

Aplikasi ini dapat dibangun sebagai kontainer Docker ringan dan disebarkan secara terintegrasi pada server **TrueNAS SCALE**.

### Langkah 1: Persiapan Dataset & User SMB di TrueNAS SCALE
Sebelum memasang aplikasi, pastikan konfigurasi akun dan hak akses dataset pada Web UI TrueNAS SCALE telah diatur sesuai pedoman keamanan:
1. **Membuat Dataset ZFS**:
   * Buka menu **Datasets** di TrueNAS SCALE.
   * Buat tiga dataset terpisah pada pool Anda: `admin`, `projects`, dan `library`.
2. **Membuat Grup Pengguna (Credentials > Local Users & Groups)**:
   * Buat grup `admin_group` (untuk personel administratif dan pimpinan).
   * Buat grup `design_group` (untuk tim desainer/arsitek).
3. **Mengonfigurasi ACL (Access Control List)**:
   * **Dataset `admin`**: Berikan hak akses penuh hanya untuk grup `admin_group`. Pastikan izin untuk grup `design_group` disetel ke **Blocked/No Access**.
   * **Dataset `projects` & `library`**: Berikan izin Read/Write untuk kedua grup (`admin_group` & `design_group`).

### Langkah 2: Penyebaran Kontainer Aplikasi (Docker)
1. Navigasi ke menu **Apps** di TrueNAS SCALE, lalu pilih **Discover Apps** > **Custom App** (Launch Docker Image).
2. Konfigurasikan detail kontainer berikut:
   * **Application Name**: `mda-portal`
   * **Container Image**: Alamat image kontainer privat Anda (misal: `torkykomputer/mda-portal:latest`).
   * **Container Port**: `3000`
   * **Port Forwarding (Host Port)**: `7777` (atau port pilihan Anda untuk mengakses portal melalui browser web).
3. Atur Variabel Lingkungan (*Environment Variables*):
   * `NODE_ENV` = `production`
   * `GEMINI_API_KEY` = `(Kunci Server Verifikasi Cloud Anda)`
4. Alokasikan sumber daya secara efisien (rekomendasi minimum: 0.5 vCPU dan 512MB RAM), lalu klik **Save** dan tunggu hingga status kontainer aktif (**Running**).

### Langkah 3: Akses dari Komputer Klien
Dari komputer klien di dalam jaringan LAN kantor:
1. Buka browser web (Chrome, Edge, Firefox, atau Safari).
2. Akses alamat IP server TrueNAS SCALE beserta port yang dikonfigurasi.
   * *Format*: `http://[IP_SERVER_TRUENAS]:7777` (misalnya: `http://192.168.1.254:7777`).

---

## 💻 Panduan Pengembangan & Otomatisasi (Developer Only)

Bagi pengembang berlisensi yang mengelola kode sumber ini secara privat:

### 1. Prasyarat Lingkungan Lokal
* **Node.js** v18 atau v20 LTS.
* Manajemen paket menggunakan `npm`.

### 2. Pemasangan Dependensi & Menjalankan Mode Pengembangan
Untuk menguji aplikasi secara lokal sebelum melakukan proses deployment:
```bash
# Memasang seluruh paket dependensi
npm install

# Menjalankan server pengembangan (Express + Vite)
npm run dev
```
Hasil kompilasi static client akan tersimpan pada direktori `/dist` dan backend server akan dibundle ke dalam `dist/server.cjs`.

### 3. Skrip Pengiriman Kode Instan (`auto_push.bat`)
Gunakan utilitas pengiriman otomatis yang terintegrasi di direktori root untuk mencadangkan kode sumber Anda ke repositori Git privat secara praktis. Cukup klik ganda (double-click) pada berkas `auto_push.bat` untuk memicu proses staging, commit otomatis dengan tanda waktu, dan push langsung ke branch utama.

---

## 📖 Buku Manual Pengoperasian CDE (BIM Standard)

Portal ini dilengkapi dengan modul **Buku Manual Komprehensif** terintegrasi di dalamnya untuk keperluan pelatihan staf mandiri. Modul ini dapat dicetak secara langsung atau disimpan sebagai dokumen PDF berkualitas tinggi yang ramah cetak (*print-friendly layout*), mempermudah proses training pimpinan kantor dan tim drafter di lapangan.

---

**Developed by Torky Komputer Security Engine &copy; 2026.**
