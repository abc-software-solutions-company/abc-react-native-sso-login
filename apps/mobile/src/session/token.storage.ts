import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "session_access_token";
const REFRESH_TOKEN_KEY = "session_refresh_token";
const USER_KEY = "session_user";

export const TokenStorage = {
  async save(accessToken: string, refreshToken: string, userJson: string) {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
      [USER_KEY, userJson],
    ]);
  },

  async load() {
    const [[, accessToken], [, refreshToken], [, userJson]] =
      await AsyncStorage.multiGet([
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_KEY,
      ]);
    if (!accessToken || !refreshToken || !userJson) return null;
    return { accessToken, refreshToken, userJson };
  },

  async clear() {
    await AsyncStorage.multiRemove([
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      USER_KEY,
    ]);
  },
};
