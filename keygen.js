const readline = require('readline');

function generateLicenseFromMachineId(mId) {
  if (!mId) return '';
  const clean = mId.trim();
  const base = clean.split('').reverse().join('');
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  const hexHash = Math.abs(hash).toString(16).toUpperCase();
  return `TORKY-SECURE-2026-MDA-${hexHash}`;
}

const argMId = process.argv[2];
if (argMId) {
  const key = generateLicenseFromMachineId(argMId);
  console.log('\n======================================================');
  console.log('    TORKY KOMPUTER - GENERATOR LISENSI MDA 2026');
  console.log('======================================================');
  console.log(`Machine ID   : ${argMId.trim()}`);
  console.log(`Kunci Lisensi: ${key}`);
  console.log('======================================================\n');
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n======================================================');
console.log('    TORKY KOMPUTER - GENERATOR LISENSI MDA 2026');
console.log('======================================================\n');

rl.question('Masukkan TrueNAS Machine ID Klien (contoh: MDA-HW-TORK-1921681150-POOL): ', (mId) => {
  if (!mId || !mId.trim()) {
    console.log('❌ Machine ID tidak boleh kosong.');
  } else {
    const key = generateLicenseFromMachineId(mId);
    console.log('\n✅ KUNCI LISENSI HASIL GENERATE:');
    console.log(`\n    ${key}\n`);
    console.log('Salin kunci lisensi di atas dan berikan ke klien untuk aktivasi.');
  }
  console.log('======================================================\n');
  rl.close();
});
