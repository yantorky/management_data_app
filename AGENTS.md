# Standar Operasional Prosedur (SOP) Agen AI - Management Data App

SOP ini wajib dipatuhi oleh Agen AI dalam setiap interaksi dan pengembangan aplikasi Management Data App.

## 1. Aturan Komunikasi & Bahasa
- **Bahasa Utama**: Seluruh percakapan, penjelasan, draf rencana, dan dokumentasi harus disajikan dalam **Bahasa Indonesia** yang profesional, lugas, dan terstruktur.
- **Tone**: Profesional, berfokus pada standar enterprise, dan berorientasi pada detail teknis arsitektur data.

## 2. Manajemen Perubahan Kode & Persetujuan Pengguna (Crucial)
- **TIDAK BOLEH** melakukan perubahan kode (baik modifikasi file `.tsx`, `.ts`, `.html`, dll.) sebelum menyusun draf rencana perubahan secara mendetail.
- **Draf Rencana**: Harus dipaparkan secara detail, mencakup aspek fungsionalitas, visual, dan struktur data yang akan ditambahkan atau dikoreksi.
- **Konfirmasi**: Perubahan hanya boleh dieksekusi setelah mendapatkan persetujuan/konfirmasi eksplisit dari pengguna di dalam chat.

## 3. Standar Arsitektur Data Kantor Konsultan (Enterprise-Grade)
- **BIM Tanpa Software BIM Khusus**: Sistem manajemen data harus mampu mengontrol alur kerja standar BIM (seperti ISO 19650) meskipun tim produksi menggunakan software CAD konvensional (AutoCAD) dan program modeling 3D (SketchUp).
- **Integrasi TrueNAS Scale/Core & Samba Share**:
  - Mendukung pemetaan 3 Datasheet/Samba Share: `admin`, `projects`, dan `library`.
  - **Kebijakan Akses (RBAC)**:
    - **Komputer Admin Kantor**: Diizinkan melihat dan mengedit datasheet `admin`, `projects`, dan `library`.
    - **Komputer Desainer (Design Team)**: Hanya diizinkan melihat dan mengedit datasheet `projects` dan `library` (Akses ke `admin` diblokir total secara sistem).
  - **Konfigurasi Fleksibel**: Parameter IP Address, Pool Name (Samba Pool), dan Status Mapping harus bersifat umum/konfigurabel, tidak boleh di-hardcode ke satu nama kantor atau pool tertentu (seperti AreaNas, StaNas, APNAS), melainkan memberikan panduan instruksi penyesuaian yang jelas.
