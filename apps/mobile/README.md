# Mobile (Expo)

## Envs

Create `apps/mobile/.env`:

```
EXPO_PUBLIC_MS_TENANT_ID=...
EXPO_PUBLIC_MS_CLIENT_ID=...
EXPO_PUBLIC_MS_REDIRECT_URI=ssodemo://auth
EXPO_PUBLIC_API_BASE_URL=http://localhost:3002
EXPO_PUBLIC_WEB_LOGIN_URL=https://your-web-app/login
```

## Run (short)

From repo root:

```bash
# terminal 1

yarn dev

# terminal 2

yarn ios
```

## Open terminal in path apps/mobile/

let run this command to install expose tool

```bash
yarn install-expo-router
```

## Azure

Redirect URI for the client must be:

```
ssodemo://auth
```
