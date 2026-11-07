const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Config plugin para adicionar permissões de foreground service
 * e declarar o serviço de reprodução de áudio necessário para
 * conformidade com Android 14+
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

    // Garantir que o array de application existe
    if (!mainApplication.application) {
      mainApplication.application = [{}];
    }

    const application = mainApplication.application[0];

    // Garantir que o array de services existe
    if (!application.service) {
      application.service = [];
    }

    const services = application.service;

    // Declarar o serviço de reprodução de áudio
    const audioServiceName = "expo.modules.audio.AudioPlayerService";
    const audioServiceExists = services.some(
      (s) => s.$?.["android:name"] === audioServiceName
    );

    if (!audioServiceExists) {
      services.push({
        $: {
          "android:name": audioServiceName,
          "android:foregroundServiceType": "mediaPlayback",
          "android:exported": "false",
        },
      });
    }

    return config;
  });
};

module.exports = withAndroidForegroundPermissions;
