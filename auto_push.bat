@echo off
REM Menggunakan pushd agar mendukung UNC path (TrueNAS / Samba share) secara otomatis jika dijalankan langsung lewat network share
pushd "%~dp0" 2>nul

title Auto Push Repository - Management Data App
color 0B

echo =====================================================================
echo  TORKY KOMPUTER SECURITY ENGINE - AUTOMATED REPOSITORY SINKRONISASI
echo =====================================================================
echo  Software: Management Data App (MDA) - Enterprise Vault Edition
echo  Developer/Owner: Yan Torky / Torky Komputer
echo =====================================================================
echo.
echo [INFO] Direktori Kerja Aktif: %CD%
echo.

REM Memeriksa apakah Git terinstall
git --version >nul 2>&1
if errorlevel 1 goto NO_GIT

REM Mengatasi error "dubious ownership" (safe.directory) di sistem berkas TrueNAS/Samba/Network Share
echo [INFO] Mengonfigurasi pengecualian direktori aman (safe.directory)...
git config --global safe.directory "*" >nul 2>&1
git config safe.directory "*" >nul 2>&1
echo [OK] Izin direktori aman berhasil diaktifkan.
echo.

REM Memeriksa apakah direktori .git ada untuk melakukan pembersihan berkas kunci (.lock)
if not exist .git goto INIT_GIT
echo [INFO] Mendeteksi dan membersihkan file kunci (.lock) Git yang tertinggal...
del /f /q /s .git\*.lock >nul 2>nul
echo [OK] Seluruh file kunci (.lock) berhasil dibersihkan secara otomatis.
echo.
goto CHECK_REMOTE

:INIT_GIT
echo [INFO] Menginisialisasi repositori Git lokal...
git init
echo.

:CHECK_REMOTE
REM Memeriksa apakah remote origin sudah ada dan apakah menggunakan Token (mengandung @github.com)
set "current_remote="
for /f "tokens=*" %%i in ('git remote get-url origin 2^>nul') do set "current_remote=%%i"

if "%current_remote%"=="" goto ADD_REMOTE

REM Melakukan pengecekan substring secara aman tanpa menggunakan pipa (pipe) echo untuk menghindari crash karakter spesial
set "has_token=0"
echo "%current_remote%" | findstr "@github.com" >nul 2>&1
if not errorlevel 1 set "has_token=1"

if "%has_token%"=="1" goto DETECTED_TOKEN

echo [INFO] Memperbarui tautan remote origin...
git remote remove origin >nul 2>&1

:ADD_REMOTE
echo [INFO] Menambahkan remote origin baru...
git remote add origin https://github.com/yantorky/management_data_app.git
goto REMOTE_DONE

:DETECTED_TOKEN
echo [INFO] Mendeteksi remote origin dengan Token Keamanan yang sudah aktif.
echo [OK] Menggunakan remote origin yang ada agar tidak perlu input ulang Token.

:REMOTE_DONE
echo.

REM Mengonfigurasi identitas Git lokal secara langsung untuk mencegah kegagalan commit
echo [INFO] Memastikan identitas Git lokal terkonfigurasi...
git config --local user.name "Yan Torky"
git config --local user.email "torkykomputer@gmail.com"
echo [OK] Identitas diatur ke: Yan Torky (torkykomputer@gmail.com)
echo.

echo [1/5] Memeriksa status berkas lokal...
git status -s
echo.

echo [2/5] Menambahkan seluruh berkas dan pembaruan kode...
git add .
echo [OK] Berkas berhasil dimasukkan ke staging area.
echo.

echo [3/5] Melakukan commit perubahan...
set "commit_msg="
set /p commit_msg="Masukkan catatan perubahan (kosongkan untuk default: 'Update dan Sinkronisasi Repositori MDA'): "

if "%commit_msg%"=="" set "commit_msg=Update dan Sinkronisasi Repositori MDA"
REM Bersihkan karakter kutip ganda dari pesan commit agar tidak merusak perintah git commit
if not "%commit_msg%"=="" set "commit_msg=%commit_msg:"=%"

git commit -m "%commit_msg%" >nul 2>&1
echo [OK] Pemrosesan commit selesai.
echo.

echo [4/5] Mengatur branch utama ke 'main'...
git branch -M main >nul 2>&1
echo [OK] Branch lokal diatur ke 'main'.
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
echo  [3] INPUT GITHUB TOKEN (PAT) - KHUSUS REPOSITORI PRIVATE
echo      Gunakan jika repositori diatur ke PRIVATE dan meminta password
echo      atau memunculkan error 'Repository Not Found'.
echo.
echo  [4] KELUAR - Batalkan
echo.
set "opt="
set /p opt="Masukkan pilihan Anda (1/2/3/4): "

if not "%opt%"=="" set "opt=%opt:"=%"

if "%opt%"=="1" goto DO_FORCE_PUSH
if "%opt%"=="2" goto DO_PULL_MERGE
if "%opt%"=="3" goto DO_AUTH_PAT
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

:DO_AUTH_PAT
echo.
echo =====================================================================
echo  AUTENTIKASI GITHUB PERSONAL ACCESS TOKEN (PAT)
echo =====================================================================
echo  Langkah membuat Token classic di GitHub:
echo  1. Buka browser ke: https://github.com/settings/tokens
echo  2. Klik "Generate new token" - "Generate new token (classic)"
echo  3. Berikan nama (misal: MDA_Key), pilih kedaluwarsa (misal: 30 hari), dan
echo     CENTANG pilihan "repo" (Full control of private repositories).
echo  4. Klik "Generate token" di bawah, lalu SALIN kode token yang muncul
echo     (biasanya diawali dengan 'ghp_').
echo =====================================================================
echo.
set "pat_token="
set /p pat_token="Tempel/Paste GitHub Token Anda disini: "
if "%pat_token%"=="" goto AUTH_PAT_EMPTY
set "pat_token=%pat_token:"=%"

echo [INFO] Mengonfigurasi kredensial remote dengan Token...
git remote remove origin >nul 2>&1
git remote add origin https://%pat_token%@github.com/yantorky/management_data_app.git
echo [OK] Remote origin telah diperbarui dengan Token pengaman.
echo.
echo Mencoba push kembali menggunakan Token...
git push origin main
if errorlevel 1 goto DO_FORCE_PAT
goto PUSH_SUCCESS

:DO_FORCE_PAT
echo [INFO] Push standar dengan token gagal, mencoba Force Push dengan token...
git push origin main --force
if errorlevel 1 goto ACTUAL_FAILED
goto PUSH_SUCCESS

:AUTH_PAT_EMPTY
echo [ERR] Token tidak boleh kosong!
pause
goto PUSH_FAILED

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
popd
exit /b

:END_SCRIPT
echo.
pause
popd
