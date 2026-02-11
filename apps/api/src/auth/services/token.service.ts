import { Injectable } from "@nestjs/common";
import { SignJWT } from "jose";
import type { User } from "../../user/user.entity";

@Injectable()
export class TokenService {
  private readonly secret =
    process.env.API_JWT_SECRET || "dev-secret-change-me";
  private readonly accessTtl = process.env.ACCESS_TOKEN_TTL || "15m";
  private readonly refreshTtl = process.env.REFRESH_TOKEN_TTL || "7d";

  async issueTokens(user: User) {
    // Internal tokens decouple mobile sessions from the external IdP.
    const encoder = new TextEncoder();
    const key = encoder.encode(this.secret);

    const accessToken = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
      typ: "access",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.accessTtl)
      .sign(key);

    const refreshToken = await new SignJWT({
      sub: user.id,
      typ: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.refreshTtl)
      .sign(key);

    return { accessToken, refreshToken };
  }
}
