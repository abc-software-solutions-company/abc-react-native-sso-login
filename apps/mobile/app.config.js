const appJson = require("./app.json");

module.exports = ({ config }) => {
  const base = appJson.expo ?? config ?? {};

  // In app.config.js, we check the platform via an environment variable
  // or by defining logic that handles both URIs.
  const extra = {
    ...(base.extra ?? {}),
    msTenantId:
      process.env.EXPO_PUBLIC_MS_TENANT_ID ?? base.extra?.msTenantId ?? "",
    msClientId:
      process.env.EXPO_PUBLIC_MS_CLIENT_ID ?? base.extra?.msClientId ?? "",

    // We include both, or pick one based on a custom ENV if needed
    msRedirectUriAndroid:
      process.env.EXPO_PUBLIC_MS_REDIRECT_URI_ANDROID ??
      base.extra?.msRedirectUriAndroid ??
      "",
    msRedirectUriIos:
      process.env.EXPO_PUBLIC_MS_REDIRECT_URI_IOS ??
      base.extra?.msRedirectUriIos ??
      "",
  };

  return {
    ...base,
    extra,
    plugins: ["expo-router"],
  };
};
