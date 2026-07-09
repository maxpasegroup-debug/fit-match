# Backup Readiness

## PostgreSQL

- Use Railway managed backups for point-in-time recovery where available.
- Schedule daily logical exports with `pg_dump` before launch traffic begins.
- Store encrypted backups outside the primary Railway project.
- Test restore into a separate staging database before Version 1.0 launch.
- Retain at least 7 daily, 4 weekly, and 3 monthly backup snapshots.

## Cloudinary Assets

- Keep all assets organized through the DAM folders created in Phase 8.
- Export asset inventory weekly using Cloudinary Admin API when the provider job is added.
- Store public IDs, folder paths, transformations, and usage records in PostgreSQL.
- Never delete Cloudinary assets without checking `MediaUsage` and `MediaAudit`.

## Environment Variables

- Store production secrets only in Railway environment variables.
- Keep a separate encrypted copy in the company password manager.
- Rotate `AUTH_SECRET`, payment keys, email keys, Cloudinary secrets, and Sentry tokens after staff changes.
- Never commit `.env` files or screenshots containing secrets.

## Restore Drill

1. Restore PostgreSQL backup into staging.
2. Run `npx prisma migrate deploy`.
3. Verify `/api/ready`.
4. Verify login, product browsing, checkout draft creation, media rendering, and admin access.
5. Record restore duration and issues.
