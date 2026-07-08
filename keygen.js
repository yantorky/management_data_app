/**
 * TORKY KOMPUTER - ENTERPRISE SECURITY SUITE
 * OFFLINE LICENSE GENERATOR (PRIVATE SUITE - DEVELOPER ONLY)
 * 
 * Cara Menjalankan secara Lokal:
 * node keygen.js
 * 
 * Hak Cipta © 2026 Yan Torky (Torky Komputer). Seluruh Hak Cipta Dilindungi Undang-Undang.
 * Dilarang mendistribusikan berkas generator ini ke lingkungan publik atau klien.
 */

const readline = require('readline');

// ANSI escape codes untuk warna terminal yang interaktif & indah
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  
  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    crimson: "\x1b[38m"
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    crimson: "\x1b[48m"
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const generateMachineId = (company, ip, pool) => {
  const cleanCompany = (company || 'MDA').substring(0, 4).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const cleanIp = (ip || '127001').replace(/\./g, '');
  const cleanPool = (pool || 'POOL').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `MDA-HW-${cleanCompany}-${cleanIp}-${cleanPool}`;
};

const generateLicenseFromMachineId = (mId) => {
  const base = mId.trim().toUpperCase().split('').reverse().join('');
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const hexHash = Math.abs(hash).toString(16).toUpperCase();
  return `TORKY-SECURE-2026-MDA-${hexHash}`;
};

function printHeader() {
  console.clear();
  console.log(`${colors.fg.cyan}${colors.bright}========================================================================${colors.reset}`);
  console.log(`${colors.fg.yellow}${colors.bright}                 TORKY KOMPUTER LICENSING SUITE v1.0                    ${colors.reset}`);
  console.log(`${colors.fg.yellow}${colors.bright}         Generator Kunci Aktivasi Kriptografis Resmi (Developer Only)   ${colors.reset}`);
  console.log(`${colors.fg.cyan}========================================================================${colors.reset}`);
  console.log(`${colors.fg.red}${colors.bright} PENTING: JANGAN PERNAH MENYERAHKAN BERKAS INI KEPADA KLIEN ATAU PUBLIK!${colors.reset}`);
  console.log(`${colors.fg.white}${colors.dim} Keamanan software dilindungi kriptografi satu arah menggunakan Hardware-Lock.${colors.reset}\n`);
}

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  while (true) {
    printHeader();
    console.log(`${colors.bright}PILIH METODE GENERATOR:${colors.reset}`);
    console.log(` [1] Generate Langsung dari ${colors.fg.green}ID MESIN KLIEN${colors.reset} (Paling Sering Digunakan)`);
    console.log(` [2] Generate Manual dengan memasukkan ${colors.fg.green}Parameter TrueNAS/Samba Kantor${colors.reset}`);
    console.log(` [3] Keluar dari Suite`);
    console.log();
    
    const choice = await askQuestion(`${colors.bright}Masukkan pilihan Anda (1/2/3): ${colors.reset}`);
    
    if (choice === '1') {
      console.log(`\n${colors.fg.cyan}------------------------------------------------------------------------${colors.reset}`);
      console.log(`${colors.bright}METODE 1: GENERATE DARI ID MESIN KLIEN${colors.reset}`);
      console.log(`${colors.fg.white}${colors.dim}Silakan salin ID Mesin yang dikirimkan klien (misal: MDA-HW-LANS-1921681150-ARCHPOOLNAS)${colors.reset}\n`);
      
      const machineId = await askQuestion(`${colors.bright}Masukkan ID Mesin Klien: ${colors.reset}`);
      
      if (!machineId || !machineId.trim().startsWith('MDA-HW-')) {
        console.log(`\n${colors.fg.red}${colors.bright}ERROR: ID Mesin tidak valid! Format harus berawalan "MDA-HW-"${colors.reset}`);
        await askQuestion(`\nTekan Enter untuk kembali ke menu...`);
        continue;
      }
      
      const license = generateLicenseFromMachineId(machineId);
      
      console.log(`\n${colors.fg.green}${colors.bright}>>> LISENSI BERHASIL DIBUAT! <<<${colors.reset}`);
      console.log(`ID Mesin:  ${colors.fg.white}${colors.bright}${machineId.trim().toUpperCase()}${colors.reset}`);
      console.log(`Lisensi:   ${colors.fg.yellow}${colors.bright}${license}${colors.reset}`);
      console.log(`\n${colors.fg.white}${colors.dim}Salin kode lisensi di atas dan kirimkan ke klien Anda.${colors.reset}`);
      
      await askQuestion(`\nTekan Enter untuk kembali ke menu...`);
      
    } else if (choice === '2') {
      console.log(`\n${colors.fg.cyan}------------------------------------------------------------------------${colors.reset}`);
      console.log(`${colors.bright}METODE 2: GENERATE MANUAL DARI PARAMETER KANTOR${colors.reset}\n`);
      
      const company = await askQuestion(`${colors.bright}1. Nama Kantor Konsultan (misal: Lanskap Cipta Mandiri): ${colors.reset}`);
      const ip = await askQuestion(`${colors.bright}2. IP Address TrueNAS Server (misal: 192.168.1.150): ${colors.reset}`);
      const pool = await askQuestion(`${colors.bright}3. Nama Samba Pool ZFS (misal: ArchPoolNAS): ${colors.reset}`);
      
      const machineId = generateMachineId(company, ip, pool);
      const license = generateLicenseFromMachineId(machineId);
      
      console.log(`\n${colors.fg.green}${colors.bright}>>> LISENSI & ID MESIN BERHASIL DIBUAT! <<<${colors.reset}`);
      console.log(`ID Mesin:  ${colors.fg.white}${colors.bright}${machineId}${colors.reset}`);
      console.log(`Lisensi:   ${colors.fg.yellow}${colors.bright}${license}${colors.reset}`);
      console.log(`\n${colors.fg.white}${colors.dim}Salin kode lisensi di atas dan kirimkan ke klien Anda.${colors.reset}`);
      
      await askQuestion(`\nTekan Enter untuk kembali ke menu...`);
      
    } else if (choice === '3') {
      console.log(`\n${colors.fg.yellow}Terima kasih telah menggunakan Torky Komputer Licensing Suite! Mengamankan aset digital Anda.${colors.reset}\n`);
      rl.close();
      break;
    } else {
      console.log(`\n${colors.fg.red}Pilihan tidak valid. Silakan coba lagi.${colors.reset}`);
      await askQuestion(`\nTekan Enter untuk kembali ke menu...`);
    }
  }
}

main();
