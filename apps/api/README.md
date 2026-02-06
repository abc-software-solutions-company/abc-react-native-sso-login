# API (NestJS)

## Run

From repo root:

```bash
yarn api
```

## Env

`apps/api/.env`:

```
AZURE_TENANT_ID=...
AZURE_CLIENT_ID=...
API_JWT_SECRET=...
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
PORT=3002
```

## Endpoint

`POST /auth/oidc/login`

Send Azure `id_token` in `Authorization: Bearer <idToken>`.

Response:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "email": "...",
    "name": "...",
    "role": "USER"
  }
}
```
