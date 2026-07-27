# Standar Operasional Prosedur (SOP) Agen AI - Management Data App

SOP ini wajib dipatuhi oleh Agen AI dalam setiap interaksi dan pengembangan aplikasi Management Data App.

## 1. Aturan Komunikasi & Bahasa
- **Bahasa Utama**: Seluruh percakapan, penjelasan, draf rencana, dan dokumentasi harus disajikan dalam **Bahasa Indonesia** yang profesional, lugas, dan terstruktur.
- **Tone**: Profesional, berfokus pada standar enterprise, dan berorientasi pada detail teknis arsitektur data.

## 2. Manajemen Perubahan Kode & Persetujuan Pengguna (Crucial)
- **TIDAK BOLEH** melakukan perubahan kode (baik modifikasi file `.tsx`, `.ts`, `.html`, dll.) sebelum menyusun draf rencana perubahan secara mendetail.
- **Draf Rencana**: Harus dipaparkan secara detail, mencakup aspek fungsionalitas, visual, dan struktur data yang akan ditambahkan atau di-koreksi.
- **Konfirmasi**: Perubahan hanya boleh dieksekusi setelah mendapatkan persetujuan/konfirmasi eksplisit dari pengguna di dalam chat.

## 3. Standar Arsitektur Data Kantor Konsultan & Keamanan Sistem (Enterprise-Grade)
- **BIM Tanpa Software BIM Khusus**: Sistem manajemen data harus mampu mengontrol alur kerja standar BIM (seperti ISO 19650) meskipun tim produksi menggunakan software CAD konvensional (AutoCAD) dan program modeling 3D (SketchUp).
- **Integrasi TrueNAS Scale/Core & Samba Share**:
  - Mendukung pemetaan 3 Datasheet/Samba Share: `admin`, `projects`, dan `library`.
  - **Kebijakan Akses (RBAC)**:
    - **Komputer Admin Kantor**: Diizinkan melihat dan mengedit datasheet `admin`, `projects`, dan `library`.
    - **Komputer Desainer (Design Team)**: Hanya diizinkan melihat dan mengedit datasheet `projects` dan `library` (Akses ke `admin` diblokir total secara sistem).
  - **Konfigurasi Fleksibel**: Parameter IP Address, Pool Name (Samba Pool), dan Status Mapping harus bersifat umum/konfigurabel, tidak boleh di-hardcode ke satu nama kantor atau pool tertentu, melainkan memberikan panduan instruksi penyesuaian yang jelas.
- **Konfigurasi Port TrueNAS Container**:
  - Port internal container: `3000`.
  - Port publik/host TrueNAS SCALE: **`3030`** (Konfigurasi wajib: `-p 3030:3000`). Akses web klien: `http://<IP_TRUENAS>:3030`.
- **Kebijakan Keamanan Kunci Lisensi (Zero Security Hole Policy)**:
  - **DILARANG KERAS** menyertakan file `generate.bat`, `keygen.js`, atau tombol publik "Auto-Generate Lisensi" di Setup Wizard publik aplikasi.
  - Skrip generator lisensi adalah **EKSKLUSIF DEVELOPER** (Yan Torky / Torky Komputer) dan tidak boleh didistribusikan di dalam repositori atau paket aplikasi klien untuk mencegah celah manipulasi lisensi secara mandiri oleh klien.
  - Klien hanya diizinkan melihat **TrueNAS Machine ID** dan menginputkan **Kunci Lisensi** resmi yang diterbitkan oleh Yan Torky.

## 4. Trigger Perintah Khusus (Pindah & Unggah Repositori)
- **Pemicu (Trigger Phrase)**: Jika pengguna mengirimkan pesan berisi atau mirip dengan:
  `"tolong siapkan saya mau pindah edit kode dan upload perbaruan repository"`
- **Tindakan Agen (Immediate Action)**:
  1. **Langsung Paham**: Agen harus langsung mengerti bahwa pengguna ingin beralih ke pengerjaan lokal (di laptop/PC sendiri) dan ingin mensinkronkan seluruh perubahan kode terbaru ke repositori GitHub privat miliknya (`https://github.com/yantorky/management_data_app.git`).
  2. **Verifikasi Kesiapan**: Lakukan linting (`lint_applet`) dan kompilasi (`compile_applet`) secara otomatis untuk memastikan aplikasi dalam kondisi 100% bebas dari error sintaks/build sebelum diunggah.
  3. **Siapkan Script**: Pastikan file `/Auto_Push.bat` tersedia dengan konfigurasi baris akhir CRLF (Windows format) dan fungsionalitas pembersihan file kunci (`.lock`) serta opsi *Force Push* / *PAT Token* tetap prima.
  4. **Eksekusi & Instruksi Mandiri**: Berikan instruksi singkat, padat, dan jelas mengenai cara pengguna menjalankan `Auto_Push.bat` di komputer lokal mereka untuk menarik (pull) atau mendorong (push) kode tanpa perlu meminta konfirmasi berulang kali.


