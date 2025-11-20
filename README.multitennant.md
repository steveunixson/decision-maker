# Multi-Tenant Domain Support

One common backend serves many companies (tenants). Domains like cool-games.com and luck-games.co.uk they point to the same API, but each request is domain-specific and operates in its own tenant context.

    Domains -> one Load Balancer -> one backend.

On each request, the backend determines tenant by Host.

    DNS -> CDN/LB -> Shared Backend -> PostgreSQL

Backend services operate within tenant context; DB tables store tenant
ownership.

All tables and queries are associated with tenant_id.

Users exist either as (tenant_id, email) or through a global account + tenant_users.

The JWT contains the `tenant_id`, `iss`, and `aud` associated with the domain.

A cookie is issued only for a specific client's domain.

A token from one domain does not work on another: domain tenant -> 401.

Each site is completely isolated, but everything runs on the same platform. Adding new clients is easy, but there is no need to change the infrastructure.

# User Data Model Changes

Because the same email may appear under different tenants, user identity
is tenant-scoped.

## Option A --- Tenant-Scoped Users

    users(id, tenant_id, email, password_hash, ...)
    UNIQUE(tenant_id, email)

## Option B --- Global Account + Tenant Membership

    accounts(id, email, password_hash, ...)
    UNIQUE(email)

    tenant_users(id, tenant_id, account_id, role, status, ...)
    UNIQUE(tenant_id, account_id)

# Authentication & Security

Each login session is tenant-bound. A session for `cool-games.com` is
not valid for `luck-games.co.uk`.

## Login Flow

1. Identify tenant by domain\
2. Validate user inside that tenant
3. Generate JWT
4. Set cookie

```json
{
  "sub": "user_id",
  "tenant_id": "T123",
  "iss": "cool-games.com",
  "aud": "cool-games.com",
  "exp": 1234567890
}
```

    Set-Cookie: session=...; Domain=cool-games.com; Secure; HttpOnly; SameSite=Lax

### Request Validation

Backend verifies on every request:

- `token.tenant_id == tenant_from_host`
- `aud/iss` match the do

IMPORTANT: Shared API domains must return CORS headers for specific origins, not
`*`. Tenant inferred from `Origin` or token!
