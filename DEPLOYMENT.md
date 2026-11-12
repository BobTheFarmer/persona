# Persona on Railway

This is a campus-club discovery prototype, not an official TAMU directory. The bundled club catalog uses official TAMU listings, with source links and finite verified recurring schedules. See docs/campus-catalog.md. No sample student identities or obsolete events are created by deployment.

## Services
- App: this Dockerfile, Node 22, one replica, `/healthz` health check.
- Database: official `pgvector/pgvector:pg16`, private network only, persistent `/var/lib/postgresql/data` volume.
- `DATABASE_URL`: reference the private Postgres URL, never expose it to the frontend.
- `SESSION_SECRET`: independently generated random secret of 32+ characters.
- `DATABASE_SSL=false` for Railway's private plain PostgreSQL network. Set true only for a TLS-enabled database with a trusted certificate.
- `ENABLE_EMBEDDINGS=false` initially. Trait-based recommendations remain usable. Enabling downloads a local ML model and increases memory/CPU; measure before enabling on a small plan.

The container runs versioned migrations before starting. On an existing database, back up first and review migration compatibility. Fresh deployments upsert the verified club/event catalog and initialize hobbies; no fake social activity. No paid AI API is required. Passwords are salted/scrypt-hashed separately from profiles; sessions live in PostgreSQL. Email verification and password recovery are not yet implemented. Do not reuse important passwords for this prototype.

## Local checks
`npm ci --cache /tmp/persona-npm-cache`
`npm run check`
`npm run build`
`node script/migrate.cjs`
`npm start`

Keep secrets out of commits. The original Replit/demo/admin/debug endpoints are unavailable in this deployment. `/healthz` returns 200 only when the database is reachable. Unknown `/api` routes return JSON 404, not the SPA HTML.
