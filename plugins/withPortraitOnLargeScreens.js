const {AndroidConfig, withAndroidManifest} = require('expo/config-plugins');

const PROPERTY = 'android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY';

// Android 16 ignore le verrouillage portrait sur les écrans d'au moins 600 dp ; cette dérogation le rétablit tant que l'appli cible l'API 36.
module.exports = function withPortraitOnLargeScreens(config) {
  return withAndroidManifest(config, (manifestConfig) => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(
      manifestConfig.modResults,
    );
    const others = (application.property ?? []).filter(
      (property) => property.$['android:name'] !== PROPERTY,
    );
    application.property = [
      ...others,
      {$: {'android:name': PROPERTY, 'android:value': 'true'}},
    ];
    return manifestConfig;
  });
};
