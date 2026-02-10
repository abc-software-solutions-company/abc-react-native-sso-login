# SSO PoC Monorepo

## Overview

This monorepo demonstrates two mobile SSO approaches against Microsoft Entra ID (Azure AD):
1. **WebView reuse**: reuse the existing web login inside a WebView.
2. **Native OIDC**: use `react-native-app-auth` to perform native OAuth/OIDC.

In both cases, the mobile app only forwards the external `id_token`. The **backend is the source of truth**: it verifies the token, resolves the user, and issues internal access/refresh tokens.

## Structure

- `apps/mobile`: React Native (Expo) mobile PoC
- `apps/api`: NestJS API (auth verification and token issuer)
- `packages/shared`: placeholder

## Important Flows

### 1) Native OIDC Login
1. User selects **Native OIDC Login** in the app.
2. Mobile runs OIDC flow via `react-native-app-auth` and receives an `id_token`.
3. Mobile calls `POST /auth/oidc/login` with `Authorization: Bearer <id_token>`.
4. API verifies the token against Azure JWKS, finds/creates user, issues internal tokens.
5. Mobile saves session and shows Profile.

### 2) WebView Login
1. User selects **WebView Login** in the app.
2. WebView loads the web login URL.
3. On redirect to the custom scheme (`ssodemo://auth`), the app extracts `id_token`.
4. Mobile calls `POST /auth/oidc/login` with that `id_token`.
5. API verifies, issues internal tokens, mobile saves session.

### Backend Auth Responsibilities
- Verify external `id_token` (issuer + audience) using Azure JWKS.
- Perform JIT user provisioning (in-memory for PoC).
- Issue internal access/refresh tokens (decoupled from IdP tokens).

## Run (short)

From repo root:

```bash
# terminal 1
yarn dev

# terminal 2
yarn ios
```
