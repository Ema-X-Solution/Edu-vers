import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, '../src/assets');

const files = [
  { input: 'login-image.jpg', output: 'login-image.webp' },
  { input: 'Sign Up.png', output: 'signup.webp' },
  { input: 'reset-email.png', output: 'reset-email.webp' },
  { input: 'reset-password.png', output: 'reset-password.webp' },
];

for (const { input, output } of files) {
  const inputPath = path.join(assetsDir, input);
  const outputPath = path.join(assetsDir, output);
  await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath);
  console.log(`${input} -> ${output}`);
}

// OG preview image for social platforms that prefer raster
await sharp(path.resolve(__dirname, '../public/og.svg'))
  .resize(1200, 630)
  .webp({ quality: 90 })
  .toFile(path.resolve(__dirname, '../public/og.webp'));

console.log('og.svg -> public/og.webp');
