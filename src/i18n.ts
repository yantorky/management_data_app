// Translation dictionary for Management Data App
// Default: US ENGLISH (EN), secondary: INDONESIAN (ID)

export type Language = 'EN' | 'ID';

export interface TranslationSet {
  // Common
  appName: string;
  appSubtitle: string;
  copyright: string;
  back: string;
  cancel: string;
  save: string;
  delete: string;
  add: string;
  edit: string;
  search: string;
  status: string;
  action: string;
  loading: string;
  success: string;
  failed: string;
  error: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullName: string;
  role: string;
  active: string;
  inactive: string;
  unauthorized: string;
  unauthorizedDesc: string;

  // Tabs
  dashboard: string;
  clients: string;
  projectHub: string;
  truenasSamba: string;
  aiSandbox: string;
  auditTrail: string;
  userManual: string;

  // Setup Wizard
  setupTitle: string;
  setupSubtitle: string;
  setupIdentity: string;
  setupOfficeName: string;
  setupInfrastructure: string;
  setupTrueNASOption: string;
  setupStandaloneOption: string;
  setupIPAddress: string;
  setupPoolName: string;
  setupAdminCredentials: string;
  setupAdminName: string;
  setupAdminEmail: string;
  setupAdminPassword: string;
  setupConfirmPassword: string;
  setupRegionTime: string;
  setupRegion: string;
  setupTimezone: string;
  setupLicenseKey: string;
  setupLicensePlaceholder: string;
  setupLicenseHint: string;
  machineIdLabel: string;
  zfsFingerprint: string;
  copyIdBtn: string;
  copyIdSuccess: string;
  machineIdHint: string;
  devOnlyBtn: string;
  setupBtn: string;
  setupBimCompliance: string;
  setupPasswordTooShort: string;
  setupPasswordMismatch: string;
  setupLicenseInvalid: string;

  // License Status & Anti-Duplication
  licenseStatus: string;
  licenseVerified: string;
  licenseSecured: string;
  sourceProtectionActive: string;
  sourceProtectionDesc: string;
  hardwareFingerprint: string;
  antiduplicationHash: string;
  licensingSecurityModule: string;

  // Dashboard Tab
  welcomeBack: string;
  dashboardSummary: string;
  totalProjects: string;
  activeProjects: string;
  managedArea: string;
  managedBudget: string;
  activeClients: string;
  auditLogsCount: string;
  quickStats: string;
  recentLogs: string;
  isoNamingHelper: string;
  isoNamingDesc: string;
  generateCode: string;
  copyCode: string;

  // Projects Tab
  projectContext: string;
  potentialPromoTitle: string;
  potentialPromoDesc: string;
  potentialPromoBtn: string;
  promoteSuccess: string;
  projectTeam: string;
  addMember: string;
  folderCabinet: string;
  uploadDocument: string;
  dragDropText: string;
  xrefRelativeMethod: string;
  xrefSharedMethod: string;
  xrefMethodTitle: string;
  xrefMethodDesc: string;

  // TrueNAS Samba Tab
  truenasStatus: string;
  sambaPools: string;
  mappedSambaShares: string;
  adminShare: string;
  projectsShare: string;
  libraryShare: string;
  rbacControlStatus: string;
  adminPcAccess: string;
  designerPcAccess: string;
  readWrite: string;
  readOnly: string;
  blockedAccess: string;
}

