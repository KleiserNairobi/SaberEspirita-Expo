// dev/scripts/rename-aab.js
const fs = require('fs');
const path = require('path');

// Caminho para app.json (dois níveis acima)
const appJsonPath = path.resolve(__dirname, '../../app.json');
const appJson = require(appJsonPath);

const version = appJson.expo.version;
const versionCode = appJson.expo.android.versionCode;

// Caminho de entrada para o .aab
const inputPath = path.resolve(
  __dirname,
  '../../android/app/build/outputs/bundle/release/app-release.aab'
);

// Nome e caminho de saída
const outputFileName = `saber-espirita-v${version}-code${versionCode}.aab`;
const outputPath = path.resolve(__dirname, `../../builds/${outputFileName}`);

// Cria o diretório de destino, se não existir
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// Copia e renomeia o arquivo
fs.copyFileSync(inputPath, outputPath);
console.log(`✅ AAB renomeado para: ${outputFileName}`);
