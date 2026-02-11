import type { Session, User } from "../types/auth";
import { TokenStorage } from "./token.storage";

export const SessionManager = {
  async saveSession(session: Session) {
    await TokenStorage.save(
      session.accessToken,
      session.refreshToken,
      JSON.stringify(session.user),
    );
  },

  async loadSession(): Promise<Session | null> {
    const stored = await TokenStorage.load();
    if (!stored) return null;

    const user = JSON.parse(stored.userJson) as User;
    return { accessToken: stored.accessToken, refreshToken: stored.refreshToken, user };
  },

  async clearSession() {
    await TokenStorage.clear();
  },
};
