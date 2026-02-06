import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class OidcService {
  // Keep the trust boundary in the backend by verifying external tokens here.
  private readonly tenantId = process.env.AZURE_TENANT_ID || '';
  private readonly clientId = process.env.AZURE_CLIENT_ID || '';
  private readonly issuer = this.tenantId
    ? `https://login.microsoftonline.com/${this.tenantId}/v2.0`
    : '';
  private readonly jwks = this.tenantId
    ? createRemoteJWKSet(
        new URL(
          `https://login.microsoftonline.com/${this.tenantId}/discovery/v2.0/keys`,
        ),
      )
    : null;

  async verifyIdToken(idToken: string): Promise<JWTPayload> {
    if (!this.tenantId || !this.clientId || !this.issuer || !this.jwks) {
      throw new HttpException(
        'Missing Azure OIDC config',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const result = await jwtVerify(idToken, this.jwks, {
        issuer: this.issuer,
        audience: this.clientId,
      });
      return result.payload;
    } catch {
      throw new HttpException('Invalid id_token', HttpStatus.UNAUTHORIZED);
    }
  }
}
