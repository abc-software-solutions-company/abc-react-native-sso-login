import { Injectable } from '@nestjs/common';
import type { JWTPayload } from 'jose';
import type { User } from './user.entity';

@Injectable()
export class UserService {
  // PoC only: in-memory store
  private readonly users = new Map<string, User>();

  async findOrCreateFromOidc(payload: JWTPayload): Promise<User> {
    const externalId = (payload.oid || payload.sub || '') as string;
    const email = (payload.email || payload.preferred_username || '') as string;
    const name = (payload.name || email || 'Microsoft User') as string;

    if (!externalId) {
      throw new Error('OIDC payload missing subject');
    }

    const existing = this.users.get(externalId);
    if (existing) return existing;

    const user: User = {
      id: externalId,
      email,
      name,
      role: 'USER',
    };

    // JIT provisioning: create user on first login.
    this.users.set(externalId, user);
    return user;
  }
}
