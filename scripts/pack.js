import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addFilesRecursively(dir, rootDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, fullPath);
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'public') {
      continue;
    }
    if (entry.isDirectory()) {
      addFilesRecursively(fullPath, rootDir);
    } else {
      const data = fs.readFileSync(fullPath);
      zip.file(relPath, data);
    }
  }
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

addFilesRecursively('.');

zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }).then((content) => {
  fs.writeFileSync('./public/atelier-nord-marketplace.zip', content);
  console.log('Successfully created public/atelier-nord-marketplace.zip! Size:', content.length, 'bytes');
});
