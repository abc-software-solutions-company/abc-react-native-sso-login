# SSO PoC Monorepo

## Structure

- `apps/mobile`: React Native (Expo) PoC
- `apps/api`: NestJS API (source of truth for auth)
- `packages/shared`: placeholder

## Two Login Approaches

1. **WebView reuse** (web app login inside a WebView)
2. **Native OIDC** (`react-native-app-auth`)

Both flows send `id_token` to the backend, which verifies and issues internal tokens.

## Run (short)

From repo root:

```bash
# terminal 1

yarn dev

# terminal 2

yarn ios
```
