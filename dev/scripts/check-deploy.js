const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const appPath = path.join(__dirname, "../../App.tsx");
const changelogPath = path.join(__dirname, "../../changelog.md");

console.log("\n🔍 [Pre-Deploy Check] Verificando preparação do aplicativo...");

// 1. Verificar Cache Buster no App.tsx
let currentBuster = null;
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, "utf8");
  const busterMatch = appContent.match(/buster:\s*["']([^"']+)["']/);
  if (busterMatch) {
    currentBuster = busterMatch[1];
    console.log(`✅ React Query Cache Buster (App.tsx): "${currentBuster}"`);
  } else {
    console.warn("⚠️  Aviso: Propriedade buster não encontrada no App.tsx!");
  }
} else {
  console.warn("⚠️  Aviso: App.tsx não encontrado para leitura do buster.");
}

// 2. Análise Inteligente do Git Diff para Recomendação do Buster
try {
  const gitStatus = execSync("git status --porcelain", { encoding: "utf8" });
  const modifiedFiles = gitStatus
    .split("\n")
    .map((line) => (line.length > 3 ? line.substring(3).trim() : ""))
    .filter(Boolean);

  const hasDataChanges = modifiedFiles.some(
    (file) =>
      file.includes("src/services/") ||
      file.includes("src/hooks/queries/") ||
      file.includes("src/types/")
  );

  const hasBusterChanged = modifiedFiles.some((file) => file.includes("App.tsx"));

  if (hasDataChanges && !hasBusterChanged) {
    console.warn(
      "💡 RECOMENDAÇÃO: Foram detectadas alterações em serviços ou hooks de dados (services/queries/types), mas o 'buster' no App.tsx não foi alterado."
    );
    console.warn(
      "   👉 Se você alterou o formato dos dados ou corrigiu bugs em objetos salvos no cache, incremente o buster no App.tsx antes de publicar!"
    );
  } else if (!hasDataChanges) {
    console.log(
      "ℹ️  Análise Git: Alterações focadas em UI/Layout. Manter o buster atual é o recomendado."
    );
  }
} catch {
  // Ignora erro se git não estiver disponível
}

// 3. Verificar data no changelog.md
if (fs.existsSync(changelogPath)) {
  const changelogContent = fs.readFileSync(changelogPath, "utf8");
  const todayStr = new Date().toISOString().split("T")[0];
  if (changelogContent.includes(todayStr)) {
    console.log(`✅ Registro no changelog.md para hoje (${todayStr}) verificado.`);
  } else {
    console.warn(
      `⚠️  Aviso: Nenhuma entrada com a data de hoje (${todayStr}) foi encontrada no changelog.md!`
    );
  }
}

console.log("🚀 [Pre-Deploy Check] Verificações preliminares concluídas!\n");
