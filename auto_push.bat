@echo off
title Auto Push Repository - Management Data App
color 0B

echo =====================================================================
echo  TORKY KOMPUTER SECURITY ENGINE - AUTOMATED REPOSITORY SINKRONISASI
echo =====================================================================
echo  Software: Management Data App (MDA) - Enterprise Vault Edition
echo  Developer/Owner: Yan Torky / Torky Komputer
echo =====================================================================
echo.

:: Memeriksa apakah Git terinstall menggunakan 'where'
where git >nul 2>nul
if errorlevel 1 goto NO_GIT

:: Mengatasi error "dubious ownership" (safe.directory) di sistem berkas TrueNAS/Samba/Network Share
echo [INFO] Mengonfigurasi pengecualian direktori aman (safe.directory)...
:: Mencegah duplikasi konfigurasi global yang dapat membengkak jika dijalankan berkali-kali
git config --global --get-all safe.directory | findstr /C:"*" >nul 2>nul
if errorlevel 1 (
    git config --global --add safe.directory "*" >nul 2>nul
)
git config --global --get-all safe.directory | findstr /C:"%CD:\=/%" >nul 2>nul
if errorlevel 1 (
    git config --global --add safe.directory "%CD%" >nul 2>nul
)
echo [OK] Izin direktori aman berhasil diaktifkan.
echo.

:: Memeriksa apakah ini adalah repository Git, jika belum maka inisialisasi
git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 goto INIT_GIT
goto CHECK_REMOTE

:INIT_GIT
echo [INFO] Menginisialisasi repositori Git lokal...
git init
echo.

:CHECK_REMOTE
:: Mengonfigurasi remote origin secara otomatis ke repositori tujuan Anda
echo [0/5] Mengonfigurasi tautan repositori remote...
git remote remove origin >nul 2>nul
git remote add origin https://github.com/yantorky/management_data_app
echo [OK] Remote origin diatur ke: https://github.com/yantorky/management_data_app
echo.

echo [1/5] Memeriksa status berkas lokal...
git status -s
echo.

echo [2/5] Menambahkan seluruh berkas dan pembaruan kode...
git add .
echo [OK] Berkas berhasil dimasukkan ke staging area.
echo.

echo [3/5] Melakukan commit perubahan...
:: Meminta input commit message dengan aman tanpa resiko crash parsing karakter khusus
set "commit_msg="
set /p commit_msg="Masukkan catatan perubahan (kosongkan untuk default: 'Update dan Sinkronisasi Repositori MDA'): "

if not defined commit_msg (
    set "commit_msg=Update dan Sinkronisasi Repositori MDA"
) else (
    :: Bersihkan tanda kutip dua untuk menghindari kegagalan parser command line Git
    set "commit_msg=%commit_msg:"=%"
)

git commit -m "%commit_msg%"
if errorlevel 1 goto NO_CHANGES
echo [OK] Berkas berhasil dicommit dengan pesan: "%commit_msg%"
goto MAIN_BRANCH

:NO_CHANGES
echo [INFO] Tidak ada perubahan berkas baru yang perlu dicommit.

:MAIN_BRANCH
echo.
echo [4/5] Mengatur branch utama ke 'main'...
git branch -M main >nul 2>nul
echo.

echo [5/5] Melakukan pengiriman data (Push) ke repositori Git...
echo Mengirim ke branch 'main'...
git push origin main
if errorlevel 1 goto PUSH_FAILED
goto PUSH_SUCCESS

:PUSH_FAILED
echo.
echo =====================================================================
echo  [PERINGATAN] SINKRONISASI STANDAR DITOLAK - REJECTED ATAU FETCH FIRST
echo =====================================================================
echo  Hal ini biasanya terjadi karena:
echo  1. Repositori di GitHub sudah memiliki berkas awal seperti README/LICENSE
echo     yang tidak ada di komputer lokal Anda (perbedaan riwayat commit).
echo  2. Anda belum login atau belum mengatur Access Token/SSH Key yang benar.
echo =====================================================================
echo.
echo  PILIHAN PENANGANAN OTOMATIS:
echo  [1] FORCE PUSH - Unggah Paksa (SANGAT DIREKOMENDASIKAN)
echo      Menimpa isi GitHub agar 100%% sama persis dengan kode lokal Anda saat ini.
echo      Sangat cocok untuk inisialisasi awal repositori baru.
echo.
echo  [2] PULL dan MERGE - Tarik dan Gabungkan
echo      Mencoba menggabungkan berkas dari GitHub dengan berkas lokal Anda
echo      menggunakan toleransi perbedaan riwayat secara non-blocking.
echo.
echo  [3] KELUAR - Batalkan
echo.
set "opt="
set /p opt="Masukkan pilihan Anda (1/2/3): "

:: Bersihkan tanda kutip dari input user untuk mencegah crash syntax parser CMD Windows
if defined opt set "opt=%opt:"=%"

if "%opt%"=="1" goto DO_FORCE_PUSH
if "%opt%"=="2" goto DO_PULL_MERGE
goto ACTUAL_FAILED

:DO_FORCE_PUSH
echo.
echo [INFO] Menjalankan Force Push ke branch 'main'...
git push origin main --force
if errorlevel 1 goto ACTUAL_FAILED
goto PUSH_SUCCESS

:DO_PULL_MERGE
echo.
echo [INFO] Menjalankan Pull dengan toleransi perbedaan history (non-blocking)...
git pull origin main --allow-unrelated-histories --no-rebase --no-edit
if errorlevel 1 goto ACTUAL_FAILED
echo.
echo [OK] Berkas berhasil digabungkan. Mencoba push kembali...
git push origin main
if errorlevel 1 goto ACTUAL_FAILED
goto PUSH_SUCCESS

:ACTUAL_FAILED
echo.
echo =====================================================================
echo  [ERR] PROSES SINKRONISASI TETAP GAGAL!
echo =====================================================================
echo  Penyebab teknis:
echo  1. Koneksi internet terputus atau hak akses ke akun GitHub ditolak.
echo  2. Pastikan repositori target https://github.com/yantorky/management_data_app
echo     benar-benar ada di akun GitHub Anda.
echo  3. Pastikan Anda sudah login menggunakan akun Git Anda di Windows.
echo =====================================================================
goto END_SCRIPT

:PUSH_SUCCESS
echo.
echo =====================================================================
echo  [SUKSES] SINKRONISASI REPOSITORI BERHASIL DIJALANKAN!
echo =====================================================================
echo  Seluruh kode sumber terbaru Anda telah terunggah dengan aman ke
echo  repositori privat Anda. Siap untuk ditarik (clone) saat instalasi server!
echo =====================================================================
goto END_SCRIPT

:NO_GIT
echo [ERROR] Git tidak terdeteksi di komputer Anda!
echo Silakan install Git terlebih dahulu dari https://git-scm.com/
echo Pastikan Anda memilih opsi "Add to PATH" saat mengunduh Git.
echo.
pause
exit /b

:END_SCRIPT
echo.
pause
