import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const zipName = 'smart-agri-dss-complete.zip';
if (fs.existsSync(zipName)) fs.unlinkSync(zipName);

try {
  if (process.platform === 'win32') {
    execSync(`powershell -NoProfile -Command "Compress-Archive -Path * -DestinationPath '${zipName}' -Force"`);
  } else {
    execSync(`zip -r "${zipName}" . -x "node_modules/*" "dist/*" ".git/*" "${zipName}"`);
  }
  console.log(`SUCCESS: ${zipName} created.`);
} catch (err) {
  console.error('Compression failed:', err.message);
  process.exitCode = 1;
}