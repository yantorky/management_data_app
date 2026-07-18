# 📑 PANDUAN DEPLOYMENT & MANUAL BOOK PENGGUNAAN SISTEM
### **Management Data App (MDA) • Enterprise Edition**
*Dibuat khusus untuk Klien oleh Torky Komputer Security Engine (C) 2026*

---

## 📌 DAFTAR ISI
1. [BAB 1: PANDUAN INSTALASI & DEPLOYMENT DI TRUENAS SCALE](#bab-1-panduan-instalasi--deployment-di-truenas-scale)
   - [1.1 Persiapan Dataset di TrueNAS SCALE](#11-persiapan-dataset-di-truenas-scale)
   - [1.2 Konfigurasi Samba Share (SMB) & Keamanan RBAC](#12-konfigurasi-samba-share-smb--keamanan-rbac)
   - [1.3 Cloning Git & Build Docker Container MDA](#13-cloning-git--build-docker-container-mda)
   - [1.4 Menjalankan MDA sebagai Custom App di TrueNAS SCALE](#14-menjalankan-mda-sebagai-custom-app-di-truenas-scale)
2. [BAB 2: PANDUAN AKTIVASI LISENSI OFFLINE (TORKY KOMPUTER)](#bab-2-panduan-aktivasi-lisensi-offline-torky-komputer)
   - [2.1 Alur Pengambilan Machine ID](#21-alur-pengambilan-machine-id)
   - [2.2 Prosedur Generator Lisensi Offline](#22-prosedur-generator-lisensi-offline)
3. [BAB 3: MANUAL BOOK PENGGUNAAN SISTEM SISI KLIEN](#bab-3-manual-book-penggunaan-sistem-sisi-klien)
   - [3.1 Panduan untuk Komputer Admin Kantor (Full Privileges)](#31-panduan-untuk-komputer-admin-kantor-full-privileges)
   - [3.2 Panduan untuk Komputer Tim Desain (Designers)](#32-panduan-untuk-komputer-tim-desain-designers)
   - [3.3 Pembuktian Sistem Keamanan (RBAC Blockade Simulation)](#33-pembuktian-sistem-keamanan-rbac-blockade-simulation)

---

## BAB 1: PANDUAN INSTALASI & DEPLOYMENT DI TRUENAS SCALE

Panduan ini disusun secara runut untuk memastikan aplikasi **Management Data App (MDA)** berjalan optimal di atas server **TrueNAS SCALE** milik klien dengan pemetaan jaringan SMB yang aman.

### 1.1 Persiapan Dataset di TrueNAS SCALE
Untuk mendukung 3 Datasheet utama kantor konsultan arsitektur, Anda harus membuat 3 Dataset terpisah di dalam Storage Pool TrueNAS SCALE Anda:

1. Masuk ke Dashboard Web UI TrueNAS SCALE Anda.
2. Buka menu **Datasets** di sidebar kiri.
3. Pilih Root Pool Anda (misal: `tank` atau `[NAMA_POOL_ZFS_ANDA]`), klik **Add Dataset**.
4. Buat dataset pertama dengan rincian berikut:
   - **Name**: `admin`
   - **Dataset Space Allocation**: Sesuaikan dengan kapasitas (default).
   - **Share Type**: **SMB** (Sangat Penting).
   - Klik **Save**.
5. Ulangi langkah di atas untuk membuat 2 dataset lainnya:
   - **Name**: `projects` (Share Type: **SMB**)
   - **Name**: `library` (Share Type: **SMB**)

---

### 1.2 Konfigurasi Samba Share (SMB) & Keamanan RBAC
Tahap ini mengatur agar hak akses folder dibatasi secara ketat di tingkat protokol jaringan Samba.

#### A. Membuat Akun Pengguna & Grup di TrueNAS
1. Buka menu **Credentials** -> **Local Users** di TrueNAS SCALE.
2. Tambahkan User Admin Kantor:
   - **Username**: `admin_kantor`
   - **Password**: (Buat password aman)
3. Tambahkan User Tim Desain (ulangi untuk seluruh staf desainer):
   - **Username**: `desainer_staf`
   - **Password**: (Buat password aman)
4. Buka menu **Credentials** -> **Local Groups**.
5. Buat grup baru bernama `design_team` dan masukkan user `desainer_staf` ke dalam grup ini.

#### B. Mengatur Permissions (ACL) pada Dataset
Terapkan aturan Access Control List (ACL) untuk masing-masing dataset:

| Nama Dataset | Hak Akses User `admin_kantor` | Hak Akses Grup `design_team` (Desainer) | Keterangan Keamanan |
| :--- | :---: | :---: | :--- |
| **admin** | **Read & Write (Full)** | **BLOCKED (No Access)** | Hanya komputer Admin yang bisa memetakan folder ini. |
| **projects** | **Read & Write (Full)** | **Read & Write (Full)** | Tempat kolaborasi file gambar CAD/SketchUp kerja. |
| **library** | **Read & Write (Full)** | **Read & Write (Full)** | Standar folder referensi, template, dan aset proyek. |

**Langkah Setting ACL di TrueNAS:**
1. Klik icon tiga titik di samping dataset `admin`, pilih **Edit Permissions** (atau **Edit ACL**).
2. Atur Owner utama ke `admin_kantor`.
3. Di bagian ACL Entries, hapus akses untuk grup `design_team` atau user lain (set permission ke **None** atau jangan berikan entri akses).
4. Klik **Save**.
5. Pada dataset `projects` dan `library`, berikan hak akses **Read & Write** (Full Control) baik untuk user `admin_kantor` maupun grup `design_team`.

---

### 1.3 Cloning Git & Build Docker Container MDA
Aplikasi MDA dikemas menggunakan Docker agar mudah dijalankan secara independen tanpa mengganggu modul bawaan TrueNAS SCALE.

1. Buka terminal SSH atau konsol TrueNAS SCALE Anda.
2. Masuk ke direktori penyimpanan atau buat folder khusus (sesuaikan `[NAMA_POOL_ZFS_ANDA]` dengan nama pool ZFS TrueNAS Anda, misal `tank` atau `PoolData`):
   ```bash
   mkdir -p /mnt/[NAMA_POOL_ZFS_ANDA]/apps/management_data_app
   cd /mnt/[NAMA_POOL_ZFS_ANDA]/apps/management_data_app
   ```
3. Lakukan cloning repositori Git privat Anda:
   ```bash
   git clone <URL_REPOSITORY_PRIVAT_ANDA> .
   ```
4. Pastikan file `package.json`, `server.ts`, dan konfigurasi esbuild sudah lengkap.
5. Jalankan perintah build Docker Image lokal Anda:
   ```bash
   docker build -t torky/mda:latest .
   ```

---

### 1.4 Menjalankan MDA sebagai Custom App di TrueNAS SCALE
TrueNAS SCALE mendukung peluncuran Docker Container kustom melalui menu **Apps**.

1. Di Web UI TrueNAS SCALE, klik menu **Apps** di sidebar kiri.
2. Klik tombol **Discover Apps** di sudut kanan atas.
3. Klik tombol **Custom App** (atau *Launch Docker Image*).
4. Isi formulir konfigurasi aplikasi sebagai berikut:
   - **Application Name**: `management-data-app`
   - **Container Image**: `torky/mda`
   - **Container Image Tag**: `latest`
5. **Port Forwarding / Networking:**
   - Tambahkan aturan Port Forwarding.
   - **Container Port**: `3000` (Sesuai port internal server MDA).
   - **Node Port**: `3000` (Port luar yang akan diakses oleh komputer klien di kantor, misal: `http://192.168.1.150:3000`).
6. **Environment Variables:**
   - Tambahkan variabel lingkungan jika diperlukan (seperti `NODE_ENV=production`).
7. **Storage/Volume Mounts (Opsional):**
   - Jika Anda ingin melestarikan database lokal MDA, petakan volume host `/mnt/[NAMA_POOL_ZFS_ANDA]/apps/mda_data` ke `/app/data` di dalam kontainer.
8. Klik **Save** dan tunggu proses deployment selesai hingga status aplikasi berubah menjadi **Active / Running**.

---

## BAB 2: PANDUAN AKTIVASI LISENSI OFFLINE (TORKY KOMPUTER)

Sistem MDA dilengkapi dengan mekanisme pertahanan enkripsi lisensi offline yang sangat aman untuk memastikan software tidak dapat dibajak atau dipindahkan ke server lain tanpa izin dari **Torky Komputer**.

```
+------------------+     (Salin Machine ID)     +--------------------+
|  Setup Wizard    | -------------------------> |  Torky License Gen |
|  Web App Klien   | <------------------------- |  (generate.bat)    |
+------------------+     (Masukkan Lisensi)     +--------------------+
```

### 2.1 Alur Pengambilan Machine ID
1. Setelah aplikasi berhasil di-deploy di TrueNAS SCALE, buka browser dari komputer manapun di jaringan kantor dan akses:
   `http://<IP_TRUENAS_SCALE>:3000`
2. Sistem akan mendeteksi bahwa instalasi masih baru dan langsung menampilkan **Setup Wizard (Inisialisasi Awal Sistem)**.
3. Isi kolom nama firma, konfigurasi IP Samba, dan nama Pool.
4. Di bagian bawah form Setup, Anda akan melihat kotak abu-abu bertuliskan **TrueNAS Machine ID (Client Fingerprint)**.
5. Klik tombol **Salin Machine ID** untuk menduplikasi kode unik enkripsi tersebut ke clipboard Anda.

### 2.2 Prosedur Generator Lisensi Offline
Sebagai penyedia solusi IT (Torky Komputer), Anda dapat menggenerate kunci lisensi resmi secara offline di komputer teknisi Anda:

1. Buka folder hasil ekstraksi file ZIP aplikasi MDA di komputer Anda.
2. Cari file bernama `generate.bat` dan jalankan dengan klik ganda (*double click*).
3. Generator otomatis akan mendeteksi runtime Node.js dan membuka konsol keamanan interaktif.
4. Paste (tempel) **TrueNAS Machine ID** yang disalin dari klien tadi pada kolom yang disediakan, lalu tekan **Enter**.
5. Sistem akan memproses hash biner tingkat tinggi secara instan dan memunculkan **KUNCI LISENSI AMAN** dalam format:
   `TORKY-SECURE-2026-MDA-XXXXXX`
6. Salin Kunci Lisensi tersebut dan masukkan ke dalam kolom **Kunci Lisensi Resmi** pada Setup Wizard di web browser klien.
7. Klik **Selesaikan Instalasi & Terapkan Lisensi**. Sistem akan langsung aktif secara permanen!

---

## BAB 3: MANUAL BOOK PENGGUNAAN SISTEM SISI KLIEN

Bagian ini merupakan pedoman operasional harian yang wajib dicetak dan diberikan kepada pengguna akhir (*end-user*) di kantor konsultan arsitektur.

### 3.1 Panduan untuk Komputer Admin Kantor (Full Privileges)
Komputer yang digunakan oleh Admin Utama / Pemilik Kantor memiliki akses mutlak ke seluruh fitur sistem MDA.

#### A. Pemetaan Drive Jaringan (Samba Share Mapping)
Sebelum menggunakan web, pastikan komputer Admin sudah memetakan ketiga datasheet TrueNAS ke Windows Explorer:
1. Buka **This PC** di Windows, klik **Map Network Drive**.
2. Petakan Drive `A:` untuk Admin: `\\192.168.1.150\admin` (Gunakan kredensial user `admin_kantor`).
3. Petakan Drive `P:` untuk Projects: `\\192.168.1.150\projects`
4. Petakan Drive `L:` untuk Library: `\\192.168.1.150\library`

#### B. Menggunakan Aplikasi Web MDA
1. **Login**: Masuk menggunakan akun Super Admin yang dibuat saat Setup Wizard.
2. **Dashboard Overview**: Di sini Admin dapat melihat kapasitas sisa penyimpanan Samba Pool, status koneksi server, jumlah proyek aktif, dan grafik kepatuhan file ISO 19650.
3. **Menu Manajemen Pengguna (RBAC)**:
   - Admin dapat menambahkan akun staf desainer baru.
   - Setel peran staf sebagai **Architect (Staf Desain)** agar pembatasan sistem otomatis berlaku pada akun mereka.
4. **Audit Trail (Log Audit Sistem)**:
   - Admin dapat memantau log aktivitas real-time. Setiap aksi seperti pembuatan proyek, pengunggahan berkas, pemindahan folder, hingga upaya pembatasan akses ilegal akan tercatat lengkap dengan stempel waktu dan alamat IP.

---

### 3.2 Panduan untuk Komputer Tim Desain (Designers)
Para desainer menggunakan sistem ini untuk memastikan seluruh berkas gambar proyek terstandarisasi dengan rapi.

#### A. Pemetaan Drive Jaringan (Samba Share Mapping)
Pada komputer desainer, pemetaan folder admin diblokir total oleh server TrueNAS. Mereka hanya boleh memetakan folder proyek dan pustaka:
1. Buka **This PC** di Windows, klik **Map Network Drive**.
2. Petakan Drive `P:` untuk Projects: `\\192.168.1.150\projects` (Gunakan kredensial `desainer_staf`).
3. Petakan Drive `L:` untuk Library: `\\192.168.1.150\library`
4. *Catatan*: Jika desainer mencoba memetakan `\\192.168.1.150\admin`, Windows akan memunculkan pesan error "Access Denied" (Akses Ditolak).

#### B. Menggunakan Aplikasi Web MDA & Generator Nama ISO 19650
1. **Login**: Masuk menggunakan akun desainer masing-masing (Role: USER / ARCHITECT).
2. **Menyusun Penamaan Berkas Gambar Standar ISO 19650-2**:
   - Masuk ke menu **File Manager** -> Pilih proyek yang sedang dikerjakan.
   - Klik tombol **Generator Kode Penamaan ISO**.
   - Isi parameter drop-down secara interaktif:
     - *Project Code* (Kode Proyek)
     - *Originator* (Pemrakarsa)
     - *Volume/System* (Volume gambar)
     - *Level/Location* (Lantai bangunan)
     - *Type* (Jenis gambar, misal: DR untuk Drawing, SP untuk Spesifikasi)
     - *Role* (Peran disiplin, misal: A untuk Arsitektur, S untuk Struktur)
     - *Number* (Nomor urut lembar)
   - Sistem akan langsung meng-compile nama file resmi di bagian bawah, misalnya:
     `PRJ1-MDA-ZZ-XX-DR-A-0001`
   - Klik **Salin Kode Nama**, lalu gunakan kode tersebut sebagai nama file gambar AutoCAD (*.dwg*) atau SketchUp (*.skp*) sebelum di-upload.
3. **Mengunggah & Versioning Berkas**:
   - Tarik dan lepas (*drag and drop*) file CAD yang sudah dinamai ke folder proyek yang bersesuaian di web MDA.
   - Masukkan kode kesesuaian (*suitability code*, misal: `S2` - Untuk Informasi) dan nomor revisi (misal: `P01.01`).
   - Saat ada pembaruan gambar, unggah file dengan nama yang sama. Sistem akan otomatis menaikkan versi berkas ke versi berikutnya tanpa menimpa berkas lama (menyimpan riwayat versi/versioning history).

---

### 3.3 Pembuktian Sistem Keamanan (RBAC Blockade Simulation)
Aplikasi MDA memiliki integrasi visual khusus yang mensimulasikan pemblokiran ketat protokol Samba Share untuk memastikan kepatuhan standar keamanan data enterprise.

```
[Komputer Desainer]
       |
       v
Akses Folder: \\TrueNAS\admin
       |
  (DIREKTUR / ADMIN ONLY)
       |
       v
⛔ [SISTEM MEMBLOKIR AKSES & MENCATAT LOG AUDIT KEAMANAN]
```

**Cara Melakukan Simulasi Keamanan:**
1. Login ke aplikasi web MDA menggunakan akun berstatus **Architect/Staf Desain (User)**.
2. Masuk ke menu **File Manager**.
3. Klik folder **`00_Admin`** (yang merepresentasikan datasheet `\\TrueNAS\admin`).
4. Sistem web MDA akan mendeteksi peran user dan langsung memblokir layar serta menampilkan visual perisai merah bertuliskan:
   > ⛔ **Akses Ditolak secara Sistem (Samba Share Restricted)**
   > Sesuai Kebijakan RBAC Kantor Konsultan Arsitek, Komputer Tim Desain dilarang membaca atau mengedit berkas di dalam datasheet `\\TrueNAS\admin` (Kategori `00_Admin`). Akses ini dikunci ketat di tingkat Samba Share.
5. Pada saat yang sama, sistem mencatat percobaan akses tidak sah tersebut ke dalam **Audit Trail** yang dapat dipantau oleh Admin Kantor untuk menjaga integritas data dari ancaman sabotase atau kebocoran informasi.

---
*Dokumen ini diterbitkan secara resmi oleh Torky Komputer Security Engine untuk mempermudah operasional dan menjamin keberlangsungan sistem klien.*
