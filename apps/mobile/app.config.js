const appJson = require("./app.json");
const envConfig = require("../../../env.json");

module.exports = ({ config }) => {
  const base = appJson.expo ?? config ?? {};
  const extra = {
    ...(base.extra ?? {}),
    msTenantId:
      process.env.EXPO_PUBLIC_MS_TENANT_ID ??
      envConfig.EXPO_PUBLIC_MS_TENANT_ID ??
      base.extra?.msTenantId ??
      "",
    msClientId:
      process.env.EXPO_PUBLIC_MS_CLIENT_ID ??
      envConfig.EXPO_PUBLIC_MS_CLIENT_ID ??
      base.extra?.msClientId ??
      "",
    msRedirectUri:
      process.env.EXPO_PUBLIC_MS_REDIRECT_URI ??
      envConfig.EXPO_PUBLIC_MS_REDIRECT_URI ??
      base.extra?.msRedirectUri ??
      "",
  };

  return {
    ...base,
    extra,
    plugins: ["expo-router"],
  };
};
