# Version 1.0 Launch Checklists

## Smoke Test Checklist

- Home page loads on desktop and mobile.
- Register, verify email, login, logout, forgot password, and reset password work.
- Product browsing, search, filters, product details, wishlist, cart, and checkout load.
- Razorpay test payment succeeds and failed payment is recorded.
- Orders, shipping timeline, profile, measurements, FIT & Match, AI mock workflows, and engagement pages load.
- Admin catalog, media, fit, AI, orders, shipping, engagement, and system pages are protected by role.
- Legal pages, manifest, sitemap, robots, offline page, and service worker are accessible.

## Deployment Checklist

- Railway production variables are complete.
- `npx prisma migrate deploy` succeeds.
- `npm run build` succeeds.
- Sentry DSN is configured.
- Resend sender domain is verified.
- Razorpay production keys are loaded.
- Cloudinary production cloud is configured.
- Custom domain, HTTPS, HSTS, and canonical `APP_URL` are correct.
- Backups and restore procedure are documented.

## Production Verification Checklist

- `/api/live` returns 200.
- `/api/ready` returns 200.
- `/api/health` returns 200.
- Sentry receives a release event or manual test event.
- Analytics no-op endpoint accepts page events without exposing provider keys.
- CSP does not block Cloudinary images, Razorpay checkout, or Sentry.
- PWA install prompt appears on supported devices.
- Offline fallback works after first visit.
- WCAG keyboard navigation passes key account, catalog, checkout, and admin flows.