export const translations: Record<Language, TranslationSet> = {
  EN: {
    appName: "Management Data App",
    appSubtitle: "Enterprise ISO 19650 Design & Recruitment Suite",
    copyright: "Copyright © Torky Komputer. All Rights Reserved.",
    back: "Back",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    add: "Add",
    edit: "Edit",
    search: "Search",
    status: "Status",
    action: "Action",
    loading: "Loading...",
    success: "Success",
    failed: "Failed",
    error: "Error",
    password: "Password",
    confirmPassword: "Confirm Password",
    email: "Email Address",
    fullName: "Full Name",
    role: "User Role",
    active: "Active",
    inactive: "Inactive",
    unauthorized: "Access Denied",
    unauthorizedDesc: "Only authorized personnel can modify this configuration.",

    dashboard: "Dashboard",
    clients: "Clients",
    projectHub: "Project Hub",
    truenasSamba: "TrueNAS Samba",
    aiSandbox: "AI Sandbox",
    auditTrail: "Audit Trail",
    userManual: "User Manual",

    setupTitle: "System Installation & Database Initialization",
    setupSubtitle: "Configure your architecture firm profile, register the primary Super Admin account, and set network storage configurations.",
    setupIdentity: "1. Firm Identity Parameters",
    setupOfficeName: "Architecture Firm / Office Name",
    setupInfrastructure: "Storage Infrastructure Mode",
    setupTrueNASOption: "TrueNAS Server & Samba Share Mapping (Enterprise)",
    setupStandaloneOption: "Standalone Workstation / Single PC Mode",
    setupIPAddress: "TrueNAS Server IP Address",
    setupPoolName: "Samba Pool Name (ZFS Pool)",
    setupAdminCredentials: "2. Primary Super Admin Credentials",
    setupAdminName: "Administrator Full Name",
    setupAdminEmail: "Primary Work Email",
    setupAdminPassword: "Super Admin Password",
    setupConfirmPassword: "Confirm Password",
    setupRegionTime: "3. Regional & Time Settings",
    setupRegion: "Operating Region",
    setupTimezone: "System Timezone",
    setupLicenseKey: "4. Torky Komputer License Security Key",
    setupLicensePlaceholder: "Enter License Key from Torky Komputer...",
    setupLicenseHint: "Application is cryptographically locked based on client TrueNAS Machine ID to prevent piracy and software cloning.",
    machineIdLabel: "TRUENAS MACHINE ID (CLIENT)",
    zfsFingerprint: "ZFS FINGERPRINT",
    copyIdBtn: "Copy ID",
    copyIdSuccess: "Copied!",
    machineIdHint: "Send the Machine ID above to Yan Torky (Torky Komputer) to get your valid activation License Key.",
    devOnlyBtn: "Yan Torky Developer Suite",
    setupBtn: "Register Account & Initialize System",
    setupBimCompliance: "This initialization automatically applies ISO 19650-1 & 19650-2 BIM standards compliance to local databases.",
    setupPasswordTooShort: "Password is too short. Please enter at least 6 characters for enterprise-level data protection.",
    setupPasswordMismatch: "Password confirmation does not match the super admin password.",
    setupLicenseInvalid: "Invalid License Key! Please enter a valid activation code from Torky Komputer.",

    licenseStatus: "License Status",
    licenseVerified: "LICENSE VERIFIED & CRYPTOGRAPHICALLY SECURED",
    licenseSecured: "Secured by Torky Komputer Security Engine",
    sourceProtectionActive: "SOURCE CODE PROTECTION: ENCRYPTED & ACTIVE",
    sourceProtectionDesc: "Duplication restricted. Binary Obfuscation and anti-tamper hash verification is running in the container workspace.",
    hardwareFingerprint: "Hardware Fingerprint Hash",
    antiduplicationHash: "Anti-Duplication Hash",
    licensingSecurityModule: "Torky Komputer Licensing Module",

    welcomeBack: "Welcome back",
    dashboardSummary: "Here is your architect office's overall ISO 19650 workspace & storage overview.",
    totalProjects: "Total Projects",
    activeProjects: "Active Projects",
    managedArea: "Managed Design Area",
    managedBudget: "Cumulative Project Budget",
    activeClients: "Active Clients",
    auditLogsCount: "Audit Log Records",
    quickStats: "Quick Firm Statistics",
    recentLogs: "Recent Compliance Activities",
    isoNamingHelper: "ISO 19650 Document Naming Helper",
    isoNamingDesc: "Generate standard-compliant file names according to ISO 19650 naming conventions.",
    generateCode: "Generate Code",
    copyCode: "Copy Code",

    projectContext: "Active Project Context",
    potentialPromoTitle: "Potential Prospect (Negotiation Phase)",
    potentialPromoDesc: "This project is currently in the bidding/negotiation phase. Promote it to create active directories and map Samba shares.",
    potentialPromoBtn: "Promote to Active (CURRENT)",
    promoteSuccess: "Project successfully promoted to Active. ISO 19650 folder structures and ZFS Samba shares have been provisioned.",
    projectTeam: "Project Team Directory",
    addMember: "Add Team Member",
    folderCabinet: "ISO 19650 Compliance File Cabinet",
    uploadDocument: "Upload Compliance Document",
    dragDropText: "Drag & drop files here, or click to upload",
    xrefRelativeMethod: "AutoCAD Xref Relative Pathing (Standard)",
    xrefSharedMethod: "TrueNAS Shared Unified Pathing (Recommended)",
    xrefMethodTitle: "AutoCAD Xref Pathing Method",
    xrefMethodDesc: "Toggle how external reference paths are resolved across designer workstations.",

    truenasStatus: "TrueNAS Server Configuration Status",
    sambaPools: "ZFS Storage Pool & Samba Shares",
    mappedSambaShares: "Mapped Active Samba Share Folders",
    adminShare: "Admin Samba Share",
    projectsShare: "Projects Samba Share",
    libraryShare: "Library Samba Share",
    rbacControlStatus: "Role-Based Access Control (RBAC) Policies",
    adminPcAccess: "Office Administrator PCs",
    designerPcAccess: "Design Team Workstations",
    readWrite: "READ & WRITE",
    readOnly: "READ ONLY",
    blockedAccess: "BLOCKED TOTAL",
  },
  ID: {
    appName: "Management Data App",
    appSubtitle: "Suite Desain & Rekrutmen ISO 19650 Kelas Perusahaan",
    copyright: "Hak Cipta © Torky Komputer. Seluruh Hak Cipta Dilindungi.",
    back: "Kembali",
    cancel: "Batal",
    save: "Simpan",
    delete: "Hapus",
    add: "Tambah",
    edit: "Ubah",
    search: "Cari",
    status: "Status",
    action: "Tindakan",
    loading: "Memuat...",
    success: "Berhasil",
    failed: "Gagal",
    error: "Kesalahan",
    password: "Kata Sandi",
    confirmPassword: "Konfirmasi Sandi",
    email: "Alamat Email",
    fullName: "Nama Lengkap",
    role: "Peran Pengguna",
    active: "Aktif",
    inactive: "Nonaktif",
    unauthorized: "Akses Ditolak",
    unauthorizedDesc: "Hanya personel resmi yang dapat memodifikasi konfigurasi ini.",

    dashboard: "Dashboard",
    clients: "Klien",
    projectHub: "Proyek Hub",
    truenasSamba: "TrueNAS Samba",
    aiSandbox: "AI Sandbox",
    auditTrail: "Audit Trail",
    userManual: "Buku Manual",

    setupTitle: "Sistem Instalasi & Inisialisasi Database",
    setupSubtitle: "Langkah wajib untuk mengonfigurasi profil kantor konsultan arsitektur Anda, mendaftarkan akun Super Admin utama, serta menetapkan model infrastruktur jaringan.",
    setupIdentity: "1. Parameter Identitas Kantor",
    setupOfficeName: "Nama Kantor / Firma Arsitektur",
    setupInfrastructure: "Mode Infrastruktur Storage",
    setupTrueNASOption: "Server TrueNAS & Samba Share Mapping (Enterprise)",
    setupStandaloneOption: "Komputer Tunggal / Workstation Mandiri Lokal",
    setupIPAddress: "TrueNAS Server IP Address",
    setupPoolName: "Samba Pool Name (ZFS Pool)",
    setupAdminCredentials: "2. Kredensial Super Admin Utama",
    setupAdminName: "Nama Lengkap Administrator",
    setupAdminEmail: "Email Kerja Utama",
    setupAdminPassword: "Kata Sandi Super Admin",
    setupConfirmPassword: "Konfirmasi Sandi",
    setupRegionTime: "3. Penyesuaian Regional & Waktu",
    setupRegion: "Region Operasional",
    setupTimezone: "Zona Waktu Sistem",
    setupLicenseKey: "4. Kunci Keamanan Lisensi Torky Komputer",
    setupLicensePlaceholder: "Masukkan Kunci Lisensi dari Torky Komputer...",
    setupLicenseHint: "Aplikasi dikunci penuh secara kriptografis berdasarkan ID Mesin TrueNAS kantor, mencegah pembajakan dan penyalinan software liar.",
    machineIdLabel: "ID MESIN TRUENAS (KLIEN)",
    zfsFingerprint: "SIDIK JARI ZFS",
    copyIdBtn: "Salin ID",
    copyIdSuccess: "Tersalin!",
    machineIdHint: "Kirimkan ID Mesin di atas ke Yan Torky (Torky Komputer) untuk mendapatkan Kunci Lisensi resmi yang valid.",
    devOnlyBtn: "Khusus Developer Yan Torky",
    setupBtn: "Daftarkan Akun & Inisialisasi Sistem",
    setupBimCompliance: "Sistem inisialisasi ini menerapkan kepatuhan BIM Standard ISO 19650-1 & 19650-2 secara otomatis pada database lokal.",
    setupPasswordTooShort: "Kata sandi terlalu pendek. Masukkan minimal 6 karakter demi perlindungan keamanan data perusahaan.",
    setupPasswordMismatch: "Konfirmasi kata sandi tidak cocok dengan kata sandi utama.",
    setupLicenseInvalid: "Kunci Lisensi Salah! Masukkan kode aktivasi resmi dari Torky Komputer untuk melanjutkan.",

    licenseStatus: "Status Lisensi",
    licenseVerified: "LISENSI TERVERIFIKASI & TERSEKURITI SECARA KRIPTOGRAFIS",
    licenseSecured: "Sistem Diamankan oleh Torky Komputer Security Engine",
    sourceProtectionActive: "PENGAMANAN SOURCE CODE: TERENKRIPSI & AKTIF",
    sourceProtectionDesc: "Pencegahan duplikasi aktif. Obfuskasi Binary dan verifikasi integritas kode anti-tamper berjalan dalam container server.",
    hardwareFingerprint: "Sidik Jari Perangkat Keras (Hardware Hash)",
    antiduplicationHash: "Hash Anti-Duplikasi",
    licensingSecurityModule: "Modul Keamanan & Lisensi Torky Komputer",

    welcomeBack: "Selamat datang kembali",
    dashboardSummary: "Berikut ringkasan workspace kepatuhan ISO 19650 dan kondisi server penyimpanan kantor konsultan Anda.",
    totalProjects: "Total Proyek",
    activeProjects: "Proyek Aktif",
    managedArea: "Total Area Desain",
    managedBudget: "Kumulatif Anggaran Proyek",
    activeClients: "Klien Aktif",
    auditLogsCount: "Jumlah Log Audit",
    quickStats: "Statistik Cepat Kantor",
    recentLogs: "Aktivitas Kepatuhan Terbaru",
    isoNamingHelper: "Penyusun Kode Penamaan Dokumen ISO 19650",
    isoNamingDesc: "Hasilkan nama file standar yang patuh secara otomatis sesuai struktur penamaan ISO 19650.",
    generateCode: "Hasilkan Kode",
    copyCode: "Salin Kode",

    projectContext: "Konteks Proyek Aktif",
    potentialPromoTitle: "Prospek Potensial (Tahap Negosiasi)",
    potentialPromoDesc: "Proyek ini masih dalam tahap negosiasi/pitching. Promosikan untuk mengaktifkan struktur folder ISO 19650 lengkap.",
    potentialPromoBtn: "Promosikan Ke Aktif (CURRENT)",
    promoteSuccess: "Proyek berhasil dipromosikan ke status Aktif. Struktur direktori kepatuhan ISO 19650 dan alokasi datasheet Samba TrueNAS telah diinisialisasi.",
    projectTeam: "Direktori Tim Proyek",
    addMember: "Tambah Anggota Tim",
    folderCabinet: "Lemari Berkas Kepatuhan ISO 19650",
    uploadDocument: "Unggah Dokumen Kepatuhan",
    dragDropText: "Seret & letakkan berkas di sini, atau klik untuk mengunggah",
    xrefRelativeMethod: "AutoCAD Xref Pathing Relatif (Standar)",
    xrefSharedMethod: "TrueNAS Shared Pathing Bersama (Direkomendasikan)",
    xrefMethodTitle: "Metode Pathing Xref AutoCAD",
    xrefMethodDesc: "Sesuaikan bagaimana referensi eksternal (Xref) dibaca lintas workstation tim desainer.",

    truenasStatus: "Status Konfigurasi Server TrueNAS",
    sambaPools: "Pool Storage ZFS & Samba Share",
    mappedSambaShares: "Pemetaan Folder Samba Share Aktif",
    adminShare: "Samba Share Admin",
    projectsShare: "Samba Share Projects",
    libraryShare: "Samba Share Library",
    rbacControlStatus: "Kebijakan Kontrol Akses Berbasis Peran (RBAC)",
    adminPcAccess: "Komputer Admin Kantor",
    designerPcAccess: "Komputer Desainer (Design Team)",
    readWrite: "BACA & TULIS (EDIT)",
    readOnly: "BACA SAJA",
    blockedAccess: "BLOKIR TOTAL",
  }
};
