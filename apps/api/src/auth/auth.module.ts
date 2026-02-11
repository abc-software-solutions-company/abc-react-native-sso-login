import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OidcService } from './services/oidc.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [OidcService],
  exports: [OidcService],
})
export class AuthModule {}
