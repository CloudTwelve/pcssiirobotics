import fs from 'node:fs';
import path from 'node:path';

const distAssetsDir = path.resolve('dist/assets');

const limits = {
  maxJsAssetBytes: 460 * 1024,
  maxCssAssetBytes: 80 * 1024,
  maxTotalJsBytes: 1300 * 1024,
  maxTotalCssBytes: 120 * 1024
};

if (!fs.existsSync(distAssetsDir)) {
  console.error('Bundle budget check failed: dist/assets not found. Run npm run build first.');
  process.exit(1);
}

const files = fs.readdirSync(distAssetsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name);

const jsFiles = files.filter((name) => name.endsWith('.js'));
const cssFiles = files.filter((name) => name.endsWith('.css'));

const toSize = (name) => fs.statSync(path.join(distAssetsDir, name)).size;

const jsWithSizes = jsFiles.map((name) => ({ name, size: toSize(name) }));
const cssWithSizes = cssFiles.map((name) => ({ name, size: toSize(name) }));

const totalJs = jsWithSizes.reduce((sum, item) => sum + item.size, 0);
const totalCss = cssWithSizes.reduce((sum, item) => sum + item.size, 0);

const formatKb = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;
const violations = [];

for (const asset of jsWithSizes) {
  if (asset.size > limits.maxJsAssetBytes) {
    violations.push(`JS asset too large: ${asset.name} is ${formatKb(asset.size)} (limit ${formatKb(limits.maxJsAssetBytes)})`);
  }
}

for (const asset of cssWithSizes) {
  if (asset.size > limits.maxCssAssetBytes) {
    violations.push(`CSS asset too large: ${asset.name} is ${formatKb(asset.size)} (limit ${formatKb(limits.maxCssAssetBytes)})`);
  }
}

if (totalJs > limits.maxTotalJsBytes) {
  violations.push(`Total JS size too large: ${formatKb(totalJs)} (limit ${formatKb(limits.maxTotalJsBytes)})`);
}

if (totalCss > limits.maxTotalCssBytes) {
  violations.push(`Total CSS size too large: ${formatKb(totalCss)} (limit ${formatKb(limits.maxTotalCssBytes)})`);
}

console.log('Bundle size summary:');
console.log(`- JS files: ${jsWithSizes.length}, total ${formatKb(totalJs)}`);
console.log(`- CSS files: ${cssWithSizes.length}, total ${formatKb(totalCss)}`);

if (violations.length > 0) {
  console.error('\nBundle budget check failed:');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('Bundle budget check passed.');
