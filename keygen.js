/**
 * Torky Komputer Security Engine - Offline License Key Generator
 * (C) 2026 Yan Torky (Torky Komputer). All Rights Reserved.
 *
 * Digunakan untuk menggenerate Kunci Lisensi khusus klien berdasarkan TrueNAS Machine ID (Client Fingerprint).
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateLicenseFromMachineId(mId) {
  if (!mId) return '';
  const base = mId.trim().toUpperCase().split('').reverse().join('');
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const hexHash = Math.abs(hash).toString(16).toUpperCase();
  return `TORKY-SECURE-2026-MDA-${hexHash}`;
}

console.clear();
console.log('================================================================');
console.log('         TORKY KOMPUTER LICENSE SECURITY GENERATOR              ');
console.log('          Management Data App (MDA) - Enterprise                ');
console.log('================================================================');
console.log('');

rl.question('Masukkan TrueNAS Machine ID (Client Fingerprint): ', (machineId) => {
  const mId = machineId.trim();
  if (!mId) {
    console.log('\nError: Machine ID tidak boleh kosong.');
    rl.close();
    process.exit(1);
  }

  const licenseKey = generateLicenseFromMachineId(mId);

  console.log('\n----------------------------------------------------------------');
  console.log(' HASIL GENERASI LISENSI AMAN:');
  console.log(` Machine ID:  ${mId}`);
  console.log(` KUNCI LISENSI: \x1b[36m${licenseKey}\x1b[0m`);
  console.log('----------------------------------------------------------------');
  console.log('Salin Kunci Lisensi di atas dan berikan ke klien untuk aktivasi.');
  console.log('================================================================\n');

  rl.close();
});
