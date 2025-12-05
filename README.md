# CI_NestJS Monorepo

## Architecture
- Microservices (Port): 
    - `auth` (3000)
    - `clubs` (3001)
    - `events` (3002)
    - `notifications` (3004)
    - `users` (3005)
- Each service exposes REST endpoints under its own prefix (e.g., `/clubs`, `/users`).
- API Gateway: `gateway` (3003) is a NestJS app using Express + `http-proxy-middleware` to forward requests from route prefixes to the corresponding microservice. The gateway also has a controller endpoint `/overview` that aggregates sample data via Axios.
- Proxy behavior (current config): Express mounts the proxy at a prefix and removes that mount path before forwarding, so the gateway currently uses "doubled" paths for service endpoints. Example: `GET /clubs/clubs` at the gateway becomes `GET /clubs` at the clubs service (because the gateway mount `/clubs` is removed before proxying). If you prefer single-prefix paths, update `pathRewrite` rules to preserve the prefix.

## Run Services
Start any services you need (recommend `clubs`, `events`, `notifications`, `auth`, and `users` if available):

```powershell
# Replace placeholders with your local paths
npm run start:dev --prefix "<path-to-auth-folder>"
npm run start:dev --prefix "<path-to-clubs-folder>"
npm run start:dev --prefix "<path-to-events-folder>"
npm run start:dev --prefix "<path-to-notifications-folder>"
npm run start:dev --prefix "<path-to-users-folder>"
```

Start the gateway:

```powershell
npm run start:dev --prefix "<path-to-gateway-folder>"
```

## Frontend (Gateway Demo)
A minimal static frontend lives in `frontend/index.html` and calls the gateway.

Example buttons in the page call (doubled paths to reach service endpoints):
- `GET http://localhost:3003/overview`
- `GET http://localhost:3003/clubs/clubs`
- `GET http://localhost:3003/users/users`
- `GET http://localhost:3003/events/events`
- `GET http://localhost:3003/notifications/notifications`
- `GET http://localhost:3003/auth/auth/permissions/check/1?clubId=1`


## Gateway Tests
E2E tests for the gateway live in `gateway/test/app.e2e-spec.ts`.

Run them from the gateway folder:

```powershell
cd "<path-to-gateway-folder>"
npm run test:e2e
```

Or run from anywhere:

```powershell
npm run test:e2e --prefix "<path-to-gateway-folder>"
```

## Prerequisites:
- Ensure the gateway and required microservices are running before executing e2e tests.



