# 📑 PANDUAN DEPLOYMENT (DEVELOPER) & MANUAL BOOK PENGGUNAAN (KLIEN)
### **Management Data App (MDA) • Enterprise Edition**
*Diterbitkan oleh Torky Komputer Security Engine (C) 2026*

---

## 📌 STRUKTUR DOKUMEN & DAFTAR ISI

Dokumen ini dibagi menjadi dua bagian utama untuk memisahkan secara tegas antara **Tugas & Prosedur Developer/Teknisi** dengan **Panduan Operasional Pengguna/Klien Kantor Konsultan**.

* [**BAGIAN I: PANDUAN DEPLOYMENT & DEVOPS UNTUK DEVELOPER / TEKNISI (YAN TORKY / TORKY KOMPUTER)**](#bagian-i-panduan-deployment--devops-untuk-developer--teknisi-yan-torky--torky-komputer)
  * [1.1 Perbedaan Lingkungan Deployment (Homelab Developer vs Server Klien)](#11-perbedaan-lingkungan-deployment-homelab-developer-vs-server-klien)
  * [1.2 Persiapan ZFS Storage Pool, Dataset & Samba Share (SMB)](#12-persiapan-zfs-storage-pool-dataset--samba-share-smb)
  * [1.3 Hak Akses Root (`sudo -s`) & Socket Docker](#13-hak-akses-root-sudo--s--socket-docker)
  * [1.4 Langkah Instalasi & Build Docker Container Pertama Kali](#14-langkah-instalasi--build-docker-container-pertama-kali)
  * [1.5 Menjalankan Aplikasi dengan Port Host `3030`](#15-menjalankan-aplikasi-dengan-port-host-3030)
  * [1.6 Prosedur Perbaharui Kode (Git Pull & Rebuild Docker Image)](#16-prosedur-perbaharui-kode-git-pull--rebuild-docker-image)
  * [1.7 Kebijakan Lisensi Offline & Prosedur Penerbitan Kunci Lisensi](#17-kebijakan-lisensi-offline--prosedur-penerbitan-kunci-lisensi)
* [**BAGIAN II: MANUAL BOOK & PANDUAN PENGGUNAAN APLIKASI UNTUK KLIEN / KANTOR KONSULTAN**](#bagian-ii-manual-book--panduan-penggunaan-aplikasi-untuk-klien--kantor-konsultan)
  * [2.1 Akses Web Aplikasi dari Jaringan Lokal Kantor](#21-akses-web-aplikasi-dari-jaringan-lokal-kantor)
  * [2.2 Inisialisasi Sistem Pertama Kali via Setup Wizard (Aktivasi Lisensi)](#22-inisialisasi-sistem-pertama-kali-via-setup-wizard-aktivasi-lisensi)
  * [2.3 Panduan Operasional Komputer Admin Kantor (Full Privileges)](#23-panduan-operasional-komputer-admin-kantor-full-privileges)
  * [2.4 Panduan Operasional Komputer Tim Desain (Design Team & RBAC)](#24-panduan-operasional-komputer-tim-desain-design-team--rbac)
  * [2.5 Pengelolaan Standar BIM (ISO 19650) Tanpa Software BIM Khusus](#25-pengelolaan-standar-bim-iso-19650-tanpa-software-bim-khusus)
  * [2.6 Pembuktian Simulasi Keamanan & Sistem Audit Trail](#26-pembuktian-simulasi-keamanan--sistem-audit-trail)

---

# BAGIAN I: PANDUAN DEPLOYMENT & DEVOPS UNTUK DEVELOPER / TEKNISI (YAN TORKY / TORKY KOMPUTER)

Bagian ini ditujukan khusus bagi **Developer / Teknisi IT (Yan Torky / Torky Komputer)** untuk melakukan deployment, maintenance, dan update aplikasi pada server TrueNAS SCALE.

---

### 1.1 Perbedaan Lingkungan Deployment (Homelab Developer vs Server Klien)

Saat melakukan instalasi dan pemeliharaan, pahami perbedaan direktori penyimpanan antara komputer pengujian (Homelab) dan server produksi milik klien:

1. **Lingkungan Homelab / Pengujian Pengembang**:
   * **Path Direktori**: `/home/truenas_admin/management_data_app`
   * **Tujuan**: Tempat uji coba build Docker, validasi skrip, dan eksperimen fitur.

2. **Lingkungan Produksi Server TrueNAS SCALE Klien**:
   * **Path Direktori**: `/mnt/[NAMA_POOL_KLIEN]/apps/management_data_app` (Contoh: `/mnt/tank/apps/management_data_app` atau `/mnt/PoolData/apps/management_data_app`).
   * **Tujuan**: Memastikan file aplikasi tersimpan di dalam ZFS Storage Pool utama klien yang memiliki redundant drive (RAID-Z / Mirror) dan snapshot otomatis.

---

### 1.2 Persiapan ZFS Storage Pool, Dataset & Samba Share (SMB)

Sebelum menjalankan aplikasi MDA, buat 3 Dataset utama pada TrueNAS SCALE klien melalui menu **Datasets**:

1. **Dataset `admin`**:
   * Share Type: **SMB**
   * Hak Akses (ACL): Hanya diberikan kepada `admin_kantor` (Read & Write). User desainer diblokir total (**No Access**).
2. **Dataset `projects`**:
   * Share Type: **SMB**
   * Hak Akses (ACL): Diberikan kepada `admin_kantor` dan grup `design_team` (Read & Write).
3. **Dataset `library`**:
   * Share Type: **SMB**
   * Hak Akses (ACL): Diberikan kepada `admin_kantor` dan grup `design_team` (Read & Write).

---

### 1.3 Hak Akses Root (`sudo -s`) & Socket Docker

Sistem operasi TrueNAS SCALE membatasi akses pengguna biasa (`truenas_admin`) ke socket Docker (`/var/run/docker.sock`). 

> ⚠️ **PENTING**: Setiap kali membuka Terminal SSH TrueNAS SCALE, Anda **WAJIB** masuk ke mode superuser/root terlebih dahulu dengan perintah:
> ```bash
> sudo -s
> ```
Jika perintah `sudo -s` tidak dijalankan, perintah `docker ps`, `docker build`, atau `docker run` akan gagal dengan pesan error `permission denied`.

---

### 1.4 Langkah Instalasi & Build Docker Container Pertama Kali

Jalankan langkah-langkah berikut di terminal SSH TrueNAS SCALE:

```bash
# Langkah 1: Pindah ke mode root (WAJIB)
sudo -s

# Langkah 2: Buat & masuk ke direktori proyek
# (Sesuaikan path dengan lingkungan server: /home/truenas_admin/... atau /mnt/[POOL_NAME]/apps/...)
mkdir -p /home/truenas_admin/management_data_app
cd /home/truenas_admin/management_data_app

# Langkah 3: Clone repositori privat GitHub
git clone https://github.com/yantorky/management_data_app.git .

# Langkah 4: Build Docker Image lokal
docker build -t torky/mda:latest .
```

---

### 1.5 Menjalankan Aplikasi dengan Port Host `3030`

Aplikasi MDA menggunakan port internal container **`3000`**. Namun untuk menghindari konflik dengan aplikasi internal TrueNAS SCALE lain, port yang dipublikasikan ke jaringan luar/host adalah **`3030`**.

Perintah resmi untuk menjalankan kontainer MDA:

```bash
# Pastikan berada di mode root (sudo -s)
docker stop mda-app 2>/dev/null
docker rm mda-app 2>/dev/null

docker run -d -p 3030:3000 --name mda-app --restart always torky/mda:latest
```

Port Mapping: **`-p 3030:3000`** (`Host Port: 3030` ➔ `Container Port: 3000`).

---

### 1.6 Prosedur Perbaharui Kode (Git Pull & Rebuild Docker Image)

Jika terdapat perbaikan kode di repositori GitHub, lakukan langkah pembaruan berikut pada server TrueNAS SCALE:

```bash
# 1. Pindah ke mode root (Wajib)
sudo -s

# 2. Masuk ke direktori repositori
cd /home/truenas_admin/management_data_app

# 3. Tarik kode terbaru dari repositori GitHub
git pull origin main

# 4. Rebuild Docker Image terbaru
docker build -t torky/mda:latest .

# 5. Stop, hapus kontainer lama, dan jalankan kontainer baru
docker stop mda-app 2>/dev/null
docker rm mda-app 2>/dev/null
docker run -d -p 3030:3000 --name mda-app --restart always torky/mda:latest
```

Aplikasi versi terbaru akan langsung aktif dan dapat diakses kembali oleh klien.

---

### 1.7 Kebijakan Lisensi Offline & Prosedur Penerbitan Kunci Lisensi

Sistem MDA menerapkan **Zero Security Hole Policy** untuk melindungi hak cipta pengembang (Yan Torky / Torky Komputer):

1. **Aturan Distribusi**: File generator lisensi (`generate.bat` atau `keygen.js`) **TIDAK BOLEH** disertakan dalam repositori publik/klien atau di dalam paket kontainer aplikasi.
2. **Prosedur Aktivasi Klien**:
   * Klien membuka Setup Wizard di browser dan mencatat **TrueNAS Machine ID** (`MDA-HW-...`).
   * Klien menyerahkan Machine ID tersebut kepada Yan Torky / Torky Komputer.
   * Yan Torky menjalankan generator lisensi secara offline di PC pengembang untuk membuat **Kunci Lisensi Resmi** (`TORKY-SECURE-2026-MDA-XXXXXX`).
   * Yan Torky memberikan Kunci Lisensi kepada klien untuk diinputkan pada Setup Wizard.

---

# BAGIAN II: MANUAL BOOK & PANDUAN PENGGUNAAN APLIKASI UNTUK KLIEN / KANTOR KONSULTAN

Bagian ini merupakan pedoman operasional harian yang diperuntukkan bagi **Pemilik Kantor, Admin Utama, dan Tim Desain (Desainer/Drafter)** di kantor konsultan arsitektur.

---

### 2.1 Akses Web Aplikasi dari Jaringan Lokal Kantor

Seluruh komputer yang terhubung ke jaringan Wi-Fi atau LAN kantor dapat menguji dan menggunakan aplikasi web MDA melalui penjelajah web (Google Chrome, Microsoft Edge, Firefox, atau Safari):

* **Alamat URL Akses Web**: `http://<IP_ADDRESS_TRUENAS>:3030`
* **Contoh**: `http://192.168.1.150:3030`

---

### 2.2 Inisialisasi Sistem Pertama Kali via Setup Wizard (Aktivasi Lisensi)

Saat aplikasi pertama kali dibuka pada instalasi baru, sistem akan menampilkan **Setup Wizard (Inisialisasi Awal System & Lisensi)**:

```
+-----------------------------------------------------------------------+
|                 SETUP WIZARD MANAGEMENT DATA APP                      |
+-----------------------------------------------------------------------+
| 1. Nama Firma / Kantor Konsultan : [ Konsultan Arsitek Nusantara ]    |
| 2. IP Address Server Samba       : [ 192.168.1.150 ]                  |
| 3. Nama ZFS Samba Pool           : [ PoolData ]                       |
|                                                                       |
| 4. TrueNAS Machine ID (Sidik Jari Hardware) :                         |
|    [ MDA-HW-A1B2-C3D4-E5F6-7890 ]  <-- (Salin & Kirim ke Yan Torky)   |
|                                                                       |
| 5. Input Kunci Lisensi Resmi     :                                    |
|    [ TORKY-SECURE-2026-MDA-XXXXXX ]                                   |
|                                                                       |
| 6. Buat Akun Super Admin & Daftarkan Sistem                           |
+-----------------------------------------------------------------------+
```

1. Isi Nama Firma, IP Samba TrueNAS, dan Nama ZFS Pool.
2. Salin **TrueNAS Machine ID** dan kirimkan ke penyedia layanan (Yan Torky / Torky Komputer).
3. Masukkan **Kunci Lisensi Resmi** yang diterbitkan oleh Yan Torky.
4. Buat Username dan Password untuk akun Super Admin Kantor, lalu klik **Daftarkan Akun & Inisialisasi Sistem**.

---

### 2.3 Panduan Operasional Komputer Admin Kantor (Full Privileges)

Pemilik Kantor / Admin Utama memiliki akses penuh ke seluruh fitur aplikasi MDA dan seluruh folder Samba Share TrueNAS:

#### A. Pemetaan Drive Jaringan di Windows (Map Network Drive)
Pada komputer Admin Kantor, petakan 3 folder jaringan berikut ke Windows Explorer:
* **Drive A:** `\\192.168.1.150\admin` (Kredensial User: `admin_kantor`)
* **Drive P:** `\\192.168.1.150\projects` (Kredensial User: `admin_kantor`)
* **Drive L:** `\\192.168.1.150\library` (Kredensial User: `admin_kantor`)

#### B. Fitur Utama Web Admin:
1. **Dashboard Monitoring**: Memantau kapasitas penyimpanan ZFS Pool, status kesehatan server TrueNAS, dan persentase kepatuhan ISO 19650.
2. **Manajemen Pengguna (RBAC)**: Menambahkan akun staf desainer baru dan menyetel hak akses mereka.
3. **Audit Trail Log**: Memantau log aktivitas harian seluruh staf, termasuk riwayat pembatasan akses ilegal.

---

### 2.4 Panduan Operasional Komputer Tim Desain (Design Team & RBAC)

Tim Desain (Arsitek, Drafter, 3D Modeler) menggunakan aplikasi MDA untuk mengorganisir berkas gambar kerja tanpa diberikan akses ke folder keuangan/administrasi kantor.

#### A. Pemetaan Drive Jaringan di Windows (Map Network Drive)
Pada komputer desainer, folder admin diblokir total oleh server TrueNAS SCALE:
* **Drive P:** `\\192.168.1.150\projects` (Kredensial User: `desainer_staf`)
* **Drive L:** `\\192.168.1.150\library` (Kredensial User: `desainer_staf`)
* *(Catatan: Pemetaan `\\192.168.1.150\admin` akan otomatis ditolak dengan pesan "Access Denied").*

---

### 2.5 Pengelolaan Standar BIM (ISO 19650) Tanpa Software BIM Khusus

Aplikasi MDA memungkinkan kantor konsultan menjalankan alur kerja manajemen data **BIM ISO 19650-2** meskipun tim produksi masih menggunakan software 2D/3D konvensional seperti **AutoCAD (*.dwg)** dan **SketchUp (*.skp)**.

#### Generator Nama Berkas Standar ISO 19650-2
1. Pada aplikasi Web MDA, buka **File Manager** ➔ Pilih Proyek.
2. Klik tombol **Generator Kode Penamaan ISO**.
3. Pilih parameter berkas:
   * **Kode Proyek**: `PRJ1`
   * **Pemrakarsa (Originator)**: `MDA`
   * **Volume/Sistem**: `ZZ` (Keseluruhan Bangunan)
   * **Level/Lokasi**: `XX` (Multi-Lantai)
   * **Jenis Berkas**: `DR` (Drawing / Gambar Kerja)
   * **Disiplin**: `A` (Arsitektur) atau `S` (Struktur)
   * **Nomor Lembar**: `0001`
4. Generator akan menyusun nama resmi otomatis:
   `PRJ1-MDA-ZZ-XX-DR-A-0001`
5. Gunakan nama tersebut sebagai nama file AutoCAD (`PRJ1-MDA-ZZ-XX-DR-A-0001.dwg`) sebelum diunggah ke server.
6. **Sistem Versioning Otomatis**: Setiap kali ada revisi gambar, unggah file dengan nama yang sama. Sistem akan menyimpan versi terdahulu (misal: Rev `P01.01` ➔ `P01.02`) tanpa menimpa histori gambar lama.

---

### 2.6 Pembuktian Simulasi Keamanan & Sistem Audit Trail

Aplikasi MDA dilengkapi dengan modul simulasi keamanan visual untuk memastikan kebijakan Role-Based Access Control (RBAC) berjalan dengan sempurna:

```
[Komputer Tim Desain]
       |
       v
Membuka Folder: 00_Admin (\\TrueNAS\admin)
       |
 ⛔ AKSES DITOLAK SECHARA SISTEM (Samba Share Restricted)
       |
       v
[Sistem Mencatat Kejadian ke Audit Trail Log Admin]
```

1. Jika staf desainer mencoba mengklik folder **`00_Admin`** di dalam web MDA, sistem akan menampilkan perisai merah peringatan bahwa akses ditolak di tingkat Samba Share.
2. Kejadian tersebut langsung dicatat dalam **Audit Trail Log** lengkap dengan stempel waktu, nama pengguna, dan IP address komputer staf untuk keperluan audit keamanan berkala.

---

*Dokumen ini diterbitkan secara resmi oleh Torky Komputer Security Engine untuk penjaminan mutu deployment dan operasional sistem Management Data App.*
