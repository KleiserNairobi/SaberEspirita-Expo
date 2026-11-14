/**
 * Script de pós-deploy OTA para garantir compatibilidade com builds nativas de produção (lojas).
 * Ele mapeia os bundles recém-gerados para os fingerprints nativos conhecidos de produção (Android e iOS).
 */

require('dotenv').config({ path: '.env.hotupdater' });
const crypto = require('crypto');
const pkg = require('../../package.json');

const KNOWN_FINGERPRINTS = [
  // Android
  { platform: 'android', hash: '46bd7a25d89c886d0b3fa6ccbbd0e091ba4d8286' },
  { platform: 'android', hash: '77251b3cb98f26e52f122debead22c57b627ba5a' },
  { platform: 'android', hash: '30f9831427ccb6a8b25e58094cdebb292b49d3d4' },
  // iOS
  { platform: 'ios', hash: '6bb2d6832b56fbb16e4aaa173e6067bb235f7203' },
  { platform: 'ios', hash: 'f6e190d66027b9c920fce2443f0fecfb6f43398a' },
  { platform: 'ios', hash: '8b9977f7589a6f5cd93e62bacd5e48dc3b0e34a2' },
];

function uuidv7() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const now = Date.now();
  const bytes = crypto.randomBytes(16);
  bytes.writeUIntBE(Math.floor(now / 0x100000000), 0, 2);
  bytes.writeUInt32BE(now >>> 0, 2);
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join('-');
}

async function run() {
  const token = process.env.HOT_UPDATER_CLOUDFLARE_API_TOKEN;
  const accountId = process.env.HOT_UPDATER_CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.HOT_UPDATER_CLOUDFLARE_D1_DATABASE_ID;

  if (!token || !accountId || !databaseId) {
    console.warn('[sync-ota-fingerprints] Credenciais Cloudflare D1 ausentes em .env.hotupdater. Pulando.');
    return;
  }

  const queryUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  // 1. Busca os últimos bundles publicados
  const res = await fetch(queryUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql: 'SELECT * FROM bundles ORDER BY rowid DESC LIMIT 10;',
    }),
  });

  const data = await res.json();
  const bundles = data?.result?.[0]?.results || [];

  for (const { platform, hash: targetFingerprint } of KNOWN_FINGERPRINTS) {
    // Acha o bundle original mais recente compilado para essa plataforma
    const targetVersion = pkg.version;
    const latestBundle = bundles.find(
      (b) => b.platform === platform && b.message && b.message.includes(targetVersion)
    ) || bundles.find((b) => b.platform === platform);

    if (!latestBundle) continue;

    // Verifica se já existe um bundle com esse fingerprint e mesmo file_hash
    const alreadyLinked = bundles.some(
      (b) => b.platform === platform && b.fingerprint_hash === targetFingerprint && b.file_hash === latestBundle.file_hash
    );

    if (alreadyLinked) {
      console.log(`[sync-ota-fingerprints] Plataforma ${platform} já está vinculada ao fingerprint ${targetFingerprint}.`);
      continue;
    }

    // Caso contrário, insere um registro associando aos assets desse bundle mais recente
    const newId = uuidv7();
    const insertSql = `
      INSERT INTO bundles (
        id, platform, should_force_update, enabled, file_hash, git_commit_hash,
        message, channel, storage_uri, target_app_version, fingerprint_hash,
        metadata, rollout_cohort_count, target_cohorts, manifest_storage_uri,
        manifest_file_hash, asset_base_storage_uri
      ) VALUES (
        '${newId}',
        '${platform}',
        1,
        1,
        '${latestBundle.file_hash}',
        '${latestBundle.git_commit_hash}',
        '${latestBundle.message}',
        '${latestBundle.channel}',
        '${latestBundle.storage_uri}',
        ${latestBundle.target_app_version ? `'${latestBundle.target_app_version}'` : 'NULL'},
        '${targetFingerprint}',
        '${latestBundle.metadata}',
        1000,
        NULL,
        '${latestBundle.manifest_storage_uri}',
        '${latestBundle.manifest_file_hash}',
        '${latestBundle.asset_base_storage_uri}'
      );
    `;

    const insertRes = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: insertSql }),
    });

    const insertData = await insertRes.json();
    if (insertData.success) {
      console.log(`[sync-ota-fingerprints] Plataforma ${platform} vinculada com sucesso ao fingerprint ${targetFingerprint} com id ${newId}.`);
    } else {
      console.error(`[sync-ota-fingerprints] Falha ao vincular ${platform} (${targetFingerprint}):`, insertData.errors);
    }
  }
}

run().catch((err) => {
  console.error('[sync-ota-fingerprints] Erro:', err);
});
