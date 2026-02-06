import { Body, Controller, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { OidcService } from './services/oidc.service';
import { TokenService } from './services/token.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly oidcService: OidcService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  @Post('oidc/login')
  async oidcLogin(
    @Headers('authorization') authorization?: string,
    @Body() body?: Record<string, unknown>,
  ) {
    // The backend owns authentication; mobile only forwards identity proof.
    const idToken = this.extractBearerToken(authorization) ||
      (typeof body?.idToken === 'string' ? body.idToken : null);

    if (!idToken) {
      throw new HttpException('Missing id_token', HttpStatus.UNAUTHORIZED);
    }

    const payload = await this.oidcService.verifyIdToken(idToken);
    const user = await this.userService.findOrCreateFromOidc(payload);
    const tokens = await this.tokenService.issueTokens(user);

    return {
      ...tokens,
      user,
    };
  }

  private extractBearerToken(authorization?: string) {
    if (!authorization) return null;
    const [type, value] = authorization.split(' ');
    if (type?.toLowerCase() !== 'bearer' || !value) return null;
    return value;
  }
}
