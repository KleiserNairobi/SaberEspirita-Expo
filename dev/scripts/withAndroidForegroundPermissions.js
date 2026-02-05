const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Config plugin para adicionar permissões de foreground service
 * necessárias para conformidade com Android 14
 */
const withAndroidForegroundPermissions = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest;

    // Garantir que o array de permissões existe
    if (!mainApplication["uses-permission"]) {
      mainApplication["uses-permission"] = [];
    }

    const permissions = mainApplication["uses-permission"];

    // Permissões necessárias para foreground service
    const requiredPermissions = [
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
    ];

    // Adicionar permissões se não existirem
    requiredPermissions.forEach((permission) => {
      const exists = permissions.some((p) => p.$?.["android:name"] === permission);

      if (!exists) {
        permissions.push({
          $: {
            "android:name": permission,
          },
        });
      }
    });

    return config;
  });
};

module.exports = withAndroidForegroundPermissions;
