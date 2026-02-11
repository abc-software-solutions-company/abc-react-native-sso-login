import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { decodeJwt } from "jose";
import { UserService } from "../user/user.service";
import { OidcService } from "./services/oidc.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly oidcService: OidcService,
    private readonly userService: UserService,
  ) {}

  @Post("oidc/login")
  async oidcLogin(
    @Headers("authorization") authorization?: string,
    @Body() body?: Record<string, unknown>,
  ) {
    // The backend owns authentication; mobile only forwards identity proof.
    const idToken =
      this.extractBearerToken(authorization) ||
      (typeof body?.idToken === "string" ? body.idToken : null);

    if (!idToken) {
      // eslint-disable-next-line no-console
      console.warn("[auth] login failed: missing id_token");
      throw new HttpException("Missing id_token", HttpStatus.UNAUTHORIZED);
    }

    const accessToken =
      typeof body?.accessToken === "string" ? body.accessToken : null;
    const refreshToken =
      typeof body?.refreshToken === "string" ? body.refreshToken : null;
    const accessTokenExpiration = this.getAccessTokenExpiration(accessToken);

    if (!accessToken) {
      // eslint-disable-next-line no-console
      console.warn("[auth] login failed: missing accessToken");
      throw new HttpException("Missing accessToken", HttpStatus.BAD_REQUEST);
    }

    if (!refreshToken) {
      // eslint-disable-next-line no-console
      console.warn("[auth] login failed: missing refreshToken");
      throw new HttpException("Missing refreshToken", HttpStatus.BAD_REQUEST);
    }

    try {
      const payload = await this.oidcService.verifyIdToken(idToken);
      const user = await this.userService.findOrCreateFromOidc(payload);

      // eslint-disable-next-line no-console
      console.log("[auth] login success", {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accessTokenExpiration: accessTokenExpiration?.iso ?? null,
      });

      // eslint-disable-next-line no-console
      console.log("[auth] access token", {
        expiresAt: accessTokenExpiration?.iso ?? null,
        exp: accessTokenExpiration?.exp ?? null,
      });

      // eslint-disable-next-line no-console
      console.log("[auth] refresh token", {
        refreshToken,
      });

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessTokenExpiration?.iso ?? null,
        user,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("[auth] login failed", {
        message: error instanceof Error ? error.message : "unknown_error",
      });
      throw error;
    }
  }

  private extractBearerToken(authorization?: string) {
    if (!authorization) return null;
    const [type, value] = authorization.split(" ");
    if (type?.toLowerCase() !== "bearer" || !value) return null;
    return value;
  }

  private getAccessTokenExpiration(token: string | null) {
    if (!token) return null;
    try {
      const payload = decodeJwt(token);
      if (typeof payload.exp !== "number") return null;
      const iso = new Date(payload.exp * 1000).toISOString();
      return { exp: payload.exp, iso };
    } catch {
      return null;
    }
  }
}
